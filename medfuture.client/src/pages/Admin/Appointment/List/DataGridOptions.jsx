import React, { useState, useContext } from 'react';
import Stack from '@mui/material/Stack';
import { Box, Button, DialogTitle, DialogContent, DialogContentText, DialogActions, MenuItem, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Modal, Input, Popconfirm } from 'antd';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { FirebaseAuthContext } from "context/FirebaseAuthProvider";
import PropTypes from 'prop-types'; // Import PropTypes

const ActionButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    borderRadius: 0,
}));

const SetStatusButton = styled(ActionButton)({
    color: '#333',
    '&:hover': {
        backgroundColor: '#f5f5f5',
    },
});

const DeleteButton = styled(ActionButton)({
    color: '#f44336',
    '&:hover': {
        backgroundColor: '#ffcdd2',
    },
});

function DataGridOptions({ rowSelectionModel, setPrevDateRange }) {


    const [openStatusDialog, setOpenStatusDialog] = useState(false);
    const [status, setStatus] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [deleteError, setDeleteError] = useState("");
    const [updateError, setUpdateError] = useState("");

    const { idToken } = useContext(FirebaseAuthContext);
    const queryClient = useQueryClient();

    const { mutate: deleteRows, isLoading: isDeleting } = useMutation(
        async (appointmentIdList) => {
            try {
                const response = await axios.post('/api/appointment/delete', { appointmentIdList }, {
                    headers: {
                        Authorization: 'Bearer '+idToken,
                    },
                });
                if (response.status !== 200) {
                    throw new Error(`Error deleting appointments: ${response.status}`);
                }
            } catch (error) {
                throw new Error(`Error deleting appointments: ${error.message}`);
            }
        },
        {
            onSuccess: () => {
                setPrevDateRange(null);
                queryClient.invalidateQueries(['apiGetAppointmentsForRange']);
            },
            onError: (error) => {
                setDeleteError(error.message);
            },
        }
    );

    const { mutate: updateStatus, isLoading: isUpdating } = useMutation(
        async ({ appointmentIdList, newStatus }) => {
            try {
                const response = await axios.put(
                    '/api/appointment/update-status',
                    { appointmentIdList, newStatus },
                    {
                        headers: {
                            Authorization: 'Bearer ' + idToken,
                        },
                    }
                );
                if (response.status !== 200) {
                    throw new Error(`Error updating appointments status: ${response.status}`);
                }
            } catch (error) {
                throw new Error(`Error updating appointments status: ${error.message}`);
            }
        },
        {
            onSuccess: () => {
                setPrevDateRange(null);
                queryClient.invalidateQueries(['apiGetAppointmentsForRange']);
                handleCloseStatusDialog();
            },
            onError: (error) => {
                console.error('Error updating appointments status:', error);
                setUpdateError(error.message)
            },
        }
    );


    // ... (rest of the component code)
    const handleOpenStatusDialog = () => {
        setOpenStatusDialog(true);
    };

    const handleCloseStatusDialog = () => {
        setOpenStatusDialog(false);
        setStatus('');
        setUpdateError("");
    };

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const handleConfirmStatus = async () => {
        try {
           // Replace with your logic to get the selected appointment IDs
            await updateStatus({ appointmentIdList: rowSelectionModel, newStatus: status });
           // handleCloseStatusDialog();
      
        } catch (error) {
            console.error('Error updating appointments status:', error);
        }
    };

    const showDeletePopconfirm = () => {
        setConfirmLoading(true);
    };

    const handleDeleteOk = async () => {
        try {
            // Perform the delete action
            console.log('Deleting selected rows');
            // Await any asynchronous operation here

            await deleteRows(rowSelectionModel);

            setDeleteConfirmation("");
            setConfirmLoading(deleteError !== "");
        } catch (error) {
            console.error('Error deleting rows:', error);
            setDeleteConfirmation("");
            setConfirmLoading(deleteError !== "");
        }
    };

    const handleDeleteCancel = () => {
        console.log('Clicked cancel button');
        setDeleteConfirmation("");
        setDeleteError("");
        setConfirmLoading(false);
    };

    return (
        <Box sx={{ m: 2 }}>
            <Stack direction="row" spacing={2}>
                <SetStatusButton onClick={handleOpenStatusDialog}>Set Status</SetStatusButton>
                <Popconfirm
                    title="Confirm Delete"
                    description={
                        <div>
                            <DialogContentText>
                                Are you sure you want to delete the selected rows? Type &quot;delete&quot; to confirm.
                            </DialogContentText>
                            {deleteError && <DialogContentText style={{ color: 'red' }}>{deleteError}</DialogContentText>}

                            <Input
                                value={deleteConfirmation}
                                onChange={(e) => setDeleteConfirmation(e.target.value)}
                                placeholder="Type 'delete' to confirm"
                                onPressEnter={handleDeleteOk}
                            />
                        </div>
                    }
                    open={confirmLoading}
                    onConfirm={handleDeleteOk}
                    onCancel={handleDeleteCancel}
                    okButtonProps={{ disabled: deleteConfirmation.toLowerCase() !== 'delete' }}
                    cancelButtonProps={{ disabled: false }}
                    overlayStyle={{ zIndex: 1550 }}
                >
                    <DeleteButton variant="text" onClick={showDeletePopconfirm}>
                        Delete
                    </DeleteButton>
                </Popconfirm>
            </Stack>

            {/* Status Dialog */}
            <Modal open={openStatusDialog} onCancel={handleCloseStatusDialog} footer={null}>
                <DialogTitle>Set Status</DialogTitle>
                <DialogContent>
                    <TextField
                        sx={{ mt: 2 }}
                        select
                        label="Select Status"
                        value={status}
                        onChange={handleStatusChange}
                        fullWidth
                    >
                        <MenuItem value={2}>Cancelled</MenuItem>
                        <MenuItem value={1}>Pending</MenuItem>

                    </TextField>
                    <DialogContentText sx={{ mt: 2 }}>Are you sure you want to update the selected rows?</DialogContentText>
                    {updateError && <DialogContentText style={{ color: 'red' }}>{updateError}</DialogContentText>}

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseStatusDialog} disabled={isUpdating}>Cancel</Button>
                    <Button onClick={handleConfirmStatus} disabled={isUpdating} loading={isUpdating}>Confirm</Button>
                </DialogActions>
            </Modal>
        </Box>
    );
}

DataGridOptions.propTypes = {
    rowSelectionModel: PropTypes.arrayOf(PropTypes.number).isRequired, 
    setPrevDateRange: PropTypes.func
};

export default DataGridOptions;