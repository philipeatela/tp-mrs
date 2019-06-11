import React from 'react';
import "./LayoutBasis.css";

export const LayoutBasis = ({ children }) => {
  return (
    <main className="Layout">
      {children}
    </main>
  );
};

export default LayoutBasis;