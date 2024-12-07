import React, { useState } from 'react';
import './LoginRegister.css';
import { FaUser,FaLock,FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Container } from 'react-bootstrap';
import axios from 'axios'; 

const LoginRegister = () => {
    const [username, setUsername] = useState('');
    const [action, setAction] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = {};

        if (!username) validationErrors.username = 'Username is required';
        else if (username.length > 30) validationErrors.username = 'Username cannot exceed 30 characters';
        
        // Email Validation
        if (!email) validationErrors.email = 'Email is required';
        // else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email))
        else if (!/\S+@\S+\.\S+/.test(email))
            validationErrors.email = 'Email is invalid';

        // Password Validation
        if (!password) validationErrors.password = 'Password is required';
        else if (password.length < 6) validationErrors.password = 'Password must be at least 6 characters';
        else if(!/[a-z]/.test(password)) validationErrors.password = 'Password must contain at least one lowercase letter';
        else if(!/[A-Z]/.test(password)) validationErrors.password = 'Password must contain at least one uppercase letter';
        else if(!/[0-9]/.test(password)) validationErrors.password = 'Password must contain at least one number';
        else if(!/[^a-zA-Z0-9]/.test(password)) validationErrors.password = 'At least one special character is required'; // validationErrors.password = 'Password must contain at least one special character';

        // Phone Number Validation
        if (!phoneNumber) validationErrors.phoneNumber = 'Phone number is required';
        else if (!/^\d{10}$/.test(phoneNumber))
            validationErrors.phoneNumber = 'Phone number is invalid';
        // else if (phoneNumber.length !== 10)
        //     validationErrors.phoneNumber = 'Phone number must be 10 digits';
        
        // check for validation errors 
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            // if(errors.username === "" && errors.phoneNumber === "" && errors.email === "" && errors.password === ""){
            //     axios.post('http://localhost:3001/', {username, phoneNumber, email, password})
            //     .then(res => {
            //         console.log(res);
            //     })
            //     .catch(err => {
            //         console.log(err);
            //     })
            // }
            console.log('Registered with:', {username,email, password,phoneNumber});
            // alert('Registration successful!');
        }

        try{
            const response = await axios.post('http://localhost:3001/LoginRegister', {username, phoneNumber, email, password});
            if(response.data.success){
                alert('Registration successful');
                // Clear the form fields
                setUsername('');
                setPhoneNumber('');
                setEmail('');
                setPassword('');
            } else{
                alert("Error: " + response.data.message);
            }
        } catch (error) {
            console.error("There was an error!",error);
        }
    };

    const registerLink = () => setAction(' active');
    const loginLink = () => setAction('');

    // const loginLink = () => {
    //     setAction('');
    // };

  return (
    <div className={`wrapper${action}`}>
        <div className="form-box login">
            <form action="#" onSubmit={handleSubmit} className='login-form'>
                <h1>Login</h1>
                <div className="input-box">
                    <input type="text" placeholder='Username' required />
                    <FaUser className='icon' />
                </div>
                <div className="input-box">
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter your password' required />
                    {showPassword ? <FaEyeSlash className='icon' onClick={() => setShowPassword(false)}/> : <FaEye className='icon' onClick={() => setShowPassword(true)}/>}
                    {/* <FaLock className='icon'/> */}
                </div>

                <div className="remember-forget">
                    <label><input type="checkbox" />Remember me</label>
                    <a href="#">Forgot password</a>
                </div>

                <button type="submit">Login</button>
                <div className="register-link">
                    <p>Don't have an account?<a href="#" onClick={registerLink}> Register</a> </p>
                </div>
            </form>
        </div>

        <div className="form-box register">
            <form action="" onSubmit={handleSubmit} className='register-form'>
                <h1>Registration</h1>
                <div className="input-box">
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' 
                    maxLength={30} required className={errors.username ? 'error' : ''} />
                    <FaUser className='icon' />
                    {errors.username && <span className="error-message">{errors.username}</span>}
                </div>
                <div className="input-box">
                    <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className={errors.phoneNumber ? 'error' : ''} placeholder='Phone number' required />
                    {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                    {/* <FaUser className='icon' /> */}
                </div>
                <div className="input-box">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' required className={errors.email ? 'error' : ''} />
                    <FaEnvelope className='icon' />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className="input-box">
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter your password' required className={errors.password ? 'error' : ''}/>
                    {errors.password && ( <div className="error-container">
                        <span className="error-message">{errors.password}</span></div>)}
                    {showPassword ? <FaEyeSlash className='icon' onClick={() => setShowPassword(false)}/> : <FaEye className='icon' onClick={() => setShowPassword(true)}/>}
                    {/* <FaLock className='icon'/> */}
                </div>

                <div className="remember-forget">
                    <label><input type="checkbox" />I agree to the terms & conditions</label>
                </div>
            
                <button type="submit">Register</button>
                <div className="register-link">
                    <p>Already have an account?<a href="#" onClick={loginLink}> Login</a> </p>
                </div>
            </form>
        </div>
    </div>
  );
};

export default LoginRegister;
