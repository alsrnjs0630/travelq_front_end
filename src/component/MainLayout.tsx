import MainHeader from './MainHeader';
import MainFooter from "./MainFooter";

interface LayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({children} : LayoutProps) {
    return(
        <div>
            <MainHeader/>
            <main>
                {children}
            </main>
            <MainFooter/>
        </div>
    );
}