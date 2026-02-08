import React from 'react'
import Navbar from '../../clients/components/Navbar'
import GuestLoginDoneMain from '../components/GuestLoginDoneMain'
import Footer from '../../clients/components/Footer'
const GuestLoginDone = () => {
  return (
    <div className="bg-light">
    <Navbar />
    <GuestLoginDoneMain />
    <Footer />
    </div>
  )
}

export default GuestLoginDone