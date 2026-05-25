import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router';
import Billing from '../Billing';
import axios from 'axios';
import QrPopup from './QrPopup';
import ReprintPreview from '../Components/ReprintPreview';
import api from '../api/axios';
import logo from '../assets/Abishek_logo.png'
const Payment = () => {

    const location = useLocation();
    const [showQr, setShowQr] = useState(false);

    const {
        cart = [],
        netAmount,
        discount,
        finalAmount = 0,
        billNo = "",
        billType = "SI",
        TagedCustomer,
    } = location.state || {};

    const navigate = useNavigate();



    useEffect(() => {
        if (!location.state || !location.state.cart || location.state.cart.length === 0) {
            alert("No items in cart!");
            navigate('/billing');
        }
    }, []);

    const methods = ['cash', 'fonepay', 'credit_card', 'credit'];
    const [paymentMethod, setPaymentMethod] = useState(0);
    const activeMethod = methods[paymentMethod];
    const [amount, setAmount] = useState('');
    const [payments, setPayments] = useState([]);


    const tenderAmount = payments.reduce((sum, p) => sum + p.amount, 0);

    const Gross = netAmount / 1.13;
    const discountAmount = discount / 1.13;
    const billAmount = finalAmount;
    const taxableAmount = Gross - discountAmount;
    const Vat = taxableAmount * 0.13;
    const dueAmount = Math.max(billAmount - tenderAmount, 0);
    const changeAmount = Math.max(tenderAmount - billAmount, 0);

    const isFullyPaid = dueAmount <= 0;

    const handleKeyClick = (value) => {
        setAmount((prev) => prev + value)
    }

    const handleBalance = () => {
        setAmount(finalAmount);
    }

    const handleAddPayment = () => {
        if (!amount) return;

        const numericAmount = Number(amount);

        const remaining = billAmount - payments.reduce((sum, p) => sum + p.amount, 0);

        // ❌ Non-cash methods cannot exceed bill
        if (activeMethod !== 'cash' && numericAmount > remaining) {
            alert("Amount cannot exceed bill amount for this payment method!");
            return;
        }
        if (activeMethod == 'fonepay') {
            setShowQr(true);
        }

        const newPayment = {
            method: activeMethod,
            amount: numericAmount,
            remark: ""
        };

        setPayments(prev => [...prev, newPayment]);

        setAmount(''); // clear input after adding
    };

    const addPaymentRef = useRef();
    const showQrRef = useRef(false);

    useEffect(() => {
        showQrRef.current = showQr;
    }, [showQr]);

    addPaymentRef.current = handleAddPayment;

    useEffect(() => {

        const handleKeyDown = (e) => {

            if (e.repeat) return; // 🔥 prevents holding/double fire

            if (!isNaN(e.key)) {
                setAmount((prev) => prev + e.key)
            }

            if (e.key === 'Backspace') {
                setAmount((prev) => prev.slice(0, -1))
            }

            if (e.key === 'PageDown') {
                setPaymentMethod((prev) => (prev + 1) % methods.length)
            }

            if (e.key === 'PageUp') {
                setPaymentMethod((prev) =>
                    prev === 0 ? methods.length - 1 : prev - 1
                )
            }

            if (e.key === 'Escape') {

                // 🔥 if QR is open → close it first
                if (showQrRef.current) {
                    setShowQr(false);
                    return;
                }

                // 🔥 otherwise go back
                navigate('/billing');


            }

            if (e.key === 'Enter') {
                e.preventDefault();
                addPaymentRef.current();
            }

        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }

    }, [])

    const handleClear = () => {
        setAmount('');
    }

    const handleBack = () => {
        setAmount((prev) => prev.slice(0, -1))
    }

    const handleDeletePayment = (index) => {
        setPayments(prev => prev.filter((_, i) => i !== index));
    };



    useEffect(() => {
        setAmount('');
        setPayments([]);
    }, [paymentMethod]);


    const handleSaveAndPrint = async () => {
        if (dueAmount > 0) {
            alert("Please settle full payment before saving the bill!");
            return;
        }
        try {

            const billData = {
                billType: billType,
                items: cart,
                discount: discount,
                customer_name: selectedCustomerData?.name || null,
                customer_no: selectedCustomerData?.mobile_no || null,
                customer_pan: selectedCustomerData?.pan_no || null,
                customer_addr: selectedCustomerData?.address || null,

                payments: payments.map(p => ({
                    method: p.method,
                    amount: p.amount
                }))
            };

            console.log(billData);

            // 🔥 API CALL
            const response = await api.post(
                "/billing/save/",
                billData
            );

            console.log("Saved:", response.data);

            const sessionData = JSON.parse(
                localStorage.getItem("sessionData")
            ) || {};

            sessionData.total_sales = Number(sessionData.total_sales || 0);
            sessionData.cash_sales = Number(sessionData.cash_sales || 0);
            sessionData.fonepay_sales = Number(sessionData.fonepay_sales || 0);
            sessionData.card_sales = Number(sessionData.card_sales || 0);
            sessionData.credit_sales = Number(sessionData.credit_sales || 0);
            sessionData.total_bills = Number(sessionData.total_bills || 0);

            sessionData.total_sales += Number(finalAmount);

            sessionData.total_bills += 1;


            payments.forEach((p) => {

                if (p.method === "cash") {
                    sessionData.cash_sales += Number(p.amount);
                }

                if (p.method === "fonepay") {
                    sessionData.fonepay_sales += Number(p.amount);
                }

                if (p.method === "credit_card") {
                    sessionData.card_sales += Number(p.amount);
                }

                if (p.method === "credit") {
                    sessionData.credit_sales += Number(p.amount);
                }

            });

            localStorage.setItem(
                "sessionData",
                JSON.stringify(sessionData)
            );
            // // ✅ CLEAR CART
            // localStorage.removeItem("cart");

            // ✅ PRINT
            setTimeout(() => {
                window.print();
                // 3. AFTER PRINT DELAY → CLEAR + NAVIGATE
                setTimeout(() => {
                    localStorage.removeItem("cart");
                    localStorage.removeItem("discountData");
                    localStorage.removeItem("TagedCustomer");
                    navigate("/billing");
                }, 500);

            }, 300);


            // // ✅ GO BACK
            // navigate('/billing');

        } catch (error) {
            console.error("Error saving bill:", error);
            alert("Failed to save bill");
        }
    };



    const [showCustomer, setShowCustomer] = useState(false);
    const [customerType, setCustomerType] = useState('NIC');
    const [Forpos, setForpos] = useState(false);
    const [Customers, setCustomers] = useState([]);
    const [SelectedCustomer, setSelectedCustomer] = useState(
        TagedCustomer?.id || ""
    );

    useEffect(() => {

        const fetchCustomers = async () => {
            try {

                const res = await api.get(
                    "/customers/customers/"
                );

                setCustomers(res.data);

            } catch (err) {
                console.error(err);
            }
        };

        fetchCustomers();

    }, []);

    useEffect(() => {
        if (activeMethod === 'credit' || activeMethod === 'credit_card') {
            setShowCustomer(true);

            if (activeMethod === 'credit_card') {
                setForpos(true);
            }
            else {
                setForpos(false);
            }
        } else {
            setShowCustomer(false);
        }
    }, [activeMethod]);

    const selectedCustomerData = Customers.find(
        cust => cust.id == SelectedCustomer
    );

    return (
        <>
            <div className='top'>
                

            </div>
            <div className='payment'>

                <div className='payment_method'>

                    <div className={`cash ${activeMethod === 'cash' ? 'active' : ''}`}>
                        <button className='cash_btn'
                            onClick={() => setPaymentMethod(0)}>

                            Cash

                        </button>
                    </div>
                    <div className={`fonepay ${activeMethod === 'fonepay' ? 'active' : ''}`}>
                        <button className='fonepay_btn'
                            onClick={() => setPaymentMethod(1)}
                        >

                        </button>

                    </div>
                    <div className={`credit_card ${activeMethod === 'credit_card' ? 'active' : ''}`}>
                        <button className='credit_card_btn'
                            onClick={() => setPaymentMethod(2)}
                        >
                            POS
                        </button>
                    </div>

                    {billType === 'TI' && (
                        <div className={`credit ${activeMethod === 'credit' ? 'active' : ''}`}>

                            <button className='credit_btn'
                                onClick={() => setPaymentMethod(3)}
                            >
                                Credit
                            </button>
                        </div>

                    )}



                </div>

                <div className='keyboard'>
                    {showCustomer && (

                        <div className='customer'>
                            <h2>Customer</h2>

                            {Forpos ? (
                                <select
                                    className='customer_input'
                                    value={customerType}
                                    onChange={(e) => setCustomerType(e.target.value)}
                                >
                                    <option value="NIC">NIC</option>
                                    <option value="FONEPAY">FonePay</option>
                                </select>


                            ) : (
                                <select
                                    className='customer_input'
                                    value={SelectedCustomer}
                                    onChange={(e) => setSelectedCustomer(e.target.value)}
                                >
                                    <option value="">Select Customer</option>

                                    {Customers.map((cust) => (
                                        <option
                                            key={cust.id}
                                            value={cust.id}
                                        >
                                            {cust.name}
                                        </option>
                                    ))}
                                </select>
                            )}

                        </div>

                    )}
                    <div className='input'>
                        <input className='amount_input'
                            type='text' placeholder='Enter Amount' value={amount} onChange={(e) => setAmount(e.target.value)} autoFocus readOnly />
                    </div>

                    <div className='balance_add'>
                        <button className='balance' onClick={handleBalance}>Balance</button>
                        <button className='add' onClick={handleAddPayment}>Add</button>

                    </div>

                    <div className='keypad'>
                        <button className='key' onClick={() => handleKeyClick('1')}>1</button>

                        <button className='key' onClick={() => handleKeyClick('2')}>2</button>

                        <button className='key' onClick={() => handleKeyClick('3')}>3</button>

                        <button className='key' onClick={() => handleKeyClick('4')}>4</button>

                        <button className='key' onClick={() => handleKeyClick('5')}>5</button>

                        <button className='key' onClick={() => handleKeyClick('6')}>6</button>

                        <button className='key' onClick={() => handleKeyClick('7')}>7</button>

                        <button className='key' onClick={() => handleKeyClick('8')}>8</button>

                        <button className='key' onClick={() => handleKeyClick('9')}>9</button>

                        <button className='key fs-2' onClick={handleClear}>Clear</button>

                        <button className='key' onClick={() => handleKeyClick('0')}>0</button>

                        <button className='key fs-2' onClick={handleBack}>Back</button>

                        <button className='key' onClick={() => handleKeyClick('.')}>.</button>

                        <button className='key Enter fs-2' onClick={handleAddPayment}>Enter</button>
                    </div>

                </div>

                <div className='payment_summary'>
                    <div className='pay_method_details'>
                        <div className='pmd_header'>
                            <span>Payment Method</span>
                            <span>Amount</span>
                            <span>Remark</span>
                        </div>

                        {payments.map((p, index) => (
                            <div className='pmd_row' key={index}>
                                <span>{p.method}</span>
                                <span>Rs. {p.amount}</span>
                                <span>{p.remark || '-'}</span>
                                <button className='cancel_btn' onClick={() => handleDeletePayment(index)}>X</button>
                            </div>
                        ))}
                    </div>

                    <div className='calculation_payment'>
                        <div className="calculation_header">
                            <span>Tender Amount</span>
                            <span>Bill Amount</span>
                            <span>Due Amount</span>
                            <span className='change_header'>Change</span>

                        </div>

                        <div className="calculation_amount">
                            <span>{tenderAmount}</span>
                            <span>{billAmount}</span>
                            <span>{dueAmount}</span>
                            <span className='change_value'>{changeAmount}</span>

                        </div>
                    </div>

                </div>

                <div className="vat_details">
                    <div className="all_vat">
                        <div className='av_left'>
                            <span>Gross</span>
                            <span>Discount</span>
                            <span>Taxable Amount</span>
                            <span>VAT</span>
                            <span>Net Amount</span>
                        </div>

                        <div className='av_right'>
                            <span>{Gross.toFixed(2)}</span>
                            <span>{discountAmount.toFixed(2)}</span>
                            <span>{taxableAmount.toFixed(2)}</span>
                            <span>{Vat.toFixed(2)}</span>
                            <span>{billAmount.toFixed(2)}</span>
                        </div>

                    </div>

                    <div className='save_prt_btn'>
                        <button className='print' onClick={handleSaveAndPrint}
                            disabled={!isFullyPaid}
                            style={{
                                opacity: !isFullyPaid ? 0.5 : 1,
                                cursor: !isFullyPaid ? 'not-allowed' : 'pointer'
                            }}>Save & Print</button>

                        <button className='back' onClick={() => navigate("/billing")}>Back</button>

                    </div>


                </div>

                <div id="invoice-print-area" className="invoice">

                    {/* HEADER */}
                    <div className="invoice-header" style={{ textAlign: "center" }}>
                        <h2>Company Name</h2>
                        <p>Address Line Here</p>
                        <h3>INVOICE</h3>
                    </div>

                    {/* BILL INFO */}
                    <div className="invoice-info">
                        <p><b>Bill No:</b> {billNo}</p>
                        <p><b>Date:</b> {new Date().toLocaleString()}</p>
                        <p><b>Customer:</b> {selectedCustomerData?.name || "-"}</p>
                        <p><b>Mobile:</b> {selectedCustomerData?.mobile_no || "-"}</p>
                        <p><b>PAN:</b> {selectedCustomerData?.pan_no || "-"}</p>
                        <p><b>Address:</b> {selectedCustomerData?.address || "-"}</p>
                        <p><b>Pay Method:</b> {payments.map(p => p.method).join(", ")}</p>
                    </div>

                    <hr />

                    {/* ITEMS TABLE */}
                    <table width="100%" style={{ fontSize: "14px" }}>
                        <thead>
                            <tr>
                                <th>SN</th>
                                <th>Item Name</th>
                                <th>Qty</th>
                                <th>Amount</th>
                            </tr>
                        </thead>

                        <tbody>
                            {cart.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.qty}</td>
                                    <td>{item.price * item.qty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <hr />

                    {/* TOTAL SECTION */}
                    <div className="invoice-summary">

                        <p>Gross Amount: {Gross.toFixed(2)}</p>
                        <p>Discount: {discount}</p>
                        <p><b>Net Amount: {billAmount.toFixed(2)}</b></p>

                        <hr />

                        <p>Tender: {tenderAmount}</p>
                        <p>Change: {changeAmount}</p>

                    </div>

                    <hr />

                    {/* AMOUNT IN WORDS (simple placeholder) */}
                    <p>
                        <b>Net Amount in Words:</b> {billAmount} only
                    </p>

                    <br />

                    {/* FOOTER */}
                    <div style={{ textAlign: "center" }}>
                        <p>Thank you</p>
                        <p>........................................</p>
                        <p>Powered by Abishek_Innovation</p>
                    </div>

                </div>

            </div>

            <div className='last_bottom'>
                    <img src={logo}></img>
                    <h2 className='abishek'>Abishek_Innovation</h2>
            
                  </div>

            <QrPopup
                show={showQr}
                onClose={() => setShowQr(false)}

            />


        </>
    )
}

export default Payment