import React from 'react'
import Navbar from '../../clients/components/Navbar'
import JoinConfirmPageMain from '../components/JoinConfirmPageMain'
import Footer from '../../clients/components/Footer'
const JoinConfirmPage = () => {
  return (
    <div className="bg-light">
    <Navbar />
    <JoinConfirmPageMain />
    <Footer />
    </div>
  )
}

export default JoinConfirmPage