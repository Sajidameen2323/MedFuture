import React, { useContext, useEffect } from 'react';
import {
    Container,
    Grid,
    Typography,
    Button,
    Link,
    Stack,
    Box
} from '@mui/material';

import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';

import { useTheme } from '@mui/material/styles';
import { Link as RouterLink, useLoaderData } from 'react-router-dom';
import { FirebaseAuthContext } from '../context/FirebaseAuthProvider';


const WelcomePage = () => {
    const theme = useTheme();
    const { currentUser } = useLoaderData();
    const { logout } = useContext(FirebaseAuthContext);
    return (
        <>
           <NewFunction theme={theme} />
        </>
    );

    function NewFunction({ theme }) {
        return <Container maxWidth="lg" sx={{ paddingTop: 0, paddingBottom: 4, maxHeight:'100vh' }}>
            <Stack spacing={2} sx={{ textAlign:'center', alignContent:'center'}}>
                <Grid container spacing={3}>
                    <Grid item xs={12} >
                        <Grid container spacing={2} sx={{ justifyContent: 'center', my: 4 }}>
                            <Grid item xs={12}>
                                <Typography variant="h4" gutterBottom>
                                    Your All-in-One Healthcare Companion
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    Empowering you to manage your well-being with ease.
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <Button component={RouterLink} to="/book-now" variant="contained" size="large" color="primary">
                                    Book Appointment
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <LocalHospitalIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                                <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                                    Find Doctors
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Connect with specialists in your area.
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <CalendarMonthIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                                <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                                    Schedule Appointments
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Manage your healthcare calendar efficiently.
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <DocumentScannerOutlinedIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
                                <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                                    Access Records
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    View and manage your medical history securely.
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
                <Grid container spacing={3}>

                    <Grid item xs={12}>
                        <Grid container spacing={2} sx={{ display: 'flex', alignItems: 'center', mt:2, mb:6  }}>
                            <Grid item xs={4}>
                                <HealthAndSafetyIcon sx={{ fontSize: 80, color: theme.palette.primary.main }} />
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="h5" gutterBottom>
                                    Additional Features
                                </Typography>
                                <ul style={{ listStyle: 'none'}}>
                                    <li>
                                        <Typography variant="body1">
                                            Medication reminders to stay on track
                                        </Typography>
                                    </li>
                                    <li>
                                        <Typography variant="body1">
                                            Track vitals and health data for insights
                                        </Typography>
                                    </li>
                                    <li>
                                        <Typography variant="body1">
                                            Secure messaging with healthcare providers
                                        </Typography>
                                    </li>
                                </ul>
                            </Grid>
                        </Grid>
                        {!currentUser && <Grid item xs={12}>
                            <Link component={RouterLink} to="/auth/login" variant="body2">
                                Already have an account? Log in
                            </Link>
                            {/* Added signup link */}
                            <Link component={RouterLink} to="/auth/signup" variant="body2" sx={{ ml: 2 }}>
                                New user? Sign Up
                            </Link>
                        </Grid>}
                        {currentUser && <Grid item xs={12}>
                            <Link component={RouterLink} to="/dashboard" variant="body2" sx={{ ml: 2 }}>
                                Dashboard
                            </Link>
                            <Link component={Button} onClick={logout } variant="body2" sx={{ ml: 2 }}>
                                Logout
                            </Link>

                        </Grid>}

                    </Grid>

                </Grid>
            </Stack>

        </Container>;
    }
};

export default WelcomePage;
