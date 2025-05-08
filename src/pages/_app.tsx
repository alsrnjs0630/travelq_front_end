import 'bootstrap/dist/css/bootstrap.min.css';
import "@/styles/globals.css";
import type {AppProps} from "next/app";
import MainLayout from "@/component/MainLayout";
import {store} from "@/store/store"
import {Provider} from "react-redux";

export default function App({Component, pageProps}: AppProps) {
    return (
        <Provider store={store}>
            <MainLayout>
                <Component {...pageProps} />
            </MainLayout>
        </Provider>
    );
}
