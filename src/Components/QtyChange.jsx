import { useState, useEffect } from "react";

const QtyChange = ({ show, onClose, item, onApply }) => {

    const [qty, setQty] = useState("");

    useEffect(() => {
        if (item) {
            setQty(item.qty);
        }
    }, [item]);

    if (!show) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-box">

                <div className='qty_header d-flex'>
                    <h2>Change Quantity</h2>
                    <button className='qty_close_btn' onClick={onClose}>X</button>
                </div>

               
                <h3>{item?.name}</h3>
                <input
                    type="number"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                />
                
                <div className="popup-buttons">

                    <button
                        onClick={() => {
                            if (qty <= 0) {
                                alert("Invalid quantity");
                                return;
                            }
                            onApply(qty);
                        }}
                    >
                        Apply
                    </button>
                    <button onClick={onClose}>
                        Cancel
                    </button>

                </div>

            </div>

        </div>
    );
};

export default QtyChange;