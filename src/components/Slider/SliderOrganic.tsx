'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';

import Slider1  from '../../../public/images/banner/1.png'
import Slider2  from '../../../public/images/banner/2.png'
import Slider3  from '../../../public/images/banner/3.png'

const SliderOrganic = () => {
    return (
        <>
            <div className="slider-block style-two bg-linear 2xl:h-[820px] xl:h-[740px] lg:h-[680px] md:h-[580px] sm:h-[500px] h-[420px] w-full">
                <div className="slider-main h-full w-full">
                    <Swiper
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={true}
                        pagination={{ clickable: true }}
                        modules={[Pagination, Autoplay]}
                        className='h-full relative'
                        autoplay={{
                            delay: 4000,
                        }}
                    >
                        <SwiperSlide>
                            <div className="slider-item h-full w-full relative">
                                <div className="container w-full h-full flex items-center">
                                   
                                    <div className="sub-img absolute left-0 top-0 w-full h-full z-[-1]">
                                        <Image
                                            src={Slider1}
                                            width={3840}
                                            height={2160}
                                            alt='organic1'
                                            priority={true}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="slider-item h-full w-full relative">
                                <div className="container w-full h-full flex items-center">
                                   
                                    <div className="sub-img absolute left-0 top-0 w-full h-full z-[-1]">
                                        <Image
                                            src={Slider2}
                                            width={1920}
                                            height={1080}
                                            alt='organic2'
                                            priority={true}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="slider-item h-full w-full relative">
                                <div className="container w-full h-full flex items-center">
                                  
                                    <div className="sub-img absolute left-0 top-0 w-full h-full z-[-1]">
                                        <Image
                                            src={Slider3}
                                            width={1920}
                                            height={1080}
                                            alt='organic3'
                                            priority={true}
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
        </>
    )
}

export default SliderOrganic