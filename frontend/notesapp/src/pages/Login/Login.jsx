import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../../components/Input/PasswordInput'
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    
    const handleLogin = async (e) => {
        e.preventDefault();

        if(!validateEmail(email)){
            setError("Please Enter a valid email address.")
            return;
        }

        if(!password){
            setError("Please Enter the password.")
            return;
        }

        setError("");

        //login api call
        try {
            const response = await axiosInstance.post("/login",{
                email: email,
                password: password,
            })

            // handle successful login
            if(response.data && response.data.accessToken){
                localStorage.setItem("token", response.data.accessToken)
                navigate("/dashboard");
            }
        } catch (error) {
            // handle login error
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message);
            }
            else{
                setError("An unexpected error occurred. Please try again.")
            }
        }
    }

  return (
    <>
        <Navbar/>

        <div className='flex items-center justify-center mt-28'>
            <div className='w-96 border rounded bg-white px-7 py-10'>
                <form onSubmit={handleLogin}>
                    <h4 className='text-2xl mb-7'>Login</h4>
                    <input type="text" placeholder='Email' className='input-box' 
                    onChange={(e)=> setEmail(e.target.value)}
                    value={email}
                    />

                    <PasswordInput value={password} onChange={(e)=> setPassword(e.target.value)}/>

                    {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

                    <button type='submit' className='btn-primary'>Login</button>

                    <p className='text-sm text-center mt-4'>Not registered yet?{" "} <Link to='/signup' className='font-medium text-blue-600 underline'>Create an account</Link></p>
                </form>
            </div>
        </div>
    </>
  )
}

export default Login