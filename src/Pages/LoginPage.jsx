import React, { useState } from 'react'
import api from '../api/axios';
import { useNavigate } from "react-router-dom";


const LoginPage = ({
    show,
    onClose,
}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    if (!show) return null;

    // Handle Input Change
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Form Validation
    const validateForm = () => {

        let newErrors = {};

        // Username Validation
        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        }

        // Password Validation
        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Login Submit
    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        if (validateForm()) {

            try {

                const response = await api.post("/users/login/", {
                    username: formData.username,
                    password: formData.password,
                });
                console.log("Login Response:", response.data);
                // ⚠️ Check before storing
                if (response.data.user) {
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                }

                // localStorage.setItem("user", JSON.stringify(response.data.user));
                localStorage.setItem("access", response.data.access);
                localStorage.setItem("refresh", response.data.refresh);
                localStorage.setItem("shops", JSON.stringify(response.data.shops || []));
                
                

                if (response.data.active_shop) {
                    localStorage.setItem("active_shop", JSON.stringify(response.data.active_shop));
                    localStorage.setItem("shop_id",response.data.active_shop.id);
                }
                

                setFormData({
                    username: '',
                    password: '',
                });
                setErrors({});



                onClose();
                navigate("/billing");

            } catch (error) {

                alert(
                    error.response?.data?.message ||
                    "Server Error"
                );
            }finally {
                setLoading(false);  
            }
        };
    };
    return (
        <>
            <div className='loginpage'>

                <div className="login_section">

                    {/* Close Button */}
                    <div className='login_close_btn'>
                        <button
                            className='close_login_btn'
                            onClick={onClose}
                        >
                            X
                        </button>
                    </div>

                    {/* Heading */}
                    <h2 className='login_heading'>
                        Login
                    </h2>

                    <label className='login_label'>
                        Welcome back! Please login to your account.
                    </label>

                    {/* Form */}
                    <form
                        className='login_form'
                        onSubmit={handleSubmit}
                    >

                        {/* Username */}
                        <label className='Input_label'>
                            Username:
                        </label>

                        <input
                            type="text"
                            name="username"
                            placeholder='Username'
                            className='login_input'
                            value={formData.username}
                            onChange={handleChange}
                        />

                        {errors.username && (
                            <p className='error_text'>
                                {errors.username}
                            </p>
                        )}

                        {/* Password */}
                        <label className='Input_label'>
                            Password:
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder='Password'
                            className='login_input'
                            value={formData.password}
                            onChange={handleChange}
                        />

                        {errors.password && (
                            <p className='error_text'>
                                {errors.password}
                            </p>
                        )}

                        {/* Login Button */}
                        <button
                            type='submit'
                            className='login_btn'
                        >
                            {loading ? "Logging in..." : "Log In"}
                        </button>

                    </form>

                </div>

            </div>
        </>
    )

}
export default LoginPage;