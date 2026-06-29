import React from 'react'
import AgentDashboard from '../components/AgentDashboard'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function agentDashboard() {
  return (
    <div>
      <Header backgroundColor="#101828"/>
      <AgentDashboard/>
      <Footer/>
    </div>
  )
}
