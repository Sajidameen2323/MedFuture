// AppointmentStepper.js

import { useState, useContext } from 'react';
import { Stepper, Step, StepLabel, Button, Container, Box, Typography, Link, Alert } from '@mui/material';
import SelectServiceForm from "./SelectServiceForm";
import SelectDoctorForm from "./SelectDoctorForm";
import BookingPage from './BookingPage';
import SuccessPage from './SuccessPage';
import Logo from 'components/Logo';
import { useQueryClient } from 'react-query';
import { FirebaseAuthContext } from "context/FirebaseAuthProvider";
import { Link as RouterLink } from 'react-router-dom';
import AnimateButton from 'components/@extended/AnimateButton';
import { Button as AntButton } from 'antd';
import {
    HomeOutlined
} from '@ant-design/icons';
const steps = ['Service', 'Doctor', 'Date & Time', 'Success'];

const AppointmentStepper = () => {

    const { idToken } = useContext(FirebaseAuthContext);
    const queryClient = useQueryClient();

    const [activeStep, setActiveStep] = useState(0);
    const [formError, setFormError] = useState(null);
    const [selectedService, setSelectedService] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDateTime, setSelectedDateTime] = useState('');
    const [appointmentDetails, setAppointmentDetails] = useState(null);
    const [taxRateFromDb, setTaxRateFromDb] = useState(0);

    const [processing, setProcessing] = useState(false);

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
    const handleReset = () => {

        setFormError(null)
        setSelectedDateTime('');
        setSelectedDoctor('');
        setSelectedService('');
        setActiveStep(0);
    };
    const handleFinish = async() => {

        setFormError(null);
        setProcessing(true);
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

                const { data, message, tax } = await response.json()
                console.log(data)
                console.log(message)
                if(tax){
                    setTaxRateFromDb(tax);
                }
                setAppointmentDetails(data);
                queryClient.invalidateQueries('appointmentScheduleApi');
                setActiveStep((prevStep) => prevStep + 1);
            }
            else if (response.status === 403) {
                console.log("Not Authorized for This Role");
                setFormError("Not Authorized for This Role");
            }
            else if (response.status === 429) {
                console.log("Rate Limitted");
                setFormError("Too many requests! Please try again later");
            }
            else {
                const { error, message } = await response.json()
                if (error) {
                    console.log(message)
                    setFormError(message)
                }
               
            }
        
        } catch (err) {
            console.error(err);
            setFormError("Server erro! Please try again later.")
        }

        setProcessing(false);

    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    return (
     <Container>
            <Box display="flex" justifyContent="center" alignItems="center" p={2}>
                <Logo to="/" width={300} height={60} viewBox="0 0 2000 531" />
            </Box>
            <Box sx={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center', width: {md:'80vw'}, mx: { md: '10px' } }}>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label} >
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

                <Box sx={{ mt: 2 }}>
                    {formError && <Alert onClose={() => setFormError(null)} severity="error">{formError}</Alert>}
                </Box>
            {/* Render step content based on activeStep */}

                {activeStep === 0 && <SelectServiceForm selectedService={selectedService} setSelectedService={ setSelectedService } />}
                {activeStep === 1 && <SelectDoctorForm doctors={selectedService.doctorNames} setSelectedDoctor={setSelectedDoctor} selectedDoctor={selectedDoctor } />}
                {activeStep === 2 && <BookingPage setSelectedDateTime={setSelectedDateTime} selectedService={selectedService} selectedDoctor={selectedDoctor} />}
                {activeStep === 3 && <SuccessPage taxRateFromDb={taxRateFromDb} selectedService={selectedService} selectedDoctor={selectedDoctor} appointmentDetails={appointmentDetails} handleReset={ handleReset } />}
            

                {/* Navigation buttons */}



                <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>

                    {activeStep <= steps.length - 2 && <AnimateButton> <Button disabled={activeStep === 0} onClick={handleBack}>
                        Back
                    </Button>     </AnimateButton>}

                    {activeStep == steps.length - 1 && 
                        <Box sx={{ display: 'flex', justifyContent: 'center', width: { sm: '90%', md: '50%' } } } >

                            <AnimateButton> 
                                <Button startIcon={<HomeOutlined />} component={RouterLink} to="/" size="small" variant="contained" sx={{ mt: 1 }}>
                                         Home
                                </Button>
                            </AnimateButton>
                        </Box>    
                    
                    }

                    {activeStep === steps.length - 2 && <AnimateButton> <AntButton type="primary" loading={processing} onClick={handleFinish}>
                        Finish
                    </AntButton></AnimateButton>}

                    {activeStep < steps.length - 2 && <AnimateButton> <Button variant="contained" color="primary" onClick={handleNext}>
                      Next
                    </Button>
                        </AnimateButton>
                      }

            </Box>

            </Box>
        </Container>
    );
};

// Implement ServiceSelection, DoctorSelection, and DateTimeSelection components
// ...

export default AppointmentStepper;
