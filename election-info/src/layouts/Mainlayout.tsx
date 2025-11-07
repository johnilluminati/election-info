import { useState, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import { FaTimes } from "react-icons/fa"

const Mainlayout = () => {
  const { pathname } = useLocation();

  // Check sessionStorage synchronously on initial render to avoid flash
  // sessionStorage automatically clears when the tab/browser is closed
  const [isAnnouncementDismissed, setIsAnnouncementDismissed] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('announcementDismissed') === 'true';
    }
    return false;
  });

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleDismiss = () => {
    setIsAnnouncementDismissed(true);
    // Store in sessionStorage - will be cleared when tab/browser closes
    sessionStorage.setItem('announcementDismissed', 'true');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="w-full">
        <div className="container mx-auto my-8 px-2 sm:px-4 md:px-6 lg:px-8">
          {!isAnnouncementDismissed && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border rounded-sm border-amber-200 dark:border-amber-800 mb-8">
              <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
                      Please note that this is a <strong>proof-of-concept</strong> website. All data shown is dummy data for testing and demo purposes only.
                    </p>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className="flex-shrink-0 text-amber-800 dark:text-amber-200 hover:text-amber-900 dark:hover:text-amber-100 transition-colors"
                    aria-label="Dismiss announcement"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Mainlayout