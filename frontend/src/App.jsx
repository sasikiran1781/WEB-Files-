import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/public/Home/LandingPage';
import AboutPage from './pages/public/About/AboutPage';
import FeaturesPage from './pages/public/Features/FeaturesPage';
import HowItWorksPage from './pages/public/HowItWorks/HowItWorksPage';
import LoginPage from './pages/public/Auth/LoginPage';
import SignupPage from './pages/public/Auth/SignupPage';
import RoleSelection from './pages/public/Auth/RoleSelection';
import DoctorEnrollment from './pages/public/Auth/DoctorEnrollment';
import ForgotPassword from './pages/public/Auth/ForgotPassword';

// Private Pages
import Dashboard from './pages/app/Dashboard/Dashboard';
import UploadReport from './pages/app/Reports/UploadReport';
import ReportHistory from './pages/app/Reports/ReportHistory';
import ReportDetails from './pages/app/Reports/ReportDetails';
import ComparativeAnalysis from './pages/app/Analysis/ComparativeAnalysis';
import RecoveryPlan from './pages/app/Recovery/RecoveryPlan';
import MedicalData from './pages/app/Medical/MedicalData';
import Settings from './pages/app/Settings/Settings';
import REVABrain from './pages/app/Brain/REVABrain';
import WaterTracking from './pages/app/Water/WaterTracking';
import DailyOverview from './pages/app/Health/DailyOverview';
import NutritionPage from './pages/app/Nutrition/NutritionPage';
import ProfilePage from './pages/app/Profile/ProfilePage';

import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, isInitialized } = useApp();
  
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-stone-600 text-xs font-black uppercase tracking-widest mt-4">Calibrating Workspace...</p>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/doctor-enrollment" element={<DoctorEnrollment />} />
          </Route>

          {/* Standalone auth pages (no navbar/footer) */}
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Private Routes */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="upload" element={<UploadReport />} />
            <Route path="history" element={<ReportHistory />} />
            <Route path="report/:id" element={<ReportDetails />} />
            <Route path="compare" element={<ComparativeAnalysis />} />
            <Route path="care" element={<RecoveryPlan />} />
            <Route path="brain" element={<REVABrain />} />
            <Route path="medical" element={<Navigate to="/app/medical-data" replace />} />
            <Route path="medical-data" element={<MedicalData />} />
            <Route path="settings" element={<Settings />} />
            <Route path="water" element={<WaterTracking />} />
            <Route path="overview" element={<DailyOverview />} />
            <Route path="nutrition" element={<NutritionPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;

