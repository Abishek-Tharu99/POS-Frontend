import React from 'react'
import Header from '../Components/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../Components/Footer'

const Base = () => {
  return (
    <>
        <Header/>
            <Outlet/>
        
        <Footer/>
    
    
    
    </>
  )
}

export default Base