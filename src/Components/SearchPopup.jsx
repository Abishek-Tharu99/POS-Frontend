import React, { useState, useEffect } from "react";

const SearchPopup = ({
    show,
    query,
    setQuery,
    items,
    onClose,
    onSelect
}) => {

    let isSelecting = false;

    const [selectedIndex, setSelectedIndex] = useState(0);

    // reset when popup opens or items change
    useEffect(() => {
        if (show) {
            setSelectedIndex(0);
        }
    }, [show, items]);

    useEffect(() => {
        if (!show) return;

        const handleKeyDown = (e) => {

            if (items.length === 0) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev >= items.length - 1 ? 0 : prev + 1
                );
            }

            if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev <= 0 ? items.length - 1 : prev - 1
                );
            }
            if (e.key === "Enter") {
                e.preventDefault();

                if (isSelecting) return;
                isSelecting = true;

              
                onSelect(items[selectedIndex]);

                setTimeout(() => {
                    isSelecting = false;
                }, 200);
            }

        };

        document.addEventListener("keydown", handleKeyDown);

        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [show, items, selectedIndex]);

    if (!show) return null;

    return (
        <div className="popup_overlay" onClick={onClose}>
            <div className="popup_box" onClick={(e) => e.stopPropagation()}>

                <input
                    autoFocus
                    type="text"
                    placeholder="Search item..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (["ArrowUp", "ArrowDown", "Enter"].includes(e.key)) {
                            e.preventDefault();
                        }
                    }}
                    className="popup_search"
                />

                <div className="popup_list">
                    <div className="heading d-flex">
                        <h2 className="title">Code</h2>
                        <h2 className="title">Name</h2>
                        <h2 className="title">Price</h2>
                    </div>

                    {items.map((item, index) => (
                        <div
                            key={item.code}
                            className={`item_row ${index === selectedIndex ? "item_active" : ""}`}
                            onDoubleClick={() => {
                                if (isSelecting) return;
                                isSelecting = true;

                                onSelect(item);

                                setTimeout(() => {
                                    isSelecting = false;
                                }, 200);
                            }}
                        >
                            <span>{item.code}</span>
                            <span>{item.name}</span>
                            <span>Rs.{item.price}</span>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default SearchPopup;