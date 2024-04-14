import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useEffect, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import EditIcon from '@mui/icons-material/Edit';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';

import { useNavigate } from "react-router-dom";

function createData(id,name, description, duration, fee, doctorNames) {
    return {
        id,
        name,
        description,
        duration,
        fee,
        doctorNames
    };
}

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
      const navigate = useNavigate();

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell >{row.description}</TableCell>
                <TableCell align="right">{row.duration}</TableCell>
                <TableCell align="right">{row.fee}</TableCell>
                <TableCell>
                    <Stack direction="row" spacing={1}>
                        <IconButton aria-label="edit" color="secondary" onClick={() => { navigate('/account/edit-service', { state: { serviceId: row.id } }) }} >
                            <EditIcon />
                        </IconButton>
                        <IconButton aria-label="delete" color="error" onClick={() => props.handleDeleteOpen(row.id)} >
                            <DeleteIcon  />
                        </IconButton>

                    </Stack>

                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Doctors Associated ({ row?.doctorNames ? row.doctorNames.length : 0 })
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>First Name</TableCell>
                                        <TableCell >Last Name</TableCell>
                                        <TableCell align="right"></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.doctorNames.map((doctorRow) => (
                                        <TableRow key={doctorRow.doctorID}>
                                            <TableCell component="th" scope="row">
                                                {doctorRow.doctorID}
                                            </TableCell>
                                            <TableCell>{doctorRow.firstName}</TableCell>
                                            <TableCell >{doctorRow.lastName}</TableCell>
                                            <TableCell>
                                                <DeleteIcon variant="error" color="error" />

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        id: PropTypes.number.isRequired,
        fee: PropTypes.number.isRequired,
        duration: PropTypes.number.isRequired,
        doctorNames: PropTypes.arrayOf(
            PropTypes.shape({
                doctorID: PropTypes.number.isRequired,
                firstName: PropTypes.string.isRequired,
                lastName: PropTypes.string.isRequired,
                fullName: PropTypes.string.isRequired,
            }),
        ),
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,

    }).isRequired,
    handleDeleteOpen: PropTypes.func.isRequired
};


const servicesResponse = async () => {

    const response = await fetch('/api/service/get-services', {

        headers: {

            "Content-Type": "application/json"
        },
        method: 'GET',

    });
    const data = await response.json();
    console.log(data)
    return data;

};

export default function CollapsibleTable() {

    const { isLoading: serviceLoading, error: serviceError, data: serviceData } = useQuery('servicesFetchApi', servicesResponse);
    const [rows, setRows] = React.useState([]);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [doctorToDeleteId, setDoctorToDeleteId] = React.useState(null);
    const queryClient = useQueryClient();
    const { idToken } = useContext(FirebaseAuthContext);

    const deleteService = async (id) => {

        const response = await fetch(`/api/service/service-delete/${id}`, {
            method: 'DELETE', headers: {
                'Authorization': `Bearer ${idToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete user');
        }
        return true // You might not need a response here
    };
    const { mutate: deleteUserMutation, isLoading: isDeleting, error: deleteError } = useMutation(
        deleteService,
        {
            onSuccess: () => {
                queryClient.invalidateQueries('servicesFetchApi'); // Invalidate user list query
                // onUserDeleted(deletedUser); // Callback for successful deletion
            },
            onError: (error) => {
                console.error('Delete service error:', error);
                // Handle deletion error (e.g., show error message)
            },
        }
    )


    useEffect(() => {

        if (serviceData && serviceData?.length > 0) {

            let tempArr = [];

            serviceData.forEach((el) => {

                tempArr.push(createData(el.serviceID, el.name, el.description, el.duration, el.serviceCharge, el.doctorNames))

            });
            setRows(tempArr);
        }

    },[serviceData, serviceLoading])

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
        console.log('Deleting service with ID:', doctorToDeleteId);
        deleteUserMutation(doctorToDeleteId);
        handleDeleteClose(); // Close the dialog after deletion
    };

    if (serviceError) {

        return (
            <>
                <Typography variant="error"> Server Error </Typography>
                
            </>
        )
    }
    if (isDeleting) {

        return (
            <>
                <Typography variant="warning"> Refetching </Typography>

            </>
        )
    }
    return (
        <>
            <DeleteConfirmationDialog
                open={openDeleteDialog}
                onClose={handleDeleteClose}
                onDeleteConfirm={handleDeleteConfirm}
            />
            <TableContainer component={Paper} sx={{ width: { md: 1100 }, height: '100%' }}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>Service Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Duration&nbsp;(min)</TableCell>
                            <TableCell align="right">Fee&nbsp;(Rs)</TableCell>
                            <TableCell align="right"></TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <Row key={row.id} row={row} handleDeleteOpen={handleDeleteOpen} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>

    );
}
// eslint-disable-next-line react/prop-types
function DeleteConfirmationDialog({ open, onClose, onDeleteConfirm }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm Service Deletion</DialogTitle>
            <DialogContent>
                <Typography variant="body2">Are you sure you want to delete this service?</Typography>
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