import React, { useEffect, useState } from 'react';
import BuilderPage from './pages/BuilderPage';
import { useBuilderStore, migrateStateToV2 } from './store/builderStore';

const ThemeManager: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const theme = useBuilderStore((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}

const MigrationManager: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isMigrated, setIsMigrated] = useState(false);

  useEffect(() => {
    // This effect runs once on mount to perform the state migration.
    useBuilderStore.setState(migrateStateToV2);
    setIsMigrated(true);
  }, []);

  if (!isMigrated) {
    // You can render a loading spinner here if migration takes time
    return null; 
  }

  return <>{children}</>;
}


function App() {
  return (
    <MigrationManager>
      <ThemeManager>
        <BuilderPage />
      </ThemeManager>
    </MigrationManager>
  );
}

export default App;
