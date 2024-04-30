/* eslint-disable react/prop-types */
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Datepicker, getJson, Page, setOptions, momentTimezone } from '@mobiscroll/react';
import { useCallback, useState } from 'react';
import dayjs from 'dayjs';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Logo from 'components/Logo';
import { Card, CardContent, Typography, Button, Box, CardActions } from '@mui/material';
import moment from 'moment-timezone';
import { useEffect } from 'react';


// setup Mobiscroll Moment plugin
momentTimezone.moment = moment;

setOptions({
    theme: 'material',
    themeVariant: 'light'
});

const getAppointmentSchedule = async (docId, serviceId) => {
    const response = await fetch('/api/appointment/get-appointment-schedule?docId=' + docId + '&serviceId='+ serviceId);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
};

function App({ setSelectedDateTime, selectedService, selectedDoctor }) {

    const { isLoading, isError, data: scheduleData, error } = useQuery(['appointmentScheduleApi', selectedDoctor.doctorID], () => getAppointmentSchedule(selectedDoctor.doctorID, selectedService.serviceID), {
        // Optional configuration options for useQuery
        refetchOnWindowFocus: false,
        staleTime: 0, // Fetch data again if it's older than 0 seconds
        refetchInterval: 60 * 60 * 1000, // Refetch data every hour (optional)
        onError: (error) => {
            console.error('Error fetching appointment schedule:', error);
        },
    });


    const today = new Date();
    const minDateObj = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
    const maxDateObj = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    minDateObj.setUTCHours(0, 0, 0, 0);
    maxDateObj.setUTCHours(23, 0, 0, 0);


    const min = minDateObj.toISOString();
    const max = maxDateObj.toISOString();

    const [minDate, setMinDate] = useState(min);
    const [maxDate, setMaxDate] = useState(max);

    const [datetimeLabels, setDatetimeLabels] = useState([]);
    const [datetimeInvalid, setDatetimeInvalid] = useState([]);
 
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

    }, [scheduleData])

    const handlePageLoadingDatetime = useCallback((args) => {

        const invalid = [

            {
                recurring: {
                    repeat: 'yearly',
                    day: 23,
                    month: 5
                }
            },
            //{
            //    start: '2024-05-07',
            //    end: '2024-05-10'
            //},
        ];
        const labels = [];

        let bookedApps = scheduleData?.groupedAppointments || [];
        let weeklyInvalids = scheduleData?.weeklyInvalid;
        if (weeklyInvalids?.weekDays != "") {
            invalid.push({ recurring: weeklyInvalids })
        }


        for (let i = 0; i < bookedApps.length; i++)
        {
            let booking = bookedApps[i];
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

        console.log(scheduleData);
        setDatetimeLabels(labels);
        setDatetimeInvalid(invalid);


    }, [scheduleData]);

    return (
        <Box sx={{ my: 4, height: isLoading?'500px':'100%' }}>

                <Datepicker

                display="inline"
                dateFormat="DD.MM.YYYY"
                    controls={['calendar', 'timegrid']}
                    min={minDate}
                    max={maxDate}
                    minTime={scheduleData?.doctorWorkingHours.startTime ?? "08:00"}
                    maxTime={scheduleData?.doctorWorkingHours.endTime ?? "18:00"}
                    stepMinute={selectedService?.duration || 15}
                    width={null}
                    labels={datetimeLabels}
                    invalid={datetimeInvalid}
                    onPageLoading={handlePageLoadingDatetime}
                    cssClass="booking-datetime"
                    onChange={(event) => {
                        const selectedDatetime = event.value;
                        // Process the selectedDatetime (format, etc.) as needed
                        
                        console.log('Selected datetime:', selectedDatetime.toLocaleString());
                       // const formattedDate = `${selectedDatetime.getFullYear()}-${selectedDatetime.getMonth() + 1}-${selectedDatetime.getDate()}T${selectedDatetime.getHours()}:${selectedDatetime.getMinutes()}:00.000Z`;

                        let formattedDate = formatDate(selectedDatetime);
                        console.log('ISO datetime:', selectedDatetime.toISOString());
                        console.log('Formatted datetime:', formattedDate);

                        setSelectedDateTime(formattedDate)
                        console.log(datetimeInvalid)
                        console.log("min max dates - "+ minDate+" , "+ maxDate)
                }}

                />
     

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

export default App;