import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import CompanyPublicProfile from './features/companies/pages/CompanyPublicProfile';
import HrDashboardLayout from './features/hr/layout/HrDashboardLayout';
import CandidateDiscovery from './features/hr/pages/CandidateDiscovery';
import CompanyProfile from './features/hr/pages/CompanyProfile';
import CreateJob from './features/hr/pages/CreateJob';
import HrDashboard from './features/hr/pages/HrDashboard';
import JobListing from './features/hr/pages/JobListing';
import InterestAssessment from './features/student/pages/InterestAssessment';
import KnowledgeCheck from './features/student/pages/KnowledgeCheck';
import Portfolio from './features/student/pages/Portfolio';
import SelfAssessment from './features/student/pages/SelfAssessment';
import LandingPage from './pages/LandingPage';

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
