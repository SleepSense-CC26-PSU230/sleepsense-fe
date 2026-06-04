import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import LandingPage from '../pages/LandingPage';
import TeamPage from '../pages/TeamPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import OnboardingPage from '../pages/OnboardingPage';
import HomePage from '../pages/HomePage';
import ScreenPage from '../pages/ScreenPage';
import SleepPage from '../pages/SleepPage';
import HealthPage from '../pages/HealthPage';
import SettingsPage from '../pages/SettingsPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh' }}><p>Memuat...</p></div>;
  return isAuthenticated ? children : <Navigate to="/landing" replace />;
}

function OnboardingGuard({ children }) {
  const { isAuthenticated, isOnboarded, loading } = useAuth();
  if (loading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100dvh' }}><p>Memuat...</p></div>;
  if (!isAuthenticated) return <Navigate to="/landing" replace />;
  if (!isOnboarded) return <Navigate to="/onboarding" replace />;
  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public — tidak butuh login */}
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/team" element={<TeamPage />} />

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Onboarding */}
      <Route path="/onboarding" element={
        <ProtectedRoute><OnboardingPage /></ProtectedRoute>
      } />

      {/* Protected + Onboarded */}
      <Route element={<ProtectedRoute><OnboardingGuard><MainLayout /></OnboardingGuard></ProtectedRoute>}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/screen" element={<ScreenPage />} />
        <Route path="/sleep" element={<SleepPage />} />
        <Route path="/health" element={<HealthPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Root redirect: "/" → landing atau home */}
      <Route path="/" element={<Navigate to="/landing" replace />} />
      <Route path="*" element={<Navigate to="/landing" replace />} />
    </Routes>
  );
}
