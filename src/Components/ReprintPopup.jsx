import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import ReprintPreview from './ReprintPreview';


const ReprintPopup = ({
    show,
    onClose,
}
) => {

    const navigate = useNavigate();

    const [bills, setBills] = useState([]);
    const [selectedBill, setSelectedBill] = useState(null);
    const [billInput, setBillInput] = useState("");

    useEffect(() => {
        if (show) {
            axios.get('http://127.0.0.1:8000/billing/bills/recent/')
                .then(res => setBills(res.data));
        }
    }, [show]);


    if (!show) return null;

    const handleReprint = async () => {

        const billNo = (billInput || selectedBill?.bill_no || "").trim().toUpperCase();

        if (!billNo) {
            alert("Enter or select a bill");
            return;
        }

        try {
            const res = await axios.get(`http://127.0.0.1:8000/billing/bills/detail/${billNo}/`);

            const reprint_billData = res.data;

            // store for print page
            localStorage.setItem("reprintBill", JSON.stringify(reprint_billData));
            console.log("OK done");

            navigate("/reprint-preview");


        } catch (err) {
            console.error(err);
            alert("Error: " + err.message);
        }
    };



    return (
        <>
            <div className='reprint_screen'>
                <div className="reprint_section" onClick={(e) => e.stopPropagation()}>
                    <div className='close_reprint_btn'>
                        <button className='reprint_close_button' onClick={onClose}>X</button>
                    </div>
                    <div className='reprint_btn'>
                        <div className="billwithheading">
                            <h2 className='billNo'>Bill No</h2>


                            <input
                                className='billvalue'
                                type='text'
                                value={billInput}
                                onChange={(e) => setBillInput(e.target.value)}
                                placeholder="Enter Bill No"
                            />

                        </div>

                        <div className="reprtn">
                            <button className='reprint_button'
                                onClick={handleReprint}>Reprint</button>
                        </div>

                    </div>
                    <div className='bills50'>

                        <div className='bills_header'>
                            <span>Bill No</span>
                            <span>Date </span>
                            <span>Time</span>
                            <span>Total</span>
                        </div>

                        <div className='bills_list'>
                            {bills.map((b, i) => (
                                <div
                                    key={i}
                                    className={`bill_row ${selectedBill?.bill_no === b.bill_no ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedBill(b);
                                        setBillInput(b.bill_no); // autofill
                                    }}
                                >
                                    <span>{b.bill_no}</span>
                                    <span>{b.date}</span>
                                    <span>{b.time}</span>
                                    <span>Rs. {b.total}</span>
                                </div>
                            ))}
                        </div>

                    </div>


                </div>

            </div>
        </>
    )
}

export default ReprintPopup