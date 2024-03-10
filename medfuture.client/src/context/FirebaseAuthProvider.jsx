/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { createContext, useState, useEffect } from "react";
import { auth, googleProvider } from '../config/firebaseConfig';
import { signInWithEmailAndPassword, signInWithPopup ,signOut, onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
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
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            
            if (user) {
                user.getIdToken(/* forceRefresh */ false).then(function (idToken) {
                    // Send token to your backend via HTTPS
                    console.log(user);
                    setIdToken(idToken)
                    getCustomToken(idToken)

                }).catch(function (error) {

                    console.log("Token Error : " + error.message);
                    setLoading(false);
                });
             
            } else {
                // User is signed out
                setIdToken("")
                setCurrentUser(null);
                setLoading(false);
            }  
        });
        
        return unsubscribe;
    }, []);

    async function getCustomToken(idToken) {
        setLoading(true);

        const response = await fetch('/auth/authorize-user', {
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            setLoading(false)
            return;
        }

        const data = await response.json();
        const { newToken } = data;
        // setIdToken(newToken);
       // console.log(newToken);

        signInWithCustomToken(auth, newToken)
            .then(async (userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log("Successfully logged in with cutom token");
                var idTokenResult = await user.getIdTokenResult(true);
                setCurrentUser(user);
                const { role, email, user_id, email_verified, name, picture } = idTokenResult.claims;
                console.log(idTokenResult.claims)

                var newUser = {
                    role,
                    email,
                    user_id,
                    email_verified,
                    name,
                    picture
                }
                console.log(newUser)
                setCurrentUser(newUser)
                setLoading(false);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.log("Error sign in with custom token - code : " + errorCode + "| message : " + errorMessage);
                setCurrentUser(null);
                setLoading(false);
            });

    }

    const login =  (email, password) => { 
           return  signInWithEmailAndPassword(auth, email, password);
    };

    const googleLogin = () => {

        return signInWithPopup(auth, googleProvider);
    }

    const logout = () => {
        return signOut(auth);
    };

    return (
        <FirebaseAuthContext.Provider
            value={{ currentUser, idToken, login, googleLogin, logout, loading }}
        >
            {loading? <Spinner />: children }
   
        </FirebaseAuthContext.Provider>
    );
}

export { FirebaseAuthContext, FirebaseAuthProvider };