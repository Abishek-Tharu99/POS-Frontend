import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/Abishek_logo.png'
import { useNavigate } from "react-router-dom";
import LoginPage from '../Pages/LoginPage';
import SignupPage from '../Pages/SignupPage';
import nexus from '../assets/Nexuspos.png';
import AboutUs from '../Pages/AboutUs';




const Header = () => {

    const [showLogin, setShowLogin] = React.useState(false);
    const [showSignup, setShowSignup] = React.useState(false);

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    return (
        <>
            <header className="header bg-info-subtle">
                <nav className="navbar navbar-expand-lg">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to={"/"}>
                            <img src={logo} alt="NexusPOS" className='logo' />
                            <h2>NexusPos</h2>
                        </Link >

                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav m-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link active" aria-current="page" to={"/"}>Home</Link >
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to={"/"}>Service</Link >
                                </li>


                                <li className="nav-item">
                                    <Link className="nav-link" to={"/"}>Our Team</Link >
                                </li>


                                <li className="nav-item">
                                    <Link className="nav-link" to={"/about"}>About us</Link >
                                </li>


                            </ul>

                            <div>
                                <Link className="text-decoration-none btn btn-sm btn-light me-2" onClick={() => setShowSignup(true)}>Register</Link>
                                <Link className="text-decoration-none btn btn-sm btn-dark me-2" onClick={() => setShowLogin(true)}>Login</Link>
                                <Link className='btn btn-warning' to={'/'}><i className="fa-solid fa-magnifying-glass"></i></Link>
                            </div>

                        </div>
                    </div>
                </nav>

            </header>

            <LoginPage
                show={showLogin}
                onClose={() => {setShowLogin(false)}}
            />
            <SignupPage
                show={showSignup}
                onClose={() => {setShowSignup(false)}}
            />




        </>
    )
}

export default Header