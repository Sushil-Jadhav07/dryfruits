'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import MenuTwo from '@/components/Header/Menu/MenuTwo';
import productData from '@/data/productBrand.json';
import Product from '@/components/Product/Product'; // <-- adjust this path to your actual Product component
import SkeletonCard from '@/components/SkeletonCard';
import Footer from '@/components/Footer/Footer';
import BannerCollection from '@/components/Categories/BannerCollection';
import BannerBrand from '@/components/Brand/BannerBrand';

const BrandPage = () => {
	const { brand } = useParams();
	const decodedBrand = decodeURIComponent(brand || '');

	const [loading, setLoading] = useState(true);
	const [filtered, setFiltered] = useState([]);

	// Filter products for this brand
	useEffect(() => {
		setLoading(true);
		const timer = setTimeout(() => {
			const products = productData.filter(
				(item) => item.brand?.toLowerCase() === decodedBrand.toLowerCase()
			);
			setFiltered(products);
			setLoading(false);
		}, 500); // small delay so skeleton is visible; tweak as you like
		return () => clearTimeout(timer);
	}, [decodedBrand]);

	// Map your simple JSON to the shape your <Product /> expects
	const mappedForProductCard = useMemo(() => {
		return filtered.map((p, idx) => ({
			// Minimum fields your Product component uses
			id: `${p.brand}-${p.category}-${idx}`,
			name: p.name,
			price: p.price || 0,
			originPrice: p.price || 0,
			// images
			thumbImage: ['/images/product/1000x1000.png'],
			variation: [], // no color variations in your JSON
			sizes: [],     // no sizes in your JSON
			// misc fields your component references
			sold: 0,
			quantity: 100,
			quantityPurchase: 1,
			action: 'add to cart',
		}));
	}, [filtered]);

	return (
		<div className="w-full">
			<MenuTwo />
			<BannerBrand url={"/images/banner/bannerCollection/brand.webp"} title={brand} />

			{/* Grid */}
			<div className="container">
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-36 px-4 pb-12">
					{loading
						? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)
						: mappedForProductCard.map((data) => (
							<Product
								key={data.id}
								data={data}
								type="grid"
								style="style-1"  // or "style-5" etc. – whichever variant you prefer
							/>
						))}
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default BrandPage;
