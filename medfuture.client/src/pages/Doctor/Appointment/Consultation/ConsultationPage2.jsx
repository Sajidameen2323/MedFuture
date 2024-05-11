
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Stepper, Step, StepLabel, Button, Grid, Card, CardContent, TextField, Avatar, Alert, IconButton, MenuItem, Select, List, ListItem, ListItemText, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { AudioOutlined, AudioMutedOutlined, ClearOutlined, CaretDownOutlined } from '@ant-design/icons'; 
import { Button as AntButton, Tooltip } from 'antd';
import useSpeechRecognition from 'hooks/useAzureSpeechRecognition';
import moment from 'moment';

import { useLocation, useNavigate } from "react-router-dom";

const ConsultationPage = () => {

    const location = useLocation();
    const { patientData } = location.state || {};
    const navigate = useNavigate();

    const [activeStep, setActiveStep] = useState(0);
    const [summary, setSummary] = useState('');
    const [prescription, setPrescription] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [language, setLanguage] = useState('en-US'); 

    const {
        transcript,
        listening,
        error,
        microphoneAllowed,
        browserSupported,
        startListening,
        stopListening,
        resetTranscript,
        setTotalTranscript,
        totalTranscript
    } = useSpeechRecognition(language);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };


    const steps = ['Patient Details', 'Voice Recording', 'Summary & Prescription'];

    useEffect(() => {

        if (!patientData) {

            navigate(`/doctor/appointments/today`, { state: {  } });
        }

    },[])

    return (
        <Box sx={{ width: { md: '1100px', xs: '100%' } }}>
           
            <Stepper activeStep={activeStep}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Box mt={4}>
                {activeStep === 0 && (
                    // ... (Patient Details)
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent sx={{ textAlign: 'left' }}>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Avatar alt="Patient Name" src={patientData?.profilePicture} />
                                        <Typography variant="h6" ml={2}>
                                            {patientData?.name}
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle1">Age:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1">{calculateAge(patientData?.dob || "")}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle1">Gender:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1">{patientData?.gender}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle1">Contact:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1">{patientData?.phoneNumber}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle1">Emergency Contact:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1">{patientData?.emergencyNumber}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle1">Blood Group:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1">{getBloodGroupName(patientData?.bloodGroup)}</Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<CaretDownOutlined />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography variant="h6">Allergies</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box sx={{ maxHeight: '200px', overflowY: 'auto', width: '100%', textAlign:'left' }}>
                                        {patientData?.allergies && patientData.allergies.map(el => (
                                            <Box key={el.id} mb={1}>
                                                <Typography variant="body1"><strong>{el.name}</strong></Typography>
                                                <Typography variant="body2">{el.reaction}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<CaretDownOutlined />}
                                    aria-controls="panel2a-content"
                                    id="panel2a-header"
                                >
                                    <Typography variant="h6">Diagnoses</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box sx={{ maxHeight: '200px', overflowY: 'auto', width: '100%', textAlign: 'left' }}>
                                        {patientData?.diagnoses && patientData.diagnoses.map(el => (
                                            <Box key={el.id} mb={1}>
                                                <Typography variant="body1"><strong>{el.name}</strong></Typography>
                                                <Typography variant="body2">Diagnosed on: {moment(el.diagnosisDate).format('YYYY-MM-DD')}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    </Grid>
                )}
                {activeStep === 1 && (
                    <Box>
                        {!browserSupported && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                Browser does not support speech recognition.
                            </Alert>
                        )}
                        {!microphoneAllowed && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                Please allow microphone access to use voice recording.
                            </Alert>
                        )}
                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <Tooltip title={listening ? 'Stop' : 'Record'}>
                                <AntButton
                                    type="primary"
                                    shape="circle"
                                    icon={listening ? <AudioMutedOutlined style={{ fontSize: '2rem' }} /> : <AudioOutlined style={{ fontSize: '2rem' }} />}
                                    onClick={listening ? stopListening : startListening}
                                    size="large"
                                    style={{ padding: '2rem' }}
                                    disabled={!browserSupported || !microphoneAllowed}
                                />
                            </Tooltip>
                        </Box>
                        <Box mt={2}>
                            <Typography variant="body1" gutterBottom>
                                Transcript
                            </Typography>
                            {totalTranscript && <Box display="flex">
                                <TextField
                                    multiline
                                    rows={7}
                                    variant="outlined"
                                    value={totalTranscript}
                                    onChange={(e) => setTotalTranscript(e.target.value)}
                                    fullWidth
                                />
                                <Tooltip title="Reset Transcript">
                                    <IconButton onClick={resetTranscript}>
                                        <ClearOutlined />
                                    </IconButton>
                                </Tooltip>
                            </Box>}

                        </Box>
                        <Box mt={2}>
                            <Typography variant="body1" gutterBottom>
                                Language
                            </Typography>
                            <Select
                                value={language}
                                onChange={handleLanguageChange}
                                disabled={listening}
                            >
                                <MenuItem value="en-US">English</MenuItem>
                                <MenuItem value="si-LK">Sinhala</MenuItem>
                                <MenuItem value="ta-IN">Tamil</MenuItem>
                            </Select>
                        </Box>
                    </Box>
                )}
                {activeStep === 2 && (
                    // ... (Summary & Prescription)
                    <h2>sad</h2>
                )}
                <Box mt={3} display="flex" justifyContent="space-between">
                    <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        disabled={activeStep === steps.length - 1}
                    >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

const calculateAge = (dateOfBirth) => {

    const dobMoment = moment(dateOfBirth);
    const currentMoment = moment();
    const age = currentMoment.diff(dobMoment, 'years');
    return age;

};

function getBloodGroupName(key) {

    const BloodGroupDescriptions = {
        1: "A+",
        2: "A-",
        3: "B+",
        4: "B-",
        5: "AB+",
        6: "AB-",
        7: "O+",
        8: "O-",
    };

    return BloodGroupDescriptions[key] || "Unknown"; // Return "Unknown" for invalid keys
}

export default ConsultationPage;