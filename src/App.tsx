import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import BuilderPage from './pages/BuilderPage';
import LayoutGuidePage from './pages/LayoutGuidePage';
import ImporterGuidePage from './pages/ImporterGuidePage';
import ImporterPage from './pages/ImporterPage';
import TemplatesPage from './pages/TemplatesPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/builder" element={<BuilderPage />} />
      <Route path="/guide" element={<LayoutGuidePage />} />
      <Route path="/importer-guide" element={<ImporterGuidePage />} />
      <Route path="/importer" element={<ImporterPage />} />
      <Route path="/templates" element={<TemplatesPage />} />
    </Routes>
  );
}

export default App;
