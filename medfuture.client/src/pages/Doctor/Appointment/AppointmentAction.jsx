/* eslint-disable react/prop-types */
import React, { useState, useContext } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Stack } from '@mui/material';
import { notification } from 'antd';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';
import { useNavigate } from "react-router-dom";

const AppointmentAction = ({ appointment, onAppointmentComplete }) => {
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState(null);
    const queryClient = useQueryClient();
    const { idToken } = useContext(FirebaseAuthContext);
    const navigate = useNavigate();

    const updateAppointmentStatus = async (appointmentId, status) => {

        const response = await axios.put(`/api/doctor/appointments/${appointmentId}/status/update`, { status }, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    };

    const { mutate: UpdateStatus } = useMutation(

        (status) => updateAppointmentStatus(appointment?.appointmentId, status),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('ApiGetAppointmentForDoctor');
                if (action === 'missed') {
                    notification.success({
                        key: 'missed',
                        message: 'Missed Appointment',
                        description: 'Successfully Marked as Missed.',
                        duration: 2,
                    });
                }
                else if (action === "complete") {

                    notification.success({
                        key: 'complete',
                        message: 'Appointment Completed',
                        description: 'Appointment has been completed.',
                        duration: 2,
                    });
                }

            },
            onError: (error) => {
                console.error('Error updating appointment status:', error);

                if (action === 'missed') {
                    notification.error({
                        key: 'missed',
                        message: 'Error',
                        description: 'Failed to update appointment status.',
                        duration: 2,
                    });
                }
                else if (action === "complete") {

                    notification.error({
                        key: 'complete',
                        message: 'Error',
                        description: 'Failed to update appointment status.',
                        duration: 2,
                    });
                }

            },
        }
    );


    const handleOpenDialog = (actionType) => {
        setAction(actionType);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setAction(null);
    };

    const handleConsultation = () => {

        navigate(`/doctor/appointments/${appointment?.appointmentId}/consultation`, { state: { kaaham: 'kaaham' } });

    }

    const handleConfirmAction = () => {
        if (action === 'missed') {
            // Mark appointment as missed
            notification.warning({
                key: 'missed',
                message: 'Missed Appointment',
                description: 'Marking appointment as missed...',
                duration: 2,
            });
            UpdateStatus(3)


        } else if (action === 'complete') {
            // Complete appointment
            onAppointmentComplete(appointment.id);
            notification.warning({
                key: 'complete',
                message: 'Completing Appointment',
                description: 'Marking appointment as Completed...',
                duration: 2,
            });
            UpdateStatus(4)
        }

        handleCloseDialog();
    };


    //public enum AppointmentStatus {
    //    Pending = 1,
    //    Cancelled = 2,
    //    Missed = 3,
    //    Completed = 4,
    //}

    return (
        <>
       
            <Stack direction="row" spacing={2}>
            {appointment?.con ? (
                <Button variant="contained" color="primary" onClick={() => handleOpenDialog('consultation')}>
                    View Consultation
                </Button>
            ) : (
                <>
                    <Button variant="contained" color="primary" onClick={handleConsultation}>
                        Start Consultation
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => handleOpenDialog('missed')}>
                        Mark as Missed
                    </Button>
                </>
            )}
            <Button variant="contained" color="success" onClick={() => handleOpenDialog('complete')}>
                Complete Appointment
            </Button>
            </Stack>
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>
                    {action === 'consultation'
                        ? 'Start Consultation'
                        : action === 'missed'
                            ? 'Mark as Missed'
                            : 'Complete Appointment'}
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        {action === 'consultation'
                            ? 'Are you sure you want to start a consultation for this appointment?'
                            : action === 'missed'
                                ? 'Are you sure you want to mark this appointment as missed?'
                                : 'Are you sure you want to complete this appointment?'}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleConfirmAction} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AppointmentAction;