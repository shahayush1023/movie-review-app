import React from 'react'
import Navbar from './components/user/Navbar'
import SignIn from './components/auth/SignIn';
import Signup from './components/auth/Signup';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import EmailVerification from './components/auth/EmailVerification';
import ForgetPassword from './components/auth/ForgetPassword';
import ConfirmPassword from './components/auth/ConfirmPassword';
import NotFound from './components/NotFound';

export default function App() {
  return (
  <>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/auth/signin' element={<SignIn/>} />
      <Route path='/auth/signup' element={<Signup/>} />
      <Route path='/auth/verification' element={<EmailVerification/>} />
      <Route path='/auth/forget-password' element={<ForgetPassword/>} />
      <Route path='/auth/reset-password' element={<ConfirmPassword/>} />
      <Route path='*' element={<NotFound/>} />
    </Routes>
  </>
  );
}
