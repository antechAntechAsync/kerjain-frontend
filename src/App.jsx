import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import LoginPage from './features/auth/pages/LoginPage';
import HrDashboardLayout from './features/hr/layout/HrDashboardLayout';
import HrDashboard from './features/hr/pages/HrDashboard';
import CompanyProfile from './features/hr/pages/CompanyProfile';
import JobListing from './features/hr/pages/JobListing';
import CreateJob from './features/hr/pages/CreateJob';
import CandidateDiscovery from './features/hr/pages/CandidateDiscovery';
import CompanyPublicProfile from './features/companies/pages/CompanyPublicProfile';
import InterestAssessment from './features/student/pages/InterestAssessment';
import KnowledgeCheck from './features/student/pages/KnowledgeCheck';
import SelfAssessment from './features/student/pages/SelfAssessment';
import Portfolio from './features/student/pages/Portfolio';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
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

          {/* Student Routes */}
          <Route path="/student">
            <Route path="interest" element={<InterestAssessment />} />
            <Route path="knowledge-check" element={<KnowledgeCheck />} />
            <Route path="self-assessment" element={<SelfAssessment />} />
            <Route path="portfolio" element={<Portfolio />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
