/* eslint-disable react/prop-types */
import { redirect } from "react-router-dom";

function LoginLoader({ currentUser }) {

    console.log(currentUser)
    if (currentUser) {
        return redirect("/dashboard");
    }
    return null;
}

function ProtectedLoader({ request, currentUser }) {

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

function VerificationMailLoader({ request, currentUser }) {

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

export { LoginLoader, ProtectedLoader, VerificationMailLoader };