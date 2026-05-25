import React from "react";

const Invoice = ({ bill }) => {
    if (!bill) return null;

    return (
        <div id="invoice-print-area" className="invoice">

            <div className="invoice-header" style={{ textAlign: "center" }}>
                <h2>Company Name</h2>
                <p>Address Line Here</p>
                <h3>INVOICE</h3>
            </div>

            <div className="invoice-info">
                <p><b>Bill No:</b> {bill.bill_no}</p>
                <p><b>English Date:</b> {bill.date_en}</p>
                <p><b>Nepali Date:</b> {bill.date_np}</p>
                <p><b>Customer:</b>{bill.customer_name}</p>
                <p><b>Mobile:</b> {bill.customer_no}</p>
                <p><b>PAN:</b> {bill.customer_pan}</p>
                <p><b>Address:</b> {bill.customer_addr}</p>
                <p><b>Pay Method:</b> {bill.payments?.map(p => p.method).join(", ")}</p>
            </div>

            <hr />

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
                    {bill.items?.map((item, index) => (
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

            <div>
                <p><b>Net Amount:</b> {bill.total}</p>
                <p><b>Change:</b> {bill.change || 0}</p>
            </div>

            <hr />

            <p style={{ textAlign: "center" }}>Thank you</p>
        </div>
    );
};

export default Invoice;