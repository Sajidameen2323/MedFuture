/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';

import { useQuery, useMutation, useQueryClient } from 'react-query';

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Button, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';




import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useState, useContext } from 'react';

import avatar1 from 'assets/images/users/avatar-1.png';

import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';



//const rows = [
//    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42, email:'admin123@gmail.com' },
//    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
//];

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
                    onClick={() => { }}
                />
                ,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => handleDeleteOpen(params.row.id)}
                    showInMenu
                />,
                <GridActionsCellItem
                    icon={<SecurityIcon />}
                    label="Toggle Status"
                    onClick={() => { }}
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

                tempArr.push({ id: el?.doctorID, firstName: el?.user?.firstName, lastName: el?.user?.lastName, age: el?.dob, email: el?.user?.email, status: 'active', firebaseId: el?.user?.firebaseID })

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
        <div style={{ height: '100%', width: '1100px', overflow: 'hidden' }}>
            <DataGrid
                slots={{
                    noRowsOverlay: () => <h5>No Data</h5>,
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
        </div>
    );
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
