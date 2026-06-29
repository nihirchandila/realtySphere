import React from 'react'
import PropertiesPage from '../components/allProperties'
import Headers from '../components/Header'
import Footer from '../components/Footer'

export default function AllProperties() {
  return (
    <div>
        <Headers backgroundColor="#101828"/>
      <PropertiesPage/>
      <Footer/>
    </div>
  )
}
