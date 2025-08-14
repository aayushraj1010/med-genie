# Authentication System Documentation

## Overview

This documentation outlines the complete authentication system implemented for Med Genie, featuring JWT-based authentication, password hashing with bcrypt, API route protection, and session management.

## Features Implemented

### ✅ User Registration
- JWT token generation on successful registration
- Password hashing with bcryptjs (salt rounds: 10)
- Input validation using Zod schema
- Automatic login after successful registration
- Prisma database integration
- **Smart signup suggestions** - Users who try to login with non-existent emails get signup suggestions
- **Email pre-filling** - Email addresses are pre-filled when redirected from login

### ✅ JWT Authentication
- JWT token generation and validation
- Configurable expiration time (default: 7 days)
- Secure token storage in localStorage
- Automatic token inclusion in API requests

### ✅ API Route Protection
- Middleware for protecting API routes
- Optional authentication middleware
- Automatic token extraction from Authorization header
- User context attachment to requests

### ✅ Password Hashing with bcrypt
- bcryptjs for secure password hashing
- Salted hashing with 10 rounds
- Password comparison for login validation

### ✅ Session Storage & Management
- JWT tokens stored in localStorage
- User data cached in localStorage
- Automatic session cleanup on logout
- Session persistence across browser refreshes

### ✅ Smart User Flow
- **Intelligent error detection** - Detects when users don't exist and suggests signup
- **Seamless transitions** - Smooth flow between login and signup pages
- **Context-aware messaging** - Different messaging based on user flow
- **Email validation** - Pre-filled emails are validated before use

## File Structure

```
src/
├── lib/
│   ├── jwt.ts                 # JWT utilities
│   ├── auth-middleware.ts     # API route protection
│   └── api-client.ts          # HTTP client with auto-auth
├── contexts/
│   └── AuthContext.tsx        # Authentication context
├── components/
│   ├── ProtectedRoute.tsx     # Route protection component
│   └── UserMenu.tsx           # User menu with logout
├── app/
│   ├── layout.tsx             # Root layout with AuthProvider
│   ├── login/
│   │   └── page.tsx           # Login page
│   ├── sign-up/
│   │   └── page.tsx           # Registration page
│   ├── homepage/
│   │   └── page.tsx           # Protected homepage
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts      # Login API endpoint
│       │   ├── register/route.ts   # Registration API endpoint
│       │   └── logout/route.ts     # Logout API endpoint
│       └── user/
│           └── profile/route.ts    # Protected user profile API
└── validation/
    └── userRegister.ts        # Zod validation schemas
```

## Environment Variables

Add these to your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/medgenie"
```

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/api/auth/logout`
Logout (clears client-side session).

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### POST `/api/auth/check-email`
Check if an email address is already registered.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "exists": false,
  "message": "Email is available"
}
```

### Protected Endpoints

#### GET `/api/user/profile`
Get user profile data (requires authentication).

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## Usage Examples

### Frontend Authentication

#### Using the AuthContext
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated, isLoading } = useAuth();

  const handleLogin = async () => {
    const result = await login('email@example.com', 'password');
    if (result.success) {
      // Login successful
    } else {
      // Handle error: result.message
    }
  };

  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

#### Protecting Routes
```tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

#### Making Authenticated API Calls
```tsx
import { apiClient } from '@/lib/api-client';

// The API client automatically includes the JWT token
const userData = await apiClient.get('/user/profile');
const updatedUser = await apiClient.put('/user/profile', { name: 'New Name' });
```

### Backend API Protection

#### Protecting API Routes
```tsx
import { withAuth, AuthenticatedRequest } from '@/lib/auth-middleware';

async function handler(req: AuthenticatedRequest) {
  const user = req.user!; // User is guaranteed to exist
  
  // Your protected logic here
  return NextResponse.json({ message: `Hello ${user.name}!` });
}

export const GET = withAuth(handler);
export const POST = withAuth(handler);
```

#### Optional Authentication
```tsx
import { optionalAuth, AuthenticatedRequest } from '@/lib/auth-middleware';

async function handler(req: AuthenticatedRequest) {
  const user = req.user; // May be undefined if not authenticated
  
  if (user) {
    // Authenticated user logic
  } else {
    // Anonymous user logic
  }
  
  return NextResponse.json({ message: 'Hello!' });
}

export const GET = optionalAuth(handler);
```

## Database Schema

The authentication system uses this User model in Prisma:

```prisma
model User {
  id              Int      @id @default(autoincrement())
  name            String 
  email           String   @unique
  password        String 
  confirmpassword String
  createdAt       DateTime @default(now())
}
```

## Security Considerations

1. **JWT Secret**: Use a strong, unique JWT secret in production
2. **HTTPS**: Always use HTTPS in production to protect tokens in transit
3. **Token Expiration**: Tokens expire after 7 days by default
4. **Password Hashing**: Passwords are hashed with bcrypt using 10 salt rounds
5. **Input Validation**: All inputs are validated using Zod schemas
6. **SQL Injection Protection**: Prisma provides built-in SQL injection protection

## Testing the Authentication System

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test Registration:**
   - Navigate to `http://localhost:9003/sign-up`
   - Fill out the registration form
   - Verify successful registration and automatic login

3. **Test Login:**
   - Navigate to `http://localhost:9003/login`
   - Use your registered credentials
   - Verify successful login and redirect to homepage

4. **Test Protected Routes:**
   - Try accessing `http://localhost:9003/homepage` without authentication
   - Should redirect to login page
   - Login and verify access to protected content

5. **Test API Endpoints:**
   ```bash
   # Register a user
   curl -X POST http://localhost:9003/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"John Doe","email":"john@example.com","password":"password123","confirmPassword":"password123"}'

   # Login
   curl -X POST http://localhost:9003/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"john@example.com","password":"password123"}'

   # Access protected endpoint (use token from login response)
   curl -X GET http://localhost:9003/api/user/profile \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

## Error Handling

The authentication system includes comprehensive error handling:

- **Invalid credentials**: Returns 401 with appropriate message
- **Validation errors**: Returns 400 with specific validation messages
- **Expired tokens**: Returns 401 and triggers client-side logout
- **Missing tokens**: Returns 401 for protected routes
- **Server errors**: Returns 500 with error message

## Next Steps

1. **Password Reset**: Implement forgot password functionality
2. **Email Verification**: Add email verification for new accounts
3. **Refresh Tokens**: Implement refresh token rotation for enhanced security
4. **Social Login**: Add OAuth providers (Google, GitHub, etc.)
5. **Role-Based Access**: Implement user roles and permissions
6. **Rate Limiting**: Add rate limiting to authentication endpoints

## Troubleshooting

### Common Issues

1. **"Cannot find name 'localStorage'"**: This error occurs during SSR. The AuthContext handles this by checking `typeof window !== 'undefined'`.

2. **"Invalid or expired token"**: Clear localStorage and login again.

3. **Database connection errors**: Ensure your DATABASE_URL is correct and the database is running.

4. **JWT verification fails**: Check that JWT_SECRET is set in your environment variables.

### Debugging Tips

1. Check browser console for authentication errors
2. Verify JWT tokens using [jwt.io](https://jwt.io)
3. Check Network tab for API request/response details
4. Ensure environment variables are loaded correctly

This completes the comprehensive authentication system integration for Med Genie!
