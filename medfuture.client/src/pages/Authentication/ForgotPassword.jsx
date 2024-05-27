import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Box, CardActions, OutlinedInput, Stack } from '@mui/material';
import Logo from 'components/Logo';

const ForgotPassword = () => {
    const [isSending, setIsSending] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const initialCountdown = 60; // Initial countdown value in seconds
    const [countdown, setCountdown] = useState(initialCountdown);
    const [error, setError] = useState("");
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (resetSent) {
            const intervalId = setInterval(() => {
                if (countdown > 0) {
                    setCountdown(countdown - 1); // Decrement countdown every second
                } else {
                    clearInterval(intervalId); // Stop interval when countdown reaches 0
                }
            }, 1000); // Update every second

            return () => clearInterval(intervalId); // Cleanup function to clear interval on unmount
        }
    }, [resetSent, countdown]); // Run effect only when resetSent or countdown changes

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordReset = async () => {
        setIsSending(true);
        setError("");
        try {
            // Replace with your actual password reset email sending logic, using a backend API
            const response = await fetch("/api/auth/get-password-reset-mail?email="+email, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            
            });

            if (response.ok) {
                setResetSent(true);
            } else {
                // Handle error gracefully, e.g., display an error message
                let { message } = await response.json();

                setError(message ?? "Too many requests");
                console.error('Error sending password reset email:', response.statusText);
            }
        } catch (error) {
            console.error('Error sending password reset email:', error);
            setError("Something went wrong!");
        } finally {
            setIsSending(false);
            setCountdown(initialCountdown);
        }
    };

    const handleResendRequest = () => {
        if (countdown > 0) return; // Prevent resend until countdown finishes

        setResetSent(false); // Reset reset status for resend
        handlePasswordReset();
    };

    return (
        <Card sx={{ width: { xs: '80vw', md: '30vw' } }}>
            <Box display="flex" justifyContent="center" alignItems="center" p={2}>
                <Logo to="/" width={300} height={60} viewBox="0 0 2000 531" />

            </Box>
            <CardContent>
                <Typography sx={{mb:2}} variant="h6">Forgot Password</Typography>

                <Box component="form" noValidate autoComplete="off">
                    <Stack spacing={2}>
                        <OutlinedInput
                            id="email-login"
                            type="email"
                            name="email"
                            label="Email"
                            variant="outlined"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Enter email address"
                            fullWidth
                        />
                        <Button
                            variant="contained"
                            disabled={isSending || resetSent || !email}
                            onClick={handlePasswordReset}
                        >
                            {isSending ? 'Sending...' : resetSent ? 'Reset Email Sent' : 'Request Password Reset'}
                        </Button>
                    </Stack>

                </Box>
                {resetSent && (
                    <Box mt={2}>
                        <Typography variant="body2">A password reset email has been sent to <strong>{email}</strong>.</Typography>
                        {countdown > 0 && (
                            <Typography variant="caption">
                                You can request a new password reset email in {countdown} seconds.
                            </Typography>
                        )}
                    </Box>
                )}
                {resetSent && countdown === 0 && (
                    <Button variant="text" onClick={handleResendRequest} disabled={isSending}>
                        Resend Password Reset
                    </Button>
                )}
                {error && <Typography mt={2} variant="h6" color="error">{error}</Typography>}
            </CardContent>
            <CardActions disableSpacing>
                <Typography variant="caption">© Medfuture 2024</Typography>
            </CardActions>
        </Card>
    );
};

export default ForgotPassword;