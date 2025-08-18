import React from 'react'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuOne from '@/components/Header/Menu/MenuOne'
import SliderOne from '@/components/Slider/SliderOne'
import blogData from '@/data/Blog.json'

import WhatNewOne from '@/components/Home1/WhatNewOne'
import productData from '@/data/Product.json'
import Collection from '@/components/Pet/Collection'
import TabFeatures from '@/components/Home1/TabFeatures'
import Banner from '@/components/Home5/Banner'
import Benefit from '@/components/Home1/Benefit'
import testimonialData from '@/data/Testimonial.json'
import Testimonial from '@/components/Home1/Testimonial'
import Instagram from '@/components/Home1/Instagram'
import Brand from '@/components/Home1/Brand'
import Footer from '@/components/Footer/Footer'
import ModalNewsletter from '@/components/Modal/ModalNewsletter'
import MenuTwo from '@/components/Header/Menu/MenuTwo'
import BannerTop from '@/components/Home3/BannerTop'
import SliderThree from '@/components/Slider/SliderThree'
import SliderOrganic from '@/components/Slider/SliderOrganic'
import Category from '@/components/Organic/Category'
import PopularProduct from '@/components/Organic/PopularProduct'
import BuyPack from '@/components/Organic/BuyPack'
import FlashSale from '@/components/Organic/FlashSale'
import NewsInsight from '@/components/Home3/NewsInsight'
import Banner2 from '@/components/Pet/Banner2'

export default function Home() {
  return (
    <>
      {/* <TopNavOne props="style-one bg-black" slogan="New customers save 10% with the code GET10" /> */}
      <div id="header" className='relative w-full'>

        <MenuTwo />

      </div>



      <SliderOrganic />
      <Category />
      {/* <Banner /> */}

      <WhatNewOne start={0} limit={8} />

     
      <PopularProduct start={0} limit={8} />


      {/* <TabFeatures data={productData} start={0} limit={6} /> */}
      <Banner2 />

      {/* <Benefit props="md:py-15 py-12" />
      <Testimonial data={testimonialData} limit={6} /> */}

      <Brand />
      <Footer />
      {/* <ModalNewsletter /> */}
    </>
  )
}
