import React, { useState } from 'react'
import api from '../api/axios';

const SignupPage = ({
    show,
    onClose,
}) => {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    if (!show) return null;

    // Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Email Validation
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Form Validation
    const validateForm = () => {

        let newErrors = {};

        // Username
        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        }

        // Email
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        // Password
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        // Confirm Password
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // Submit Form
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (validateForm()) {
            setLoading(true);

            try {

                const response = await api.post(
                    "/users/register/",
                    {
                        username: formData.username,
                        email: formData.email,
                        password: formData.password,
                    }
                );

                alert(response.data.message);

                //console.log(response.data);

                // Clear Form
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                });

                setErrors({});

                onClose();

            } catch (error) {

                console.log(error);

                if (error.response) {
                    setErrors({
                        api: error.response?.data?.message || "Server Error"
                    });
                } else {
                    alert("Server Error");
                }
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <div className='signuppage'>

                <div className='signupcontainer' >

                    <div className='signup_close_btn'>
                        <button
                            className='close_signup_btn'
                            onClick={onClose}
                        >
                            X
                        </button>
                    </div>

                    <form className='signup_form' onSubmit={handleSubmit}>

                        <h2 className='signup_heading'>
                            Create an Account
                        </h2>

                        <label className='signup_label'>
                            Join us and experience the best services!
                        </label>

                        {/* Username */}
                        <label className='Input_label'>UserName:</label>

                        <input
                            type="text"
                            name="username"
                            placeholder='Username'
                            className='signup_input'
                            value={formData.username}
                            onChange={handleChange}
                        />

                        {errors.username && (
                            <p className='error_text'>{errors.username}</p>
                        )}

                        {/* Email */}
                        <label className='Input_label'>Email:</label>

                        <input
                            type="email"
                            name="email"
                            placeholder='Email'
                            className='signup_input'
                            value={formData.email}
                            onChange={handleChange}
                        />

                        {errors.email && (
                            <p className='error_text'>{errors.email}</p>
                        )}

                        {/* Password */}
                        {/* Password */}
                        <label className='Input_label'>Password:</label>

                        <div className='password_input_container'>

                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder='Password'
                                className='signup_input'
                                value={formData.password}
                                onChange={handleChange}
                            />

                            <button
                                type="button"
                                className='show_password_btn'
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>

                        </div>

                        {errors.password && (
                            <p className='error_text'>{errors.password}</p>
                        )}

                        {/* Confirm Password */}
                        <label className='Input_label'>
                            Confirm Password:
                        </label>

                        <div className='password_input_container'>

                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder='Confirm Password'
                                className='signup_input'
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />

                            <button
                                type="button"
                                className='show_password_btn'
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>

                        </div>

                        {errors.confirmPassword && (
                            <p className='error_text'>
                                {errors.confirmPassword}
                            </p>
                        )}
                        {/* <button
                            type='button'
                            className='already_account_btn'
                            onClick={() => {
                                onClose();
                                setShowLogin(true);
                            }}
                        >
                            Already have an account? Login
                        </button> */}

                        <button
                            type='submit'
                            className='signup_btn'
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Sign Up"}
                        </button>

                    </form>

                    {errors.api && <p className="error_text">{errors.api}</p>}

                </div>

            </div>

        </>
    )
}

export default SignupPage