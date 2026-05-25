import React, { useEffect, useState, useRef } from "react";
import Invoice from "./Invoice";
import Billing from "../Billing";
import { useNavigate } from "react-router";


const ReprintPreview = () => {

    const navigate = useNavigate();

    const [bill, setBill] = useState(null);
    const printTriggered = useRef(false);


    useEffect(() => {
        const data = localStorage.getItem("reprintBill");

        console.log("RAW DATA:", data); // 👈 important debug

        if (data) {
            setBill(JSON.parse(data));
        }
    }, []);

    useEffect(() => {
        if (bill && !printTriggered.current) {
            printTriggered.current = true;

            // wait for DOM render
            requestAnimationFrame(() => {
                setTimeout(() => {
                    window.print();

                    setTimeout(() => {
                        localStorage.removeItem("reprintBill");
                    }, 500);

                }, 300);
            });
        }
    }, [bill]);

    // 🔥 detect when print dialog closes
    useEffect(() => {
        const handleAfterPrint = () => {
            navigate("/billing");
        };

        window.addEventListener("afterprint", handleAfterPrint);

        return () => {
            window.removeEventListener("afterprint", handleAfterPrint);
        };
    }, [navigate]);


    return (
        <div>
            <Invoice bill={bill} />
        </div>
    );
};

export default ReprintPreview;