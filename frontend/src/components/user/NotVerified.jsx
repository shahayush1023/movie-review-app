import React from 'react'
import Container from '../Container'
import { useAuth } from '../../hooks';
import { useNavigate } from 'react-router-dom';

export default function NotVerified() {
    const {authInfo} = useAuth();
  const {isloggedIn} = authInfo;
  const isVerified  = authInfo.profile?.isVerified;
  const navigate = useNavigate();

  const navigateToVerification = ()=>{
    navigate('/auth/verification',{state:{user:authInfo.profile}})
  }
  return (
    <Container>
    {isloggedIn && !isVerified ? (
      <p className='text-lg text-center bg-blue-50 p-2'>It looks like you havent verified your account
      <button onClick={navigateToVerification} className='text-blue-500 font-semibold hover:underline'>
      click here to verify account</button>
      </p>
    ):null}
  </Container>
  )
}
