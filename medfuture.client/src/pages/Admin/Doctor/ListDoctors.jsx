/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import * as React from 'react';

import { useQuery, useMutation, useQueryClient } from 'react-query';

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Button, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Input, Container, IconButton } from '@mui/material';

import { Empty, Button as AntButton } from 'antd';

import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useState, useContext } from 'react';

import avatar1 from 'assets/images/users/avatar-1.png';

import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';
import { Descriptions } from 'antd';

import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment';

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
            valueGetter: (params) => { return calculateAge(params?.value) ?? "N/A" }
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
                    onClick={() => {
                        if (params.row?.status == "Active") {
                            handleDisableOpen(params.row.id)
                        }
                        else if (params.row?.status == "Disabled") {

                            handleActivateOpen(params.row.id)
                        }
                    }}
                    showInMenu
                />,

            ],
        },
    ];

  
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

    const disableUser = async (userId) => {

        const response = await fetch(`/api/doctor/doctors/${userId}/disable`, {
            method: 'DELETE', headers: {
                'Authorization': `Bearer ${idToken}`            
            }
        });

        if (!response.ok) {
            throw new Error('Failed to disable user');
        }
        return true // You might not need a response here
    };
    const activateUser = async (userId) => {

        const response = await fetch(`/api/doctor/doctors/${userId}/activate`, {
            method: 'PUT', headers: {
                'Authorization': `Bearer ${idToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to activate user');
        }
        return true // You might not need a response here
    };

    const [rows, setRows] = useState([]);


    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const [openDisableDialog, setOpenDisableDialog] = React.useState(false);
    const [doctorToDisableId, setDoctorToDisableId] = React.useState(null);

    const [openActivateDialog, setOpenActivateDialog] = React.useState(false);
    const [doctorToActivateId, setDoctorToActivateId] = React.useState(null);

    const { idToken } = useContext(FirebaseAuthContext);

    const queryClient = useQueryClient();
    const { isLoading, isError, data, error } = useQuery('doctors', fetchDoctors,{
        refetchOnWindowFocus: false
    });

    const { mutate: disableUserMutation, isLoading: isDisabling, error: disableError } = useMutation(
        disableUser,
        {
            onSuccess: () => {
                queryClient.invalidateQueries('doctors'); // Invalidate user list query
                // onUserDeleted(deletedUser); // Callback for successful deletion
                handleDisableClose(); // Close the dialog after deletion
            },
            onError: (error) => {
                console.error('Disable user error:', error);
                // Handle deletion error (e.g., show error message)
            },
        }
    )
    const { mutate: activateUserMutation, isLoading: isActivating, error: activateError } = useMutation(
        activateUser,
        {
            onSuccess: () => {
                queryClient.invalidateQueries('doctors'); // Invalidate user list query
                // onUserDeleted(deletedUser); // Callback for successful deletion
                handleActivateClose(); // Close the dialog after deletion
            },
            onError: (error) => {
                console.error('Activate user error:', error);
                // Handle deletion error (e.g., show error message)
            },
        }
    )

    React.useEffect(() => {

        // console.log(data);
        if (data) {
            let tempArr = [];
            data.forEach((el) => {

                tempArr.push(
                    { id: el?.doctorID, firstName: el?.user?.firstName, lastName: el?.user?.lastName, age: el?.dob,
                         email: el?.user?.email, gender: el?.gender ,status: el?.user.isDeleted ? "Disabled" : "Active", firebaseId: el?.user?.firebaseID })

            })
            console.log(data)
            setRows(tempArr)
        }


    }, [data]);


    // Handle Disable Dialog Actions ---------------


    const handleDisableOpen = (id) => {
        setOpenDisableDialog(true);
        setDoctorToDisableId(id);
 
    };

    const handleDisableClose = () => {
        setOpenDisableDialog(false);
        setDoctorToDisableId(null);
    };

    const handleDisableConfirm = () => {
        // Implement your logic to delete the doctor with doctorToDeleteId
        console.log('Deleting doctor with ID:', doctorToDisableId);
        disableUserMutation(doctorToDisableId);
        
    };

    // Handle Activate Dialog Actions ---------------


    const handleActivateOpen = (id) => {

        setOpenActivateDialog(true);
        setDoctorToActivateId(id);

    };

    const handleActivateClose = () => {

        setOpenActivateDialog(false);
        setDoctorToActivateId(null);
    };

    const handleActivateConfirm = () => {
        // Implement your logic to delete the doctor with doctorToDeleteId
        console.log('Activating doctor with ID:', doctorToActivateId);
        activateUserMutation(doctorToActivateId);

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
            <DisableConfirmationDialog
                open={openDisableDialog}
                onClose={handleDisableClose}
                onDisableConfirm={handleDisableConfirm}
                isDisabling={isDisabling}
            />

            <ActivateConfirmationDialog
                open={openActivateDialog}
                onClose={handleActivateClose}
                onActivateConfirm={handleActivateConfirm}
                isActivating={isActivating}
            />

        </Container>
    );
}

function DisableConfirmationDialog({ open, onClose, onDisableConfirm, isDisabling }) {

    const [confirmDeleteText, setConfirmDeleteText] = useState("");

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm to Disable Doctor</DialogTitle>
            <DialogContent>
                <Typography variant="body2">Are you sure you want to disable this doctor?</Typography>
                <Input
                    value={confirmDeleteText}
                    onChange={(e) => setConfirmDeleteText(e.target.value)}
                    placeholder="Type 'disable' to confirm"

                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    setConfirmDeleteText("")
                    onClose()
                }}>Cancel</Button>
                <AntButton variant="contained" disabled={confirmDeleteText !== "disable"} loading={isDisabling} danger onClick={() => {
                    setConfirmDeleteText("")
                    onDisableConfirm()
                }}>
                    Disable
                </AntButton>
            </DialogActions>
        </Dialog>
    );
}
function ActivateConfirmationDialog({ open, onClose, onActivateConfirm, isActivating }) {

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm to Activate Doctor</DialogTitle>
            <DialogContent>
                <Typography variant="body2">Are you sure you want to Activate this doctor?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
           
                    onClose()
                }}>Cancel</Button>
                <AntButton type="primary" disabled={isActivating} loading={isActivating} onClick={() => {
             
                    onActivateConfirm()
                }}>
                    Activate
                </AntButton>
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
            children: getGender(selectedDoctor?.gender) ?? "N/A",
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

const calculateAge = (dateOfBirth) => {

    if(!dateOfBirth) return undefined;
    const dobMoment = moment(dateOfBirth);
    const currentMoment = moment();
    const age = currentMoment.diff(dobMoment, 'years');
    return age;

};

const getGender = (code) => {

    switch (code) {
        case 1:
            return "Male"
        case 2:
            return "Female"
        default:
            return "N/A"

    }
}