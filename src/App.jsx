import React from 'react'
import { useState } from 'react'
import api from './api/axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';


const App = () => {


  const navigate = useNavigate();
  const sessionData = JSON.parse(localStorage.getItem("sessionData")) || "{}";
  // console.log("Session Data in App.jsx:", sessionData);

  const saveBill = async () => {
    try {
        const res = await api.post("/api/save/", {
        date: new Date().toISOString().split("T")[0],
        opening_balance: value_ob,
        cash_sales: cash_sales,
        pos: value_pos,
        fonepay: value_fp,
        credit: value_cr,
        total_sales: value_ts,
        excess_less: ex_le,
        expenses: value_exp,
        deposited_bank: value_de_bank,
        given_other: value_gto,
        closing_balance: sum_result,
      });

      console.log(res.data);

      // 🔥 THIS IS MISSING IN YOUR CODE
      const sessionEndRes = await api.post("/session/end/", {
        session_id: sessionData.session_id,
        total_sales: value_ts,
        fonepay: value_fp,
        pos: value_pos,
        credit: value_cr,
      });

      
      console.log(sessionEndRes.data);



      localStorage.removeItem("sessionData");

      alert("Saved Successfully");
      navigate("/");
    } catch (error) {
      console.error("Error saving bill:", error);
      alert("Error saving bill");
    }
  };




    const [quantity1000, setQuantity1000] = useState(0);
    const [quantity500, setQuantity500] = useState(0);
    const [quantity100, setQuantity100] = useState(0);
    const [quantity50, setQuantity50] = useState(0);
    const [quantity20, setQuantity20] = useState(0);
    const [quantity10, setQuantity10] = useState(0);
    const [quantity5, setQuantity5] = useState(0);
    const [quantity_ic, setQuantity_ic] = useState(0);

    const [value_ob, setValue_ob] = useState(0);
    const [value_pos, setValue_pos] = useState(0);
    const [value_fp, setValue_fp] = useState(0);
    const [value_cr, setValue_cr] = useState(0);
    const [value_ts, setValue_ts] = useState(sessionData.total_sales || 0);
    const [value_exp, setValue_exp] = useState(0);

    const [value_de_bank, setValue_de_bank] = useState(0);
    const [value_gto, setValue_gto] = useState(0);



    const result1000 = (quantity1000 || 0) * 1000;
    const result500 = (quantity500 || 0) * 500;
    const result100 = (quantity100 || 0) * 100;
    const result50 = (quantity50 || 0) * 50;
    const result20 = (quantity20 || 0) * 20;
    const result10 = (quantity10 || 0) * 10;
    const result5 = (quantity5 || 0) * 5;
    const result_ic = (quantity_ic || 0) * 1.6;

    const sum_result = result1000 + result500 + result100 + result50 + result20 + result10 + result5 + result_ic;
    const other_sales_sum = value_cr + value_fp + value_pos;
    const cash_sales = value_ts - other_sales_sum;
    const total_cash_sales = cash_sales + value_ob;
    const net_cash = total_cash_sales - value_exp - value_de_bank - value_gto;
    const ex_le = sum_result - net_cash;


    return (
      <>
        <main className='end wrap d-flex flex-column flex-lg-row my-3'>
          <div className='custom-col col-12 '>
            <input type="text" readOnly className='w-auto text-center' value={sessionData.session_id}></input>
            <div className='d-flex align-items-center gap-2 ms-3 mt-3'>


              <h5 className='mb-0'>1000 x</h5>
              <input type="number" className='w-auto' value={quantity1000} onChange={(e) => setQuantity1000(Number(e.target.value === "" ? 0 : Number(e.target.value)))}></input>
              <h5 className='mb-0'>=</h5>
              <input type="number" className='w-auto' readOnly value={result1000}></input>
            </div>

            <div className='d-flex align-items-center gap-2 ms-3 mt-3'>
              <h5 className='mb-0'>500 x</h5>
              <input type="number" className='w-auto' value={quantity500} onChange={(e) => setQuantity500(Number(e.target.value === "" ? 0 : Number(e.target.value)))}></input>
              <h5 className='mb-0'>=</h5>
              <input type="Number" className='w-auto' readOnly value={result500}></input>
            </div>

            <div className='d-flex align-items-center gap-2 ms-3 mt-3'>
              <h5 className='mb-0'>100 x</h5>
              <input type="number" className='w-auto' value={quantity100} onChange={(e) => setQuantity100(Number(e.target.value === "" ? 0 : Number(e.target.value)))}></input>
              <h5 className='mb-0'>=</h5>
              <input type="number" className='w-auto' readOnly value={result100}></input>
            </div>

            <div className='d-flex align-items-center gap-2 ms-3 mt-3'>
              <h5 className='mb-0'>50 x</h5>
              <input type="number" className='w-auto' value={quantity50} onChange={(e) => setQuantity50(Number(e.target.value === "" ? 0 : Number(e.target.value)))}></input>
              <h5 className='mb-0'>=</h5>
              <input type="number" className='w-auto' readOnly value={result50}></input>
            </div>

            <div className='d-flex align-items-center gap-2 ms-3 mt-3'>
              <h5 className='mb-0'>20 x</h5>
              <input type="number" className='w-auto' value={quantity20} onChange={(e) => setQuantity20(Number(e.target.value === "" ? 0 : Number(e.target.value)))}></input>
              <h5 className='mb-0'>=</h5>
              <input type="number" className='w-auto' readOnly value={result20}></input>
            </div>

            <div className='d-flex align-items-center gap-2 ms-3 mt-3'>
              <h5 className='mb-0'>10 x</h5>
              <input type="number" className='w-auto' value={quantity10} onChange={(e) => setQuantity10(Number(e.target.value === "" ? 0 : Number(e.target.value)))}></input>
              <h5 className='mb-0'>=</h5>
              <input type="number" className='w-auto' readOnly value={result10}></input>
            </div>

            <div className='d-flex align-items-center gap-2 ms-3 mt-3'>
              <h5 className='mb-0'>5 x</h5>
              <input type="number" className='w-auto' value={quantity5} onChange={(e) => setQuantity5(Number(e.target.value === "" ? 0 : Number(e.target.value)))}></input>
              <h5 className='mb-0'>=</h5>
              <input type="number" className='w-auto' readOnly value={result5}></input>
            </div>

            <div className='d-flex align-items-center gap-2 ms-3 mt-3'>
              <h5 className='mb-0'>IC x</h5>
              <input type="number" className='w-auto' value={quantity_ic} onChange={(e) => setQuantity_ic(Number(e.target.value === "" ? 0 : Number(e.target.value)))}></input>
              <h5 className='mb-0'>=</h5>
              <input type="number" className='w-auto' readOnly value={result_ic}></input>
            </div>

            <hr />
            <div className='d-flex align-items-center gap-2 ms-3 mt-5'>
              <h5 className='mb-0'>Total</h5>
              <h5 className='mb-0'>=</h5>
              <input type="number" className='w-auto' readOnly value={sum_result}></input>
            </div>


          </div>


          <div className='custom-col col-12 '>

            <div className='d-flex align-items-center'>

              <h3>Opening balance</h3>

              <div className='m-3'>
                <input type='number' onChange={(e) => setValue_ob(Number(e.target.value === "" ? 0 : Number(e.target.value)))}></input>
              </div>

            </div>

            <div className='d-flex align-items-center'>

              <h3>Cash Sales</h3>

              <div className='m-3'>
                <input type='number' readOnly value={cash_sales}></input>
              </div>

            </div>

            <div className='d-flex align-items-center'>

              <h3>POS</h3>

              <div className='m-3'>
                <input type='number' onChange={(e) => setValue_pos(Number(e.target.value === "" ? 0 : Number(e.target.value)))}></input>
              </div>

            </div>

            <div className='d-flex align-items-center'>

              <h3>Fonepay</h3>

              <div className='m-3'>
                <input type='number' onChange={(e) => setValue_fp(Number(e.target.value === "" ? 0 : Number(e.target.value)))}></input>
              </div>

            </div>

            <div className='d-flex align-items-center'>

              <h3>Credit</h3>

              <div className='m-3'>
                <input type='number' onChange={(e) => setValue_cr(Number(e.target.value === "" ? 0 : Number(e.target.value)))}></input>
              </div>

            </div>

            <div className='d-flex align-items-center'>

              <h3>Total sales</h3>

              <div className='m-3'>
                <input type='number' value={value_ts} readOnly></input>
              </div>

              {/* <div className='m-3'>
              <input type='number' onChange={(e) => setValue_ts(Number(e.target.value === "" ? 0 : Number(e.target.value)))}></input>
            </div> */}

            </div>

            <div className='d-flex align-items-center'>
              <h3>Expenses</h3>
              <div className='m-3'>
                <input type='number' onChange={(e) => setValue_exp(Number(e.target.value === "" ? 0 : Number(e.target.value)))}></input>
              </div>
            </div>



            <div className='d-flex align-items-center'>

              <h3>Excess/Less</h3>

              <div className='m-3'>
                <input type='number' readOnly value={ex_le}></input>
              </div>

            </div>


            <div className='d-flex align-items-center'>

              <h3>Closing Balance</h3>

              <div className='m-3'>
                <input type='number' readOnly value={sum_result}></input>
              </div>

            </div>





          </div>

          <div className='custom-col col-12 '>
            <div className='d-flex align-items-center'>
              <h3>Deposited in Bank</h3>
              <div className='m-3'>
                <input type='number' onChange={(e) => setValue_de_bank(Number(e.target.value === "" ? 0 : Number(e.target.value)))}></input>
              </div>
            </div>

            <div className='d-flex align-items-center'>
              <h3>Given to other</h3>
              <div className='m-3'>
                <input type='number' onChange={(e) => setValue_gto(Number(e.target.value === "" ? 0 : Number(e.target.value)))}></input>
              </div>
            </div>

            <div className='d-flex'>
              <button disabled={!value_ts} className='m-auto align-items-center btn border border-3 border-primary bg-primary-subtle' onClick={saveBill}>Save Data</button>

              <Link className='viewdata fs-4 m-auto align-items-center border border-3 border-primary rounded-3 bg-primary-subtle border-3 me-3' to={'/viewdata'}>View Data</Link>

              {/* <input type="date" onChange={(e) => setSearchDate(e.target.value)} />
            <button className='m-auto align-items-center btn btn-2 border border-3 border-primary bg-primary-subtle' onClick={getBill}>View Data</button> */}

            </div>

            {/* {billData && (
            <div>
              <h3>Total Sales: {billData.total_sales}</h3>
              <h3>Cash Sales: {billData.cash_sales}</h3>
            </div>
          )} */}

          </div>
        </main>



      </>
    )
  }

  export default App