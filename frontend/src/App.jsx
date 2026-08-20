// Application routes
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import AICompanion from "./components/AICompanion";
import CareerInsights from "./components/CareerInsights";
import About from "./components/About";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Resume from "./pages/Resume";
import ResumeBuilder from "./pages/ResumeBuilder";
import Applications from "./pages/Applications";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import CareerRoadmap from "./pages/CareerRoadmap";
import JobMatch from "./pages/JobMatch";
import Interviews from "./pages/Interviews";
import Analytics from "./pages/Analytics";
import Skills from "./pages/Skills";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function Home() {
    return (
        <>
            <Navbar />

            <main>
                <Hero />
                <Features />
                <HowItWorks />
                <AICompanion />
                <CareerInsights />
                <About />
                <CTA />
            </main>

            <Footer />
        </>
    );
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />

            <Route
               path="/reset-password"
              element={<ResetPassword />}
           />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Dashboard />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="resume" element={<Resume />} />
                <Route path="resume-builder" element={<ResumeBuilder />} />
                <Route path="career-roadmap" element={<CareerRoadmap />} />
                <Route path="applications" element={<Applications />} />
                <Route path="job-match" element={<JobMatch />} />
                <Route path="interviews" element={<Interviews />} />
                <Route path="ai-insights" element={<Analytics />} />
                <Route path="skills" element={<Skills />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    );
}

export default App;