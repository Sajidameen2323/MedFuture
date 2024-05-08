import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Button, Avatar, IconButton, TextField, InputLabel, Select, FormControl, MenuItem } from '@mui/material';
import { Button as AntButton } from 'antd';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { EditOutlined, CameraOutlined, ReloadOutlined, CheckOutlined } from '@ant-design/icons'; // Added icons for reset and update
import { Formik, Form, Field } from 'formik';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useQuery } from 'react-query';
import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';

const PatientProfile = () => {

    const { idToken } = useContext(FirebaseAuthContext);


    const { patientId } = useParams();
    const [patient, setPatient] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [selectedProfilePicture, setSelectedProfilePicture] = useState(null); // State to store selected profile picture

    const fetchPatientData = async () => {
        const response = await fetch('/api/patient/me', {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch patient data');
        }

        return response.json();
    };

    const { data: patientData, isLoading, error } = useQuery('patientData', fetchPatientData, {

        staleTime: Infinity, // Data will never become stale
        cacheTime: 0, // Disable cache
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
        refetchOnMount: false, // Don't refetch on component mount
        onSuccess: (data) => {
            console.log('Patient data:', data);
            setPatient(data)
        },
    });



    const handleUpdatePatient = async (updatedPatient) => {
        try {
            await fetch(`/api/patients/${patientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPatient),
            });
            setPatient(updatedPatient);
            setEditMode(false);
        } catch (error) {
            console.error('Error updating patient:', error);
        }
    };

    const handleUpdateProfilePicture = (file) => {
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            // Do something with the imageUrl, such as storing it in state or using it directly
            console.log("Image URL:", imageUrl);
            setSelectedProfilePicture(imageUrl);
        }
    };

    const handleResetProfilePicture = () => {
        setSelectedProfilePicture(null);
    };

    const BloodGroupType = {
        APositive: 1,
        ANegative: 2,
        BPositive: 3,
        BNegative: 4,
        ABPositive: 5,
        ABNegative: 6,
        OPositive: 7,
        ONegative: 8
    };

    const bloodGroups = Object.keys(BloodGroupType).map(key => ({
        value: BloodGroupType[key],
        label: key
    }));

    const genderOptions = [
        { value: 1, label: 'Male' },
        { value: 2, label: 'Female' }
    ];


    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        phoneNumber: Yup.string().matches(/^[0-9]{10}$/, 'Invalid phone number'),
        // Add more validation rules for other fields
    });

    if (!patient) {
        return <div>Loading...</div>;
    }

    return (
        <Box sx={{ padding: 4, width: { md: '1100px', xs: '100%' } }}>
            <Typography variant="h4" gutterBottom>
                Patient Profile
            </Typography>
            <Formik
                initialValues={patient}
                validationSchema={validationSchema}
                onSubmit={handleUpdatePatient}
                enableReinitialize
            >
                {({ isSubmitting, values }) => (
                    <Form>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Avatar
                                        alt="Profile Picture"
                                        src={selectedProfilePicture || patient.profilePictureUrl} // Show selected picture if available
                                        sx={{ width: 150, height: 150 }}
                                    />
                                    <IconButton component="label" color="primary" sx={{ marginTop: 1 }} onClick={() => document.getElementById('pro-pic').click()}>
                                        <AntButton icon={<CameraOutlined />}>Update Picture</AntButton>
                                        <input
                                            id="pro-pic"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleUpdateProfilePicture(e.target.files[0])}
                                            hidden
                                        />
                                    </IconButton>
                                    {selectedProfilePicture && ( // Show reset and update buttons only when a picture is selected
                                        <>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                startIcon={<ReloadOutlined />}
                                                onClick={handleResetProfilePicture}
                                            >
                                                Reset
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<CheckOutlined />}
                                                sx={{ marginTop: 1 }}
                                                onClick={() => {
                                                    handleUpdateProfilePicture(selectedProfilePicture);
                                                    setSelectedProfilePicture(null); // Reset selected picture after update
                                                }}
                                            >
                                                Update
                                            </Button>
                                        </>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Grid container spacing={2} sx={{ textAlign:'left' }} >
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            name="name"
                                            component={renderTextField}
                                            label="Name"
                                            disabled={!editMode}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            name="email"
                                            component={renderTextField}
                                            label="Email"
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            name="phoneNumber"
                                            component={renderTextField}
                                            label="Phone Number"
                                            disabled={!editMode}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                                            <Box sx={{ width: '100%' }} >
                                                <DatePicker
                                                    label="Date of Birth"
                                                    value={dayjs(values?.dateOfBirth) || dayjs()}
                                                    disabled={!editMode}
                                                    fullWidth required name="dob" id="dob" sx={{ width: '100%' }} />
                                            </Box>
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            name="emergencyNumber"
                                            component={renderTextField}
                                            label="Emergency Number"
                                            disabled={!editMode}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="gender-label">Gender</InputLabel>
                                            <Select
                                                labelId="gender-label"
                                                value={1}
                                                disabled={!editMode}
                                                onChange={() => { } }
                                            >
                                                {genderOptions.map(option => (
                                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="blood-group-label">Blood Group</InputLabel>
                                            <Select
                                                labelId="blood-group-label"
                                                value={1}
                                                onChange={() => { }}
                                                disabled={!editMode}
                                            >
                                                {bloodGroups.map(group => (
                                                    <MenuItem key={group.value} value={group.value}>{group.label}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                

                                    {/* Add more fields as needed */}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Box display="flex" justifyContent="flex-end" marginTop={2}>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => setEditMode(!editMode)}
                                startIcon={!editMode ? <EditOutlined /> : <></>}
                            >
                                {editMode ? 'Cancel' : 'Edit'}
                            </Button>
                            {editMode && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={isSubmitting}
                                    sx={{ marginLeft: 2 }}
                                >
                                    Save
                                </Button>
                            )}
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

const renderTextField = ({ field, form, label, disabled }) => (
    <TextField
        {...field}
        label={label}
        variant="outlined"
        fullWidth
        disabled={disabled}
        error={form.touched[field.name] && Boolean(form.errors[field.name])}
        helperText={form.touched[field.name] && form.errors[field.name]}
    />
);

export default PatientProfile;
