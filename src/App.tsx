import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { FloatingTelegram } from './components/FloatingTelegram';
import { LandingPage } from './pages/LandingPage';
import { RegisterPage } from './pages/RegisterPage';
import { OTPVerifyPage } from './pages/OTPVerifyPage';
import { PricingPage } from './pages/PricingPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { SuccessPage } from './pages/SuccessPage';
import { LoginPage } from './pages/LoginPage';
import { MenuPreviewPage } from './pages/MenuPreviewPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { PlanId, BillingCycle } from './types';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  const [searchParams, setSearchParams] = useState<URLSearchParams>(new URLSearchParams(window.location.search));

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSearchParams(new URLSearchParams(window.location.search));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (url: string) => {
    try {
      const [path, search] = url.split('?');
      window.history.pushState({}, '', url);
      setCurrentPath(path);
      setSearchParams(new URLSearchParams(search || ''));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error(e);
    }
  };

  // Route parsing logic
  const renderCurrentView = () => {
    const path = currentPath;

    // Route: /
    if (path === '' || path === '/') {
      return <LandingPage navigate={navigate} />;
    }

    // Route: /register/verify
    if (path === '/register/verify') {
      const plan = (searchParams.get('plan') as PlanId) || 'trial';
      const slug = searchParams.get('slug') || '';
      return <OTPVerifyPage navigate={navigate} plan={plan} slug={slug} />;
    }

    // Route: /register/success
    if (path === '/register/success') {
      const slug = searchParams.get('slug') || 'phnom-penh-bistro';
      const plan = searchParams.get('plan') || 'trial';
      const isPaid = searchParams.get('paid') === 'true';
      return <SuccessPage navigate={navigate} slug={slug} plan={plan} isPaid={isPaid} />;
    }

    // Route: /register
    if (path === '/register') {
      const plan = (searchParams.get('plan') as PlanId) || 'trial';
      const cycle = (searchParams.get('cycle') as BillingCycle) || 'monthly';
      return <RegisterPage navigate={navigate} initialPlan={plan} initialCycle={cycle} />;
    }

    // Route: /pricing
    if (path === '/pricing') {
      return <PricingPage navigate={navigate} />;
    }

    // Route: /checkout/:plan
    if (path.startsWith('/checkout')) {
      const parts = path.split('/').filter(Boolean);
      const planParam = (parts[1] as PlanId) || (searchParams.get('plan') as PlanId) || 'pro';
      const slug = searchParams.get('slug') || '';
      const cycle = (searchParams.get('cycle') as BillingCycle) || 'monthly';
      return <CheckoutPage navigate={navigate} planId={planParam} slug={slug} cycle={cycle} />;
    }

    // Route: /login
    if (path === '/login') {
      return <LoginPage navigate={navigate} />;
    }

    // Route: /admin
    if (path === '/admin') {
      return <AdminDashboardPage navigate={navigate} />;
    }

    // Route: /menu/:slug (Customer Digital Menu)
    if (path.startsWith('/menu')) {
      const parts = path.split('/').filter(Boolean);
      const slug = parts[1] || 'phnom-penh-bistro';
      return <MenuPreviewPage slug={slug} navigate={navigate} />;
    }

    // Fallback: Default to LandingPage
    return <LandingPage navigate={navigate} />;
  };

  const isCustomerMenuView = currentPath.startsWith('/menu');

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900 selection:bg-amber-200 selection:text-amber-950">
      {/* Global Navbar (Hidden in full-screen customer menu view) */}
      {!isCustomerMenuView && <Navbar currentPath={currentPath} navigate={navigate} />}

      {/* Main Page Content */}
      <main className="flex-1">{renderCurrentView()}</main>

      {/* Global Footer (Hidden in customer menu view) */}
      {!isCustomerMenuView && <Footer navigate={navigate} />}

      {/* Floating Telegram Support Button (Stuck on left) */}
      {!isCustomerMenuView && <FloatingTelegram />}
    </div>
  );
}
