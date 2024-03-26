/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, lazy } from "react";
import {
    RouterProvider,
    createBrowserRouter,
    redirect,
    useSearchParams
} from "react-router-dom";
import { FirebaseAuthContext } from "./FirebaseAuthProvider";
import Loadable from 'components/Loadable';

// Import components and pages

import MainLayout from "../layout/MainLayout";

const WelcomePage = Loadable(lazy(() => import("pages/WelcomePage")));
const Login = Loadable(lazy(() => import('pages/Authentication/Login')));
const Register = Loadable(lazy(() => import("../pages/Authentication/Register")));
const Weather = Loadable(lazy(() => import("../pages/Weather")));
const NotFound = Loadable(lazy(() => import("../pages/ErrorPages/NotFound")));
const EmailVerification = Loadable(lazy(() => import("../pages/Authentication/EmailVerification")));
const AddMedicalServiceForm = Loadable(lazy(() => import("../pages/Admin/Service/Add")));
const AddDoctor = Loadable(lazy(() => import("../pages/Admin/Doctor/AddDoctor")));
const ListDoctors = Loadable(lazy(() => import("pages/Admin/Doctor/ListDoctors")));
const ListServices = Loadable(lazy(() => import("pages/Admin/Service/List")));

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
            id: "account",
            path: '/account',
            //loader: protectedLoader,
            Component: MainLayout,
            children: [
                {
                    index: true,
                    loader: protectedLoader,
                    Component: Weather,
                },
                // admin routes
                {
                    path: "overview",
                    loader: protectedLoader,
                    Component: Weather,
                },
                {
                    path: 'add-service',
                    loader: protectedLoader,
                    Component: AddMedicalServiceForm
                },
                {
                    path: 'services',
                    loader: protectedLoader,
                    Component: ListServices
                },
                {
                    path: 'add-doctor',
                    loader: protectedLoader,
                    Component: AddDoctor
                },
                {
                    path: 'doctors',
                    loader: adminOnlyLoader,
                    Component: ListDoctors
                },

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

    async function loginLoader({ request, params }) {

        if (currentUser) {

            const fromValue = getQueryValue(window.location.href, "from");
            //console.log(fromValue);
            return redirect((fromValue || '/'));
    
        }
        return null;
    }
    // Function to parse the query string
    function getQueryValue(url, key) {
        const queryString = url.split('?')[1];
        if (!queryString) {
            return null;
        }

        const params = new URLSearchParams(queryString);
        return params.get(key);
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

    function adminOnlyLoader({ request, params }) {

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
        else if (currentUser && currentUser?.role != "Admin") {

            return redirect("/not-found")
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

            const fromValue = getQueryValue(window.location.href, "from");
            //console.log(fromValue);
            return redirect((fromValue || '/'));
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