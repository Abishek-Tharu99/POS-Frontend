import React, { useState, useEffect } from 'react';

const Discount_Popup = ({
    show,
    netAmount,
    onClose,
    onApply
}) => {
    if (!show) return null;

    const [discountType, setDiscountType] = useState("percentage");
    const [discountValue, setDiscountValue] = useState("");
    const [finalAmount, setFinalAmount] = useState(netAmount);

    useEffect(() => {
        let discount = 0;

        if (discountType === "percentage") {
            discount = (netAmount * parseFloat(discountValue || 0)) / 100;

        } else {
            discount = parseFloat(discountValue || 0);
        }

        setFinalAmount(netAmount - discount);
    }, [discountType, discountValue, netAmount]);

    const calculateFinal = () => {
        let discount = 0;

        if (discountType === "percentage") {
            discount = (netAmount * parseFloat(discountValue || 0)) / 100;
        } else {
            discount = parseFloat(discountValue || 0);
        }

        return netAmount - discount;
    };

    const handleApply = () => {
        const value = parseFloat(discountValue);

        if (isNaN(value)) {
            alert("Enter valid discount!");
            return;
        }
        const final = calculateFinal();

        onApply({
            discountType,
            discountValue: parseFloat(discountValue || 0),
            finalAmount: final
        });

        onClose();
    };





    return (
        <div className='discount_popup' onClick={onClose}>
            <div className='popup_content' onClick={(e) => e.stopPropagation()}>

                <div className='dis_header d-flex'>
                    <h2>Apply Discount</h2>
                    <button className='close_btn' onClick={onClose}>X</button>
                </div>

                <div className='options d-flex'>
                    <span>
                        <input
                            type="radio"
                            checked={discountType === "percentage"}
                            onChange={() => setDiscountType("percentage")}
                        />
                        (% ) Percentage
                    </span>

                    <span>
                        <input
                            type="radio"
                            checked={discountType === "amount"}
                            onChange={() => setDiscountType("amount")}
                        />
                        Amount Value
                    </span>
                </div>

                <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleApply();
                        }
                    }}
                    placeholder="Enter discount"
                    autoFocus
                />

                <h3>Final: Rs.{finalAmount}</h3>

                <button onClick={handleApply}>
                    Apply
                </button>

            </div>
        </div>
    );
};

export default Discount_Popup;