/* eslint-disable react/prop-types */
import { Button, Typography, Card, CardContent, CardActions, Grid, Container, Stack } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { Result } from 'antd';
import AnimateButton from 'components/@extended/AnimateButton';

const SuccessfulBooking = ({ selectedService: service, selectedDoctor: doctor, appointmentDetails, handleReset }) => {
    const taxRate = 0.1; // Assuming a tax rate of 10%
    const fee = service.serviceCharge;
    const tax = fee * taxRate;
    const total = fee + tax;

    const handleAddToCalendar = () => {
        // Code to add appointment to Google Calendar
        // Example: window.open(`https://www.google.com/calendar/render?action=TEMPLATE&text=Appointment&dates=20220412T100000Z/20220412T110000Z&details=Appointment%20details&location=Appointment%20location`);
    };
    let formattedTime = new Date(appointmentDetails.startDateTime);
    formattedTime = `${formattedTime.getUTCHours()}:${formattedTime.getUTCMinutes()}`
    return (
        <>
          <Result
    status="success"
    title="Successfully Booked Appointment!"
                subTitle={`Appointment ID: ${appointmentDetails.appointmentId}. Due to exceptionally high demand, the start time of your appointment may experience delays. Your patience is appreciated.`}
    extra={[
        <Container key="container" sx={{ display: 'flex', justifyContent: 'center', margin: 1 }}>
            
            <Card sx={{ width: { md: 'auto', sm: '400px' } }} disableElevation>
                <CardContent>
    

                    <Grid container spacing={2} style={{ marginTop: '10px', textAlign: 'left' }}>

                        <Grid item xs={6}>
                            <Typography variant="body1">Service</Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant="body1" style={{ textAlign: 'right' }}>
                                {service.name}
                            </Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant="body1">Doctor</Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant="body1" style={{ textAlign: 'right' }}>
                                {doctor.fullName}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">Date</Typography>
                        </Grid>

                        <Grid item xs={6}>
                            <Typography variant="body1" style={{ textAlign: 'right' }}>
                                {appointmentDetails.appointmentDate}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">Time</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" style={{ textAlign: 'right' }}>
                                {formattedTime}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">Duration</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" style={{ textAlign: 'right' }}>
                                {service.duration} min
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">Fee:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" style={{ textAlign: 'right' }}>
                                ${fee}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">Total:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                ${total.toFixed(2)}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>

            </Card>
        </Container>,
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} key="action-btn" useFlexGap flexWrap="wrap" sx={{ display:'flex', justifyContent:'center'} }>
            <AnimateButton >
                <Button

                    size="medium"
                    variant="contained"
                    color="info"
                    disableElevation
                    sx={{ borderRadius: '0px' }}
                    startIcon={<EventIcon />}
                    onClick={handleAddToCalendar}

                >
                    Add to Calendar
                </Button>
            </AnimateButton>
            <AnimateButton >
                <Button

                    size="medium"
                    variant="contained"
                    color="primary"
                    disableElevation
                    sx={{ borderRadius: '0px' }}
                >
                    Appointments
                </Button>
            </AnimateButton>
            <AnimateButton >
                <Button

                    size="medium"
                    variant="contained"
                    color="primary"
                    disableElevation
                    onClick={handleReset}
                    sx={{ borderRadius: '0px' }}
                >
                    Book Again
                </Button>
            </AnimateButton>
        </Stack>

    ]}
  />
  </>

    );
};

export default SuccessfulBooking;
