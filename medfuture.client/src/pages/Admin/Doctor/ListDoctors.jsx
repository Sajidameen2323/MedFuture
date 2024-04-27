/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import * as React from 'react';

import { useQuery, useMutation, useQueryClient } from 'react-query';

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Button, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Input, Container, IconButton } from '@mui/material';

import { Empty } from 'antd';


import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useState, useContext } from 'react';

import avatar1 from 'assets/images/users/avatar-1.png';

import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';
import { Descriptions } from 'antd';

import CloseIcon from '@mui/icons-material/Close';

export default function DataTable() {


    const columns = [
        { field: 'id', headerName: 'ID', flex: 1 },
        {
            field: 'proPic', flex: 1, headerName: '', sortable: false, filterable: false,
            renderCell: (params) => {

                return <Avatar alt="profile user" src={params.value || avatar1} sx={{ width: 32, height: 32 }} />

            }
        },
        { field: 'firstName', headerName: 'First name', flex: 1, },
        { field: 'lastName', headerName: 'Last name', flex: 1, },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            flex: 1,
            valueGetter: (params) => { return params?.value ?? "N/A" }
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            flex: 2,
            valueGetter: (params) =>
                `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
        {
            field: 'email',
            headerName: 'Email',
            type: 'string',
            flex: 3,
        },
        {
            field: 'gender',
            headerName: 'Gender',
            type: 'string',
            flex: 1,
            valueGetter: (params) => {

                switch (params?.value) {
                    case 1:
                        return "Male"
                    case 2:
                        return "Female"
                    default:
                        return "N/A"

                }

            }
        },
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

                        if (data) {
                            let doc = data.filter((el) => el?.doctorID === params.row.id)[0]

                            console.log(doc)
                            setSelectedDoctor(doc)
                        }



                    }}
                />
                ,

                <GridActionsCellItem
                    icon={<SecurityIcon />}
                    label={ params.row?.status == "Active" ? "Disable": "Activate" }
                    onClick={() => { () => handleDeleteOpen(params.row.id) }}
                    showInMenu
                />,

            ],
        },
    ];

    // Replace with your API endpoint and data fetching logic
    const fetchDoctors = async () => {
        const response = await fetch('/api/doctor/doctors', {

            headers: {
                'Authorization': `Bearer ${idToken}`,
                "Content-Type": "application/json"
            },
            method: 'GET',

        });
        return response.json();
    };

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


    const [rows, setRows] = useState([]);


    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [doctorToDeleteId, setDoctorToDeleteId] = React.useState(null);
    const { idToken } = useContext(FirebaseAuthContext);

    const queryClient = useQueryClient();
    const { isLoading, isError, data, error } = useQuery('doctors', fetchDoctors);

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
            data.forEach((el) => {

                tempArr.push({ id: el?.doctorID, firstName: el?.user?.firstName, lastName: el?.user?.lastName, age: el?.dob, email: el?.user?.email, status: el?.user.isDeleted ? "Disabled" : "Active", firebaseId: el?.user?.firebaseID })

            })
            console.log(data)
            setRows(tempArr)
        }


    }, [data]);

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
        return <span>Error: {error.message}</span>
    }

    return (
        <Container maxWidth="lg" sx={{ width: { md: '1100px' } }}>

            {selectedDoctor && <DetailView selectedDoctor={selectedDoctor} setSelectedDoctor={setSelectedDoctor} />}

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
     
            />
            <DeleteConfirmationDialog
                open={openDeleteDialog}
                onClose={handleDeleteClose}
                onDeleteConfirm={handleDeleteConfirm}
            />
        </Container>
    );
}

function DeleteConfirmationDialog({ open, onClose, onDeleteConfirm }) {

    const [confirmDeleteText, setConfirmDeleteText] = useState("");

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Doctor Deletion</DialogTitle>
            <DialogContent>
                <Typography variant="body2">Are you sure you want to delete this doctor?</Typography>
                <Input
                    value={confirmDeleteText}
                    onChange={(e) => setConfirmDeleteText(e.target.value)}
                    placeholder="Type 'delete' to confirm"

                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    setConfirmDeleteText("")
                    onClose()
                }}>Cancel</Button>
                <Button variant="contained" disabled={confirmDeleteText !== "delete"} color="error" onClick={() => {
                    setConfirmDeleteText("")
                    onDeleteConfirm()
                }}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}
function DetailView({ selectedDoctor, setSelectedDoctor }) {

    const items = [
        {
            key: '1',
            label: 'Doctor Name',
            children: selectedDoctor?.user?.firstName + " " + selectedDoctor?.user?.lastName,
        },
        {
            key: '2',
            label: 'Email',
            span: 1,
            children: selectedDoctor?.user?.email ?? "N/A",
        },
        {
            key: '3',
            label: 'Phone',
            span: 1,
            children: selectedDoctor?.phoneNumber ?? "N/A",
        },
        {
            key: '4',
            label: 'Gender',
            span: 1,
            children: selectedDoctor?.gender ?? "N/A",
        },
        {
            key: '5',
            label: 'Working Hours',
            span: 1,
            children: formatTime(selectedDoctor?.workingHours.startTime) + " - " + formatTime(selectedDoctor?.workingHours.endTime),
        },
        {
            key: '6',
            label: 'Account Status',
            children: selectedDoctor?.user.isDeleted ? "Disabled" : "Active",
        },

    ];

    return (
        <>
           
            <Descriptions title="Doctor Info" layout="vertical" items={items}
                extra={
                    <IconButton aria-label="delete" size="medium" onClick={() => { setSelectedDoctor(null) }} >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
            />
        </>
    )

}

function formatTime(time) {
    try {
        let hours = parseInt(time.slice(0, 2));
        let minutes = time.slice(3, 5);
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format (adjust for noon)

        return `${hours}:${minutes} ${ampm}`;
    }
    catch {

        return ""
    }
}