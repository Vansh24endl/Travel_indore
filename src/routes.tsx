import { createBrowserRouter } from 'react-router'
import { Layout } from './components/Layout'
import { Landing } from './components/Landing'
import { Login } from './components/Login'
import { Register } from './components/Register'
import { Dashboard } from './components/Dashboard'
import { Explore } from './components/Explore'
import { DestinationDetail } from './components/DestinationDetail'
import { Bookings } from './components/Bookings'
import { BookingDetail } from './components/BookingDetail'
import { Profile } from './components/Profile'
import { AIAssistant } from './components/AIAssistant'
import { ForgotPassword } from './components/ForgotPassword'
import { ResetPassword } from './components/ResetPassword'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'
import { AdminDashboard } from './components/admin/AdminDashboard'
import { AdminUsers } from './components/admin/AdminUsers'
import { AdminDestinations } from './components/admin/AdminDestinations'
import { AdminBookings } from './components/admin/AdminBookings'
import { AdminReviews } from './components/admin/AdminReviews'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Landing },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: 'forgot-password', Component: ForgotPassword },
      { path: 'reset-password', Component: ResetPassword },
      
      // Protected User Routes
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', Component: Dashboard },
          { path: 'explore', Component: Explore },
          { path: 'destination/:id', Component: DestinationDetail },
          { path: 'bookings', Component: Bookings },
          { path: 'booking/:id', Component: BookingDetail },
          { path: 'profile', Component: Profile },
          { path: 'ai-assistant', Component: AIAssistant },
        ]
      },

      // Protected Admin Routes
      {
        element: <AdminRoute />,
        children: [
          { path: 'admin', Component: AdminDashboard },
          { path: 'admin/users', Component: AdminUsers },
          { path: 'admin/destinations', Component: AdminDestinations },
          { path: 'admin/bookings', Component: AdminBookings },
          { path: 'admin/reviews', Component: AdminReviews },
        ]
      }
    ],
  },
])
