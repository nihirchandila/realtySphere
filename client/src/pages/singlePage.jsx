import React from 'react'
import SingleProperty from '../components/SingleProperty'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function singlePage() {
  return (
    <div>
    <Header backgroundColor="#101828"/>
        <SingleProperty/>
    <Footer/>
    </div>
  )
}
