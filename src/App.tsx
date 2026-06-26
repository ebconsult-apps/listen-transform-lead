
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import { initGoogleAds, trackPageView } from "@/utils/analytics";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import Resources from "./pages/Resources";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import GetTheBook from "./pages/GetTheBook";
import Framework from "./pages/Framework";
import Methodology from "./pages/Methodology";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import ThankYou from "./pages/ThankYou";
import CookieConsent from "./components/CookieConsent";
import OrganizationalChange from "./pages/landing/OrganizationalChange";
import ClearWhitepaper from "./pages/landing/ClearWhitepaper";
import Sustainability from "./pages/landing/Sustainability";
import ChangeManagement from "./pages/landing/ChangeManagement";
import LeadershipDevelopment from "./pages/landing/LeadershipDevelopment";
import OrganizationalPsychology from "./pages/landing/OrganizationalPsychology";
import MergerIntegration from "./pages/landing/MergerIntegration";
import BookingConfirmation from "./pages/BookingConfirmation";
import BookCall from "./pages/BookCall";
import Assessment from "./pages/Assessment";
import ChangeManagementStockholm from "./pages/niche/ChangeManagementStockholm";
import ChangeManagementEurope from "./pages/niche/ChangeManagementEurope";
import OrganizationalPsychologyConsulting from "./pages/niche/OrganizationalPsychologyConsulting";
import ManufacturingChangeManagement from "./pages/niche/ManufacturingChangeManagement";
import HealthcareChangeManagement from "./pages/niche/HealthcareChangeManagement";
import SustainabilityChangeManagement from "./pages/niche/SustainabilityChangeManagement";
import MergerIntegrationConsulting from "./pages/niche/MergerIntegrationConsulting";
import ChangeManagementService from "./pages/services/ChangeManagementService";
import LeadershipDevelopmentService from "./pages/services/LeadershipDevelopmentService";
import ExecutiveCoachingService from "./pages/services/ExecutiveCoachingService";
import PsychometricAssessmentsService from "./pages/services/PsychometricAssessmentsService";
import WorkshopsService from "./pages/services/WorkshopsService";
import Insights from "./pages/Insights";
import SpeakingService from "./pages/services/SpeakingService";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ProductLayout from "@/components/product/ProductLayout";
import ProductLanding from "./pages/product/ProductLanding";
import Sample from "./pages/product/Sample";
import Pricing from "./pages/product/Pricing";
import Login from "./pages/product/Login";
import Signup from "./pages/product/Signup";
import AuthCallback from "./pages/product/AuthCallback";
import Dashboard from "./pages/app/Dashboard";
import NewProject from "./pages/app/NewProject";
import ProjectDetail from "./pages/app/ProjectDetail";
import Account from "./pages/app/Account";
import RespondentPortal from "./pages/respond/RespondentPortal";
import DevPanel from "@/components/dev/DevPanel";
import { DEV_ACCESS_ENABLED } from "@/lib/dev/config";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function RouteTracker() {
  const location = useLocation();
  useEffect(() => {
    initGoogleAds();
  }, []);
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteTracker />
          <AuthProvider>
          <Routes>
            {/* Self-serve product — auth (standalone, no chrome) */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Public respondent portal — no account, tokenized link, no app chrome */}
            <Route path="/respond/:token" element={<RespondentPortal />} />

            {/* Self-serve product — landing, pricing, and gated app share ProductLayout */}
            <Route element={<ProductLayout />}>
              <Route path="/product" element={<ProductLanding />} />
              <Route path="/product/sample" element={<Sample />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/app" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/app/projects/new" element={<ProtectedRoute><NewProject /></ProtectedRoute>} />
              <Route path="/app/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
              <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
              {/* Billing folded into /account; keep the path as a redirect for old links. */}
              <Route path="/account/billing" element={<Navigate to="/account" replace />} />
            </Route>

            {/* Landing pages - no Layout wrapper (no nav/footer) */}
            <Route path="/lp/organizational-change" element={<OrganizationalChange />} />
            <Route path="/lp/clear-whitepaper" element={<ClearWhitepaper />} />
            <Route path="/lp/sustainability" element={<Sustainability />} />
            <Route path="/lp/change-management" element={<ChangeManagement />} />
            <Route path="/lp/leadership-development" element={<LeadershipDevelopment />} />
            <Route path="/lp/organizational-psychology" element={<OrganizationalPsychology />} />
            <Route path="/lp/merger-integration" element={<MergerIntegration />} />

            {/* Main site with Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="about" element={<About />} />
              <Route path="resources" element={<Resources />} />
              <Route path="services" element={<Services />} />
              <Route path="contact" element={<Contact />} />
              <Route path="get-the-book" element={<GetTheBook />} />
              <Route path="framework" element={<Framework />} />
              <Route path="methodology" element={<Methodology />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="book-call" element={<BookCall />} />
              <Route path="booking-confirmed" element={<BookingConfirmation />} />
              <Route path="thank-you" element={<ThankYou />} />
              <Route path="assessment" element={<Assessment />} />
              <Route path="services/change-management" element={<ChangeManagementService />} />
              <Route path="services/leadership-development" element={<LeadershipDevelopmentService />} />
              <Route path="services/executive-coaching" element={<ExecutiveCoachingService />} />
              <Route path="services/psychometric-assessments" element={<PsychometricAssessmentsService />} />
              <Route path="services/workshops" element={<WorkshopsService />} />
              <Route path="services/speaking" element={<SpeakingService />} />
              <Route path="insights" element={<Insights />} />
              <Route path="consulting/change-management-stockholm" element={<ChangeManagementStockholm />} />
              <Route path="consulting/change-management-europe" element={<ChangeManagementEurope />} />
              <Route path="consulting/organizational-psychology-consulting" element={<OrganizationalPsychologyConsulting />} />
              <Route path="consulting/manufacturing-change-management" element={<ManufacturingChangeManagement />} />
              <Route path="consulting/healthcare-change-management" element={<HealthcareChangeManagement />} />
              <Route path="consulting/sustainability-change-management" element={<SustainabilityChangeManagement />} />
              <Route path="consulting/merger-integration-consulting" element={<MergerIntegrationConsulting />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          </AuthProvider>
          <CookieConsent />
          {DEV_ACCESS_ENABLED && <DevPanel />}
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
