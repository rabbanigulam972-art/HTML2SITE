import { useEffect, useState } from "react";
import Navbar, { type TabId } from "./components/Navbar";
import HomeTab from "./components/HomeTab";
import FeaturesTab from "./components/FeaturesTab";
import AboutTab from "./components/AboutTab";
import Footer from "./components/Footer";

export default function App() {
  const [tab, setTab] = useState<TabId>("home");

  // Keep the active tab in the URL hash so it survives reloads
  useEffect(() => {
    const fromHash = window.location.hash.replace("#", "") as TabId;
    if (["home", "features", "about"].includes(fromHash)) {
      setTab(fromHash);
    }
  }, []);

  const changeTab = (next: TabId) => {
    setTab(next);
    window.location.hash = next;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Navbar active={tab} onChange={changeTab} />
      <main className="flex-1">
        {tab === "home" && <HomeTab />}
        {tab === "features" && <FeaturesTab />}
        {tab === "about" && <AboutTab onNavigate={changeTab} />}
      </main>
      <Footer />
    </div>
  );
}
