# E-commerce Platform with Shopping Cart

This is a modern e-commerce platform with full shopping cart functionality using local storage.

## Features

### 🛒 Shopping Cart System

- **Add to Cart**: Click "Add to Cart" button on any product
- **Cart Management**: View, update quantities, and remove items
- **Local Storage**: Cart data persists between browser sessions
- **Real-time Updates**: Cart count updates automatically
- **Responsive Design**: Works on all device sizes

### 📱 Pages

- **Products Page** (`products.html`): Browse products and add to cart
- **Cart Page** (`cart.html`): Manage cart items and checkout
- **Navigation**: Easy access between pages with cart icon

### 🎨 Modern UI/UX

- Beautiful gradient backgrounds
- Smooth animations and transitions
- Responsive grid layouts
- Professional styling with hover effects

## How to Use

### 1. Browse Products

- Navigate to `products.html`
- Browse available products
- Click "Add to Cart" on desired items
- See real-time cart count updates

### 2. Manage Cart

- Click the cart icon (🛒) in navigation
- View all cart items with details
- Adjust quantities using +/- buttons
- Remove individual items
- Clear entire cart if needed

### 3. Checkout

- Review order summary with subtotal, tax, and total
- Click "Proceed to Checkout" when ready
- Cart clears after successful checkout

## Technical Details

### Local Storage

- Cart data stored in browser's localStorage
- Persists between sessions and page refreshes
- Automatic cart count synchronization

### JavaScript Features

- **products.js**: Product display and cart management
- **cart.js**: Cart page functionality and calculations
- Event-driven architecture
- Responsive quantity controls

### CSS Styling

- Modern gradient designs
- Responsive grid layouts
- Smooth animations
- Mobile-first approach

## File Structure

```
E-commerce/
├── products.html      # Products page with add to cart
├── cart.html         # Shopping cart page
├── products.js       # Products functionality
├── cart.js          # Cart functionality
├── style.css        # All styling including cart
└── README.md        # This file
```

## Browser Compatibility

- Modern browsers with ES6+ support
- Local storage support required
- Responsive design for all screen sizes

## Future Enhancements

- User authentication integration
- Payment gateway integration
- Order history tracking
- Wishlist functionality
- Product reviews and ratings

## Getting Started

1. Open `products.html` in your browser
2. Start adding products to your cart
3. Navigate to cart page to manage items
4. Enjoy the shopping experience!

---

**Note**: This is a frontend-only implementation. For production use, integrate with a backend server for data persistence and user management.
