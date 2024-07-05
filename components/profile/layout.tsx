import ProfPanel from "./profilepanel";
import ProfNavbar from "../profnavbar";

const Layout = ({children}) => {
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