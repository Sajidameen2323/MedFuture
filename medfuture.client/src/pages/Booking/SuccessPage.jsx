/* eslint-disable react/prop-types */
import React from 'react';
import { Button, Typography, Card, CardContent, CardActions, Grid, Container } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';

const SuccessfulBooking = ({ selectedService: service, selectedDoctor: doctor, appointmentDetails }) => {
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
        <Container sx={{ display:'flex', justifyContent:'center', margin:2 }}>
  
            <Card style={{ maxWidth: { sm: '400px', md:'auto' } }}>
            <CardContent>
                <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                    Appointment Booking Successful
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Service: {service.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Doctor: {doctor.fullName}
                </Typography>
                <Grid container spacing={2} style={{ marginTop: '10px', textAlign: 'left' }}>

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
                        <Typography variant="body1">Tax (10%):</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1" style={{ textAlign: 'right' }}>
                            ${tax.toFixed(2)}
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
            <CardActions style={{ justifyContent: 'flex-end', padding: '16px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EventIcon />}
                    onClick={handleAddToCalendar}
                    style={{ borderRadius: '8px' }}
                >
                    Add to Calendar
                </Button>
            </CardActions>
            </Card>
        </Container>
    );
};

export default SuccessfulBooking;
