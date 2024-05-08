
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Stepper, Step, StepLabel, Button, Grid, Card, CardContent, TextField, Avatar, Alert, IconButton, MenuItem, Select, List, ListItem, ListItemText } from '@mui/material';
import { AudioOutlined, AudioMutedOutlined, ClearOutlined } from '@ant-design/icons';
import { Button as AntButton, Tooltip } from 'antd';
import  useSpeechRecognition  from 'hooks/useAzureSpeechRecognition';


const ConsultationPage = () => {
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
                                <CardContent sx={{ textAlign:'left' }}>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Avatar alt="Patient Name" src="/static/images/avatar/1.jpg" />
                                        <Typography variant="h6" ml={2}>
                                            Patient Name
                                        </Typography>
                                    </Box>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle1">Age:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1">35</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle1">Gender:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1">Male</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle1">Contact:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1">123-456-7890</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle1">Blood Group:</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1">O+</Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Card sx={{ maxHeight: '300px', overflowY:'scroll' }}>
                                <CardContent>
                                    <Typography variant="h4" gutterBottom>
                                        Allergies
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemText
                                                primary="Pollen"
                                                secondary="Seasonal allergy causing sneezing and itching."
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="Peanuts"
                                                secondary="Allergic reaction leading to hives or swelling."
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="Pollen"
                                                secondary="Seasonal allergy causing sneezing and itching."
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="Peanuts"
                                                secondary="Allergic reaction leading to hives or swelling."
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="Pollen"
                                                secondary="Seasonal allergy causing sneezing and itching."
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary="Peanuts"
                                                secondary="Allergic reaction leading to hives or swelling."
                                            />
                                        </ListItem>

                                    </List>
                                </CardContent>
                            </Card>
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

export default ConsultationPage;