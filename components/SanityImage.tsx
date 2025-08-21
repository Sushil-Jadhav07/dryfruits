import React from 'react'
import { getImageUrl, getOptimizedImageUrl } from '../lib/sanity'
import type { SanityImage } from '../types/sanity'

interface SanityImageProps {
  image: SanityImage | null | undefined
  alt?: string
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpg' | 'png'
  className?: string
  style?: React.CSSProperties
  priority?: boolean
  sizes?: string
  onClick?: () => void
  fallbackSrc?: string
}

const SanityImage: React.FC<SanityImageProps> = ({
  image,
  alt = '',
  width = 800,
  height = 600,
  quality = 80,
  format = 'webp',
  className = '',
  style = {},
  priority = false,
  sizes = '100vw',
  onClick,
  fallbackSrc = '/images/product/1000x1000.png'
}) => {
  if (!image?.asset?._ref) {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
        onClick={onClick}
      />
    )
  }

  const imageUrl = getOptimizedImageUrl(image, width, height, quality, format)
  const fallbackUrl = getImageUrl(image, width, height)

  return (
    <picture>
      {/* WebP format for modern browsers */}
      <source
        srcSet={imageUrl}
        type={`image/${format}`}
        media="(min-width: 1px)"
      />
      
      {/* Fallback image */}
      <img
        src={fallbackUrl}
        alt={alt || image.alt || ''}
        width={width}
        height={height}
        className={className}
        style={style}
        onClick={onClick}
        loading={priority ? 'eager' : 'lazy'}
        sizes={sizes}
        onError={(e) => {
          // Fallback to fallback image if Sanity image fails to load
          const target = e.target as HTMLImageElement
          target.src = fallbackSrc
        }}
      />
    </picture>
  )
}

// Responsive image component
interface ResponsiveSanityImageProps extends Omit<SanityImageProps, 'width' | 'height'> {
  breakpoints: number[]
  className?: string
  style?: React.CSSProperties
}

export const ResponsiveSanityImage: React.FC<ResponsiveSanityImageProps> = ({
  image,
  breakpoints,
  alt = '',
  quality = 80,
  format = 'webp',
  className = '',
  style = {},
  priority = false,
  onClick,
  fallbackSrc = '/images/product/1000x1000.png'
}) => {
  if (!image?.asset?._ref) {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        className={className}
        style={style}
        onClick={onClick}
      />
    )
  }

  const generateSrcSet = () => {
    return breakpoints
      .map(breakpoint => {
        const url = getOptimizedImageUrl(image, breakpoint, breakpoint, quality, format)
        return `${url} ${breakpoint}w`
      })
      .join(', ')
  }

  const srcSet = generateSrcSet()
  const defaultWidth = breakpoints[Math.floor(breakpoints.length / 2)] || 800

  return (
    <picture>
      {/* WebP format for modern browsers */}
      <source
        srcSet={srcSet}
        type={`image/${format}`}
        media="(min-width: 1px)"
      />
      
      {/* Fallback image */}
      <img
        src={getImageUrl(image, defaultWidth, defaultWidth)}
        alt={alt || image.alt || ''}
        className={className}
        style={style}
        onClick={onClick}
        loading={priority ? 'eager' : 'lazy'}
        srcSet={srcSet}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = fallbackSrc
        }}
      />
    </picture>
  )
}

// Background image component
interface BackgroundSanityImageProps {
  image: SanityImage | null | undefined
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpg' | 'png'
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  fallbackSrc?: string
}

export const BackgroundSanityImage: React.FC<BackgroundSanityImageProps> = ({
  image,
  width = 1920,
  height = 1080,
  quality = 80,
  format = 'webp',
  className = '',
  style = {},
  children,
  fallbackSrc = '/images/product/1000x1000.png'
}) => {
  const backgroundImage = image?.asset?._ref 
    ? getOptimizedImageUrl(image, width, height, quality, format)
    : fallbackSrc

  return (
    <div
      className={className}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        ...style
      }}
    >
      {children}
    </div>
  )
}

export default SanityImage
