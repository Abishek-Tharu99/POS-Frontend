import React from 'react'
import logo from '../assets/Abishek_logo.png'
import { Link } from 'react-router'



const Footer = () => {
  return (
    <>
      <footer className='mt-1 px-2'>
        <div className='ps-3 bg-dark-subtle d-md-flex justify-content-between'>
          <div className='col-md-4'>
            <div className='d-flex align-item-center'>
              <img src={logo} alt="NexusPOS" className='logo' />
              <h2 className="nexus d-flex align-items-center">NexusPOS</h2>

            </div>
            <p className='d-flex align-items-center fw-bold text-primary justify-content-center'>Smart Billing, Smarter Business.</p>

          </div>

          <div className='py-3 col-md-3'>
            <h5>Ouick Links</h5>
            <hr className='line' />
            <ul className=''>
              <li><Link className='no-underline' to={"/"}>About us</Link></li>
              <li><Link className='no-underline' to={"/"}>Contact</Link></li>
              

            </ul>
          </div>

          <div className='py-3 col-md-3'>
            <h5>Social Media</h5>
            <hr className='line' />
            <ul className=''>
              <li><Link className='no-underline' to={"https://www.facebook.com/abishek.king.263335"}>Facebook</Link></li>
              <li><Link className='no-underline' to={"https://www.instagram.com/abishek_innovation/"}>Instagram</Link></li>
              <li><Link className='no-underline' to={"https://www.youtube.com/@abishek_bankatti_nepal"}>YouTube</Link></li>
              

            </ul>
          </div>


          <div className='icon py-4 col-md-4'>
            <h4>Social Media</h4>
            <hr className='w-25'></hr>
            <div>
              <Link to={'https://www.facebook.com/abishek.king.263335'} className='fs-2 mx-1 border border-3 rounded-3 border-dark'><i className="fa-brands fa-facebook"></i></Link>
              <Link to={'https://www.instagram.com/abishek_innovation/'} className='fs-2 mx-1 border border-3 rounded-3 border-dark'><i className="fa-brands fa-instagram"></i></Link>
              <Link to={'https://www.tiktok.com/@abishekking99?is_from_webapp=1&sender_device=pc'} className='fs-2 mx-1 border border-3 rounded-3 border-dark'><i className="fa-brands fa-tiktok"></i></Link>
              <Link to={'https://www.youtube.com/@abishek_bankatti_nepal'} className='fs-2 mx-1 border border-3 rounded-3 border-dark'><i className="fa-brands fa-youtube"></i></Link>
            </div>
        </div>




      </div>

    </footer >

    </>
  )
}

export default Footer