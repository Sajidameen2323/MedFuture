import React from 'react';
import { auth } from '../../config/firebaseConfig';
import {  signInWithEmailAndPassword } from "firebase/auth";
import PropTypes from 'prop-types';
function Login({ setToken }) {

    const signInWithFirebase = async () => {
        try {
            
            signInWithEmailAndPassword(auth, "admin123@gmail.com", "Asdfghjkl2323@")
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                   
                    console.log(user);
                    auth.currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
                        // Send token to your backend via HTTPS
                        console.log(idToken)
                        setToken(idToken)
                        console.log("Token Set")
                        // ...
                    }).catch(function (error) {
                        // Handle error
                        console.log("Token Error : "+ error.message)
                    });
                   
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode, errorMessage)
                });

        } catch (error) {
            console.error('Error signing in:', error.message);
        }
    };
    return (
      <div>
      <p>Login Page</p>
            <button onClick={signInWithFirebase}> Sign In </button>
    </div>
  );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}

export default Login;