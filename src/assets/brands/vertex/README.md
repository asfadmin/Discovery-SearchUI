# Vertex Brand Assets

This directory contains brand-specific assets for the standard Vertex deployment (search.asf.alaska.edu).

## Required Assets

### Logo Files
- `logo.svg` - Main application logo (SVG format for scalability)
- `logo-white.svg` - White version for dark backgrounds (optional)
- `logo.png` - Fallback PNG version (optional)

### Favicon
- `favicon.ico` - Browser favicon (16x16, 32x32, 48x48 sizes)
- `favicon-16x16.png` - 16x16 PNG
- `favicon-32x32.png` - 32x32 PNG
- `apple-touch-icon.png` - 180x180 for iOS (optional)

### Additional Brand Assets (Optional)
- `og-image.png` - Open Graph image for social sharing (1200x630)
- `hero-banner.jpg` - Hero section background image
- `pattern.svg` - Brand pattern/texture
- `splash-icon.png` - PWA splash screen icon

## Current Assets

Currently using existing ASF logo. To replace:
1. Add your logo files to this directory
2. Update references in `src/styles/brands/vertex.scss`
3. Update `angular.json` file replacements if needed

## Asset Guidelines

- **Colors**: Primary ASF Blue (#236192)
- **File Formats**: Prefer SVG for logos, PNG for favicons
- **Sizes**: Ensure logos work at multiple sizes (min 24px height)
- **Transparency**: Use transparent backgrounds where appropriate
