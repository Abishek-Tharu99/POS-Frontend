import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import Base from './Pages/Base'
import ViewData from './Pages/ViewData'
import Billing from './Billing'
import Payment from './Pages/Payment'
import ReprintPreview from './Components/ReprintPreview'
import HomePage from './Pages/HomePage'
import LoginPage from './Pages/LoginPage'
import { useLocation } from 'react-router-dom'
import AboutUs from './Pages/AboutUs'


const MyRoute = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Base />} >
          <Route index element={<HomePage />} />
          <Route index element={<AboutUs />} />
        </Route>
        <Route path='/viewdata' element={<ViewData />} />
        <Route path='/end_session' element={<App />} />
        <Route path='/billing' element={<Billing />} />
        <Route path="/payment"
          element={<Payment key={location.state?.timestamp} />}
        />
        <Route path="/reprint-preview" element={<ReprintPreview />} />
        <Route path="/login" element={<LoginPage />} />
        


      </Routes>


    </BrowserRouter>
  )
}

export default MyRoute