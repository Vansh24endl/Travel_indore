import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Landing } from './components/Landing';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { Explore } from './components/Explore';
import { DestinationDetail } from './components/DestinationDetail';
import { Bookings } from './components/Bookings';
import { BookingDetail } from './components/BookingDetail';
import { Profile } from './components/Profile';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Landing },
      { path: 'login', Component: Login },
      { path: 'register', Component: Register },
      { path: 'dashboard', Component: Dashboard },
      { path: 'explore', Component: Explore },
      { path: 'destination/:id', Component: DestinationDetail },
      { path: 'bookings', Component: Bookings },
      { path: 'booking/:id', Component: BookingDetail },
      { path: 'profile', Component: Profile },
    ],
  },
]);
