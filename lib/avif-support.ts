// AVIF Support Detection and Image Handling
// This file provides AVIF format support for Sanity images

// Check if AVIF is supported by the browser
export function isAvifSupported(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false)
      return
    }

    // Create a test image to check AVIF support
    const img = new Image()
    
    // Set a timeout to avoid hanging
    const timeout = setTimeout(() => {
      resolve(false)
    }, 100)

    img.onload = () => {
      clearTimeout(timeout)
      resolve(true)
    }
    
    img.onerror = () => {
      clearTimeout(timeout)
      resolve(false)
    }

    // Use a minimal AVIF data URL for testing
    img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgIEAxBAACAgEAKAAAABWmW8w=='
  })
}

// Cache the AVIF support result
let avifSupportCache: boolean | null = null

// Get cached AVIF support status
export async function getAvifSupport(): Promise<boolean> {
  if (avifSupportCache !== null) {
    return avifSupportCache
  }
  
  avifSupportCache = await isAvifSupported()
  return avifSupportCache
}

// Convert Sanity image URL to AVIF format
export function convertToAvifFormat(imageUrl: string): string {
  if (!imageUrl) return imageUrl
  
  // If the URL already has a format parameter, replace it
  if (imageUrl.includes('format=')) {
    return imageUrl.replace(/format=[^&]+/, 'format=avif')
  }
  
  // If no format parameter, add it
  const separator = imageUrl.includes('?') ? '&' : '?'
  return `${imageUrl}${separator}format=avif`
}

// Get image URL with best available format
export async function getBestFormatImageUrl(
  baseUrl: string,
  preferAvif: boolean = true
): Promise<string> {
  if (!preferAvif) {
    return baseUrl
  }
  
  try {
    const supportsAvif = await getAvifSupport()
    if (supportsAvif) {
      return convertToAvifFormat(baseUrl)
    }
  } catch (error) {
    console.warn('Error checking AVIF support:', error)
  }
  
  return baseUrl
}

// Hook for React components to use AVIF support
export function useAvifSupport() {
  // This hook requires React to be imported in the component file
  // Usage: import { useAvifSupport } from '@/lib/avif-support'
  // const [supportsAvif, setSupportsAvif] = React.useState<boolean | null>(null)
  // React.useEffect(() => { getAvifSupport().then(setSupportsAvif) }, [])
  // return supportsAvif
  
  // For now, return null - implement in your component as needed
  return null
}
