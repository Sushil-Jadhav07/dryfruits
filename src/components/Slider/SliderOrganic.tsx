'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import { useSliders } from '@/hooks/useSanity'
import { getImageUrl } from '@/lib/sanity'

const SliderOrganic = () => {
    const { data: sliders, loading } = useSliders()

    // Fallback slides if no Sanity data
    const fallbackSlides = [
        {
            key: 'fallback-1',
            src: '/images/banner/2.png',
            width: 3840,
            height: 2160,
            alt: 'organic1',
        },
        {
            key: 'fallback-2',
            src: '/images/banner/1.png',
            width: 1920,
            height: 1080,
            alt: 'organic2',
        },
    ]

    const hasSanityImages = Array.isArray(sliders) && sliders.length > 0

    return (
        <>
            <div className="slider-block style-two bg-linear 2xl:h-[7000px] xl:h-[650px] lg:h-[680px] md:h-[580px] sm:h-[500px] h-[420px] w-full">
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
                        {hasSanityImages
                            ? sliders!.map((doc, idx) => {
                                const url = getImageUrl((doc as any).image, 3840, 2160)
                                return (
                                  <SwiperSlide key={doc._id || `sanity-${idx}`}>
                                    <div className="slider-item h-full w-full relative">
                                      <div className="container w-full h-full flex items-center">
                                        <div className="sub-img absolute left-0 top-0 w-full h-full z-[-1]">
                                          <Image
                                            src={url}
                                            width={3840}
                                            height={2160}
                                            alt={'slide'}
                                            priority={true}
                                            className='w-full h-full object-cover'
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </SwiperSlide>
                                )
                              })
                            : fallbackSlides.map((f) => (
                                <SwiperSlide key={f.key}>
                                    <div className="slider-item h-full w-full relative">
                                        <div className="container w-full h-full flex items-center">
                                            <div className="sub-img absolute left-0 top-0 w-full h-full z-[-1]">
                                                <Image
                                                    src={f.src}
                                                    width={f.width}
                                                    height={f.height}
                                                    alt={f.alt}
                                                    priority={true}
                                                    className='w-full h-full object-cover'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                              ))}
                    </Swiper>
                </div>
            </div>
        </>
    )
}

export default SliderOrganic
