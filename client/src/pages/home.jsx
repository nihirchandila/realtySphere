import React from 'react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import Footer from '../components/Footer'
import StatsAndDiscovery from '../components/StatsAndDiscovery'
import ProductsGrid from '../components/ProductsGrid'
import FAQ from '../components/FAQ'
import CTA from '../components/CTA'
import Contact from '../pages/contact'

export default function home() {
  return (
    <>
      <div className='relative hero-bg h-auto w-full'>
          <Header backgroundColor="transparent" />
          <HeroSection />
      </div>
      <StatsAndDiscovery />
      <ProductsGrid />
      <FAQ/>
      <CTA />
      <Footer />

    </>
  )
}
