// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from "react";
import { FirebaseAuthContext } from "../../context/FirebaseAuthProvider";

// MUI imports
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import GoogleIcon from '@mui/icons-material/Google';

import { useSearchParams, Navigate, useLocation } from "react-router-dom";

function Login() {

    const location = useLocation();
    const { successMessage, loginEmail } = location.state || {};

    const [searchParams] = useSearchParams();
    const fromValue = searchParams.get('from');

    const [email, setEmail] = useState((loginEmail || ""));
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [processing, setProcessing] = useState(false);
    const [googleProcessing, setGoogleProcessing] = useState(false);

    const { login, googleLogin, currentUser } = useContext(FirebaseAuthContext);

    const handleInputChange = (event) => {

        const { name, value } = event.target;
        if (name === 'email') {
            setEmail(value);
        } else if (name === 'password') {
            setPassword(value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true)
        // Simulate API call with delay and potential error
        try {
            await login(email, password);
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage("Wrong Credentials")
        }
        setProcessing(false)
    };

    const loginByGoogle = async (event) => {
        event.preventDefault();
        setGoogleProcessing(true)
        // Simulate API call with delay and potential error
        try {
            await googleLogin();
        } catch (error) {
            console.error('Google Auth Error:', error);
            setGoogleProcessing(false)
           // setErrorMessage("Wrong Credentials")
        }
        setGoogleProcessing(false)
    };

    return (
        <div className="login-container">
            {currentUser && (
                <Navigate to={(fromValue || "/dashboard")} replace={true} />
            )}
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in 
                    </Typography>
                   
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        {errorMessage && errorMessage.length > 0 && <Alert severity="error">{errorMessage}</Alert>}

                        {successMessage && <Alert severity="success">{successMessage}</Alert> }
                        
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email }
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={handleInputChange}
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        {processing ? <h5>Logging In..</h5> :
                            <Button
                                onClick={handleSubmit}
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                        }

                        <Grid sx={{ my:4 }} container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to="/auth/signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                        <Divider>OR</Divider>
                        {googleProcessing ? <h5>Logging In..</h5> :
                            <Button
                                startIcon={<GoogleIcon />}
                                onClick={loginByGoogle}
                                fullWidth
                                variant="contained"

                                sx={{ mt: 3, mb: 2 }}
                                color="success"
                            >
                                Continue with Google
                            </Button>
                        }
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </div>
    );
}

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright � '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

Login.propTypes = {

}

export default Login;