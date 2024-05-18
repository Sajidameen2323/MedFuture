/* eslint-disable react/prop-types */
import React, { useState, useContext } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Stack } from '@mui/material';
import { notification } from 'antd';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';
import { useNavigate } from "react-router-dom";
import InvoiceDialog from 'components/Invoice/InvoiceDialog';

const AppointmentAction = ({ appointment, onAppointmentComplete }) => {

    const [open, setOpen] = useState(false);
    const [action, setAction] = useState(null);
    const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
    const queryClient = useQueryClient();
    const { idToken } = useContext(FirebaseAuthContext);
    const navigate = useNavigate();

    const updateAppointmentStatus = async (appointmentId) => {

        const response = await axios.put(`/api/patient/appointments/${appointmentId}/cancel`, {  }, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    };

    const { mutate: CancelAppointment } = useMutation(

        () => updateAppointmentStatus(appointment?.appointmentId),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('ApiGetAppointmentForDoctor');
          
                    notification.success({
                        key: 'cancel',
                        message: 'Cancelled Appointment',
                        description: 'Successfully cancelled appointment.',
                        duration: 2,
                    });
                
            },
            onError: (error) => {
                console.error('Error updating appointment status:', error);

                    notification.error({
                        key: 'cancel',
                        message: 'Error',
                        description: 'Failed to cancel appointment.',
                        duration: 2,
                    });
                


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

        navigate(`/patient/appointments/${appointment?.appointmentId}/consultation`, {

            state: {

                consultationData: appointment?.consultation,
            }
        });

    }

    const handleConfirmAction = () => {

        if (action === 'cancel') {
            // Mark appointment as missed
            notification.warning({
                key: 'cancel',
                message: 'Cancel Appointment',
                description: 'Cancelling Appointment...',
                duration: 2,
            });
            CancelAppointment()
        }
        else if (action === "reschedule") {
            navigate(`/patient/appointments/${appointment?.appointmentId}/reschedule`, {
                state: {
                    rescheduleData: { 
                        serviceId: appointment?.serviceID,
                        doctorId: appointment?.doctor?.id,
                        appointmentId: appointment?.appointmentId,
                        startDateTime: appointment?.startDateTime,
                        duration: appointment?.duration
                    }
                }
            })
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
                {appointment?.consultation && (
                    <Button variant="contained" color="primary" onClick={handleConsultation}>
                        View Consultation
                    </Button>
                )}  
               
                {appointment?.status === "Pending" && 
            
                    <>
                    {appointment?.canRescedule && <Button variant="contained" color="info" onClick={() => handleOpenDialog('reschedule')}>
                        Reschedule Appointment
                    </Button>}
                    {appointment?.canCancel && <Button variant="outlined" color="error" onClick={() => handleOpenDialog('cancel')}>
                        Cancel Appointment
                    </Button>}
                </>
                }
                {appointment?.hasPayment &&

                    <Button variant="outlined" color="success" onClick={() => setOpenInvoiceDialog(true) }>
                        Invoice
                    </Button>
                }

            </Stack>
            <Dialog open={open} onClose={handleCloseDialog}>
                <DialogTitle>
                    {action === 'cancel'
                        ? 'Cancel Appointment'
                        : action === 'reschedule'
                            ? 'Reschedule Appointment'
                            : ''}
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        {action === 'cancel'
                            ? 'Are you sure you want to canel this appointment?'
                            : action === 'reschedule'
                                ? 'Are you sure you want to reschedule this appointment?'
                                : ''}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleConfirmAction} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <InvoiceDialog
                open={openInvoiceDialog}
                onClose={() => setOpenInvoiceDialog(false)}
                appointment={appointment}
            />
        </>
    );
};

export default AppointmentAction;