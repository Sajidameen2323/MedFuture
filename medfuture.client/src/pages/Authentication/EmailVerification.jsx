import React, { useState, useEffect, useContext } from 'react';
import { Card, CardContent, Typography, Button, Box, CardActions } from '@mui/material';
import Logo from 'components/Logo';
import { FirebaseAuthContext } from "context/FirebaseAuthProvider";

const EmailVerification = () => {

    const [isSending, setIsSending] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const initialCountdown = 60; // Initial countdown value in seconds
    const [countdown, setCountdown] = useState(initialCountdown);
    const [error, setError] = useState("");

    const { currentUser, idToken } = useContext(FirebaseAuthContext);

    useEffect(() => {
        if (verificationSent) {
            const intervalId = setInterval(() => {
                if (countdown > 0) {
                    setCountdown(countdown - 1); // Decrement countdown every second
                } else {
                    clearInterval(intervalId); // Stop interval when countdown reaches 0
                }
            }, 1000); // Update every second

            return () => clearInterval(intervalId); // Cleanup function to clear interval on unmount
        }
    }, [verificationSent, countdown]); // Run effect only when verificationSent or countdown changes

    const handleSendVerification = async () => {
        setIsSending(true);
        setError("");
        try {
            // Replace with your actual email sending logic, using a backend API
            const response = await fetch("/auth/get-verification-mail", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${idToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                setVerificationSent(true);
            } else {
                // Handle error gracefully, e.g., display an error message
                setError("Too many requests")
                console.error('Error sending verification email:', response.statusText);
            }
        } catch (error) {
            console.error('Error sending verification email:', error);
            setError("Something went wrong!")
        } finally {

            setIsSending(false);
            setCountdown(initialCountdown)
        }
    };

    const handleResendRequest = () => {
        if (countdown > 0) return; // Prevent resend until countdown finishes

        setVerificationSent(false); // Reset verification status for resend
        handleSendVerification();
    };

    return (
        <Card sx={{ width: { xs: '80vw', md: '30vw' } }}>

            <Box display="flex" justifyContent="center" alignItems="center" p={2}>
                <Logo to="/" />
            </Box>
            <CardContent>
                <Typography variant="h6">Medfuture Email Verification</Typography>
                <br />
                <Button
                    variant="contained"
                    disabled={isSending || verificationSent}
                    onClick={handleSendVerification}
                >
                    {isSending ? 'Sending...' : verificationSent ? 'Verification Sent' : 'Send Verification'}
                </Button>
                {verificationSent && (
                    <Box mt={2}>
                        <Typography variant="body2">A verification email has been sent to <strong>{currentUser?.email}</strong>.</Typography>
                        {countdown > 0 && (
                            <Typography variant="caption">
                                You can request a new verification email in {countdown} seconds.
                            </Typography>
                        )}
                    </Box>
                )}
                {verificationSent && countdown === 0 && (
                    <Button variant="text" onClick={handleResendRequest} disabled={isSending}>
                        Resend Verification
                    </Button>
                )}
                {error && <Typography variant="h6" error>{error}</Typography>}

            </CardContent>
            <CardActions disableSpacing>
                <Typography variant="caption">� Medfuture 2024</Typography>
            </CardActions>
        </Card>
    );
};

export default EmailVerification;
