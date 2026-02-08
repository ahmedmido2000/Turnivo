import React from 'react'
import Navbar from '../../clients/components/Navbar'
import Footer from '../../clients/components/Footer'
import HeroSection from '../components/HeroSection'
import AnalyticsImg from '../components/AnalyticsImg'
import BenefitsSection from '../components/BenefitsSection'
import DirectBookingsSection from '../components/DirectBookingsSection'
import RevenueGrowthSection from '../components/RevenueGrowthSection'
import GuestExperienceSection from '../components/GuestExperienceSection'
import CTASection from '../components/CTASection'
import SolutionsSection from '../components/SolutionsSection'
import MigrationSection from '../components/MigrationSection'
import ReviewsSection from '../components/ReviewsSection'
import IntegrationsSection from '../components/IntegrationsSection'
import FAQSection from '../components/FAQSection'
import FinalCTASection from '../components/FinalCTASection'

const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <AnalyticsImg />
      <BenefitsSection />
      <DirectBookingsSection />
      <RevenueGrowthSection />
      <GuestExperienceSection />
      <CTASection />
      <SolutionsSection />
      <MigrationSection />
      <ReviewsSection />
      <IntegrationsSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </div>
  )
}

export default Home
