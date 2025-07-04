import React from 'react';
import '../theme/palettes.css';

// PUBLIC_INTERFACE
export const ThemeProvider = ({ children }) => {
  // Future theme toggle could be handled here
  // For now just apply main palette and fonts globally
  React.useEffect(() => {
    document.body.style.background = 'var(--background-gradient)';
    document.body.style.fontFamily = "var(--font-body)";
  }, []);

  return <>{children}</>;
};
