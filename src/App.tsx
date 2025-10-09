import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import BuilderPage from './pages/BuilderPage';
import LayoutGuidePage from './pages/LayoutGuidePage';
import BlocksPage from './pages/BlocksPage';
import { useBuilderStore } from './store/builderStore';

const ThemeManager: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const theme = useBuilderStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}


function App() {
  return (
    <ThemeManager>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/guide" element={<LayoutGuidePage />} />
        <Route path="/blocks" element={<BlocksPage />} />
      </Routes>
    </ThemeManager>
  );
}

export default App;
