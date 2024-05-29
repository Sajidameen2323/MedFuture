/* eslint-disable react/prop-types */
import { Box, Typography, Card, Grid, Container, Button } from '@mui/material';

import {
    GoogleOutlined,
    ReloadOutlined,
    UnorderedListOutlined
} from '@ant-design/icons';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Link as RouterLink } from 'react-router-dom';
import moment from 'moment';

const SuccessfulBooking = (props) => {

    const { selectedService: service, selectedDoctor: doctor, appointmentDetails, handleReset } = props;

    const taxRate = 0.1;
    const fee = service.serviceCharge;
    const tax = fee * taxRate;
    const total = fee + tax;

    const handleAddToCalendar = () => {
        const startTime = new Date(appointmentDetails.startDateTime);
        const endTime = new Date(appointmentDetails.startDateTime).getTime() + service?.duration * 60 * 1000;

        const startTimeFormatted = startTime.toISOString().replace(/-|:|\.\d+/g, '');
        const endTimeFormatted = new Date(endTime).toISOString().replace(/-|:|\.\d+/g, '');

        const calendarUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?
        text=Appointment+with+${encodeURIComponent(doctor.fullName)}
        &dates=${startTimeFormatted}/${endTimeFormatted}
        &details=%0A%3Cb%3EMedFuture%3C%2Fb%3E%0A%0AService:+${encodeURIComponent(service.name)}%0ADuration:+${service.duration}+minutes%0A
        &location=${encodeURIComponent('123 Main St, Anytown, CA 12345')}
    `;
       // console.log(calendarUrl )
        window.open(calendarUrl, '_blank');
    };

    const formattedTime = moment.utc(appointmentDetails.startDateTime).format('h:mm a');

    return (
        <Container maxWidth="sm">
            <Card sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                    Appointment Booked Successfully!
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center" gutterBottom>
                    Appointment ID: {appointmentDetails.appointmentId}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" gutterBottom>
                    Due to exceptionally high demand, the start time of your appointment may experience delays. Your patience is appreciated.
                </Typography>

                <Box mt={4}>
                    <Grid container spacing={2} alignItems="center" sx={{ textAlign:'center' } }>
                        <Grid item xs={6}>
                            <Typography variant="body1" fontWeight="bold">
                                Service
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">{service.name}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" fontWeight="bold">
                                Doctor
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">{doctor.fullName}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" fontWeight="bold">
                                Date
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">{appointmentDetails.appointmentDate}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" fontWeight="bold">
                                Time
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">{formattedTime}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" fontWeight="bold">
                                Duration
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">{service.duration} min</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" fontWeight="bold">
                                Fee
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">Rs {fee.toFixed(2)}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" fontWeight="bold">
                                Tax
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">10 %</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" fontWeight="bold">
                                Total
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">Rs {total.toFixed(2)}</Typography>
                        </Grid>
                    </Grid>
  
                </Box>

                <Box mt={4} display="flex" justifyContent="center" gap={2}>
                    <Button
                        variant="outlined"
                        color="success"
                        startIcon={<GoogleOutlined />}
                        onClick={handleAddToCalendar}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'success.main',
                                color: 'common.white',
                            },
                        }}
                    >
                        Add to Google
                    </Button>
                    <Button
                        component={RouterLink}
                        startIcon={<UnorderedListOutlined />}
                        to="/patient/appointments"
                        variant="outlined"
                        color="primary"
                        sx={{
                            '&:hover': {
                                backgroundColor: 'primary.main',
                                color: 'common.white',
                            },
                        }}
                    >
                        Appointments
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<ReloadOutlined />}
                        color="warning"
                        onClick={handleReset}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'warning.main',
                                color: 'common.white',
                            },
                        }}
                    >
                        Book Again
                    </Button>
                </Box>
            </Card>
        </Container>
    );
};

export default SuccessfulBooking;