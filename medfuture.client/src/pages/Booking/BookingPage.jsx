/* eslint-disable react/prop-types */
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Datepicker, getJson, Page, setOptions, momentTimezone } from '@mobiscroll/react';
import { useCallback, useState } from 'react';
import dayjs from 'dayjs';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Logo from 'components/Logo';
import { Card, CardContent, Typography, Button, Box, CardActions } from '@mui/material';
import moment from 'moment-timezone';


// setup Mobiscroll Moment plugin
momentTimezone.moment = moment;

setOptions({
    theme: 'material',
    themeVariant: 'light'
});

const getAppointmentSchedule = async (docId) => {
    const response = await fetch('/api/appointment/get-appointment-schedule?docId=' + docId);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
};

function App({ setSelectedDateTime, selectedService, selectedDoctor }) {

    const { isLoading, isError, data: scheduleData, error } = useQuery(['appointmentScheduleApi', selectedDoctor.doctorID], () => getAppointmentSchedule(selectedDoctor.doctorID), {
        // Optional configuration options for useQuery
        staleTime: 0, // Fetch data again if it's older than 0 seconds
        refetchInterval: 60 * 60 * 1000, // Refetch data every hour (optional)
        onError: (error) => {
            console.error('Error fetching appointment schedule:', error);
        },
    });


    const today = new Date();
    const minDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const maxDate = new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000);

    minDate.setUTCHours(0, 0, 0, 0);
    maxDate.setUTCHours(23, 0, 0, 0);


    const min = minDate.toISOString();
    const max = maxDate.toISOString();

    const [datetimeLabels, setDatetimeLabels] = useState([]);
    const [datetimeInvalid, setDatetimeInvalid] = useState([]);
 


    const handlePageLoadingDatetime = useCallback((args) => {

    

        const ddd = args.firstDay;
        const invalid = [];
        const labels = [];

        for (let i = 0; i < scheduleData.length; i++)
        {
            let booking = scheduleData[i];
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

    if (isLoading) {

        return (
            <>
                <div style={{ width:'100vw', height:'80vh', textAlign:'center'}}>
                        <h3>Loading...</h3>
                </div>
            </>
        )
    }
    if (isError) {

        return (
            <>
                <h5>Failed To fetch data</h5>
            </>
        )
    }

    return (
        <Box sx={{ my:4 } }>

 

                <Datepicker

                display="inline"
                dateFormat="DD.MM.YYYY"
                    controls={['calendar', 'timegrid']}
                    min={min}
                    max={max}
                    minTime="08:00"
                    maxTime="19:59"
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