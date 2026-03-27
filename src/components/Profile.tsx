import { useNavigate } from 'react-router';
import { User, Mail, Phone, MapPin, Calendar, Bell, Lock, CreditCard, LogOut, Edit2, Camera, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 98765 43210',
    location: 'Indore, Madhya Pradesh',
    joinDate: 'January 2026'
  });

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const stats = [
    { label: 'Total Bookings', value: '12' },
    { label: 'Places Visited', value: '8' },
    { label: 'Reviews', value: '5' },
    { label: 'Travel Points', value: '850' }
  ];

  const menuItems = [
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Manage your alerts',
      action: () => {}
    },
    {
      icon: CreditCard,
      label: 'Payment Methods',
      description: 'Manage cards and payments',
      action: () => {}
    },
    {
      icon: Lock,
      label: 'Privacy & Security',
      description: 'Password and security settings',
      action: () => {}
    },
    {
      icon: LogOut,
      label: 'Logout',
      description: 'Sign out of your account',
      action: handleLogout,
      danger: true
    }
  ];

  return (
    <div className="p-4 lg:p-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account settings</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            {/* Avatar */}
            <div className="relative mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="absolute bottom-0 right-1/2 transform translate-x-12 translate-y-1 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-all">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-xl text-gray-900 mb-1">{userData.name}</h2>
              <p className="text-gray-600">{userData.email}</p>
              <p className="text-sm text-gray-500 mt-2">Member since {userData.joinDate}</p>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition-all duration-300 mb-4 hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl text-indigo-600 mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl text-gray-900">Personal Information</h2>
              {isEditing && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  Save Changes
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={userData.location}
                    onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl text-gray-900 mb-6">Preferences</h2>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive booking updates via email</p>
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-600">Get alerts on your device</p>
                  </div>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Promotional Emails</p>
                    <p className="text-sm text-gray-600">Receive offers and news</p>
                  </div>
                </div>
                <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded" />
              </label>
            </div>
          </div>

          {/* Settings Menu */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl text-gray-900">Settings</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className={`w-full flex items-center gap-4 p-6 transition-all duration-300 text-left group ${
                      item.danger ? 'hover:bg-red-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                      item.danger ? 'bg-red-100 group-hover:bg-red-200' : 'bg-gray-100 group-hover:bg-indigo-100'
                    }`}>
                      <Icon className={`w-6 h-6 transition-colors duration-300 ${item.danger ? 'text-red-600' : 'text-gray-600 group-hover:text-indigo-600'}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium transition-colors duration-300 ${item.danger ? 'text-red-600' : 'text-gray-900 group-hover:text-indigo-600'}`}>
                        {item.label}
                      </p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <ArrowRight className={`w-5 h-5 transition-all duration-300 group-hover:translate-x-1 ${item.danger ? 'text-red-400' : 'text-gray-400 group-hover:text-indigo-600'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}