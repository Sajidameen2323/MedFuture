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
            path: "/login",
            loader: loginLoader,
            Component: Login,

        }
    ]);

    async function loginLoader() {

        if (currentUser) {
            
           // return redirect("/");
        }
        return null;
    }
    function protectedLoader({ request }) {
        // If the user is not logged in and tries to access `/protected`, we redirect
        // them to `/login` with a `from` parameter that allows login to redirect back
        // to this page upon successful authentication
        if (!currentUser) {
            let params = new URLSearchParams();
            params.set("from", new URL(request.url).pathname);
            return redirect("/login?" + params.toString());
        }
        return null;
    }

    return (
        <RouterProvider router={router} />
    )
}


function Layout() {
    const { logout } = useContext(FirebaseAuthContext);
    return (
        <React.Fragment>
          <h4>Welcome!!</h4>
            <ul style={{ listStyle:'none' }}>
                <li>
                    <Link to="/">Public Page</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/protected">Protected Page</Link>
                </li>
            </ul>
            <button onClick={async()=>{
                await logout()
            }}>Logout</button>

            <Outlet />
        </React.Fragment>
    );
}


function ProtectedPage() {
    return <h3>Protected</h3>;
}

export default CustomRouterProvider;