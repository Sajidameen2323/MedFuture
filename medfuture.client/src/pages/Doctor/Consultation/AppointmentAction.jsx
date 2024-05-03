/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Stack } from '@mui/material';
import { notification } from 'antd';

const AppointmentAction = ({ appointment, onAppointmentComplete }) => {
    const [open, setOpen] = useState(false);
    const [action, setAction] = useState(null);

    const handleOpenDialog = (actionType) => {
        setAction(actionType);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setAction(null);
    };

    const handleConfirmAction = () => {
        if (action === 'consultation') {
            // Open consultation form or navigate to consultation page
            notification.info({

                message: 'Consultation',
                description: 'Opening consultation form...',
                duration: 2,
            });
        } else if (action === 'missed') {
            // Mark appointment as missed
            notification.warning({
                key: 'kak',
                message: 'Missed Appointment',
                description: 'Marking appointment as missed...',
                duration: 2,
            });
            setTimeout(() => {
                notification.success({
                    key: 'kak',
                    message: 'Missed Appointment',
                    description: 'Successfully Marked as Missed.',
                    duration: 2,
                });
            }, 1000);


        } else if (action === 'complete') {
            // Complete appointment
            onAppointmentComplete(appointment.id);
            notification.success({
                message: 'Appointment Completed',
                description: 'Appointment has been completed.',
                duration: 2,
            });
        }

        handleCloseDialog();
    };


    return (
        <>
       
            <Stack direction="row" spacing={2}>
            {appointment?.con ? (
                <Button variant="contained" color="primary" onClick={() => handleOpenDialog('consultation')}>
                    View Consultation
                </Button>
            ) : (
                <>
                    <Button variant="contained" color="primary" onClick={() => handleOpenDialog('consultation')}>
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