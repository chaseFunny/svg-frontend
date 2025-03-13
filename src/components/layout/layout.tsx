// src/components/layout/layout.tsx
import React, { ReactNode } from "react";
import Footer from "./footer";
import Header from "./header";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 min-h-[calc(100vh-158px)]">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
