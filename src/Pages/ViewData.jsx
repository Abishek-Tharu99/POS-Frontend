import { useState } from 'react'
import api from '../api/axios';

const ViewData = () => {

    const [searchDate, setSearchDate] = useState("");
    const [billData, setBillData] = useState(null);
    const [error, setError] = useState("");

    const getBill = async () => {
        try {
            setError("");

            const res = await api.get(
                `/api/bill/${searchDate}/`
            );

            setBillData(res.data);
        } catch (err) {
            setBillData(null);
            setError("No data found or server error");
            console.log("Error fetching bill data:", err);
        }
    };

    return (
        <div className='p-4'>

            <div className='d-flex align-items-center'>
                <input className='fs-4' type="date" onChange={(e) => setSearchDate(e.target.value)}/>
                <button className='m-auto btn btn-primary' onClick={getBill}>Search</button>
            </div>

            {error && <p className="text-danger mt-3">{error}</p>}

            <div className='p-5 mt-5 border border-4 border-primary'>

                {billData && (
                    <div>
                        <h3>Opening Balance: {billData.opening_balance}</h3>
                        <h3>Cash Sales: {billData.cash_sales}</h3>
                        <h3>POS: {billData.pos}</h3>
                        <h3>Fonepay: {billData.fonepay}</h3>
                        <h3>Credit: {billData.credit}</h3>
                        <h3>Total Sales: {billData.total_sales}</h3>

                        <h3>Expenses: {billData.expenses}</h3>
                        <h3>Excess/Less: {billData.excess_less}</h3>
                        <h3>Closing Balance: {billData.closing_balance}</h3>

                        <h3>Deposited in Bank: {billData.deposited_bank}</h3>
                        <h3>Given to Other: {billData.given_other}</h3>
                    </div>
                )}

            </div>
        </div>
    )
}

export default ViewData