'use client';

import React from 'react';

const SkeletonCard = () => {
	return (
		<div className="product-item grid-type animate-pulse">
			<div className="product-main block">
				<div className="product-thumb bg-white relative overflow-hidden rounded-2xl">
					<div className="w-full h-full aspect-[3/4] bg-gray-200" />
				</div>

				<div className="product-infor mt-4 lg:mb-7">
					<div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
					<div className="h-3 bg-gray-200 rounded w-1/2" />
				</div>
			</div>
		</div>
	);
};

export default SkeletonCard;
