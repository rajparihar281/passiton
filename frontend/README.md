# PassItOn Frontend

Campus Resource Sharing Platform - Frontend Application

## 🚀 Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **Axios** for API calls
- **TailwindCSS** for styling
- **React Hot Toast** for notifications
- **Lucide React** for icons

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── ItemCard.tsx
│   └── UI.tsx
├── pages/           # Page components
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── DashboardPage.tsx
│   ├── BrowsePage.tsx
│   ├── CreateItemPage.tsx
│   └── ...
├── layouts/         # Layout components
│   ├── MainLayout.tsx
│   └── Navbar.tsx
├── services/        # API service layer
│   ├── api.ts
│   ├── auth.service.ts
│   ├── item.service.ts
│   ├── borrow.service.ts
│   └── ...
├── context/         # React Context for state
│   └── AuthContext.tsx
├── routes/          # Route configuration
│   └── ProtectedRoute.tsx
├── types/           # TypeScript type definitions
│   └── index.ts
├── utils/           # Utility functions
│   ├── helpers.ts
│   └── constants.ts
├── hooks/           # Custom React hooks
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## 🔧 Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Backend server running on port 5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Architecture

### Data Flow

```
Frontend → API Service Layer → Backend APIs → Supabase → Database
```

**IMPORTANT**: Frontend NEVER connects directly to Supabase. All data operations go through backend APIs.

### State Management

- **Authentication**: Managed via AuthContext
- **Local State**: useState for component-level state
- **API State**: Managed in components with loading/error states

### API Integration

All API calls are centralized in the `services/` directory:

- `auth.service.ts` - Authentication operations
- `item.service.ts` - Item CRUD operations
- `borrow.service.ts` - Borrow request operations
- `transaction.service.ts` - Transaction management
- `profile.service.ts` - User profile operations
- `chat.service.ts` - Messaging operations

### Type Safety

All types are defined in `types/index.ts` and aligned with the database schema:

- User, Profile, College
- Item, ItemImage
- BorrowRequest, Transaction
- Review, Conversation, Message

## 🎨 UI Components

### Core Components

- **Button** - Customizable button with variants and loading states
- **Input** - Form input with label, error, and helper text
- **Card** - Container component for content
- **Badge** - Status indicators
- **Avatar** - User profile images
- **Modal** - Overlay dialogs
- **ItemCard** - Display item listings
- **Spinner** - Loading indicators
- **EmptyState** - Empty state placeholders

### Layouts

- **MainLayout** - Main app layout with navbar
- **Navbar** - Navigation bar with user menu

## 📄 Pages

### Authentication
- `/login` - User login
- `/signup` - User registration with college validation
- `/forgot-password` - Password reset

### Main App
- `/dashboard` - Home dashboard with stats and recent items
- `/browse` - Browse all items with filters
- `/items/create` - Create new item listing
- `/items/:id` - Item detail page
- `/my-items` - User's listed items
- `/my-requests` - Borrow requests made by user
- `/received-requests` - Requests received for user's items
- `/transactions` - Active and past transactions
- `/chat` - Messaging interface
- `/profile/:id` - User profile page

## 🔐 Authentication

Authentication is handled via JWT tokens:

1. User logs in/signs up
2. Backend returns JWT token
3. Token stored in localStorage
4. Token sent in Authorization header for all API requests
5. Protected routes check for valid token

## 🎯 Features Implemented

### ✅ Core Features
- User authentication (login/signup)
- Item listing with image upload
- Browse items with filters
- Dashboard with stats
- Responsive design
- Toast notifications
- Protected routes
- Type-safe API calls

### 🚧 To Be Implemented
- Item detail page with borrow request
- Borrow request management
- Transaction tracking
- Real-time chat
- User profile editing
- Review system
- Notifications
- Search functionality

## 🔨 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Separate business logic from UI

### Adding New Features

1. Define types in `types/index.ts`
2. Create service methods in `services/`
3. Build UI components in `components/`
4. Create page in `pages/`
5. Add route in `App.tsx`

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Environment Variables

Set the following in production:

```env
VITE_API_URL=https://your-backend-api.com
```

## 📝 Notes

- All API calls include error handling
- Loading states are shown for async operations
- Form validation is implemented client-side
- Images are validated before upload (type, size)
- Responsive design works on mobile, tablet, and desktop

## 🔗 Related

- Backend: `../backend/`
- Database Schema: `../backend/sql/`

## 📞 Support

For issues or questions, please refer to the main project documentation.
