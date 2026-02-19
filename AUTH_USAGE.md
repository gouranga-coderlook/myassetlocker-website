# Authentication Popup Usage Guide

This guide explains how to use the authentication popup feature in your application.

## Overview

The authentication popup is a Google One Tap-style popup that appears when users need to authenticate. It automatically closes after successful authentication, allowing users to continue their tasks seamlessly.

## Features

- ✅ Modern popup UI similar to Google One Tap
- ✅ Login and Signup forms
- ✅ Google OAuth integration (ready for implementation)
- ✅ Automatic popup close after successful authentication
- ✅ Smooth animations using Framer Motion
- ✅ Responsive design
- ✅ Integrated with Redux state management

## Basic Usage

### 1. Trigger the Auth Popup

To open the authentication popup from any component, use the `useAuth` hook:

```tsx
import { useAuth } from "@/lib/hooks/useAuth";

function MyComponent() {
  const { openAuthPopup, isAuthenticated, user } = useAuth();

  const handleProtectedAction = () => {
    if (!isAuthenticated) {
      openAuthPopup(); // Opens the popup
    } else {
      // User is authenticated, proceed with action
      performAction();
    }
  };

  return (
    <button onClick={handleProtectedAction}>
      {isAuthenticated ? `Hello, ${user?.name}` : "Sign In"}
    </button>
  );
}
```

### 2. Check Authentication Status

```tsx
import { useAuth } from "@/lib/hooks/useAuth";

function ProtectedComponent() {
  const { isAuthenticated, user, token } = useAuth();

  if (!isAuthenticated) {
    return <div>Please sign in to continue</div>;
  }

  return <div>Welcome, {user?.name}!</div>;
}
```

### 3. Sign Out

```tsx
import { useAuth } from "@/lib/hooks/useAuth";

function LogoutButton() {
  const { signOut } = useAuth();

  return (
    <button onClick={signOut}>
      Sign Out
    </button>
  );
}
```

## API Integration

The authentication service is located at `lib/api/authService.ts`. Update the API endpoints to match your backend:

```typescript
// lib/api/authService.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

// Update these endpoints:
- `${API_BASE_URL}/auth/login`
- `${API_BASE_URL}/auth/signup`
- `${API_BASE_URL}/auth/google`
```

### Expected API Response Format

Your API should return responses in this format:

```typescript
{
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}
```

## Example: Protect a Route or Action

```tsx
"use client";
import { useAuth } from "@/lib/hooks/useAuth";
import { useState } from "react";

function BookingButton() {
  const { isAuthenticated, openAuthPopup } = useAuth();
  const [isBooking, setIsBooking] = useState(false);

  const handleBook = async () => {
    if (!isAuthenticated) {
      openAuthPopup(); // Show popup if not authenticated
      return;
    }

    // User is authenticated, proceed with booking
    setIsBooking(true);
    try {
      // Your booking logic here
      await createBooking();
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <button onClick={handleBook} disabled={isBooking}>
      {isBooking ? "Booking..." : "Book Now"}
    </button>
  );
}
```

## Example: Auto-trigger Popup on Page Load

```tsx
"use client";
import { useAuth } from "@/lib/hooks/useAuth";
import { useEffect } from "react";

function ProtectedPage() {
  const { isAuthenticated, openAuthPopup } = useAuth();

  useEffect(() => {
    // Show popup automatically if user is not authenticated
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        openAuthPopup();
      }, 1000); // Show after 1 second

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, openAuthPopup]);

  return <div>Protected Content</div>;
}
```

## Redux State

The authentication state is managed in Redux:

```typescript
{
  auth: {
    token: string | undefined;
    user: {
      id?: string;
      email?: string;
      name?: string;
    } | null;
    showAuthPopup: boolean;
    isLoading: boolean;
  }
}
```

## Customization

### Styling

The popup styles can be customized in `components/AuthPopup.tsx`. The component uses Tailwind CSS and follows your brand colors (`#f8992f`, `#ea9637`, etc.).

### Popup Behavior

To modify when the popup appears or how it behaves, edit:
- `components/AuthPopup.tsx` - Popup component logic
- `store/slices/authSlice.ts` - State management
- `lib/hooks/useAuth.ts` - Hook logic

## Notes

- The popup automatically hides when a user is already authenticated
- The popup closes automatically after successful authentication
- Loading states are handled automatically during API calls
- Error messages are displayed via toast notifications
- The popup is globally available through the Providers component

