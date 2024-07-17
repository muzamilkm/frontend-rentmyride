import ProfPanel from "./profilepanel";
import ProfNavbar from "../profnavbar";
import { ReactNode } from "react";

type LayoutProps = {
    children: ReactNode;
  };

const Layout = ({children}: LayoutProps) => {
    return (
        <main>
            <ProfNavbar/>
            <div className="flex min-h-screen">
            <ProfPanel/>
            <div className="flex-1 p-4">
                {children}
            </div>
            </div>
        </main>
    )};

export default Layout;