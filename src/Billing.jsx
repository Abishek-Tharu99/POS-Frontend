import api from './api/axios';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import SearchPopup from './Components/SearchPopup';
import Discount_Popup from './Components/Discount_Popup';
import Payment from './Pages/Payment';
import ReprintPopup from './Components/ReprintPopup';
import AddNewCustomer from './Components/AddNewCustomer';
import logo from './assets/Abishek_logo.png'
import tokenapi from './api/jwtapi';
import QtyChange from './Components/QtyChange';

const Billing = () => {

  const navigate = useNavigate();

  const [billType, setbillType] = useState("SI");
  const [BillNo, setBillNo] = useState("");

  /*Cart management*/
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });


  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const [discountItem, setDiscountItem] = useState(null);

  const addToCart = (item) => {
    setCart(prev => {
      const exist = prev.find(i => i.code === item.code);

      if (exist) {
        return prev.map(i =>
          i.code === item.code
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      } else {
        // return [...prev, { ...item, qty: 1 }];
        return [...prev, { ...item, qty: 1 }];
      }
    });

    setShowPopup(false);
    setQuery("");
  };

  /* Calculate net amount*/
  const netAmount = cart.reduce((total, item) => {
    return total + item.price * item.qty;
  }, 0);


  /*Clear bill*/
  //const [IsClearing,setIsClearing] = useState(false);

  const clearBill = () => {
    // setIsClearing(true);
    setCart([]);
    setDiscountData(null);
    setTagedCustomer(null);

    localStorage.removeItem("cart");
    localStorage.removeItem("discountData");
    localStorage.removeItem("TagedCustomer");


  };

  /*search function*/

  const [items, setItems] = useState([]);
  const [SelectedItem, setSelectedItem] = useState(null);
  const [query, setQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [DiscountPopup, setDiscountPopup] = useState(false);
  const [Reprint_popup, setReprint_popup] = useState(false);
  const [QtyItem, setQtyItem] = useState(null);
  const [QtyPopup, setQtyPopup] = useState(false);


  /*get items from backend*/
  const handleSearch = async (value) => {
    setQuery(value);

    try {
      const res = await api.get(
        `/billing/items/?search=${value}`
      );

      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  const [loadingBill, setLoadingBill] = useState(true);

  const [SelectCustomer, setSelectCustomer] = useState(null);
  const [ShowTagCustomer, setShowTagCustomer] = useState(false);
  const [Customers, setCustomers] = useState([]);
  const [SearchCustomer, setSearchCustomer] = useState("");
  const [ShowAddCustomer, setShowAddCustomer] = useState(false);

  const [TagedCustomer, setTagedCustomer] = useState(() => {
    return JSON.parse(localStorage.getItem("TagedCustomer")) || null;
  });

  useEffect(() => {
    localStorage.setItem(
      "TagedCustomer", JSON.stringify(TagedCustomer));
  }, [TagedCustomer]);

  const handleSearchCustomer = async (value) => {
    setSearchCustomer(value);

    try {
      const res = await api.get(`/customers/customers/?customer=${value}`)

      setCustomers(res.data);


    } catch (err) {
      console.error("Error fetching items:", err);
    }

  };

  useEffect(() => {
    const fetchBillNo = async () => {
      try {
        const res = await tokenapi.get(`/billing/bill_no/?type=${billType}`);
        setBillNo(res.data.bill_no);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingBill(false);
      }
    };

    fetchBillNo();
  }, [billType]);

  const billNoRef = useRef(BillNo);

  useEffect(() => {
    billNoRef.current = BillNo;
  }, [BillNo]);


  const [holdData, setHoldData] = useState(() => {
    return JSON.parse(localStorage.getItem("holdData")) || [];
  });

  useEffect(() => {
    localStorage.setItem("holdData", JSON.stringify(holdData));
  }, [holdData]);

  const [showHoldPanel, setShowHoldPanel] = useState(false);
  const [selectedHold, setSelectedHold] = useState(null);


  const cartRef = useRef(cart);

  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);


  const handleHold = () => {

    const currentCart = cartRef.current;

    if (currentCart.length === 0) return;

    const now = new Date();
    const nowTime = Date.now();


    if (nowTime - lastHoldTime.current < 1000) return;
    lastHoldTime.current = nowTime;

    const net = currentCart.reduce((t, i) => t + i.price * i.qty, 0);

    const discountValue = discountData
      ? discountData.discountType === "percentage"
        ? (net * discountData.discountValue) / 100
        : discountData.discountValue
      : 0;

    const final = net - discountValue;

    const newHold = {
      id: Date.now(), // unique id
      billNo: String(billNoRef.current),
      items: structuredClone(cartRef.current),
      amount: final,
      date: now.toDateString(),
    };



    setHoldData(prev => {
      const updated = [...prev, newHold];
      localStorage.setItem("holdData", JSON.stringify(updated));
      return updated;
    });
    //console.log(newHold);
    // clear current bill
    clearBill();

    // optional: reset selected hold
    setSelectedHold(null);

  };


  const handleRetrieveHold = (hold) => {

    if (!hold) return;

    // ❗ If current cart has data, confirm overwrite
    if (cartRef.current.length > 0) {
      const confirmReplace = window.confirm("Current bill will be lost. Continue?");
      if (!confirmReplace) return;
    }

    // ✅ Load hold data into cart
    setCart(structuredClone(hold.items));


    // ✅ remove from hold list
    setHoldData(prev => prev.filter(h => h.id !== hold.id));

    // ✅ reset UI
    setSelectedHold(null);
    setShowHoldPanel(false);

  };

  const deleteHold = (id) => {
    const confirmDelete = window.confirm("Delete this hold bill?");
    if (!confirmDelete) return;

    setHoldData(prev => prev.filter(h => h.id !== id));

    // if deleted one is selected, reset selection
    if (selectedHold?.id === id) {
      setSelectedHold(null);
    }
  };

  /* Handle payment and count management */

  const [discountData, setDiscountData] = useState(() => {
    return JSON.parse(localStorage.getItem("discountData")) || null;
  });

  useEffect(() => {
    localStorage.setItem(
      "discountData",
      JSON.stringify(discountData)
    );
  }, [discountData]);

  const itemDiscountTotal = cart.reduce((total, item) => {
    return total + (item.discount || 0);
  }, 0);

  const discount = discountData
    ? discountData.discountType === "percentage"
      ? (netAmount * Number(discountData.discountValue)) / 100
      : Number(discountData.discountValue)
    : 0;

  // const hasBillDiscount = discountData !== null;

  // const totalDiscount = hasBillDiscount
  //   ? discount
  //   : itemDiscountTotal;

  const totalDiscount = discount + itemDiscountTotal;
  const finalAmount = Number(netAmount) - Number(totalDiscount);


  const handleGoToPayment = () => {

    //console.log({
    //  netAmount,
    //  totalDiscount,
    //  finalAmount
    //});

    try {
      localStorage.setItem("finalAmount", finalAmount);

      navigate('/payment', {
        state: {
          cart: structuredClone(cart),
          netAmount,
          discount: totalDiscount,
          finalAmount,
          billNo: BillNo,
          billType: billType,
          timestamp: Date.now(),
          TagedCustomer,
        }
      });
    } catch (err) {
      console.log(err);
    }
  };


  /* Handle Enter key in search input */

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (items.length === 0) return;

      const matchedItem = items.find(item =>
        item.code.toString().trim() === query.trim()
      );

      if (matchedItem) {
        addToCart(matchedItem);
      }
      else {
        alert("Item not found!");
        setQuery("");
        setItems([]);
      }

    }
  };

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const lastHoldTime = useRef(0);


  const increaseQty = (item) => {
    if (SelectedItem?.code !== item.code) return;

    setCart(prev =>
      prev.map(i =>
        i.code === item.code
          ? { ...i, qty: i.qty + 1 }
          : i
      )
    );
  };

  const decreaseQty = (item) => {
    if (SelectedItem?.code !== item.code) return;

    setCart(prev =>
      prev
        .map(i =>
          i.code === item.code
            ? { ...i, qty: i.qty - 1 }
            : i
        )
        .filter(i => i.qty > 0)
    );
  };


  const changeRate = (item) => {
    if (SelectedItem?.code !== item.code) return;

    const newRate = prompt("Enter new rate:");
    if (!newRate) return;

    setCart(prev =>
      prev.map(i =>
        i.code === item.code
          ? { ...i, price: Number(newRate) }
          : i
      )
    );
  };

  const applyDiscount = (item) => {
    if (SelectedItem?.code !== item.code) {
      alert("Select item first!");
      return;
    }

    setDiscountItem(item);       // store selected item
    setDiscountPopup(true);      // open popup
  };

  const changeqty = (item) => {
    if (SelectedItem?.code !== item.code) {
      alert("Select item first!");
      return;
    }

    setQtyItem(item);
    setQtyPopup(true);
  };

  /* Keyboard shortcuts */
  useEffect(() => {
    const handleKeyDown = (e) => {


      if (e.key === 'F1') {
        e.preventDefault(); // stops browser help page
        setShowPopup(true);
      }

      if (e.key == 'F3') {
        e.preventDefault();
        setDiscountItem(null);   // 🔥 IMPORTANT
        setDiscountPopup(true);
        setShowHoldPanel(false);
        setShowTagCustomer(false);
        setReprint_popup(false);
       
  
      }

      if (e.key == 'F2') {
        e.preventDefault();
        setShowTagCustomer(true);
        setShowHoldPanel(false);
        handleSearchCustomer("");
        setReprint_popup(false);
        setShowAddCustomer(false);
      }

      if (e.key === 'Escape') {
        setShowPopup(false);
        setDiscountPopup(false);
        setShowHoldPanel(false);
        setReprint_popup(false);
        setShowTagCustomer(false);
        setShowAddCustomer(false);
        setSelectedHold(null);
        setQtyPopup(false);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }

      if (e.key == 'F10') {
        e.preventDefault();

        const confirmClear = window.confirm("Clear full bill?");
        if (confirmClear) {
          clearBill();
        }
      }

      if (e.key === 'F9') {
        e.preventDefault();

        setbillType(prev => (prev === "SI" ? "TI" : "SI"));
      }

      if (e.key === 'F6') {
        e.preventDefault();
        handleHold();
      }

      if (e.key === 'F7') {
        e.preventDefault();
        //setShowHoldPanel(prev => !prev);// toggle visibility
        setShowTagCustomer(false);
        setShowHoldPanel(true);

      }
      if (e.key === 'End') {
        e.preventDefault();

        if (!billNoRef.current) {
          alert("Bill number not ready yet");
          return;
        }

        handleGoToPayment();
      }
      if (e.key === 'F4') {

        e.preventDefault();
        setReprint_popup(true);
        setShowAddCustomer(false);
      }


    };
    /*  Remember to clean up the event listener when the component unmounts to prevent memory leaks and unintended behavior. */

    window.addEventListener('keydown', handleKeyDown);
    /*returning a cleanup function that removes the event listener when the component unmounts. This ensures that the event listener does not persist after the component is no longer in use, preventing potential memory leaks and unintended behavior. */
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [finalAmount, netAmount, totalDiscount, billType, cart, BillNo, TagedCustomer]);



  useEffect(() => {
    const startsession = async () => {
      try {
        const res = await tokenapi.post("/session/start/");
        return res.data.session_id;
      } catch (err) {
        console.log("Failed to start session:", err);
      } finally {
        console.log("Session start attempt finished");
      }
    };

    const init = async () => {
      try {
        const session_id = await startsession();

        if (!session_id) {
          console.log("No session ID received, aborting init");
          return;
        }

        const existingSession = JSON.parse(localStorage.getItem("sessionData"));
        // console.log("Existing session data:", existingSession);

        if (!existingSession) {
          const newSession = {
            session_id: session_id,
            total_sales: 0,
            cash_sales: 0,
            fonepay_sales: 0,
            card_sales: 0,
            credit_sales: 0,
            total_bills: 0
          };

          localStorage.setItem("sessionData", JSON.stringify(newSession));
        }

      } catch (err) {
        console.log(err);
      }
    };

    init();

  }, []);

  const viewdata = () => {

    navigate("/viewdata");
  };


  const handleEndSession = async () => {

    try {

      const sessionData = JSON.parse(
        localStorage.getItem("sessionData")
      );

      //console.log("Ending session with data:", sessionData);

      navigate("/end_session", { state: { sessionData } });

    } catch (err) {

      console.log(err);
      alert("Failed to end session");

    }

  };
  

  return (
    <>
      <div className='top'>
        <h2>{billType === "SI" ? "Sales Bill" : "Tax Bill"}</h2>

      </div>

      <div className='container-fluid billing_container'>

        <div className='box left col-12 col-md-6'>
          <div className='search_pannel bg-warning'>
            <input type="text" placeholder="Search by name,code" value={query}
              onChange={(e) => handleSearch(e.target.value)} className="search-input"
              onKeyDown={handleEnter}
              autoFocus
              ref={inputRef}
            />
          </div>

          <div className='display_section'>
            <div className='hold_details'>
              {ShowTagCustomer ? (
                <>
                  <div className='search_customer'>
                    <h2>Customer</h2>
                    <input className='customer_input' placeholder='Enter customer name'
                      value={SearchCustomer}
                      onChange={(e) => handleSearchCustomer(e.target.value)}></input>

                  </div>

                  <div className='customer_header'>
                    <span>CUSTID</span>
                    <span>MOBILE NO</span>
                    <span>CUSTOMER NAME</span>
                    <span>PAN NO</span>
                  </div>

                  <div className='customers_details'>
                    {Customers.length === 0 ? (
                      <p>No customers found</p>
                    ) : (
                      Customers.map((cust) => (
                        <div
                          key={cust.id}
                          className={`customer_row ${SelectCustomer?.id === cust.id ? "active" : ""
                            }`}
                          onClick={() => {
                            setSelectCustomer(cust);
                          }}
                        >
                          <span>{cust.id}</span>
                          <span>{cust.mobile_no}</span>
                          <span>{cust.name}</span>
                          <span>{cust.pan_no}</span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className='buttons'>
                    <button
                      onClick={() => {
                        if (!SelectCustomer) {
                          alert("Select customer first");
                          return;
                        }

                        //console.log("Tagged:", SelectCustomer);
                        setTagedCustomer(SelectCustomer);
                        setShowTagCustomer(false);
                      }}
                    >
                      Tag
                    </button>

                    <button onClick={() => setShowAddCustomer(true)}>Add New</button>
                  </div>

                </>
              ) : (
                <div className='kuch_vi'>

                </div>
              )}

              {showHoldPanel ? (
                <>
                  <div className="hold_header">
                    <span>#</span>
                    <span>Bill No</span>
                    <span>Date</span>
                    <span>Amount</span>
                    <span>Delete</span>
                  </div>

                  {holdData.map((h, index) => (
                    <div
                      key={h.id}
                      className={`hold_row ${selectedHold?.id === h.id ? "active" : ""}`}
                      onClick={() => setSelectedHold(h)}

                    >
                      <span>{index + 1}</span>
                      <span>{String(h.billNo)}</span>
                      <span>{String(h.date)}</span>
                      <span>Rs. {Number(h.amount)}</span>
                      <span><button className='deleteHold'
                        onClick={(e) => {
                          e.stopPropagation(); // prevent selecting row
                          deleteHold(h.id);
                        }}>X</button></span>
                    </div>
                  ))}

                </>
              ) : (
                <div className="hold_placeholder">

                </div>
              )}

            </div>
            {selectedHold ? (
              <>
                <div className="recall_button">
                  <button
                    onClick={() => {
                      handleRetrieveHold(selectedHold);

                    }}
                    onDoubleClick={() => {
                      handleRetrieveHold(selectedHold);

                    }}
                  >
                    Recall
                  </button>
                </div>


              </>

            ) : (
              <div className="recall_placeholder">

              </div>
            )

            }


          </div>
        </div>


        <div className='box right col-12 col-md-6'>
          <div className='Bill_detail d-flex'>
            <span ><h3>Bill No: </h3></span>
            <span> <input type='text' value={BillNo ? BillNo : "Fetching..."} readOnly></input></span>

          </div>


          <div className='all_items_detail'>

            <div className="cart_header">
              <span>SN</span>
              <span>Code</span>
              <span>Name</span>
              <span>Qty</span>
              <span>Rate</span>
              <span>Amount</span>
              <span>Discount</span>
            </div>

            {cart.map((item, index) => (
              <div key={item.code}
                className={`cart_row ${SelectedItem?.code === item.code ? "active" : ""
                  }`}
                onClick={() => {
                  setSelectedItem(item);
                }}>
                <div className='item-details'>
                  <span>{index + 1}</span>
                  <span>{item.code}</span>
                  <span>{item.name}</span>
                  <span>{item.qty} </span>
                  <span>{item.price}</span>
                  <span>Rs.{item.price * item.qty}</span>
                  <span>
                    {item.discount > 0 && (
                      <small style={{ color: "red", marginLeft: "5px" }}>
                        -{item.discount}
                      </small>
                    )}
                  </span>
                </div>


                {SelectedItem?.code === item.code && (
                  <div className='manipulatebtn'>
                    <button onClick={() => decreaseQty(item)}>Decrease[-]</button>
                    <button onClick={() => increaseQty(item)}>Increase[+]</button>
                    <button onClick={() => changeqty(item)}>Change QTY</button>
                    <button onClick={() => applyDiscount(item)}>Discount</button>
                    <button onClick={() => changeRate(item)}>Change Rate</button>
                  </div>
                )}

              </div>
            ))}

          </div>

          <div className='last d-flex'>

            <div className='total_amount d-flex'>
              <h2 className='net_amount'>Net Amount: </h2>
              <h2 className='discount'>Discount: </h2>
              <h2 className='payable_ammount'>Total Amount: </h2>

            </div>

            <div className='calculation d-flex'>
              <h2 className='net_amount'>
                {netAmount}
              </h2>
              {/* <h2>Bill Discount: Rs.{discount}</h2> */}
              <h2 className='discount'>
                Rs.{totalDiscount}
              </h2>
              <h2 className='payable_amount'>Rs. {finalAmount}</h2>
            </div>

            <div className='pay_button d-flex'>
              <h2 className='paybill'>Pay Bill</h2>
              <button className='paybtn' onClick={handleGoToPayment}
                disabled={cart.length === 0 || !BillNo}></button>

            </div>
          </div>


        </div>

        <div className='bottom'>
          <div className='end_btn'>
            <button className="end_session_btn" onClick={handleEndSession}>
              End Session
            </button>

            <button className="end_session_btn" onClick={viewdata}>
              View Daata
            </button>


          </div>
          <div className='partyDetails'>
            <div className='partyheaders'>
              <h2>Name : </h2>
              <h2>Mobile NO : </h2>
              <h2>PAN No : </h2>
              <h2>Address:</h2>
            </div>

            <div className='partydata'>
              <h3>{TagedCustomer?.name || "-"}</h3>
              <h3>{TagedCustomer?.mobile_no || "-"}</h3>
              <h3>{TagedCustomer?.pan_no || "-"}</h3>
              <h3>{TagedCustomer?.address || "-"}</h3>
            </div>



          </div>

          <div className='shortcut'>
            <h2>F1 = Search</h2>
            <h2>F2 = Tag Customer</h2>
            <h2>F3 = Discount</h2>
            <h2>F4 = Reprint</h2>
            <h2>F6 = Hold Bill</h2>
            <h2>F7 = Recall Bill</h2>
            <h2>F9 = Tax Bill</h2>
            <h2>F10 = Clear bill</h2>

          </div>

        </div>

      </div >

      <div className='last_bottom'>
        <img src={logo}></img>
        <h2 className='abishek'>Abishek_Innovation</h2>

      </div>

      < SearchPopup
        show={showPopup}
        query={query}
        setQuery={handleSearch}
        items={items}
        onClose={() => setShowPopup(false)}
        onSelect={addToCart}   // 🔥 connect here
      />

      <Discount_Popup
        show={DiscountPopup}
        netAmount={cart.reduce((total, item) => total + item.price * item.qty, 0)}
        onClose={() => setDiscountPopup(false)}
        onApply={(data) => {
          if (discountItem) {
            // ITEM LEVEL DISCOUNT
            setCart(prev =>
              prev.map(i => {
                if (i.code === discountItem.code) {
                  let discountValue = 0;

                  if (data.discountType === "percentage") {
                    discountValue = (i.price * i.qty * data.discountValue) / 100;
                  } else {
                    discountValue = data.discountValue;
                  }

                  return { ...i, discount: discountValue };
                }
                return i;
              })
            );
          } else {
            // BILL LEVEL DISCOUNT
            setDiscountData(data);
          }

          setDiscountPopup(false);
        }}
      />

      <ReprintPopup
        show={Reprint_popup}
        onClose={() => setReprint_popup(false)}
      />

      <AddNewCustomer
        show={ShowAddCustomer}
        onClose={() => setShowAddCustomer(false)}
        onCustomerAdded={handleSearchCustomer}
      />

      <QtyChange
        show={QtyPopup}
        item={QtyItem}
        onClose={() => setQtyPopup(false)}
        onApply={(newQty) => {
          setCart(prev =>
            prev.map(i =>
              i.code === QtyItem.code
                ? { ...i, qty: Number(newQty) }
                : i
            )
          );

          setQtyPopup(false);
        }}
      />

    </>
  )
}

export default Billing