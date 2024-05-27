/* eslint-disable react/prop-types */
import { useContext, useState } from 'react';
import {
    Container,
    Grid,
    Typography,
    Button,
    Stack,
    Box,
    Card,
    CardContent,
    Avatar,
    AppBar,
    Toolbar,
    TextField,
    Paper,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import Logo from 'components/Logo';
import MenuIcon from '@mui/icons-material/Menu';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';

import { useTheme } from '@mui/material/styles';
import { Link as RouterLink, useLoaderData } from 'react-router-dom';
import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';

import AnimateButton from 'components/@extended/AnimateButton';

import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';

const WelcomePage = () => {
    const theme = useTheme();
    const { currentUser } = useLoaderData();
    const { logout } = useContext(FirebaseAuthContext);
    const [mobileMenu, setMobileMenu] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenu(!mobileMenu);
    };

    return (
        <>
            <AppBar
                position="static"
                sx={{
                    backgroundColor: theme.palette.secondary[200],
                    boxShadow: 'none',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    color: theme.palette.primary.main
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Logo to="/" width={200} height={50} viewBox="0 0 2000 531" />
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                        {!currentUser ? (
                            <>
                                <AnimateButton>
                                    <Button
                                        color="inherit"
                                        component={RouterLink}
                                        to="/auth/login"
                                        sx={{
                                            mx: 1,
                                            backgroundColor: 'primary.main',
                                            color: 'common.white',
                                            '&:hover': {
                                                backgroundColor: 'primary.dark',
                                                color: 'common.white',
                                            },
                                        }}
                                    >
                                        Login
                                    </Button>
                                </AnimateButton>
                                <AnimateButton>
                                    <Button
                                        color="inherit"
                                        component={RouterLink}
                                        to="/auth/signup"
                                        sx={{
                                            mx: 1,
                                            backgroundColor: 'secondary.main',
                                            color: 'common.white',
                                            '&:hover': {
                                                backgroundColor: 'primary.dark',
                                                color: 'common.white',
                                            },
                                        }}
                                    >
                                        Register
                                    </Button>
                                </AnimateButton>
                            </>
                        ) : (
                            <>
                                <Button
                                    color="inherit"
                                    component={RouterLink}
                                    to="/dashboard"
                                    sx={{
                                        mx: 2,
                                        px: 4,
                                        backgroundColor: 'primary.main',
                                        color: 'common.white',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark',
                                            color: 'common.white',
                                        },
                                    }}
                                >
                                    Dashboard
                                </Button>
                                <Button
                                    color="error"
                                    onClick={logout}
                                    variant='text'
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'error.main',
                                            color: 'common.white',
                                        },
                                    }}
                                >
                                    Logout
                                </Button>
                            </>
                        )}
                    </Box>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleMobileMenu}
                        sx={{ display: { xs: 'flex', md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
                <Drawer
                    anchor="left"
                    open={mobileMenu}
                    onClose={toggleMobileMenu}
                    sx={{
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: 240,
                        },
                    }}
                >
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Menu
                        </Typography>
                        <List>
                            {!currentUser ? (
                                <>
                                    <ListItem button component={RouterLink} to="/auth/login" onClick={toggleMobileMenu}>
                                        <ListItemText primary="Login" />
                                    </ListItem>
                                    <ListItem button component={RouterLink} to="/auth/signup" onClick={toggleMobileMenu}>
                                        <ListItemText primary="Register" />
                                    </ListItem>
                                </>
                            ) : (
                                <>
                                    <ListItem button component={RouterLink} to="/dashboard" onClick={toggleMobileMenu}>
                                        <ListItemText primary="Dashboard" />
                                    </ListItem>
                                    <ListItem button onClick={logout}>
                                        <ListItemText primary="Logout" />
                                    </ListItem>
                                </>
                            )}
                        </List>
                    </Box>
                </Drawer>
            </AppBar>

            <Container maxWidth="lg" sx={{ paddingTop: 4, paddingBottom: 4, minHeight: '100vh' }}>
                <Stack spacing={4} sx={{ textAlign: 'center', alignItems: 'center' }}>
                    <Typography variant="h3" color="primary" sx={{ mb: 2 }}>
                        Welcome to Your Healthcare Companion
                    </Typography>
                    <Typography variant="body1" sx={{ maxWidth: 600 }}>
                        Empowering you to manage your well-being with ease. Connect with specialists, schedule appointments, access medical records, and more.
                    </Typography>
                    <Button component={RouterLink} to="/book-now" variant="contained" size="large" color="primary"
                        sx={{
                            mt: 4,
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                                color: 'common.white',
                            },
                        }}>
                        Book Appointment
                    </Button>

                    <Grid container spacing={4} justifyContent="center">
                        <FeatureCard
                            icon={<LocalHospitalIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />}
                            title="Find Doctors"
                            description="Connect with specialists in your area."
                        />
                        <FeatureCard
                            icon={<CalendarMonthIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />}
                            title="Schedule Appointments"
                            description="Manage your healthcare calendar efficiently."
                        />
                        <FeatureCard
                            icon={<DocumentScannerOutlinedIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />}
                            title="Access Records"
                            description="View and manage your medical history securely."
                        />
                    </Grid>
                    <Box sx={{ width: '100%', textAlign: 'left', mt: 6 }}>
                        <Card sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                            <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 80, height: 80 }}>
                                <HealthAndSafetyIcon sx={{ fontSize: 50, color: '#fff' }} />
                            </Avatar>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Additional Features
                                </Typography>
                                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                                    <li>
                                        <Typography variant="body1">Medication reminders to stay on track</Typography>
                                    </li>
                                    <li>
                                        <Typography variant="body1">Track vitals and health data for insights</Typography>
                                    </li>
                                    <li>
                                        <Typography variant="body1">Secure messaging with healthcare providers</Typography>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box sx={{ width: '100%', textAlign: 'left', mt: 6 }}>
                        <Typography variant="h4" gutterBottom>
                            Our Doctors
                        </Typography>
                        <Grid container spacing={4} justifyContent="center">
                            <DoctorCard
                                name="Dr. Jane Smith"
                                photo={ avatar2 }
                                specialties="Cardiology, Internal Medicine"
                                qualifications="MD, FACC"
                            />
                            <DoctorCard
                                name="Dr. Michael Johnson"
                                photo={avatar3}
                                specialties="Pediatrics, Family Medicine"
                                qualifications="MD, FAAP"
                            />
                            <DoctorCard
                                name="Dr. Emily Davis"
                                photo={avatar4}
                                specialties="Dermatology, Cosmetic Procedures"
                                qualifications="MD, FAAD"
                            />
                        </Grid>
                    </Box>

                    <Box sx={{ width: '100%', textAlign: 'left', mt: 6 }}>
                        <Typography variant="h4" gutterBottom>
                            Healthcare Details
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Our platform offers a comprehensive suite of tools designed to help you manage your health more effectively. Whether you need to find a specialist, book an appointment, or access your medical records, we've got you covered. Our secure system ensures that your personal health information is always protected.
                        </Typography>
                    </Box>

                    <ContactForm />

                </Stack>
            </Container>
        </>
    );
};
const FeatureCard = ({ icon, title, description }) => {
    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ textAlign: 'center', padding: 3, height: '100%' }}>
                {icon}
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </Card>
        </Grid>
    );
};
const DoctorCard = ({ name, photo, specialties, qualifications }) => {
    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
                <Avatar
                    alt={name}
                    src={photo}
                    sx={{ width: 120, height: 120, marginBottom: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                    {name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Specialties: {specialties}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Qualifications: {qualifications}
                </Typography>
            </Card>
        </Grid>
    );
};
const ContactForm = () => {
    return (
        <Box component={Paper} sx={{ width: '100%', padding: 4, mt: 6 }}>
            <Typography variant="h4" gutterBottom>
                Contact Us
            </Typography>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Name" variant="outlined" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Email" variant="outlined" />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Message" variant="outlined" multiline rows={4} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};
export default WelcomePage;