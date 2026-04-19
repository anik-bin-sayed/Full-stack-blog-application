import { type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Header";
import Footer from "./footer";
import ScrollToTop from "../ScrollToTop";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const hideFooterRoutes = ["/notifications", "/blogs/create"];
  const hideFooter =
    hideFooterRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/blog/details/");

  return (
    <>
      <Navbar />
      <ScrollToTop />

      {children}

      {!hideFooter && <Footer />}
    </>
  );
};

export default Layout;
