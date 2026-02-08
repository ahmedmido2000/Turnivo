import React from 'react'
import Navbar from '../../clients/components/Navbar'
import GuestListMain from '../components/GuestListMain'
import Footer from '../../clients/components/Footer'
const GuestList = () => {
  return (
    <div className="bg-light">
    <Navbar />
    <GuestListMain />
    <Footer />
    </div>
  )
}

export default GuestList