/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import {
    RouterProvider,
    createBrowserRouter,
    redirect,
} from "react-router-dom";
import { FirebaseAuthContext } from "./FirebaseAuthProvider";
import MainLayout from "../layout/MainLayout";
import WelcomePage from "../pages/WelcomePage";

import Login from '../pages/Authentication/Login';
import Register from "../pages/Authentication/Register";
import Weather from "../pages/Weather";

import NotFound from "../pages/ErrorPages/NotFound";
import EmailVerification from "../pages/Authentication/EmailVerification";

function CustomRouterProvider() {
    const { currentUser, loading, logout } = useContext(FirebaseAuthContext);


    const router = createBrowserRouter([
        {
            id: "root",
            path: "/",
            loader: () => { return 6 },
            errorElement:<NotFound />,
            children: [
                {
                    index: true,
                    Component: WelcomePage,
                    loader: () => { return { currentUser } }
                },
 

            ],
        },
        {
            id: "dashboard",
            path: '/dashboard',
            loader: protectedLoader,
            Component: MainLayout,
            children: [
                {
                    index: true,
                    loader: protectedLoader,
                    Component: Weather,
                },
                {
                    path: "overview",
                    loader: protectedLoader,
                    Component: Weather,
                }

            ]
        },
        {
            path: "/logout",
            async action() {
                // We signout in a "resource route" that we can hit from a fetcher.Form
                await logout()
                return redirect("/");
            },
        },
        {
            id: "auth",
            path: "/auth",
            children: [
                {
                    path: 'login',
                    loader: loginLoader,
                    Component: Login
                },
                {
                    path: 'signup',
                    loader: loginLoader,
                    Component: Register,

                },
                {
                    path: 'verify-email',
                    loader: VerificationMailLoader,
                    Component: EmailVerification
                }
            ],
        },

    ]);

    async function loginLoader() {

        if (currentUser) {
            return redirect("/dashboard");
        }
        return null;
    }

    function protectedLoader({ request, params }) {

        if (!currentUser) {
            let params = new URLSearchParams();
            params.set("from", new URL(request.url).pathname);
            return redirect("/auth/login?" + params.toString());
        }
        else if (currentUser && !currentUser.email_verified) {
            let params = new URLSearchParams();
            params.set("from", new URL(request.url).pathname);
            return redirect("/auth/verify-email?" + params.toString());
        }
        return null;
    }

    function VerificationMailLoader({ request }) {

        if (!currentUser) {
            let params = new URLSearchParams();
            params.set("from", new URL(request.url).pathname);
            return redirect("/auth/login?" + params.toString());
        }
        else if (currentUser && currentUser.email_verified) {

            return redirect("/dashboard");
        }
        return null;

    }

    return (
        <RouterProvider router={router} />
    )
}

function Dummy() {


    return (

        <div>

        <h5>Hello There!</h5>

        </div>
    )

}

function GetUserDashboard() {
    const { currentUser, logout } = useContext(FirebaseAuthContext);

    if (currentUser && currentUser?.role === "Admin") {

        return (<MainLayout />)
    }
    else if (currentUser && currentUser?.role === "Patient") {

        return (<div style={{ width: '100%', height: '100vh' }}>
      
                <h5> Ayo, Patine Whats Good Nyaggaa!!</h5>


                {currentUser && <button onClick={async () => {
                    await logout()
                }}>Logout</button>}
          
        </div>)
    }
    else {
        return (<div>

            Dafuq Are ye Nyaggaaa!! {JSON.stringify(currentUser)}
        </div>)
    }
}

function ProtectedPage() {
    return <h3>Protected</h3>;
}

export default CustomRouterProvider;