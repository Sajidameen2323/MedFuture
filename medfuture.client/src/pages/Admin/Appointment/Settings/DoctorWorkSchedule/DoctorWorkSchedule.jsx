/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Switch, Typography, FormControl, FormLabel, Grid, FormControlLabel, Select, MenuItem, Stack, Alert } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker as AntTimePicker } from 'antd';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import AnimateButton from 'components/@extended/AnimateButton';
import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeftOutlined
} from '@ant-design/icons';



const DoctorSchedule = () => {

    const { idToken } = useContext(FirebaseAuthContext);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const fetchData = useCallback( async () => {
    
            const response = await fetch('/api/doctor/doctors/workdayschedule', {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    "Content-Type": "application/json"
                },
                method: 'GET',
            });
            return response.json();
      
    }, [idToken]);


    const updateDoctorSchedule = useCallback(async (data) => {

        const response = await axios.post(`/api/doctor/doctors/update/workdayschedule`, data, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;

    }, [idToken]);

    const { mutate: DoctorScheduleMutate, isLoading: isMutating, isError: isUpdateError, error: updateError, reset: updateReset } = useMutation(updateDoctorSchedule, {
        onSuccess: (resData) => {
            console.log(resData);
            setSuccessMessage("Successfully Updated!");
            queryClient.invalidateQueries('ApiFetchDoctorsWorkSchedules');
        },
        onError: (err) => {
            console.log(err);

        }
    });

    const [activeStep, setActiveStep] = useState(0);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const [successMessage, setSuccessMessage] = useState(null);

    const [timeValue, setTimeValue] = React.useState([null, null]);
    const [workSchedule, setWorkSchedule] = useState({

        "0": false,
        "1": false,
        "2": false,
        "3": false,
        "4": false,
        "5": false,
        "6": false

    });

    const [doctorData, setDoctorData] = useState(null);

    const { data, isLoading, error } = useQuery('ApiFetchDoctorsWorkSchedules', fetchData, {
        refetchOnWindowFocus: false, // Prevent refetching when the window regains focus
        
    });

    useEffect(() => {
        // Fetch doctor schedule data from the server

        console.log(data);
        if (data) {
            let { result } = data;
            if (result) setDoctorData(result);
        }

    }, [data]);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleDoctorSelect = (doctorId) => {

        let doctor = doctorData.find(el => el.doctorId == doctorId);

        console.log(doctor)

        setSelectedDoctor(doctor);
        const timeFormat = "HH:mm:ss";

        const startTime = dayjs(doctor?.workingHours?.startTime, timeFormat);
        const endTime = dayjs(doctor?.workingHours?.endTime, timeFormat);

        setTimeValue([startTime, endTime]);

        const result = doctor?.workSchedule.reduce((obj, item) => {
            obj[item.dayOfWeek] = item.isWorkingDay;
            return obj;
        }, {

            "0": false,
            "1": false,
            "2": false,
            "3": false,
            "4": false,
            "5": false,
            "6": false

        });

        setWorkSchedule(result)

        handleNext();
    };

    const handleToggleDay = (dayKey, dayVal) => {


        setWorkSchedule((prev) => {
            let obj = { ...prev };
            obj[dayKey] = dayVal;
            return obj
        } )
    };

    const handleTimeChange = (values) => {

        setTimeValue(values)
    };

    const handleSaveSchedule = (e) => {
        // Save the updated schedule to the server
        console.log('Saving schedule:', timeValue);

        let sd = new Date(timeValue[0]);
        let st = formatDate(sd);
        console.log(st)

        let ed = new Date(timeValue[1]);
        let et = formatDate(ed);
        console.log(et)

        console.log(workSchedule)

        e.preventDefault();
        const formData = {
            doctorId: selectedDoctor.doctorId,
            startTime: st,
            endTime: et,
            workDaySchedule: workSchedule,
        };
        DoctorScheduleMutate(formData)
    };
    const handleGoBack = () => {
        navigate(-1);
    };
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ width: { xs: '100%', md: '1000px' } }} >
                        <Typography variant="h6">Select a doctor</Typography>
                        <FormControl fullWidth>
                            <Select
                                value={selectedDoctor ? selectedDoctor.doctorId : ''}
                                onChange={(e) => handleDoctorSelect(e.target.value)}
                            >
                                {doctorData && doctorData.map((doctor) => (
                                    <MenuItem key={doctor.doctorId} value={doctor.doctorId}>
                                        {doctor.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                );
            case 1:
                return (
                    <ScheduleStep
                        doctor={selectedDoctor}
                        timeValue={timeValue}
                        workSchedule={ workSchedule }
                        handleToggleDay={handleToggleDay}
                        handleTimeChange={handleTimeChange}
                    />
                );
            default:
                return 'Unknown step';
        }
    };

    if (isLoading) {

        return (
            <Box sx={{ maxWidth: { xs: 'auto', md: 1100 }, mx: 'auto', mt: 4 }}>

                <Typography variant="h6">
                    Fetching Data...
                </Typography>

            </Box>
        )

    }
    if (error) {

        return (
            <Box sx={{ maxWidth: { xs: 'auto', md: 1100 }, mx: 'auto', mt: 4 }}>

                <Typography color="error" variant="h6">
                    Server Error!!
                </Typography>

            </Box>
        )

    }

    return (
        <Box sx={{ maxWidth: { xs: 'auto', md: 1100 }, mx: 'auto', mt: 4 }}>
            <Box sx={{ my: 2 }}>
                <Button
                    variant="text"
                    color="primary"
                    size="small"
                    onClick={handleGoBack}
                    startIcon={<ArrowLeftOutlined />}
                >
                    Go Back
                </Button>

            </Box>
            <Stepper activeStep={activeStep}>
                {['Select Doctor', 'Update Schedule'].map((label, index) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box sx={{ my: 2 }}>
                {successMessage && <Alert onClose={() => { setSuccessMessage(null) }} severity="success">{successMessage}</Alert>}
            </Box>
            <Box sx={{ my: 2 }}>
                {isUpdateError && <Alert onClose={() => { updateReset() }} severity="error">{updateError?.message}</Alert>}
            </Box>
            <Box sx={{ mt: 4 }}>{getStepContent(activeStep)}</Box>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                {activeStep !== 0 && (
                    <Button onClick={handleBack}>Back</Button>
                )}
                {activeStep === 0 ? (
                    <Button disabled={!selectedDoctor} onClick={handleNext}>
                        Next
                    </Button>
                ) : (
                        <AnimateButton>
                            <Button disableElevation disabled={isMutating} onClick={handleSaveSchedule} fullWidth size="large" type="submit" variant="contained" color="primary">
                                Save Schedule
                            </Button>
                        </AnimateButton>

                )}
            </Box>
        </Box>
    );
};

const ScheduleStep = ({ doctor, timeValue, workSchedule , handleToggleDay, handleTimeChange }) => {


    const days = [
        { id: 0, label: 'Sunday' },
        { id: 1, label: 'Monday' },
        { id: 2, label: 'Tuesday' },
        { id: 3, label: 'Wednesday' },
        { id: 4, label: 'Thursday' },
        { id: 5, label: 'Friday' },
        { id: 6, label: 'Saturday' }
    ];

    return (
        <Box sx={{ width: { xs: 'auto', md: '1100px' }, display:'flex', justifyContent:'center' } } >
            <Stack >
                <Typography variant="h6">
                    {doctor ? `${doctor.name}'s Schedule` : 'Loading...'}
                </Typography>
            <FormControl component="fieldset" sx={{ mt: 2 }}>
                <FormLabel component="legend">Working Time</FormLabel>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent:'center' }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <AntTimePicker.RangePicker value={timeValue} minuteStep={10} format="HH:mm" hourStep={1} size="large" showNow use12Hours

                                onCalendarChange={(e) => {

                                handleTimeChange([e[0], e[1]]);

                            }} />
                    </LocalizationProvider>
                </Box>
            
            </FormControl>


                <FormControl component="fieldset" sx={{ mt: 2 }}>
                    <FormLabel component="legend">Working Days</FormLabel>
                    <Box sx={{ width: 500, border: '1px solid #ccc', borderRadius: 2, p: 2 }}>
                        <Grid container>
                            {days.map((day, index) => (
                                <Grid item xs={6} key={day.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Box sx={{ width: '60%' }}>
                                        <Typography variant="body1">{day.label}</Typography>
                                    </Box>
                                    <Box sx={{ width: '40%', display: 'flex', justifyContent: 'flex-end' }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={workSchedule[day.id] ?? false}
                                                    onChange={(e) => {

                                                        console.log(e.target.checked)
                                                        handleToggleDay(String(day.id), e.target.checked)
                                                    }}
                                                    color="primary"
                                                />
                                            }
                                        />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </FormControl>

            </Stack>
        </Box>
    );
};

function formatDate(date) {

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
}

export default DoctorSchedule;