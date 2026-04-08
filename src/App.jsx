import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './features/auth/pages/LoginPage';
import HrDashboardLayout from './features/hr/layout/HrDashboardLayout';
import HrDashboard from './features/hr/pages/HrDashboard';
import CompanyProfile from './features/hr/pages/CompanyProfile';
import JobListing from './features/hr/pages/JobListing';
import CreateJob from './features/hr/pages/CreateJob';
import CandidateDiscovery from './features/hr/pages/CandidateDiscovery';
import CompanyPublicProfile from './features/companies/pages/CompanyPublicProfile';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/hr" replace />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/company/public" element={<CompanyPublicProfile />} />
        
        {/* Protected Routes Scope */}
        <Route element={<ProtectedRoute />}>
          <Route path="/hr" element={<HrDashboardLayout />}>
            <Route index element={<HrDashboard />} />
            <Route path="jobs" element={<JobListing />} />
            <Route path="jobs/create" element={<CreateJob />} />
            <Route path="jobs/:jobId/candidates" element={<CandidateDiscovery />} />
            <Route path="company" element={<CompanyProfile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
