import React from 'react'
import Navbar from '../../clients/components/Navbar'
import ConfirmProviderStepsMain from '../../shared/components/ConfirmProviderStepsMain'
import Footer from '../../clients/components/Footer'
const ConfirmProviderSteps = () => {
  return (
    <div className="bg-light">
    <Navbar />
    <ConfirmProviderStepsMain />
    <Footer />
    </div>
  )
}

export default ConfirmProviderSteps