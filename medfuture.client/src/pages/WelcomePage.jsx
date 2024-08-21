/* eslint-disable no-undef */
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
    ListItemIcon,
    Chip,
    Skeleton

} from '@mui/material';

import Logo from 'components/Logo';
import MenuIcon from '@mui/icons-material/Menu';
import MedicationIcon from '@mui/icons-material/Medication';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatIcon from '@mui/icons-material/Chat';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';

import { useTheme } from '@mui/material/styles';
import { Link as RouterLink, useLoaderData } from 'react-router-dom';
import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';

import AnimateButton from 'components/@extended/AnimateButton';

import { ClockCircleOutlined } from '@ant-design/icons';

import DayOfWeek from '@mui/icons-material/DateRange';

import medFutureLogo from 'assets/medFutureFav.png';

import { useQuery } from 'react-query';

const fetchDoctors = async () => {

    const response = await fetch('/api/doctor/doctors/info', {

        headers: {
            "Content-Type": "application/json"
        },
        method: 'GET',

    });
    return response.json();
};

const WelcomePage = () => {
    const theme = useTheme();
    const { currentUser } = useLoaderData();
    const { logout } = useContext(FirebaseAuthContext);
    const [mobileMenu, setMobileMenu] = useState(false);

    const { isLoading, data: doctors, isError } = useQuery('doctorsInfo', fetchDoctors, {

        refetchOnWindowFocus: false,
        onSuccess: (d) => {

            console.log(JSON.stringify(d))

        },
        onError: (err) => {
            console.log(err)
        }
    });

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
                    <Logo to="/" width={200} height={50} viewBox="0 0 1500 531" />
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
                        <Card sx={{ display: 'flex', alignItems: 'center', p: 0, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                            <Avatar sx={{ bgcolor: 'transparent', width: 300, height: 300, mr: 2 }}>
                                <img src={medFutureLogo} alt="MedFuture Logo" style={{ width: '100%', height: 'auto' }} />
                            </Avatar>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <Typography variant="h5" gutterBottom style={{ color: '#333', fontWeight: 600 }}>
                                    Additional Features
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <ListItem disablePadding>
                                        <ListItemIcon>
                                            <MedicationIcon style={{ color: '#555', fontSize: '1.2rem' }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" style={{ color: '#555', fontWeight: 500 }}>
                                                    Medication reminders to stay on track
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemIcon>
                                            <FavoriteIcon style={{ color: '#555', fontSize: '1.2rem' }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" style={{ color: '#555', fontWeight: 500 }}>
                                                    Track vitals and health data for insights
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemIcon>
                                            <ChatIcon style={{ color: '#555', fontSize: '1.2rem' }} />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" style={{ color: '#555', fontWeight: 500 }}>
                                                    Secure messaging with healthcare providers
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>

                    <Box sx={{ width: '100%', textAlign: 'left', mt: 6 }}>

                        <Grid container spacing={4} gap={2} justifyContent="center">
                            <Grid item xs={12}>
                                <Typography variant="h4" gutterBottom>
                                    Our Doctors
                                </Typography>
                            </Grid>
                            {isError && <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom color={"error"}>
                                    Failed To Fetch Doctors
                                </Typography>
                            </Grid>}

                            {isLoading && <LoadingDoctorCard />}

                            {!isLoading && !isError && doctors && (

                                doctors.map((doctor, index) => {

                                    return (

                                        <DoctorCard
                                            key={index}
                                            name={doctor.name}
                                            photo={doctor.profilePic}
                                            specialties={doctor.specializations}
                                            qualifications={doctor.qualifications}
                                            workingDays={doctor.workingDays}
                                            workingHours={doctor.workingHours}
                                        />

                                    )
                                })

                            )}

                        </Grid>
                    </Box>

                    <Box sx={{ width: '100%', textAlign: 'left', mt: 6 }}>
                        <Typography variant="h4" gutterBottom>
                            Healthcare Details
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Our platform offers a comprehensive suite of tools designed to help you manage your health more effectively. Whether you need to find a specialist, book an appointment, or access your medical records, we&apos;ve got you covered. Our secure system ensures that your personal health information is always protected.
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



const DoctorCard = ({ name, photo, specialties, qualifications, workingDays, workingHours }) => {
    // Format working days to show only the first 3 letters
    const formattedWorkingDays = workingDays.map(day => day.day.slice(0, 3)).join(', ');

    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2, width: 300, height: 450 }}>
            <Box sx={{ height: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box
                    sx={{
                        width: 120,
                        height: 120,
                        backgroundImage: `url(${photo != "" ? photo : medFutureLogo})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            </Box>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                    {name}
                </Typography>
                <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 2 }}>
                    {specialties.slice(0, 2).map((specialty, index) => (
                        <Chip key={index} label={specialty.name} variant="contained" color="primary" sx={{ m: 0.5 }} />
                    ))}
                </Box>
                <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 2 }}>
                    {qualifications.slice(0, 2).map((qualification, index) => (
                        <Chip key={index} label={qualification.name} variant="outlined" color="secondary" sx={{ m: 0.5 }} />
                    ))}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                    <DayOfWeek style={{ marginRight: 8 }} />
                    <Typography variant="body2">{formattedWorkingDays}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
                    <ClockCircleOutlined style={{ marginRight: 8 }} />
                    <Typography variant="body2">
                        {workingHours?.startTime ?? "undefined"} - {workingHours?.endTime ?? "undefined"}
                    </Typography>
                </Box>

            </CardContent>
        </Card>
    );
};


const LoadingDoctorCard = () => {
    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
                <Skeleton variant="circular" width={120} height={120} />
                <Typography variant="h6" gutterBottom>
                    <Skeleton />
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Specialties: <Skeleton width={100} />
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Qualifications: <Skeleton width={100} />
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Working Days: <Skeleton width={100} />
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Working Hours: <Skeleton width={100} />
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
                        <Button fullWidth variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};
export default WelcomePage;