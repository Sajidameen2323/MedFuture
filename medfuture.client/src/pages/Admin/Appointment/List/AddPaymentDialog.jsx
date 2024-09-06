/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Button as AntButton } from 'antd';

const AddPaymentDialog = ({ open, onClose, appointment, onPaymentAdded, isAddingPayment }) => {

    const [paymentMode, setPaymentMode] = useState('');
    const [additionalCost, setAdditionalCost] = useState(0);

    const handlePaymentAdded = () => {
        // Call the onPaymentAdded callback with the payment data
        onPaymentAdded({ appointmentId: appointment.appointmentId, amount: appointment?.price, paymentMode, additionalCost: additionalCost });
   
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Payment</DialogTitle>
           
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Payment Amount"
                    type="number"
                    value={appointment?.price}
                    fullWidth
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="Tax Amount"
                    type="number"
                    value={(appointment?.tax ?? 0) / 100 * (appointment?.price)}
                    fullWidth
                />
                <TextField
                    autoFocus
                    margin="dense"
                    label="Additional Cost"
                    type="number"
                    value={additionalCost}
                    onChange={(e) => {
                        console.log(e.target.value)
                        setAdditionalCost(Math.abs(e.target.value))
                    }}
                    fullWidth
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel>Payment Mode</InputLabel>
                    <Select
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                    >
                        <MenuItem value={1}>Cash</MenuItem>
                        <MenuItem value={2}>Card</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <AntButton type="primary" loading={ isAddingPayment } onClick={handlePaymentAdded} disabled={!appointment?.price || !paymentMode}>
                    Add Payment
                </AntButton>
            </DialogActions>
        </Dialog>
    );
};

export default AddPaymentDialog;