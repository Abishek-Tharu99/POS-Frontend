import { useState } from 'react'
import api from '../api/axios';
import tokenapi from '../api/jwtapi';

const ViewData = () => {
    const sessionData = JSON.parse(localStorage.getItem("sessionData")) || "{}";
    const [username, setUsername] = useState(sessionData.username || "");

    const today = new Date();

    const formattedDate =
        today.getFullYear().toString() +
        String(today.getMonth() + 1).padStart(2, "0") +
        String(today.getDate()).padStart(2, "0");

    const [year, setYear] = useState(formattedDate);
    const [number, setNumber] = useState("");

    const [sessionId, setSessionId] = useState("");
    const [billData, setBillData] = useState(null);
    const [error, setError] = useState("");

    const getBill = async () => {
        try {
            setError("");

            const sessionId = `${username}-${year}-${number}`;

            const res = await tokenapi.get(
                `/api/bill/${sessionId}/`
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
                {/* Username */}
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className='form-control'
                />

                {/* Year */}
                <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Year"
                    className='form-control'
                />

                {/* Session Number */}
                <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="00001"
                    className='form-control'
                />


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