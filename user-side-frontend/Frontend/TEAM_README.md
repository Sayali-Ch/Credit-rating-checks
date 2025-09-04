# CibilView Frontend - Team Development Guide

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (buttons, inputs, etc.)
│   │   ├── Button.jsx
│   │   ├── FAQItem.jsx
│   │   └── index.js     # Barrel exports
│   ├── layout/          # Layout components (navbar, footer, etc.)
│   │   ├── Navbar.jsx
│   │   ├── NavLink.jsx
│   │   ├── Logo.jsx
│   │   └── index.js
│   ├── forms/           # Form-related components
│   │   ├── FormInput.jsx
│   │   └── index.js
│   ├── cards/           # Card components
│   │   ├── ContactCard.jsx
│   │   ├── FeatureCard.jsx
│   │   ├── StatCard.jsx
│   │   └── index.js
│   ├── common/          # Common shared components
│   │   ├── CreditScoreMeter.jsx
│   │   ├── CreditScoreSpeedometer.jsx
│   │   ├── CreditScoreTracking.jsx
│   │   ├── HeroSection.jsx
│   │   └── index.js
│   └── index.js         # Main barrel export
├── pages/               # Page components
│   ├── HomePage.jsx
│   ├── AuthPage.jsx
│   ├── FeaturesPage.jsx
│   ├── AboutPage.jsx
│   └── SupportPage.jsx
├── hooks/               # Custom React hooks
│   └── index.js         # useLocalStorage, useDebounce, useAsync, useForm
├── utils/               # Utility functions
│   └── index.js         # formatCurrency, formatDate, validation, etc.
├── constants/           # Application constants
│   └── index.js         # API endpoints, routes, validation rules
├── styles/              # Global styles and themes
│   ├── index.css        # Main styles
│   └── App.css          # App-specific styles
└── assets/              # Static assets
```

## 🛠️ Development Guidelines

### Component Organization

1. **UI Components** (`/components/ui/`)
   - Basic, reusable UI elements
   - Should be stateless when possible
   - Include: Button, Input, Modal, etc.

2. **Layout Components** (`/components/layout/`)
   - Page structure components
   - Navigation, header, footer
   - Sidebar, main layout wrapper

3. **Form Components** (`/components/forms/`)
   - Form-specific components
   - Input validators, form wrappers
   - Complex form controls

4. **Card Components** (`/components/cards/`)
   - Card-based UI components
   - Display components for data

5. **Common Components** (`/components/common/`)
   - Shared business logic components
   - Feature-specific reusable components

### Import/Export Patterns

#### ✅ Good - Using barrel exports
```jsx
import { Button, FormInput } from '../components';
import { formatCurrency, debounce } from '../utils';
import { API_ENDPOINTS, ROUTES } from '../constants';
```

#### ❌ Avoid - Direct file imports
```jsx
import Button from '../components/ui/Button';
import FormInput from '../components/forms/FormInput';
```

### Custom Hooks Usage

```jsx
// Local storage management
const [user, setUser] = useLocalStorage('user', null);

// Debounced search
const debouncedSearch = useDebounce(searchTerm, 500);

// Async operations
const { data, loading, error, execute } = useAsync(fetchUserData);

// Form management
const { values, errors, handleChange, handleSubmit } = useForm(
  { email: '', password: '' },
  validateForm
);
```

### Utility Functions

```jsx
// Currency formatting
formatCurrency(1234.56); // ₹1,234.56

// Date formatting
formatDate(new Date(), 'short'); // Jan 1, 2024

// Credit score status
getCreditScoreStatus(750); // { label: 'Very Good', color: 'blue' }

// Local storage with error handling
storage.set('userPrefs', { theme: 'dark' });
const prefs = storage.get('userPrefs', {});
```

## 🔧 Development Workflow

### 1. Adding New Components

1. Create component in appropriate directory
2. Add to directory's `index.js` barrel export
3. Use consistent naming conventions
4. Include PropTypes or TypeScript types
5. Add to Storybook (if applicable)

### 2. Feature Development

1. Create feature branch: `feature/component-name`
2. Follow component structure guidelines
3. Add necessary utilities/constants
4. Update documentation
5. Create pull request with proper description

### 3. Code Review Checklist

- [ ] Component is in correct directory
- [ ] Uses barrel imports/exports
- [ ] Follows naming conventions
- [ ] Includes proper error handling
- [ ] Has responsive design
- [ ] Accessibility considerations
- [ ] Performance optimizations

## 📱 Responsive Design

All components should follow mobile-first approach:

```jsx
// Use Tailwind responsive classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* Content */}
</div>
```

## 🎨 Styling Guidelines

### Color Palette
- Primary: Blue (#2563eb)
- Secondary: Purple (#7c3aed)
- Success: Green (#059669)
- Warning: Orange (#ea580c)
- Error: Red (#dc2626)

### Component Variants
```jsx
// Button variants
<Button variant="primary" size="large">Primary</Button>
<Button variant="secondary" size="medium">Secondary</Button>
<Button variant="outline" size="small">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

## 🚀 Performance Best Practices

1. **Lazy Loading**: Use React.lazy() for route-based code splitting
2. **Memoization**: Use React.memo() for expensive components
3. **Debouncing**: Use useDebounce hook for search/input operations
4. **Local Storage**: Use utility functions for consistent error handling
5. **Image Optimization**: Use appropriate formats and sizes

## 🧪 Testing Strategy

```jsx
// Component testing example
import { render, screen } from '@testing-library/react';
import { Button } from '../components';

test('renders button with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

## 📦 Package Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 🔍 Debugging

1. Use React Developer Tools
2. Check browser console for errors
3. Use network tab for API debugging
4. Leverage VS Code debugging tools

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)
- [ESLint Rules](https://eslint.org/)

## 🤝 Team Collaboration

1. **Communication**: Use descriptive commit messages
2. **Code Reviews**: Always request peer review
3. **Documentation**: Update README when adding features
4. **Standards**: Follow established patterns and conventions

---

For questions or improvements to this guide, please reach out to the development team lead.
