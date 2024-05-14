import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Avatar, Divider, Button, Grid } from '@mui/material';
import { Alert, Spin } from 'antd';
import { styled } from '@mui/system';
import AppointmentAction from './AppointmentAction';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';
import moment from 'moment';

const StyledCard = styled(Card)(({ theme }) => ({
    boxShadow: theme.shadows[4],
    borderRadius: theme.shape.borderRadius,
}));

const AppointmentActionPage = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const { idToken } = useContext(FirebaseAuthContext);

    const fetchAppointment = async () => {
        try {
            const response = await axios.get(`/api/patient/appointments/${appointmentId}/details`, {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
            });
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch appointment');
        }
    };

    const { isLoading, error, data: appointment } = useQuery(['ApiGetAppointmentForDoctor', appointmentId], fetchAppointment);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Spin size="large" />
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
        <Box sx={{ width: { md: '1100px' }, textAlign: 'left', mx: 'auto' }}>
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

            <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                <StyledCard sx={{ width: { md: '600px' }, my: { md: 2 } }}>
                    <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                            <Avatar
                                alt={appointment.doctor.name}
                                src={appointment?.doctor?.profilePicture}
                                sx={{ mr: 2 }}
                            />
                            <Typography variant="h6">{appointment.doctor.name}</Typography>
                        </Box>
                        <Divider />
                        <Box mt={2} sx={{ textAlign: 'left' }}>
                            <Typography variant="body1">
                                <strong>Time:</strong> {moment(new Date(appointment?.startDateTime), 'HH:mm').format("HH:mm")} - {moment(new Date(appointment?.endDateTime), 'HH:mm').format("HH:mm")}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Reason:</strong> {appointment.name}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Status:</strong> {appointment.status}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Duration:</strong> {appointment?.duration || 10} min
                            </Typography>
                        </Box>
                    </CardContent>
                </StyledCard>
                <AppointmentAction appointment={appointment} onAppointmentComplete={() => { console.log("kaham") }} />
            </Box>
        </Box>
    );
};

export default AppointmentActionPage;