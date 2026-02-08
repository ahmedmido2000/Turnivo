import React from 'react'
import Navbar from '../../clients/components/Navbar'
import ActivationCodeMain from '../../shared/components/ActivationCodeMain'
import Footer from '../../clients/components/Footer'
const ActivationCode = () => {
  return (
    <div className="bg-light">
    <Navbar />
    <ActivationCodeMain />
    <Footer />
    </div>
  )
}

export default ActivationCode