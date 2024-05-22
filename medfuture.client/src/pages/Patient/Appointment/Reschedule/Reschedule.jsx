/* eslint-disable react/prop-types */
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Datepicker, setOptions, momentTimezone } from '@mobiscroll/react';
import { useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Card, CardContent, CardActions, Typography, Box, Grid } from '@mui/material';
import moment from 'moment-timezone';
import { useEffect, useContext } from 'react';
import { Button, notification } from 'antd';
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';

// setup Mobiscroll Moment plugin
momentTimezone.moment = moment;

setOptions({
    theme: 'material',
    themeVariant: 'light'
});

const getAppointmentSchedule = async (docId, serviceId) => {
    const response = await fetch('/api/appointment/get-appointment-schedule?docId=' + docId + '&serviceId=' + serviceId);
    if (!response.ok) {
        let { error, errors } = await response.json();
        console.log(errors)
        throw new Error(error || JSON.stringify(errors));
    }
    return await response.json();
};

const rescheduleAppointment = async (idToken, appId, startDateTime) => {
    
        const response = await axios.put(
            `/api/patient/appointments/${appId}/reschedule`,
            { startDateTime },
            {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            }
        );
        return response.data;
   
};

function RescheduleComponent() {

    const location = useLocation();
    const navigate = useNavigate();
    const { rescheduleData } = location.state || {};
    const { idToken } = useContext(FirebaseAuthContext);

    const queryClient = useQueryClient();
    const { isLoading, isError, data: scheduleData, error: AppScheduleError } = useQuery(['appointmentScheduleApi', rescheduleData?.doctorId], () => getAppointmentSchedule(rescheduleData?.doctorId, rescheduleData?.serviceId), {
        refetchOnWindowFocus: false,
        staleTime: 0,
        refetchInterval: 60 * 60 * 1000,
        onError: (error) => {
            console.error('Error fetching appointment schedule:', error);
        },
    });

    const [datetimeLabels, setDatetimeLabels] = useState([]);
    const [datetimeInvalid, setDatetimeInvalid] = useState([]);
    const [minDate, setMinDate] = useState(null);
    const [maxDate, setMaxDate] = useState(null);
    const [rescheduledDateTime, setRescheduledDateTime] = useState(null);

    const { mutate: updateAppointment } = useMutation(() => { rescheduleAppointment(idToken, rescheduleData?.appointmentId, rescheduledDateTime) }, {
        onSuccess: () => {
            queryClient.invalidateQueries('appointmentScheduleApi');
            notification.success({
                key: 'reschedule',
                message: 'Appointment Rescheduled',
                description: `Your appointment has been successfully rescheduled to ${rescheduledDateTime}.`,
                duration: 2,
            });
            navigate(-1);
        },
        onError: (error) => {
            notification.error({
                key: 'reschedule',
                message: 'Error Rescheduling Appointment',
                description: `Failed to reschedule the appointment to ${rescheduledDateTime}. ${error.message}`,
                duration: 2,
            });
        }
    })
   

    useEffect(() => {

        console.log(rescheduleData)
        setRescheduledDateTime(rescheduleData?.startDateTime)

    }, [rescheduleData])    

    useEffect(() => {

        if (scheduleData && scheduleData?.settings) {
            let num1 = scheduleData?.settings?.minimumTimeBeforeBookingInDays ?? 3;
            let num2 = scheduleData?.settings?.bookingPeriodInDays ?? 30;

            let today = new Date();
            let minDateObj = new Date(today.getTime() + num1 * 24 * 60 * 60 * 1000);
            let maxDateObj = new Date(today.getTime() + num2 * 24 * 60 * 60 * 1000);

            minDateObj.setUTCHours(0, 0, 0, 0);
            maxDateObj.setUTCHours(23, 0, 0, 0);

            let min = minDateObj.toISOString();
            let max = maxDateObj.toISOString();

            setMinDate(min);
            setMaxDate(max);

            console.log("min max date set from db")
        }

        handlePageLoadingDatetime();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scheduleData]);

    const handlePageLoadingDatetime = useCallback(() => {
        const invalid = [];
        const labels = [];

        const holidays = scheduleData?.holidays || [];
        const bookedApps = scheduleData?.groupedAppointments || [];
        const weeklyInvalids = scheduleData?.weeklyInvalid;

        if (weeklyInvalids?.weekDays !== '') {
            invalid.push({ recurring: weeklyInvalids });
        }

        holidays.forEach((el) => {
            const endDate = new Date(el?.endDate);
            if (endDate) {
                endDate.setDate(endDate.getDate() + 1);
                endDate.setHours(1);
                endDate.setMinutes(0);
            }
            invalid.push({
                start: el?.startDate,
                end: endDate
            });
        });

        for (let i = 0; i < bookedApps.length; i++) {
            const booking = bookedApps[i];
            const d = new Date(booking.d);
            if (booking.nr > 0) {
                labels.push({
                    start: d,
                    title: booking.nr + ' SPOTS',
                    textColor: '#e1528f',
                });
                invalid.push(...booking.invalid);
            } else {
                invalid.push(d);
            }
        }

        setDatetimeLabels(labels);
        setDatetimeInvalid(invalid);
    }, [scheduleData]);

    const handleReschedule = () => {

        console.log(rescheduledDateTime)
        // Show a success notification
        notification.warning({
            key: 'reschedule',
            message: 'Appointment Rescheduled',
            description: `Rescheduling Your appointment to ${rescheduledDateTime}.`,
            duration: 3
        });
        // Update the appointment with the rescheduled datetime
        updateAppointment(rescheduledDateTime);


    };
    const handleGoBack = () => {
        navigate(-1);
    };

    if (isError) {
        return <ErrorComponent error={AppScheduleError} handleGoBack={handleGoBack} />;
    }
    if (isLoading) {

        return (
            <Box sx={{ my: 4, height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Typography variant="h4" gutterBottom>
                            Appointment Action
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleGoBack}
                            startIcon={<ArrowBackIcon />}
                        >
                            Go Back
                        </Button>
                    </Grid>
                </Grid>
                <Card>
                    <CardContent>
                        <Typography variant="h5" component="div" gutterBottom>
                            Initializing Component
                        </Typography>
                        <Typography variant="body1" color="primary">
                            Fetching Appointment Schedule
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
            )
    }

    return (
        <Box sx={{ my: 4, height: isLoading ? '500px' : '100%' }}>
            <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                <Grid item>
                    <Typography variant="h4" gutterBottom>
                        Appointment Action {rescheduleData?.duration}
                    </Typography>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleGoBack}
                        startIcon={<ArrowBackIcon />}
                    >
                        Go Back
                    </Button>
                </Grid>
            </Grid>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                        Reschedule Appointment
                    </Typography>
                    <Datepicker
                        display="inline"
                        dateFormat="DD.MM.YYYY"
                        controls={['calendar', 'timegrid']}
                        min={minDate}
                        max={maxDate}
                        minTime={scheduleData?.doctorWorkingHours.startTime ?? '08:00'}
                        maxTime={scheduleData?.doctorWorkingHours.endTime ?? '18:00'}
                        stepMinute={rescheduleData?.duration || 10}
                        width={null}
                        labels={datetimeLabels}
                        invalid={datetimeInvalid}
                        onPageLoading={handlePageLoadingDatetime}
                        cssClass="booking-datetime"
                        value={ rescheduledDateTime }
                        onChange={(event) => {
                            const selectedDatetime = event.value;
                            // Process the selectedDatetime (format, etc.) as needed

                            console.log('Selected datetime:', selectedDatetime.toLocaleString());
                            // const formattedDate = `${selectedDatetime.getFullYear()}-${selectedDatetime.getMonth() + 1}-${selectedDatetime.getDate()}T${selectedDatetime.getHours()}:${selectedDatetime.getMinutes()}:00.000Z`;

                            let formattedDate = formatDate(selectedDatetime);
                            console.log('ISO datetime:', selectedDatetime.toISOString());
                            console.log('Formatted datetime:', formattedDate);

                            setRescheduledDateTime(formattedDate)
                            console.log(datetimeInvalid)
                            console.log("min max dates - " + minDate + " , " + maxDate)
                        }}
                    />
                    <CardActions disableSpacing>
                        <Button onClick={handleReschedule} style={{ borderRadius:0 }} type="primary" htmlType="submit" disabled={!rescheduledDateTime}>
                                 Reschedule Appointment
                        </Button>
                  </CardActions>
                </CardContent>
            </Card>
        </Box>
    );
}

function formatDate(date) {

    const year = date.getFullYear().toString().padStart(4, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}

// Error component
const ErrorComponent = ({ error, handleGoBack }) => (

    <Box sx={{ my: 4, height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
            <Grid item>
                <Typography variant="h4" gutterBottom>
                    Appointment Action
                </Typography>
            </Grid>
            <Grid item>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGoBack}
                    startIcon={<ArrowBackIcon />}
                >
                    Go Back
                </Button>
            </Grid>
        </Grid>
        <Card>
            <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                    Error
                </Typography>
                <Typography variant="body1" color="error">
                    {error.message}
                </Typography>
            </CardContent>
        </Card>
    </Box>
);
export default RescheduleComponent;