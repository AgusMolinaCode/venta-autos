# Hero Carousel Design Specification

## Overview
A full-width, autoplay hero carousel component for the landing page that showcases key messages without manual navigation controls.

## Component Architecture

### File Structure
```
components/
└── landing/
    └── hero/
        ├── Hero.tsx (existing - basic version)
        └── HeroCarousel.tsx (new - enhanced carousel version)
```

## Design Requirements Met

### ✅ Full Width (`todo el ancho`)
- Uses `w-full` classes for complete viewport width
- Removes padding/margins that would constrain width
- Implements responsive height scaling across devices

### ✅ No Arrow Navigation (`sin arrowleft y right`)
- Excludes `CarouselPrevious` and `CarouselNext` components
- Removes manual navigation buttons entirely
- Provides alternative navigation through indicator dots

### ✅ Autoplay Functionality
- Integrates `embla-carousel-autoplay` plugin
- 4-second delay between slides with smooth transitions
- Stops on user interaction (hover/touch)
- Automatically resumes when interaction ends

### ✅ Welcome Message (`h1 de bienvenida`)
- Prominent H1 heading with welcome text in Spanish
- Responsive typography scaling (4xl to 7xl)
- Centered positioning with optimal readability
- Multiple slide variations with different messaging

## Technical Implementation

### Dependencies Added
```json
{
  "embla-carousel-autoplay": "^8.6.0"
}
```

### Component Features
1. **Responsive Design**
   - Adaptive height: 70vh (mobile) → 90vh (desktop)
   - Minimum height: 500px for content protection
   - Fluid typography scaling across breakpoints

2. **Accessibility**
   - Proper ARIA labels and role descriptions
   - Screen reader compatible slide descriptions
   - Keyboard navigation support (inherited from base carousel)

3. **Performance Optimizations**
   - Memoized component with React.memo()
   - Ref-based plugin initialization to prevent recreations
   - Optimized background image loading

4. **User Experience**
   - Dark overlay for text readability (40% opacity)
   - Smooth autoplay with pause-on-hover
   - Visual indicator dots for slide position
   - Loop functionality for continuous rotation

### Slide Configuration
```typescript
interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  backgroundImage: string;
  alt: string;
}
```

Three default slides configured:
1. "Bienvenido a Nuestra Concesionaria"
2. "Calidad Garantizada" 
3. "Financiamiento Flexible"

## Usage Instructions

### Installation
1. Install the autoplay plugin:
```bash
npm install embla-carousel-autoplay
```

2. Import and use the component:
```tsx
import HeroCarousel from '@/components/landing/hero/HeroCarousel';

export default function HomePage() {
  return (
    <main>
      <HeroCarousel />
      {/* Other page content */}
    </main>
  );
}
```

### Customization Options

#### Slide Content
Modify the `heroSlides` array to customize:
- Welcome messages and subtitles
- Background images (place in `/public/images/`)
- Alt text for accessibility

#### Autoplay Settings
Adjust autoplay behavior:
```tsx
const autoplayPlugin = React.useRef(
  Autoplay({ 
    delay: 4000,           // Time between slides (ms)
    stopOnInteraction: true // Pause on user interaction
  })
);
```

#### Styling Customization
- Height: Modify viewport height classes (`h-[70vh]`)
- Overlay: Adjust dark overlay opacity (`bg-black/40`)
- Typography: Change text sizes and spacing classes
- Colors: Update text and indicator colors

## Browser Compatibility
- Modern browsers with CSS Grid and Flexbox support
- Mobile-responsive across iOS Safari, Android Chrome
- Progressive enhancement for older browsers

## Performance Considerations
- Images should be optimized for web (WebP recommended)
- Consider lazy loading for background images in production
- Monitor carousel autoplay impact on page metrics

## Future Enhancements
- Dynamic slide loading from CMS/API
- Touch/swipe gesture support
- Video background support
- Advanced transition animations
- A/B testing integration for messaging