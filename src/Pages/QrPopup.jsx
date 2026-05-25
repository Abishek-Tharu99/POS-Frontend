import React from 'react'
import { useState, useEffect } from 'react'
import logo from "../assets/Abishek_logo.png"

const QrPopup = ({
    show,
    onClose,
}
) => {
    if (!show) return null;

    const [status,setStatus]  = useState("Loading......");


    return (
        <>
            <div className='qrpopup'>
                <div className="qr_section" onClick={(e) => e.stopPropagation()}>
                    <div className='fonepay_logo'>
                        <button className='close_qr_btn' onClick={onClose}>X</button>

                    </div>

                    <div className="qrcode_img">

                    </div>
                    <div className="status_section">
                        <h2 className='status'>{status}</h2>
                        
                    </div>
                        

                    <div className='logo_section'>
                        <img className='qr_logo' src={logo} />
                        <h2 className='name'>Abishek_Innovation</h2>

                    </div>

                </div>

            </div>
        </>
    )
}

export default QrPopup