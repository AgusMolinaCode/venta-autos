# Car Valuation Feature

A complete React car valuation system with step-by-step form, API integration, and results display.

## 🚀 Features

- **Step 1**: Vehicle selection form (year, brand, model)
- **Step 2**: Price analysis and vehicle listings
- Real-time API integration with loading states
- Comprehensive error handling
- Responsive design with mobile-first approach
- TypeScript support with strict typing
- React Query for data management and caching
- Complete test coverage with Jest and React Testing Library

## 📁 File Structure

```
components/car-valuation/
├── car-valuation-form.tsx      # Main form component (Step 1)
├── car-valuation-results.tsx   # Results display (Step 2)
├── car-valuation-modal.tsx     # Modal wrapper component
└── index.tsx                   # Export file

lib/
├── services/car-valuation.ts   # API service layer
└── hooks/use-car-valuation.ts  # React Query hooks

__tests__/
├── car-valuation.test.ts       # Service tests
├── car-valuation-form.test.tsx # Component tests
└── setup.ts                    # Test configuration
```

## 🔧 API Integration

### Endpoint
```
POST https://primary-production-1e497.up.railway.app/webhook/b9c2fb0f-5b6d-407b-b19a-0561b22b98c4
```

### Request Format
```typescript
{
  "ano": 2015,
  "marca": "Peugeot", 
  "modelo": "208"
}
```

### Response Format
```typescript
[{
  "total_vehiculos": 48,
  "exchange_rate_used": "1 USD = 1300 ARS",
  "precios_ars_completo": {
    "total": 728776000,
    "min": 11750000,
    "max": 20670000,
    "avg": 15182833
  },
  "precios_usd_completo": {
    "total": 560597,
    "min": 9038,
    "max": 15900,
    "avg": 11679
  },
  "primeros_3_productos": [...]
}]
```

## 🎨 Components

### CarValuationForm
- Form validation with Zod schema
- Dynamic year/brand selection
- Loading states and error handling
- Automatic step progression

### CarValuationResults
- Price statistics in ARS and USD
- Featured vehicle grid (3 columns)
- External links to vehicle listings
- Responsive design with cards

### CarValuationModal
- Reusable modal wrapper
- Customizable trigger button
- Auto-sizing content area
- Accessibility compliant

## 🧪 Testing

### Service Tests
```bash
npm run test car-valuation.test.ts
```
- API integration tests
- Error handling validation
- Price formatting utilities

### Component Tests
```bash  
npm run test car-valuation-form.test.tsx
```
- Form validation testing
- Loading state verification
- Error display testing
- User interaction simulation

### Run All Tests
```bash
npm test                    # Single run
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage
```

## 🔧 Usage Examples

### Basic Modal
```tsx
import { CarValuationModal } from '@/components/car-valuation';

<CarValuationModal />
```

### Custom Modal
```tsx
<CarValuationModal 
  triggerText="Valorar Mi Auto"
  triggerVariant="outline"
  triggerIcon={<IconCar className="h-4 w-4" />}
/>
```

### Standalone Form
```tsx
import { CarValuationForm } from '@/components/car-valuation';

<CarValuationForm onClose={() => console.log('closed')} />
```

## 🎯 Performance Features

- React Query caching (5min stale, 10min garbage collection)
- Optimistic loading states
- Error boundary integration
- Responsive image loading with fallbacks
- Minimal bundle size with tree shaking

## 🛡️ Error Handling

- Network failure recovery
- Invalid API response handling
- User-friendly error messages
- Form validation feedback
- Graceful fallback behaviors

## 🌍 Internationalization Ready

- Spanish language support
- Currency formatting (ARS/USD)
- Number formatting with locale
- Exchange rate display
- Accessible labels and descriptions

## 🚀 Deployment Notes

- All dependencies included in package.json
- TypeScript strict mode compatible
- ESLint and Prettier configured
- Next.js App Router compatible
- Production build optimizations included