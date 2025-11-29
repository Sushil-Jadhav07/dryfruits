# AVIF Image Format Support

This document explains how to use AVIF (AV1 Image File Format) images in your dryfruits project with Sanity CMS.

## 🚀 What is AVIF?

AVIF is a modern image format that provides:
- **Better compression** than JPEG and WebP
- **Higher quality** at smaller file sizes
- **Wide color gamut** support
- **Transparency** support
- **Animation** support

## 📁 Files Added

1. **`lib/avif-support.ts`** - Core AVIF support detection and utilities
2. **`components/AvifImage.tsx`** - React component for AVIF images
3. **Updated `lib/sanity.ts`** - Enhanced with AVIF support functions

## 🛠️ How to Use

### 1. Basic AVIF Image Component

```tsx
import AvifImage from '@/components/AvifImage'
import type { SanityImage } from '@/types/sanity'

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      <AvifImage
        source={product.coverImage}
        alt={product.name}
        width={400}
        height={400}
        quality={85}
        className="rounded-lg"
        priority={true}
      />
      <h3>{product.name}</h3>
    </div>
  )
}
```

### 2. Using AVIF Support Hook

```tsx
import { useAvifSupport } from '@/components/AvifImage'

function MyComponent() {
  const supportsAvif = useAvifSupport()
  
  return (
    <div>
      {supportsAvif ? (
        <p>🎉 Your browser supports AVIF!</p>
      ) : (
        <p>📱 Using WebP fallback</p>
      )}
    </div>
  )
}
```

### 3. Direct AVIF URL Generation

```tsx
import { getAvifImageUrl, getBestImageFormat } from '@/lib/sanity'

// Get AVIF image URL
const avifUrl = getAvifImageUrl(imageSource, 800, 600, 90)

// Get best available format (AVIF > WebP > JPG)
const bestUrl = await getBestImageFormat(imageSource, 800, 600, 90)
```

## 🔧 Configuration Options

### AvifImage Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `SanityImage` | - | Sanity image source |
| `alt` | `string` | - | Image alt text |
| `width` | `number` | - | Image width |
| `height` | `number` | - | Image height |
| `quality` | `number` | `80` | Image quality (1-100) |
| `className` | `string` | `''` | CSS classes |
| `priority` | `boolean` | `false` | Load image immediately |
| `fallbackFormat` | `'webp' \| 'jpg' \| 'png'` | `'webp'` | Fallback format |
| `onLoad` | `function` | - | Image load callback |
| `onError` | `function` | - | Image error callback |

### Quality Settings

- **High Quality**: 90-100 (for hero images, product photos)
- **Medium Quality**: 70-89 (for general content)
- **Low Quality**: 50-69 (for thumbnails, backgrounds)

## 🌐 Browser Support

### AVIF Support
- ✅ Chrome 85+
- ✅ Firefox 93+
- ✅ Edge 85+
- ✅ Safari 16.4+
- ❌ Internet Explorer

### Fallback Strategy
1. **AVIF** (if supported)
2. **WebP** (if AVIF not supported)
3. **JPEG/PNG** (final fallback)

## 📊 Performance Benefits

### File Size Comparison
- **JPEG**: 100% (baseline)
- **WebP**: ~25-35% smaller
- **AVIF**: ~50-70% smaller

### Example
- **JPEG**: 500KB
- **WebP**: 350KB (30% smaller)
- **AVIF**: 200KB (60% smaller)

## 🚨 Important Notes

### 1. Sanity Backend
- AVIF support is handled on the **frontend**
- Sanity automatically serves images in requested format
- No backend changes required

### 2. Image Upload
- Upload images in any format (JPG, PNG, WebP)
- Frontend automatically converts to AVIF when possible
- Maintain original quality in Sanity

### 3. CDN Caching
- Sanity CDN caches different formats separately
- First request may be slower
- Subsequent requests are fast

## 🔍 Debugging

### Development Mode
In development, you'll see format indicators:
- **AVIF** badge for AVIF images
- **WEBP** badge for WebP fallbacks

### Console Logs
Check browser console for:
- AVIF support detection
- Image loading errors
- Format fallback information

## 📱 Mobile Optimization

### Responsive Images
```tsx
<AvifImage
  source={image}
  alt="Product"
  width={400}
  height={400}
  quality={85}
  className="w-full h-auto"
/>
```

### Performance Tips
- Use `priority={true}` for above-the-fold images
- Set appropriate `quality` based on image importance
- Consider different sizes for mobile/desktop

## 🎯 Best Practices

1. **Always provide alt text** for accessibility
2. **Use appropriate quality settings** for image purpose
3. **Set proper dimensions** to avoid layout shifts
4. **Test on different browsers** to ensure fallbacks work
5. **Monitor performance** with browser dev tools

## 🆘 Troubleshooting

### Images Not Loading
1. Check Sanity project configuration
2. Verify image asset references
3. Check browser console for errors
4. Ensure proper CORS settings

### AVIF Not Working
1. Verify browser support
2. Check if CDN supports AVIF
3. Try different quality settings
4. Check network tab for format requests

### Performance Issues
1. Reduce image quality if too high
2. Use appropriate image dimensions
3. Enable lazy loading for non-critical images
4. Consider using `priority` for important images

## 🔗 Related Links

- [AVIF Format Specification](https://aomediacodec.github.io/av1-avif/)
- [Sanity Image API](https://www.sanity.io/docs/image-urls)
- [Browser Support](https://caniuse.com/avif)
- [Performance Comparison](https://developers.google.com/web/fundamentals/performance/optimizing-images/efficient-image-formats)

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify Sanity configuration
3. Test with different image formats
4. Check browser compatibility



