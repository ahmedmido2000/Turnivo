import React from 'react'
import Navbar from '../../clients/components/Navbar'
import LoginMain from '../components/LoginMain'
import Footer from '../../clients/components/Footer'
const Login = () => {
  return (
    <div className="bg-light">
    <Navbar />
    <LoginMain />
    <Footer />
    </div>
  )
}

export default Login