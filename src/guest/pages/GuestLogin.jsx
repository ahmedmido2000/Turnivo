import React from 'react'
import Navbar from '../../clients/components/Navbar'
import GuestLoginMain from '../components/GuestLoginMain'
import Footer from '../../clients/components/Footer'
const GuestLogin = () => {
  return (
    <div className="bg-light">
    <Navbar />
    <GuestLoginMain />
    <Footer />
    </div>
  )
}

export default GuestLogin