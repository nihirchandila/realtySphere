import React from 'react'
import AgentLogin from '../components/AgentLogin'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function agentDashboard() {
  return (
    <div>
        <Header backgroundColor="#101828"/>
      <AgentLogin/>
      <Footer/>
    </div>
  )
}
