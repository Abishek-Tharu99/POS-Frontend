import axios from 'axios';
import React, {useEffect, useState } from 'react'

const AddNewCustomer = ({
    show,
    onClose,
    onCustomerAdded,
}) => {

    if (!show) return null;

    const [Custname, setCustname] = useState("");
    const [Custmobile, setCustmobile] = useState("");
    const [Custpan, setCustpan] = useState("");
    const [Custadd, setCustadd] = useState("");

    const handleSave = async () => {

        if (!Custname || !Custpan) {
            alert('Name and Pan cannot be empty');
            return;
        }

        try {
            const CustomerData = {
                name: Custname,
                mobile_no: Custmobile,
                pan_no: Custpan,
                address: Custadd,
            };

            const res = await axios.post("http://127.0.0.1:8000/customers/add/", CustomerData);

            console.log("Saved:", res.data);
            
            onCustomerAdded("");
            onClose();
            
        }
        catch (error) {
            console.log("Error adding customer :", error);

        }


    };

    useEffect ( (e) =>{



    }


    );
    return (
        <>
            <div className="add_cus">
                <div className='addcusPopUp' onClick={(e) => e.stopPropagation()}>
                    <div className='btnforbackaddCus'>
                        <button className='backfromaddcus' onClick={onClose}>X</button>
                    </div>

                    <div className='headercus'>
                        <h2>Add Customer</h2>
                    </div>

                    <div className='addCus_Details'>

                        <div className='datainput'>
                            <label>Name : </label>
                            <input type='text'
                                onChange={(e) => setCustname(e.target.value)} placeholder='Enter the Customer Name' required />
                        </div>

                        <div className='datainput'>
                            <label>Mobile No : </label>
                            <input type='text'
                                onChange={(e) => setCustmobile(e.target.value)}
                                placeholder='Enter the mobile no' />
                        </div>

                        <div className='datainput'>
                            <label>PAN NO : </label>
                            <input type='text'
                                onChange={(e) => setCustpan(e.target.value)}
                                placeholder='Enter the pan no' required />
                        </div>

                        <div className='datainput'>
                            <label>Address : </label>
                            <input type='text'
                                onChange={(e) => setCustadd(e.target.value)}
                                placeholder='Enter the address' />
                        </div>

                    </div>

                    <div className='SaveCus'>
                        <button className='SaveCustomerBtn' onClick={handleSave}>Save</button>
                    </div>

                </div>
            </div>

        </>
    )
}

export default AddNewCustomer