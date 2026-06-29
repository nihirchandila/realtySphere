import React from 'react'
import { Link } from 'react-router-dom'

export default function HeroSection() {
  return (
    <>
    <div className='container'>
  <section className="relative h-auto flex flex-col justify-between overflow-hidden pb-22">
 
    <div className="absolute inset-0 z-0"></div>
 
    <div className="relative z-10 flex-1 flex flex-col justify-center pt-36">
 
      <div className="flex gap-2 mb-6">
        <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-medium rounded-full shadow-sm">House</span>
        <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-medium rounded-full shadow-sm">Apartment</span>
        <span className="px-4 py-1.5 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-medium rounded-full shadow-sm">Residential</span>
      </div>
 
      <div className="flex flex-col lg:flex-row md:items-end gap-8 mb-5">
 
        <h1 className="heading-xl flex-1 w-full lg:w-1/2">
          Build Your Future,<br />One Property at a Time.
        </h1>
 
        <div className="text-body w-full lg:w-1/2 mb-1">
          <p className="w-full mb-5">
         Connecting Families with Beautiful Homes and Investors with Valuable Opportunities Across Every Market.
        </p>
        <Link to="/allProperties" className="inline-flex items-center gap-2 bg-[#ffffff] hover:bg-[#ececec] transition-colors text-black text-sm font-semibold px-6 py-3.5 rounded-full shadow-md whitespace-nowrap w-fit" data-discover="true">See All Properties →</Link>
        </div>
      </div>
                  
    </div>
 
  </section>
</div>
      
    </>
  )
}
