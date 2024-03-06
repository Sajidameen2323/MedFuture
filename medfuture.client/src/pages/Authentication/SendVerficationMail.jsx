import { useState, useContext } from "react";
import { Button, CircularProgress, Typography } from "@mui/material";
import { FirebaseAuthContext } from "../../context/FirebaseAuthProvider";

function SendVerificationMail() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState(null);

    const { currentUser, idToken } = useContext(FirebaseAuthContext);

    const resendVerificationEmail = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Replace with your actual API endpoint
            const response = await fetch("/auth/get-verification-mail", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${idToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                setIsSent(true);
            } else {
                setError("An error occurred while sending email.");
            }
        } catch (error) {
            console.error(error);
            setError("An error occurred while sending email.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="verification-container">
            {currentUser && !currentUser.emailVerified && (
                <div className="verification-content">
                    <Typography variant="body1">
                        Please Verify Your Email Address
                    </Typography>
                    <Button
                        variant="contained"
                        disabled={isLoading}
                        onClick={resendVerificationEmail}
                        className="resend-button"
                    >
                        {isLoading ? <CircularProgress size="small" /> : "Send Verification"}
                    </Button>
                    {isSent && (
                        <Typography variant="body1" className="success-message">
                            Verification email sent successfully!
                        </Typography>
                    )}
                    {error && (
                        <Typography variant="body1" color="error" className="error-message">
                            {error}
                        </Typography>
                    )}
                </div>
            )}
            {currentUser && currentUser.emailVerified && (
                <Typography variant="body1">Email is verified.</Typography>
            )}
        </div>
    );
}

export default SendVerificationMail;
