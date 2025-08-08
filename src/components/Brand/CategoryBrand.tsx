'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

interface Brand {
	name: string;
	image: string;
}

interface CategoryBrandProps {
	brand: Brand[];
}

const CategoryBrand: React.FC<CategoryBrandProps> = ({ brand = [] }) => {
	const router = useRouter();
	console.log(brand)
	const handleBrandClick = (brandName: string) => {
		router.push(`/brand/${encodeURIComponent(brandName)}`);
	};

	return (
		<div className="trending-block style-six md:py-12 mt-4 py-4">
			<div className="container">
				<div className="list-trending section-swiper-navigation grid grid-cols-5 style-small-border style-outline md:mt-8 mt-6">
					{/* <Swiper
						spaceBetween={12}
						slidesPerView={2}
						navigation
						loop={true}
						modules={[Navigation, Autoplay]}
						breakpoints={{
							576: { slidesPerView: 3, spaceBetween: 12 },
							768: { slidesPerView: 4, spaceBetween: 20 },
							992: { slidesPerView: 5, spaceBetween: 20 },
							1290: { slidesPerView: 4, spaceBetween: 30 },
						}}
						className="h-full"
					>
						
					</Swiper> */}

					{brand.map((item, index) => (

						<div
							onClick={() => handleBrandClick(item.name)}
							className="trending-item block relative cursor-pointer"
						>
							<div className="bg-img w-[240px] rounded-full overflow-hidden">
								<Image
									src={item.image}
									width={400}
									height={400}
									alt={item.name}
									priority
									className="w-full object-cover"
								/>
							</div>
							<div className="trending-name text-center mt-5 duration-500">
								<span className="heading5 capitalize">{item.name}</span>
							</div>
						</div>

					))}
				</div>
			</div>
		</div>
	);
};

export default CategoryBrand;
