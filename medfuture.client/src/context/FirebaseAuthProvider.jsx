/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { createContext, useState, useEffect } from "react";
import { auth, googleProvider } from '../config/firebaseConfig';
import { signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import Spinner from "../shared/components/Spinner/Spinner";

const FirebaseAuthContext = createContext({
    currentUser: null,
    setUser: () => { },
    login: () => { },
    googleLogin: () => { },
    logout: () => { },
    loading: false,
    idToken: "",
});

// eslint-disable-next-line react/prop-types
function FirebaseAuthProvider({ children }) {
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [idToken, setIdToken] = useState("");

    useEffect(() => {
        setLoading(true);
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const idToken = await user.getIdToken(/* forceRefresh */ false);
                setIdToken(idToken);
                getCustomToken(idToken);
            } else {
                setIdToken("");
                setCurrentUser(null);
                setLoading(false);
            }
        });

        const tokenExpirationInterval = setInterval(async () => {
            const currentTime = new Date().getTime();
            const user = auth.currentUser;
            if (user) {
                const idTokenResult = await user.getIdTokenResult();
                const expirationTime = new Date(idTokenResult.expirationTime).getTime();
                if (currentTime + 5 * 60 * 1000 >= expirationTime) {
                    try {
                        const newToken = await user.getIdToken(true);
                        setIdToken(newToken);
                    } catch (error) {
                        console.error('Error refreshing token:', error);
                        await logout();
                        window.location.href = '/login';
                    }
                }
            }
        }, 60000); // Check every minute

        return () => {
            unsubscribe();
            clearInterval(tokenExpirationInterval);
        };
    }, []);

    async function getCustomToken(idToken) {
        setLoading(true);
        try {
            const response = await fetch('/auth/authorize-user', {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                },
            });

            if (!response.ok) {
                setLoading(false);
                return;
            }

            const data = await response.json();
            const { newToken } = data;

            signInWithCustomToken(auth, newToken)
                .then(async (userCredential) => {
                    const user = userCredential.user;
                    console.log("Successfully logged in with custom token");
                    const idTokenResult = await user.getIdTokenResult(true);
                    setCurrentUser(user);
                    const { role, email, user_id, email_verified, name, picture } = idTokenResult.claims;
                    console.log(idTokenResult.claims);

                    const newUser = {
                        role,
                        email,
                        user_id,
                        email_verified,
                        name,
                        picture
                    };
                    console.log(newUser);
                    setCurrentUser(newUser);
                    setLoading(false);
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;

                    console.log("Error signing in with custom token - code : " + errorCode + "| message : " + errorMessage);
                    setCurrentUser(null);
                    setLoading(false);
                });
        } catch (ex) {
            await logout();
        }
    }

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const googleLogin = () => {
        return signInWithPopup(auth, googleProvider);
    };

    const logout = async () => {
        setCurrentUser(null);
        setIdToken("");
        await signOut(auth);
    };

    return (
        <FirebaseAuthContext.Provider
            value={{ currentUser, idToken, login, googleLogin, logout, loading }}
        >
            {loading ? <Spinner /> : children}
        </FirebaseAuthContext.Provider>
    );
}

export { FirebaseAuthContext, FirebaseAuthProvider };