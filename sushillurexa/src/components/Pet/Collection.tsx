'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { useRouter } from 'next/navigation';

const Collection = () => {
    const router = useRouter()

    const handleCategoryClick = (category: string) => {
        router.push(`/shop/breadcrumb1?category=${category}`);
    };

    return (
        <>
            <div className="trending-block style-six md:pt-20 pt-10">
                <div className="container">
                    <div className="heading3 text-center">Our Brands
                    </div>
                    <div className="list-trending section-swiper-navigation style-small-border style-outline md:mt-10 mt-6">
                        <Swiper
                            spaceBetween={12}
                            slidesPerView={2}
                            navigation
                            loop={true}
                            modules={[Navigation, Autoplay]}
                            breakpoints={{
                                576: {
                                    slidesPerView: 3,
                                    spaceBetween: 12,
                                },
                                768: {
                                    slidesPerView: 4,
                                    spaceBetween: 20,
                                },
                                992: {
                                    slidesPerView: 5,
                                    spaceBetween: 20,
                                },
                                1290: {
                                    slidesPerView: 6,
                                    spaceBetween: 30,
                                },
                            }}
                            className='h-full'
                        >
                            <SwiperSlide>
                                <div className="trending-item block relative cursor-pointer" onClick={() => handleCategoryClick('pet')}>
                                    <div className="bg-img rounded-[32px] overflow-hidden">
                                        <Image
                                            src={'/images/brand/1.png'}
                                            width={1000}
                                            height={1000}
                                            alt='outerwear'
                                            priority={true}
                                            className='w-full'
                                        />
                                    </div>
                                   
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="trending-item block relative cursor-pointer" onClick={() => handleCategoryClick('pet')}>
                                    <div className="bg-img rounded-[32px] overflow-hidden">
                                        <Image
                                            src={'/images/brand/2.png'}
                                            width={1000}
                                            height={1000}
                                            alt='swimwear'
                                            priority={true}
                                            className='w-full'
                                        />
                                    </div>
                                   
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="trending-item block relative cursor-pointer" onClick={() => handleCategoryClick('pet')}>
                                    <div className="bg-img rounded-[32px] overflow-hidden">
                                        <Image
                                            src={'/images/brand/3.png'}
                                            width={1000}
                                            height={1000}
                                            alt='clothes'
                                            priority={true}
                                            className='w-full'
                                        />
                                    </div>
                                    
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="trending-item block relative cursor-pointer" onClick={() => handleCategoryClick('pet')}>
                                    <div className="bg-img rounded-[32px] overflow-hidden">
                                        <Image
                                            src={'/images/brand/4.png'}
                                            width={1000}
                                            height={1000}
                                            alt='sets'
                                            priority={true}
                                            className='w-full'
                                        />
                                    </div>
                                   
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="trending-item block relative cursor-pointer" onClick={() => handleCategoryClick('pet')}>
                                    <div className="bg-img rounded-[32px] overflow-hidden">
                                        <Image
                                            src={'/images/brand/5.png'}
                                            width={1000}
                                            height={1000}
                                            alt='accessories'
                                            priority={true}
                                            className='w-full'
                                        />
                                    </div>
                                  
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="trending-item block relative cursor-pointer" onClick={() => handleCategoryClick('pet')}>
                                    <div className="bg-img rounded-[32px] overflow-hidden">
                                        <Image
                                            src={'/images/brand/6.png'}
                                            width={1000}
                                            height={1000}
                                            alt='lingerie'
                                            priority={true}
                                            className='w-full'
                                        />
                                    </div>
                                   
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="trending-item block relative cursor-pointer" onClick={() => handleCategoryClick('pet')}>
                                    <div className="bg-img rounded-[32px] overflow-hidden">
                                        <Image
                                            src={'/images/brand/7.png'}
                                            width={1000}
                                            height={1000}
                                            alt='lingerie'
                                            priority={true}
                                            className='w-full'
                                        />
                                    </div>
                                   
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Collection