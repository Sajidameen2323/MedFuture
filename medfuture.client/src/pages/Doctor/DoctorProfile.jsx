import { useState, useContext } from 'react';

import { Box, Typography, Grid, Button, Avatar, IconButton, TextField, InputLabel, Select, FormControl, MenuItem, Stack } from '@mui/material';
import { Button as AntButton } from 'antd';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { EditOutlined, CameraOutlined, ReloadOutlined, CheckOutlined } from '@ant-design/icons';
import { Formik, Form, Field } from 'formik';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';

const DoctorProfile = () => {
    const { idToken } = useContext(FirebaseAuthContext);
    const queryClient = useQueryClient();

    const [doctor, setDoctor] = useState(null);
    const [dobValue, setDobValue] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [selectedProfilePicture, setSelectedProfilePicture] = useState(null);
    const [initialValues, setInitialValues] = useState({
        firstName: doctor?.firstName,
        lastName: doctor?.lastName,
        email: doctor?.email,
        phoneNumber: doctor?.phoneNumber,
        dateOfBirth: doctor?.dateOfBirth,
        gender: doctor?.gender,
    });

    const fetchDoctorData = async () => {
        const response = await fetch('/api/doctor/me', {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch doctor data');
        }

        return response.json();
    };

    const handleUpdateDoctor = async (updatedDoctor) => {
        try {
            await fetch(`/api/doctor/profile/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedDoctor),
            });
            setDoctor(updatedDoctor);
            setEditMode(false);
        } catch (error) {
            console.error('Error updating doctor:', error);
        }
    };

    const { isLoading, error } = useQuery('doctorData', fetchDoctorData, {
        staleTime: Infinity,
        cacheTime: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        onSuccess: (data) => {
            console.log('Doctor data:', data);
            setDoctor(data);
            setInitialValues({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phoneNumber: data.phoneNumber ?? "",
                dateOfBirth: data.dateOfBirth,
                gender: data.gender ?? 0,
            });
            setDobValue(dayjs(data.dateOfBirth));
        },
    });

    const { mutate: updateProfile, isLoading: isUpdatingProfile } = useMutation(handleUpdateDoctor, {
        onSuccess: () => {
            queryClient.invalidateQueries('doctorData');
            setEditMode(false);
        },
        onError: (error) => {
            console.error('Error updating doctor:', error);
        },
    });

    const handleUpdateProfilePicture = (file) => {
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelectedProfilePicture(imageUrl);
        }
    };

    const handleSubmit = async (updatedDoctor) => {
        let jsonObj = { ...updatedDoctor };
        delete jsonObj.email;

        jsonObj.dateOfBirth = dayjs(dobValue).format('YYYY-MM-DD');

        updateProfile(jsonObj);
    };

    const handleResetProfilePicture = () => {
        setSelectedProfilePicture(null);
    };

    const genderOptions = [
        { value: 1, label: 'Male' },
        { value: 2, label: 'Female' },
    ];

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
        phoneNumber: Yup.string().matches(/^[0-9]{10}$/, 'Invalid phone number'),
 //       dateOfBirth: Yup.date().required('Date of Birth is required'),
        gender: Yup.number().required('Gender is required'),
    });

    const renderTextField = ({ field, form, label, disabled }) => {
        if (field.name === 'dateOfBirth' && !editMode) {
            return (
                <TextField
                    value={dayjs(field.value).format('YYYY-MM-DD')}
                    label={label}
                    variant="outlined"
                    fullWidth
                    disabled
                />
            );
        } else if (field.name === 'dateOfBirth' && editMode) {
            return (
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                    <Box sx={{ width: '100%' }}>
                        <DatePicker
                            label="Date of Birth"
                            value={dobValue}
                            onChange={setDobValue}
                            disabled={!editMode}
                            fullWidth
                            required
                            name="dateOfBirth"
                            id="dateOfBirth"
                            sx={{ width: '100%' }}
                        />
                    </Box>
                </LocalizationProvider>
            );
        }
        return (
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
    };

    const renderSelectField = ({ field, form, label, options, disabled }) => (
        <FormControl fullWidth>
            <InputLabel id={`${field.name}-label`}>{label}</InputLabel>
            <Select
                labelId={`${field.name}-label`}
                {...field}
                disabled={disabled}
                error={form.touched[field.name] && Boolean(form.errors[field.name])}
            >
                <MenuItem value={0}>Select a Value</MenuItem>
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );

    if (isLoading || isUpdatingProfile) {
        return <div>Loading...</div>;
    }

    return (
        <Box sx={{ padding: 4, width: { md: '1100px', xs: '100%' } }}>
            <Typography variant="h4" gutterBottom>
                Doctor Profile
            </Typography>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ isSubmitting, values, resetForm }) => (
                    <Form>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Avatar
                                        alt="Profile Picture"
                                        src={selectedProfilePicture || doctor?.profilePictureUrl}
                                        sx={{ width: 150, height: 150 }}
                                    />
                                    <IconButton
                                        component="label"
                                        color="primary"
                                        sx={{ marginTop: 1 }}
                                        onClick={() => document.getElementById('pro-pic').click()}
                                    >
                                        <AntButton icon={<CameraOutlined />}>Update Picture</AntButton>
                                        <input
                                            id="pro-pic"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleUpdateProfilePicture(e.target.files[0])}
                                            hidden
                                        />
                                    </IconButton>
                                    {selectedProfilePicture && (
                                        <Stack direction="row" spacing={2} mt={2}>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="secondary"
                                                startIcon={<ReloadOutlined />}
                                                onClick={handleResetProfilePicture}
                                            >
                                                Reset
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="primary"
                                                startIcon={<CheckOutlined />}
                                                sx={{ marginTop: 1 }}
                                                onClick={() => {
                                                    handleUpdateProfilePicture(selectedProfilePicture);
                                                    setSelectedProfilePicture(null);
                                                }}
                                            >
                                                Update
                                            </Button>
                                        </Stack>
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <Grid container spacing={2} sx={{ textAlign: 'left' }}>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            name="firstName"
                                            component={renderTextField}
                                            label="First Name"
                                            disabled={!editMode}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            name="lastName"
                                            component={renderTextField}
                                            label="Last Name"
                                            disabled={!editMode}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
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
                                        <Field
                                            name="dateOfBirth"
                                            component={renderTextField}
                                            label="Date of Birth"
                                            disabled={!editMode}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        {!editMode ? (
                                            <TextField
                                                value={genderOptions.find((option) => option.value === values.gender)?.label || ''}
                                                label="Gender"
                                                variant="outlined"
                                                fullWidth
                                                disabled
                                            />
                                        ) : (
                                            <Field name="gender" component={renderSelectField} label="Gender" options={genderOptions} />
                                        )}
                                    </Grid>

                                </Grid>
                                <Box display="flex" justifyContent="flex-end" marginTop={2}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => {
                                            if (editMode) {
                                                resetForm();
                                            }
                                            setEditMode(!editMode);
                                        }}
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
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};
export default DoctorProfile;