import React from 'react';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const WelcomePage = () => {
    const theme = useTheme();

    return (
        <Container maxWidth="lg" sx={{ paddingTop: 8, paddingBottom: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h4" gutterBottom>
                                Your All-in-One Healthcare Companion
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Empowering you to manage your well-being with ease.
                            </Typography>
                            <Button variant="contained" size="large" color="primary">
                                Book Appointment
                            </Button>
                        </Grid>
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
                <Grid item xs={12} md={6}>
                    <Grid container spacing={2} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Grid item xs={6}>
                            <HealthAndSafetyIcon sx={{ fontSize: 80, color: theme.palette.primary.main }} />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h5" gutterBottom>
                                Additional Features
                            </Typography>
                            <ul>
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
                </Grid>
            </Grid>
        </Container>
    );
};

export default WelcomePage;
