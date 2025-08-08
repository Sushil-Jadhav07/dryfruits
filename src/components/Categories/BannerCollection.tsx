import React from 'react';

interface BannerCollectionProps {
	url: string;
	title?: string; // Optional prop if you want to customize "Purse"
}

const BannerCollection: React.FC<BannerCollectionProps> = ({ url, title }) => {
	return (
		<div
			className="h-[600px] bg-cover bg-no-repeat bg-center flex justify-center items-center"
			style={{ backgroundImage: `url(${url})` }}
		>
			<h2 className="text-white text-8xl font-semibold">{title}</h2>
		</div>
	);
};

export default BannerCollection;
