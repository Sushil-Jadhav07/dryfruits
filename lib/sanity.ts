import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Sanity configuration with environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID 
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION
const token = process.env.SANITY_API_TOKEN

// Create Sanity client
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production
  token, // Only needed for write operations
})

// Image URL builder
const builder = imageUrlBuilder(client)

// Function to generate image URLs
export function urlFor(source: any) {
  return builder.image(source)
}

// Function to get image URL with specific dimensions
export function getImageUrl(source: any, width: number, height: number) {
  // Check if source exists and has valid asset reference
  if (!source || !source.asset || !source.asset._ref || source.asset._ref === '') {
    return '/images/product/1000x1000.png'
  }
  
  try {
    return urlFor(source).width(width).height(height).url()
  } catch (error) {
    console.warn('Error generating image URL:', error)
    return '/images/product/1000x1000.png'
  }
}

// Function to get image URL with quality and format options
export function getOptimizedImageUrl(
  source: any, 
  width: number, 
  height: number, 
  quality: number = 80,
  format: 'webp' | 'jpg' | 'png' = 'webp'
) {
  // Check if source exists and has valid asset reference
  if (!source || !source.asset || !source.asset._ref || source.asset._ref === '') {
    return '/images/product/1000x1000.png'
  }
  
  try {
    return urlFor(source)
      .width(width)
      .height(height)
      .quality(quality)
      .format(format)
      .url()
  } catch (error) {
    console.warn('Error generating optimized image URL:', error)
    return '/images/product/1000x1000.png'
  }
}

// Function to get responsive image URLs
export function getResponsiveImageUrls(source: any, breakpoints: number[]) {
  // Check if source exists and has valid asset reference
  if (!source || !source.asset || !source.asset._ref || source.asset._ref === '') {
    return {}
  }
  
  try {
    const urls: Record<string, string> = {}
    breakpoints.forEach(breakpoint => {
      urls[`${breakpoint}w`] = urlFor(source).width(breakpoint).url()
    })
    return urls
  } catch (error) {
    console.warn('Error generating responsive image URLs:', error)
    return {}
  }
}

// Export client configuration for debugging
export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  hasToken: !!token,
} 