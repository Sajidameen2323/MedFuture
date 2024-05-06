/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Stepper, Step, StepLabel, Button, Grid, Card, CardContent, TextField, Avatar } from '@mui/material';
import { AudioOutlined, AudioMutedOutlined } from '@ant-design/icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Alert } from '@mui/lab';
import { Button as AntButton, Tooltip } from 'antd';

const ConsultationPage = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [summary, setSummary] = useState('');
    const [prescription, setPrescription] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [transcript, setTranscript] = useState('');
    const [microphoneError, setMicrophoneError] = useState(null);

    const {
        transcript: speechTranscript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
        isMicrophoneAvailable
    } = useSpeechRecognition();

    useEffect(() => {
        if (speechTranscript !== '') {
            setTranscript(speechTranscript);
        }
    }, [speechTranscript]);

    useEffect(() => {
        if (!isMicrophoneAvailable) {
            setMicrophoneError('Please allow microphone access to use voice recording');
        } else {
            setMicrophoneError(null);
        }
    }, [isMicrophoneAvailable]);

    useEffect(() => {

        return () => {
            SpeechRecognition.abortListening()
        }

    },[])

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const steps = ['Patient Details', 'Voice Recording', 'Summary & Prescription'];

    const handleStartRecording = () => {
        SpeechRecognition.startListening({ continuous: true });
    };

    const handleStopRecording = () => {
        SpeechRecognition.stopListening();
       // resetTranscript();
    };

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

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
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Avatar alt="Patient Name" src="/static/images/avatar/1.jpg" />
                                        <Typography variant="h6" ml={2}>
                                            Patient Name
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1">Age: 35</Typography>
                                    <Typography variant="body1">Gender: Male</Typography>
                                    <Typography variant="body1">Contact: 123-456-7890</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Allergies
                                    </Typography>
                                    <Typography variant="body1">Pollen</Typography>
                                    <Typography variant="body1">Peanuts</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}
                {activeStep === 1 && (
                    <Box>
                        {microphoneError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {microphoneError}
                            </Alert>
                        )}
                        <Box display="flex" justifyContent="center" alignItems="center">
                            <Tooltip title={ listening?"Stop":'Record' }>
                            <AntButton
                                type="primary"
                                shape="circle"
                                icon={listening ? <AudioMutedOutlined style={{ fontSize: '2rem' }} /> : <AudioOutlined style={{ fontSize: '2rem' }} />}
                                onClick={listening ? handleStopRecording : handleStartRecording}
                                size="large"
                                style={{ padding:'2rem' }}
                                />
                            </Tooltip>
                        </Box>
                        <Box mt={2}>
                            <Typography variant="body1" gutterBottom>
                                Transcript:
                            </Typography>
                            {transcript ? (
                                <TextField
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    value={transcript}
                                    onChange={(e) => setTranscript(e.target.value)}
                                    fullWidth
                                />
                            ) : (
                                <Typography variant="body2" color="textSecondary">
                                    Press the record button to start transcribing.
                                </Typography>
                            )}
                        </Box>
                    </Box>
                )}
                {activeStep === 2 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Summary
                                    </Typography>
                                    <TextField
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        value={summary}
                                        onChange={(e) => setSummary(e.target.value)}
                                        fullWidth
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Prescription
                                    </Typography>
                                    <TextField
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        value={prescription}
                                        onChange={(e) => setPrescription(e.target.value)}
                                        fullWidth
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Additional Notes
                                    </Typography>
                                    <TextField
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        value={additionalNotes}
                                        onChange={(e) => setAdditionalNotes(e.target.value)}
                                        fullWidth
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
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