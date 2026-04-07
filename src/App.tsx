
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
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
import CookieConsent from "./components/CookieConsent";
import OrganizationalChange from "./pages/landing/OrganizationalChange";
import ClearWhitepaper from "./pages/landing/ClearWhitepaper";
import Sustainability from "./pages/landing/Sustainability";
import BookingConfirmation from "./pages/BookingConfirmation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Landing pages - no Layout wrapper (no nav/footer) */}
            <Route path="/lp/organizational-change" element={<OrganizationalChange />} />
            <Route path="/lp/clear-whitepaper" element={<ClearWhitepaper />} />
            <Route path="/lp/sustainability" element={<Sustainability />} />

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
