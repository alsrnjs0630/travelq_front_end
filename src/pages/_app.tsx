import 'bootstrap/dist/css/bootstrap.min.css';
import "@/styles/globals.css";
import type {AppProps} from "next/app";
import MainLayout from "@/component/MainLayout";

export default function App({Component, pageProps}: AppProps) {
    return (
        <MainLayout>
            <Component {...pageProps} />
        </MainLayout>
    );
}
