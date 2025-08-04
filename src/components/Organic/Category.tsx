'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

import { useRouter } from 'next/navigation';

const Category = () => {
    const router = useRouter()

    const handleTypeClick = (type: string) => {
        router.push(`/shop/breadcrumb1?type=${type}`);
    };

    return (
        <>
            <div className="trending-block style-six md:py-12 mt-4 py-4">
                <div className="container">
                   
                    <div className="list-trending section-swiper-navigation style-small-border style-outline md:mt-8 mt-6">
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
                                <div className="trending-item block relative cursor-pointer" onClick={() => handleTypeClick('vegetables')}>
                                    <div className="bg-img rounded-full overflow-hidden">
                                        <Image
                                            src='/images/collection/purse.webp'
                                            width={500}
                                            height={500}
                                            alt='Purse'
                                            priority={true}
                                            className='w-full'
                                        />
                                    </div>
                                    <div className="trending-name text-center mt-5 duration-500">
                                        <span className='heading5'>Purse</span>
                                        
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="trending-item block relative cursor-pointer" onClick={() => handleTypeClick('meat')}>
                                    <div className="bg-img rounded-full overflow-hidden">
                                        <Image
                                            src={'/images/collection/shoes.webp'}
                                             width={500}
                                            height={500}
                                            alt='swimwear'
                                            priority={true}
                                            className='w-full'
                                        />
                                    </div>
                                    <div className="trending-name text-center mt-5 duration-500">
                                        <span className='heading5'>Footwear</span>
                                       
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="trending-item block relative cursor-pointer" onClick={() => handleTypeClick('fruit')}>
                                    <div className="bg-img rounded-full overflow-hidden">
                                        <Image
                                            src={'/images/collection/glasses.webp'}
                                            width={500}
                                            height={500}
                                            alt='clothes'
                                            priority={true}
                                            className='w-full'
                                        />
                                    </div>
                                    <div className="trending-name text-center mt-5 duration-500">
                                        <span className='heading5'>Glasses</span>
                                       
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="trending-item block relative cursor-pointer" onClick={() => handleTypeClick('meat')}>
                                    <div className="bg-img rounded-full overflow-hidden">
                                        <Image
                                            src={'/images/collection/jackets.webp'}
                                             width={500}
                                            height={500}
                                            alt='sets'
                                            priority={true}
                                            className='w-full'
                                        />
                                    </div>
                                    <div className="trending-name text-center mt-5 duration-500">
                                        <span className='heading5'>Clothing</span>
                                      
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="trending-item block relative cursor-pointer" onClick={() => handleTypeClick('vegetables')}>
                                    <div className="bg-img rounded-full overflow-hidden">
                                        <Image
                                            src={'/images/collection/belts.webp'}
                                             width={500}
                                            height={500}
                                            alt='accessories'
                                            priority={true}
                                            className='w-full'
                                        />
                                    </div>
                                    <div className="trending-name text-center mt-5 duration-500">
                                        <span className='heading5'>Belts</span>
                                      
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="trending-item block relative cursor-pointer" onClick={() => handleTypeClick('drinks')}>
                                    <div className="bg-img rounded-full overflow-hidden">
                                        <Image
                                            src={'/images/collection/perfumes.webp'}
                                             width={500}
                                            height={500}
                                            alt='lingerie'
                                            priority={true}
                                            className='w-full'
                                        />
                                    </div>
                                    <div className="trending-name text-center mt-5 duration-500">
                                        <span className='heading5'>Perfumes</span>
                                       
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className="trending-item block relative cursor-pointer" onClick={() => handleTypeClick('fruit')}>
                                    <div className="bg-img rounded-full overflow-hidden">
                                        <Image
                                            src={'/images/collection/wallets.webp'}
                                             width={500}
                                            height={500}
                                            alt='lingerie'
                                            priority={true}
                                            className='w-full'
                                        />
                                    </div>
                                    <div className="trending-name text-center mt-5 duration-500">
                                        <span className='heading5'>Wallets</span>
                                       
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

export default Category