"use client"
import BannerCollection from '@/components/Categories/BannerCollection'
import MenuTwo from '@/components/Header/Menu/MenuTwo'

import React, { useEffect, useState } from 'react'
import productData from "@/data/productBrand.json";
import { useRouter } from 'next/navigation';
import CategoryBrand from '@/components/Brand/CategoryBrand';

const Belts = () => {
	const category = "Belts";
	const [brands, setBrands] = useState([]);
	const router = useRouter();
	useEffect(() => {
		const brandImageMap = {
			"Hermès": "/images/brand/Hermès.webp",
			"Gucci": "/images/brand/gucci.webp",
			"Ferragamo": "/images/brand/Ferragamo.webp",
			"Diesel": "/images/brand/Diesel.webp",
			"Armani": "/images/brand/giorgioarmani.webp",
			// Add more brands here if needed
		};

		const purseBrands = productData
			.filter((p) => p.category.toLowerCase() === category.toLowerCase())
			.map((p) => p.brand);

		const unique = [...new Set(purseBrands)];

		const formatted = unique.map((brand) => ({
			name: brand,
			image: brandImageMap[brand] || '/images/brands/default.webp'
		}));

		setBrands(formatted);
	}, []);

	const handleBrandClick = (brand) => {
		router.push(`/brand/${encodeURIComponent(brand)}`);
	};
	console.log(brands)
	return (
		<div id="header" className='relative w-full'>
			<MenuTwo />
			<BannerCollection url={"/images/banner/bannerCollection/belts.webp"} title={"Belts"} />
			<CategoryBrand brand={brands} handleBrandClick={handleBrandClick} />
		</div>
	)
}

export default Belts