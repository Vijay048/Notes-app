import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import PasswordInput from '../../components/Input/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

const Signup = () => {

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e)=>{
    e.preventDefault();

    if(!name){
      setError("Please enter Your name.")
      return;
    }

    if(!validateEmail(email)){
      setError("Please enter a valid email address.")
      return;
    }

    if(!password){
      setError("Please enter the password")
      return;
    }

    setError("");

    //signup api call
    try {
      const response = await axiosInstance.post("/create-account",{
          fullName: name,
          email: email,
          password: password,
      })

      // handle successful registration
      if(response.data && response.data.error){
          setError(response.data.message)
          return;
      }

      if(response.data && response.data.accessToken){
          localStorage.setItem("token", response.data.accessToken);
          navigate("/dashboard")
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
                <form onSubmit={handleSignUp}>
                    <h4 className='text-2xl mb-7'>SignUP</h4>

                    <input type="text" placeholder='Name' className='input-box' 
                    onChange={(e)=> setName(e.target.value)}
                    value={name}
                    />

                    <input type="text" placeholder='Email' className='input-box' 
                    onChange={(e)=> setEmail(e.target.value)}
                    value={email}
                    />

                    <PasswordInput value={password} onChange={(e)=> setPassword(e.target.value)}/>

                    {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

                    <button type='submit' className='btn-primary'>Create Account</button>

                    <p className='text-sm text-center mt-4'>Already have an account?{" "} <Link to='/login' className='font-medium text-blue-600 underline'>Login</Link></p>
                </form>
            </div>
        </div>
    </>
  )
}

export default Signup