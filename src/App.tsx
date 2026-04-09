
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import { trackPageView } from "@/utils/analytics";
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

const queryClient = new QueryClient();

function RouteTracker() {
  const location = useLocation();
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
          <Routes>
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
          <CookieConsent />
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
