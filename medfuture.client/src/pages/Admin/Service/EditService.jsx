

import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom'; // Assuming you're using React Router
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Button,
    Grid,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    Stack,
    FormHelperText,
    Alert,
    Typography
} from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';
import { useLocation } from "react-router-dom";

const EditServiceForm = () => {
    const location = useLocation();
    const { serviceId } = location.state || {}; // Assuming your route includes an ID parameter
    const queryClient = useQueryClient();
    const { idToken } = useContext(FirebaseAuthContext);
    const [formMessage, setFormMessage] = useState({});

    const getService = useCallback(async () => {

        const response = await fetch(`/api/service/get-service/${serviceId}`, {
            headers: {
                'Authorization': `Bearer ${idToken}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch service data');
        }
        let { data } = await response.json();
        console.log(data)
        return data;

    }, [serviceId, idToken])

    // Fetch service data using React Query
    const { data: serviceData, isLoading, isError } = useQuery('get-service', getService);


    const validationSchema = Yup.object().shape({
        serviceName: Yup.string().required('Service name is required'),
        description: Yup.string().required('Description is required'),
        duration: Yup.number().required('Duration is required').positive('Duration must be positive'),
        charge: Yup.number().required('Charge is required').positive('Charge should be a positive value')
    });
    const durations = [{ id: 1, value: 5 }, { id: 2, value: 10 }, { id: 3, value: 15 }, { id: 4, value: 30 }, { id: 5, value: 45 }]

    const onSubmit = async (values, { setSubmitting, setErrors, setStatus }) => {
        // Similar logic to Add service component, but with a different API endpoint for updating
        console.log(values);
        setFormMessage({})
        const jsonData = {
            "id": serviceId,
            "name": values['serviceName'],
            "description": values['description'],
            "duration": values['duration'],
            "serviceCharge": values['charge'],

        }

        try {

            const response = await fetch('/api/service/update-service', {

                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    "Content-Type": "application/json"
                },
                method: 'post',
                body: JSON.stringify(jsonData),
            });
            if (response.ok) {

                const { message } = await response.json()

                console.log(message)
                setFormMessage({ success: true, message })
            
                queryClient.invalidateQueries('get-service');
            }
            else {
                const { errors } = await response.json()
                console.log(errors)
                setErrors({ submit: "Check Form Fields and Resubmit" });
            }

            setStatus({ success: false });
            setSubmitting(false);
        } catch (err) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: "Something went wrong!" });
            setFormMessage({ success: false, message: "Something went wrong! Please try again later" })
            setSubmitting(false);
        }


    };

    if (isLoading) {

        return (
            <>
                <h5>Loading!!</h5>
            </>
        )
    }
    if (isError) {

        return (
            <>
                <h5>Something Went Wrong!!</h5>
            </>
        )
    }

    return (
        <>
            <Box sx={{ my: 2, textAlign:'left' }}>
                <Typography variant="h6" >Update Service ID - { serviceData.serviceID }</Typography> 
            </Box>
            <Box sx={{ my: 2 }}>
                {formMessage && formMessage?.success && <Alert onClose={() => { setFormMessage({}) }} severity={formMessage?.success ? "success" : "error"}>{formMessage?.message}</Alert>}
            </Box>

            {!isLoading && !isError && (
                <Formik
                    initialValues={{
                        serviceName: serviceData ? serviceData.name : '',
                        description: serviceData ? serviceData.description : '',
                        duration: serviceData ? serviceData.duration : '',
                        charge: serviceData ? serviceData.serviceCharge : ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={3} sx={{ textAlign: 'start' }}>
                                <Grid item xs={12} md={4}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="serviceName-field">Service Name*</InputLabel>
                                        <OutlinedInput
                                            id="serviceName-field"
                                            type="string"
                                            value={values.serviceName}
                                            name="serviceName"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Consultation"
                                            fullWidth
                                            error={Boolean(touched.serviceName && errors.serviceName)}
                                        />
                                        {touched.serviceName && errors.serviceName && (
                                            <FormHelperText error id="helper-text-serviceName-field">
                                                {errors.serviceName}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Stack spacing={1}>
                                        <InputLabel id="duration-label">Duration</InputLabel>
                                        <Select
                                            labelId="duration-label"
                                            id="duration-select"
                                            value={values.duration}
                                            onChange={handleChange}
                                            name="duration"
                                            label="Duration"
                                        >
                                            {durations.map((el) => {

                                                return (<MenuItem key={el.id} value={el.value}>{el.value} minutes</MenuItem>)
                                            })}  
                                        </Select>
                                        {touched.duration && errors.duration && (
                                            <FormHelperText error id="helper-text-duration-field">
                                                {errors.duration}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="charge-field">Charge (LKR)</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            error={Boolean(touched.charge && errors.charge)}
                                            id="charge-field"
                                            type="number"
                                            value={values.charge}
                                            name="charge"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="30"
                                            inputProps={{}}
                                        />
                                        {touched.charge && errors.charge && (
                                            <FormHelperText error id="helper-text-duration-field">
                                                {errors.charge}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="description-field">Description*</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            error={Boolean(touched.description && errors.description)}
                                            id="description-field"
                                            type="string"
                                            value={values.description}
                                            name="description"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Description"
                                            inputProps={{}}
                                            multiline
                                            minRows={3}
                                            maxRows={3}
                                        />
                                        {touched.description && errors.description && (
                                            <FormHelperText error id="helper-text-description-field">
                                                {errors.description}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                {errors.submit && (
                                    <Grid item xs={12}>
                                        <FormHelperText error>{errors.submit}</FormHelperText>
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <AnimateButton>
                                        <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                                            Update Service
                                        </Button>
                                    </AnimateButton>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
            )}
        </>
    );
};

export default EditServiceForm;
