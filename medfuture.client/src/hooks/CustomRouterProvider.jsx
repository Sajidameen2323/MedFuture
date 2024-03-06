/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import {
    Link,
    Outlet,
    RouterProvider,
    createBrowserRouter,
    redirect,

} from "react-router-dom";
import { FirebaseAuthContext } from "../context/FirebaseAuthProvider";
import Login from "../pages/Authentication/Login";
import Weather from "../pages/Weather";
import SignUp from "../pages/Authentication/Signup";
import SendVerificationMail from "../pages/Authentication/SendVerficationMail";
import { LoginLoader } from "../middlewares/RouteLoaders";

function CustomRouterProvider() {
    const { currentUser, loading, logout } = useContext(FirebaseAuthContext);


    const router = createBrowserRouter([
        {
            id: "root",
            path: "/",
            loader() {
                // Our root route always provides the user, if logged in
                return { user: currentUser };
            },
            Component: Layout,
            children: [
                {
                    index: true,
                    Component: Weather,
                },
                {
                    path: "protected",
                    loader: protectedLoader,
                    Component: ProtectedPage,
                },
            ],
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
                    Component: SignUp,
                
                },
                {
                    path: 'verify-email',
                    loader: VerificationMailLoader,
                    Component: SendVerificationMail
                }
            ],
        },
        {
            id: "dashboard",
            path: '/dashboard',
            loader: protectedLoader,
            Component: GetUserDashboard

        },

    ]);

    async function loginLoader() {

        if (currentUser) {
            return redirect("/dashboard");
        }
        return null;
    }

    function protectedLoader({ request, params }) {

        console.log(request);
        console.log(params);

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


function Layout() {
    const { logout, currentUser } = useContext(FirebaseAuthContext);
    return (
        <React.Fragment>
          <h4>Welcome!!</h4>
            <ul style={{ listStyle:'none' }}>
                <li>
                    <Link to="/">Public Page</Link>
                </li>
                {!currentUser && <>
                    <li>
                        <Link to="/auth/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/auth/signup">Sign Up</Link>
                    </li>

                </>}

                <li>
                    <Link to="/protected">Protected Page</Link>
                </li>
            </ul>
            {currentUser && <button onClick={async () => {
                await logout()
            }}>Logout</button> }


            <Outlet />
        </React.Fragment>
    );
}

function GetUserDashboard() {
    const { currentUser, logout } = useContext(FirebaseAuthContext);

    if (currentUser && currentUser?.role === "Admin") {

        return (<div>

            <h5> Ayo, Admin Wassup Homie!!</h5>
            {currentUser && <button onClick={async () => {
                await logout()
            }}>Logout</button>}
        </div>)
    }
    else if (currentUser && currentUser?.role === "Patient") {

        return (<div>

            <h5> Ayo, Patine Whats Good Nyaggaa!!</h5>
            {currentUser && <button onClick={async () => {
                await logout()
            }}>Logout</button>}
        </div>)
    }
    else {
        return (<div>

            Dafuq Are ye Nyaggaaa!! {JSON.stringify(currentUser) }
        </div>)
    }
}

function ProtectedPage() {
    return <h3>Protected</h3>;
}

export default CustomRouterProvider;