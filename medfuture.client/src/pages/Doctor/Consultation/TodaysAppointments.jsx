import { useRef, useEffect, useState, useContext } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import moment from 'moment';
import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, Button, Chip, Avatar } from '@mui/material';
import { Alert } from 'antd';
import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';
import { Link as RouterLink } from 'react-router-dom';


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
        return [
            {
                id: 1,
                patient: {
                    name: 'John Doe',
                    profilePicture: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=JD',
                },
                startTime: '09:00',
                endTime: '09:30',
                reason: 'Annual check-up',
            },
            {
                id: 2,
                patient: {
                    name: 'Jane Smith',
                    profilePicture: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=JS',
                },
                startTime: '10:00',
                endTime: '10:30',
                reason: 'Follow-up',
            },
            {
                id: 3,
                patient: {
                    name: 'Bob Johnson',
                    profilePicture: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=BJ',
                },
                startTime: '13:55',
                endTime: '13:59',
                reason: 'Consultation',
            },
            {
                id: 4,
                patient: {
                    name: 'Alice Williams',
                    profilePicture: 'https://via.placeholder.com/150/FFFF00/000000?text=AW',
                },
                startTime: '13:40',
                endTime: '13:50',
                reason: 'Consultation',
            },
            {
                id: 5,
                patient: {
                    name: 'Michael Brown',
                    profilePicture: 'https://via.placeholder.com/150/FF00FF/FFFFFF?text=MB',
                },
                startTime: '14:30',
                endTime: '15:00',
                reason: 'Physical therapy',
            },
            {
                id: 6,
                patient: {
                    name: 'Michael Brown',
                    profilePicture: 'https://via.placeholder.com/150/FF00FF/FFFFFF?text=MB',
                },
                startTime: '18:50',
                endTime: '19:13',
                reason: 'Physical therapy',
            },

            {
                id: 7,
                patient: {
                    name: 'Michael Brown',
                    profilePicture: 'https://via.placeholder.com/150/FF00FF/FFFFFF?text=MB',
                },
                startTime: '19:35',
                endTime: '19:40',
                reason: 'Physical therapy',
            },
        ]
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
    };

    return (
        <Card sx={{ width: { xs: '450px', md: '1100px' } }}>
            <CardContent>
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
                                {appointment.id === currentAppointment && (
                                    <Chip sx={{ mx: 2 }} label="Current" color="success" variant="filled" size="small" />
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
        endTime.hour() >= currentHour &&
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

    return false
}

export default TodaysAppointments;