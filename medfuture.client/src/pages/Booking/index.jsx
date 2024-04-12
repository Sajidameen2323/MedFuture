// AppointmentStepper.js

import React, { useState, useContext } from 'react';
import { Stepper, Step, StepLabel, Button, Container, Box, Typography } from '@mui/material';
import SelectServiceForm from "./SelectServiceForm";
import SelectDoctorForm from "./SelectDoctorForm";
import BookingPage from './BookingPage';
import Logo from 'components/Logo';

import { FirebaseAuthContext } from "context/FirebaseAuthProvider";


const steps = ['Service', 'Doctor', 'Date & Time'];

const AppointmentStepper = () => {

    const { idToken } = useContext(FirebaseAuthContext);

    const [activeStep, setActiveStep] = useState(0);
    const [formError, setFormError] = useState(null);
    const [selectedService, setSelectedService] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDateTime, setSelectedDateTime] = useState('');

    const handleNext = () => {

        setFormError(null)

        if (activeStep === 0 && !Array.isArray(selectedService.doctorNames)) {
            setFormError("Please Select a Service To Proceed");
            return;
        }
        else if (activeStep === 1 && typeof selectedDoctor != "object") {
            console.log(typeof selectedDoctor)
            setFormError("Please Select a Doctor To Proceed");
            return;
        }
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleFinish = async() => {

        setFormError(null);
        console.log("Booking Appointment!");
        console.log(selectedDateTime);
        const jsonData = {

            "serviceId": selectedService?.serviceID,
            "appointmentDate": selectedDateTime,
            "startDateTime": selectedDateTime,
            "endDateTime": selectedDateTime,
            "doctorId": selectedDoctor?.doctorID,
            "patientId": 1          

        }

        try {

            const response = await fetch('/api/appointment/create-appointment', {

                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    "Content-Type": "application/json"
                },
                method: 'post',
                body: JSON.stringify(jsonData),
            });
            if (response.ok) {

                const { data, message } = await response.json()
                console.log(data)
                console.log(message)
                
                //queryClient.invalidateQueries('servicesFetchApi');
            }
            else {
                const { errors } = await response.json()
                console.log(errors)
               
            }

        
        } catch (err) {
            console.error(err);

        }



    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    return (
     <Container>
            <Box display="flex" justifyContent="center" alignItems="center" p={2}>
                <Logo to="/" />
            </Box>
        <Box sx={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center', width: {md:'80vw'}, mx: { md: '10px' } }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {/* Render step content based on activeStep */}

                {activeStep === 0 && <SelectServiceForm selectedService={selectedService} setSelectedService={ setSelectedService } />}
                {activeStep === 1 && <SelectDoctorForm doctors={selectedService.doctorNames} setSelectedDoctor={setSelectedDoctor} selectedDoctor={selectedDoctor } />}
                {activeStep === 2 && <BookingPage setSelectedDateTime={setSelectedDateTime} />}

                {/* Navigation buttons */}

                {formError && <Typography variant="subtitle2" color="error" component="h2">
                    {formError}
                </Typography> }

            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                    Back
                    </Button>

                    {activeStep === steps.length - 1 ? <Button variant="contained" color="primary" onClick={handleFinish}>
                        Finish
                    </Button> : <Button variant="contained" color="primary" onClick={handleNext}>
                      Next
                    </Button>}

            </Box>

            </Box>
        </Container>
    );
};

// Implement ServiceSelection, DoctorSelection, and DateTimeSelection components
// ...

export default AppointmentStepper;
