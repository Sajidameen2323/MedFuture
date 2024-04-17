/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import { useQuery, useMutation, useQueryClient } from 'react-query';

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Button, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Stack, IconButton, Box } from '@mui/material';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useState, useContext } from 'react';

import avatar1 from 'assets/images/users/avatar-1.png';

import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';
import { Empty } from 'antd';
import { useCallback } from 'react';

import { Descriptions } from 'antd';

import CloseIcon from '@mui/icons-material/Close';

export default function DataTable({ props }) {


    const columns = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'patient', headerName: 'Patient', flex: 1, },
        { field: 'doctor', headerName: 'Doctor', flex: 1, },
        { field: 'service', headerName: 'Service', flex: 1, },
        { field: 'date', headerName: 'Date', flex: 1, type: "date", valueGetter: (params) => { return new Date(params.value) ?? new Date() } },
        { field: 'start_at', headerName: 'Start At', flex: 1, type: "string", valueGetter: (params) => { return dayjs(params.value).format('h:mm A') ?? dayjs().format('h:mm A') } },
        {
            field: 'status',
            headerName: 'Status',
            type: 'string',
            flex: 1,
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            getActions: (params) => [

                <GridActionsCellItem
                    icon={<VisibilityIcon />}
                    label="View"
                    onClick={() => {
                        let { outputObject } = data;

                        let app = outputObject.filter((el) => el?.appointmentId === params.row.id)[0]

                        console.log(app)

                        setSelectedAppointment(app)
                    }}
                />
                ,
                <GridActionsCellItem
                    icon={<SecurityIcon />}
                    label="Set Status"
                    onClick={() => { }}
                    showInMenu
                />,

            ],
        },
    ];



    const [rows, setRows] = useState([]);
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);


    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [doctorToDeleteId, setDoctorToDeleteId] = React.useState(null);
    const { idToken } = useContext(FirebaseAuthContext);
    const { dateRange, statusFilter } = props;

    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const queryClient = useQueryClient();




    // data fetching logic
    const fetchAppointmentsByRange = useCallback(async () => {
  
        console.log("logging inside api fetcher");

        let startDate = dayjs(dateRange[0], "YYYY-MM-DD").format("YYYY-MM-DD");
        let endDate = dayjs(dateRange[1], "YYYY-MM-DD").format("YYYY-MM-DD");

        try {
            const response = await fetch(`/api/appointment/get-appointments?startDate=${startDate}&endDate=${endDate}`, {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    "Content-Type": "application/json"
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return response.json();
        } catch (error) {
            // Handle fetch errors
            console.error('Fetch error:', error);
            throw error; // Rethrow the error to be caught by React Query
        }
    }, [idToken, dateRange]);

    const deleteUser = async (userId) => {

        const response = await fetch(`/api/doctor/doctors/${userId}`, {
            method: 'DELETE', headers: {
                'Authorization': `Bearer ${idToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete user');
        }
        return true // You might not need a response here
    };


    const { isLoading, isError, data, error } = useQuery(['apiGetAppointmentsForRange', dateRange], () => fetchAppointmentsByRange(), {
        enabled: true, 
    });

    const { mutate: deleteUserMutation, isLoading: isDeleting, error: deleteError } = useMutation(
        deleteUser,
        {
            onSuccess: () => {
                queryClient.invalidateQueries('doctors'); // Invalidate user list query
                // onUserDeleted(deletedUser); // Callback for successful deletion
            },
            onError: (error) => {
                console.error('Delete user error:', error);
                // Handle deletion error (e.g., show error message)
            },
        }
    )


    React.useEffect(() => {

        // console.log(data);
        if (data) {
            let tempArr = [];
            let { outputObject } = data;
            if (outputObject) {

                if (statusFilter != "All") {
                   // console.log("filtering")
                    outputObject = outputObject.filter(el => el.status === statusFilter)
                  //  console.log(outputObject.length)
                }

                outputObject.forEach((el) => {

                    tempArr.push({
                        id: el?.appointmentId,
                        patient: el?.patient?.firstName + " " + el?.patient?.lastName,
                        doctor: el?.doctor?.firstName + " " + el?.doctor?.lastName,
                        service: el?.service?.name,
                        date: el?.appointmentDate,
                        start_at: el?.startDateTime,
                        status: el?.status,
                    })

                })
            }

          //  console.log(outputObject)
            setRows(tempArr)
        }


    }, [data, statusFilter]);

    const handleDeleteOpen = (id) => {
        setOpenDeleteDialog(true);
        setDoctorToDeleteId(id);
    };

    const handleDeleteClose = () => {
        setOpenDeleteDialog(false);
        setDoctorToDeleteId(null);
    };

    const handleDeleteConfirm = () => {
        // Implement your logic to delete the doctor with doctorToDeleteId
        console.log('Deleting doctor with ID:', doctorToDeleteId);
        deleteUserMutation(doctorToDeleteId);
        handleDeleteClose(); // Close the dialog after deletion
    };


    if (isLoading) {
        return <span>Loading...</span>
    }

    if (isError) {
        return (
            <div>
                   <span>Errors: {error.message}</span>
            </div>
        )
    }

    return (
        <>
            <Stack spacing={2}>

                {selectedAppointment && <DetailView selectedAppointment={selectedAppointment} setSelectedAppointment={ setSelectedAppointment } />}
                <Box sx={{ margin:'100px' }}>
                    <DataGrid
                        sx={{ height: rows.length == 0 ? '300px' : '100%' }}
                        slots={{
                            noRowsOverlay: Empty,
                        }}
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                            columns: {
                                columnVisibilityModel: {
                                    id: false,
                                    fullName: false,
                                },
                            }
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        disableRowSelectionOnClick

                        onRowSelectionModelChange={(newRowSelectionModel) => {
                            console.log(newRowSelectionModel)
                            setRowSelectionModel(newRowSelectionModel);
                        }}
                        rowSelectionModel={rowSelectionModel}

                    />
                </Box>

                <DeleteConfirmationDialog
                    open={openDeleteDialog}
                    onClose={handleDeleteClose}
                    onDeleteConfirm={handleDeleteConfirm}
                />
            </Stack>
  
        </>
    );
}

function DetailView({ selectedAppointment, setSelectedAppointment }) {

    const items = [
        {
            key: '1',
            label: 'Patient Name',
            children: selectedAppointment?.patient?.firstName + " " + selectedAppointment?.patient?.lastName ,
        },
        {
            key: '2',
            label: 'Service',
            children: selectedAppointment?.service?.name,
        },
        {
            key: '3',
            label: 'Doctor',
            children: selectedAppointment?.doctor?.firstName + " " + selectedAppointment?.doctor?.lastName,
        },
        {
            key: '4',
            label: 'Date',
            span: 1,
            children: dayjs(selectedAppointment?.appointmentDate).format("YYYY-MM-DD"),
        },
        {
            key: '5',
            label: 'Start At',
            children: dayjs(selectedAppointment?.startDateTime).format('h:mm A'),
        },
        {
            key: '6',
            label: 'Duration',
            children: selectedAppointment?.service?.duration + " min",
        },
        {
            key: '7',
            label: 'Email',
            span: 1,
            children: selectedAppointment?.patient?.email ?? "N/A",
        },
        {
            key: '8',
            label: 'Phone',
            span: 1,
            children: selectedAppointment?.patient?.phoneNumber ?? "N/A",
        },
        {
            key: '9',
            label: 'Payment Status',
            children: selectedAppointment?.paymentStatus ?? "N/A",
        },
        {
            key: '10',
            label: 'Payment Method',
            children: "On-site",
        },
        {
            key: '11',
            label: 'Price',
            children: "Rs. "+ (selectedAppointment?.price ?? "200.00"),
        },
    ];

    return (
        <>
            <Descriptions title="Appointment Info" layout="vertical" items={items}
                extra={
                    <IconButton aria-label="delete" size="medium" onClick={() => { setSelectedAppointment(null) } } >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
            />
        </>
    )

}

function DeleteConfirmationDialog({ open, onClose, onDeleteConfirm }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Doctor Deletion</DialogTitle>
            <DialogContent>
                <Typography variant="body2">Are you sure you want to delete this doctor?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" color="error" onClick={onDeleteConfirm}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}
