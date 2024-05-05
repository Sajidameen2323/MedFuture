import { useRef, useEffect, useState, useContext } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import moment from 'moment';
import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, Button, Chip, Avatar } from '@mui/material';
import { Alert } from 'antd';
import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';
import { Link as RouterLink } from 'react-router-dom';
import { Empty } from "antd";

const TodaysAppointments = () => {
    const { idToken } = useContext(FirebaseAuthContext);
    const [currentAppointment, setCurrentAppointment] = useState(null);
    const currentAppointmentRef = useRef(null);

    const fetchAppointments = async () => {
        const response = await axios.get('/api/doctor/appointments/today', {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
        });
        console.log(response.data)
        let dd = [
           
        ]
        if (response.data) {

            response.data.forEach(el => {

                dd.push({
                    id: el?.appointmentId,
                    patient: el?.patient,
                    startTime: moment(new Date(el?.startDateTime), 'HH:mm').format("HH:mm"),
                    endTime: moment(new Date(el?.endDateTime), 'HH:mm').format("HH:mm"),
                    reason: el?.name,
                    status: el?.status ?? "Pending"
                })
            })
        }
        return dd
    };

    const { isLoading, error, data: appointments } = useQuery('appointments', fetchAppointments, {
        refetchInterval: 60000,
        refetchOnWindowFocus: false
        
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const currentAppointmentId = appointments.find(isCurrentAppointment)?.id;
            setCurrentAppointment(currentAppointmentId);
        }, 1000); // Check for current appointment every second

        return () => clearInterval(interval);
    }, [appointments]);

    useEffect(() => {
        if (currentAppointmentRef.current) {
            currentAppointmentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [currentAppointment]);

    if (isLoading) return <Typography variant="h6">Loading appointments...</Typography>;
    if (error) return <Alert message={`Error: ${error.message}`} type="error" />;

    const handleAddConsultation = (appointment) => {
        // Open the consultation form for the selected appointment
        console.log('Add consultation for appointment:', appointment);
        console.log(getChipColorByStatus(appointment.status))
    };

    return (
        <Card sx={{ width: { xs: '450px', md: '1100px' } }}>
            <CardContent>
                {appointments.length == 0 && <Empty /> }
        
                <List>
                    {appointments.map(appointment => (
                        <ListItem
                            key={appointment.id}
                            button
                            onClick={() => handleAddConsultation(appointment)}
                            style={{
                                backgroundColor: appointment.id === currentAppointment ? '#e0e0e0' : 'transparent',
                            }}
                            ref={appointment.id === currentAppointment ? currentAppointmentRef : null}
                        >
                            <Avatar
                                alt={appointment.patient.name}
                                src={appointment.patient.profilePicture}
                                sx={{ mx: 2 }}
                                variant="rounded"
                            />
                            <ListItemText
                                primary={appointment.patient.name}
                                secondary={`${appointment.startTime} - ${appointment.endTime} - ${appointment.reason}`}
                            />

                            <ListItemSecondaryAction>
                                <Chip sx={{ mr: 2 }} label={appointment.status} color={getChipColorByStatus(appointment.status)} variant="outlined" size="small" />

                                {appointment.id === currentAppointment && (
                                    <Chip sx={{ mr: 2 }} label="Current" color="success" variant="filled" size="small" />
                                )}
                                <Button variant="contained" size="small" disableElevation component={RouterLink} to={`/doctor/appointments/${appointment.id}/action` } >
                                    Action
                                </Button>

                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

const getChipColorByStatus = (status) => {

    switch (status) {

        case "Pending":
            return "warning";
        case "Completed":
            return "info";
        case "Missed":
            return "error";
        default:
            return "primary"
    }

}

const isCurrentAppointment = (appointment) => {
    const now = moment();
    const currentHour = now.hour();
    const currentMinute = now.minute();

    const startTime = moment(appointment.startTime, 'HH:mm');
    const endTime = moment(appointment.endTime, 'HH:mm');

    //console.log("moment " + currentHour + " : " + currentMinute);
    //console.log("app " + startTime.hour() + " : " + startTime.minute() + " | " + endTime.hour() + " : " + endTime.minute());

    if (
        startTime.hour() === currentHour &&
        startTime.minute() <= currentMinute &&
        endTime.hour() == currentHour &&
        endTime.minute() > currentMinute
    ) {
        return true;
    }
    else if (
        startTime.hour() < currentHour &&
        endTime.hour() === currentHour &&
        endTime.minute() > currentMinute
    ) {
        return true
    }
    else if (
        startTime.hour() === currentHour &&
        startTime.minute() <= currentMinute &&
        endTime.hour() > currentHour &&
        endTime.minute() < currentMinute
    ) {
        return true
    }

    return false
}

export default TodaysAppointments;