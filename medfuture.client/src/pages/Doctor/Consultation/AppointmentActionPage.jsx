/* eslint-disable react/prop-types */
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Button, Typography, Box, Card, CardContent, Avatar, Divider } from '@mui/material';
import { Alert } from 'antd';
import AppointmentAction from './AppointmentAction';

const AppointmentActionPage = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();

    const fetchAppointment = async () => {
        try {
            const response = await axios.get(`/api/appointments/${appointmentId}`);
            return response.data;
        } catch (error) {
            //throw new Error('Failed to fetch appointment');
            return {
                id: 7,
                patient: {
                    name: 'Michael Brown',
                    profilePicture: 'https://via.placeholder.com/150/FF00FF/FFFFFF?text=MB',
                },
                startTime: '19:35',
                endTime: '19:40',
                reason: 'Physical therapy',
            }
        }
    };

    const { isLoading, error, data: appointment } = useQuery(['appointment', appointmentId], fetchAppointment);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography variant="h4">Loading appointment...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Alert message={`Error: ${error.message}`} type="error" />
            </Box>
        );
    }

    if (!appointment) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Typography variant="h4">Appointment not found</Typography>
            </Box>
        );
    }

    const handleGoBack = () => {
        navigate(-1);
    };

    return (

        <Box sx={{ width: { md: '1100px' }, textAlign: 'left' }}>
            <Box>
                <Typography variant="h4" mb={2}>
                    Appointment Action
                </Typography>
                <Button variant="contained" color="primary" onClick={handleGoBack} sx={{ mt: 2 }}>
                    Go Back
                </Button>
            </Box>
        
      
        <Box display="flex" flexDirection="column" alignItems="center" mt={4}  >

            <Card sx={{ width: { md: '600px' }, my: { md:2 } }}>
                <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                        <Avatar
                            alt={appointment.patient.name}
                            src={appointment.patient.profilePicture}
                            sx={{ mr: 2 }}
                        />
                        <Typography variant="h6">{appointment.patient.name}</Typography>
                    </Box>
                    <Divider />
                    <Box mt={2} sx={ { textAlign:'left' } } >
                        <Typography variant="body1">
                            <strong>Time:</strong> {appointment.startTime} - {appointment.endTime}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Reason:</strong> {appointment.reason}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
                <AppointmentAction appointment={appointment} onAppointmentComplete={() => { console.log("kaham") } } />

            </Box>
        </Box>
    );
};

export default AppointmentActionPage;