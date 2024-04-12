import React, { useState, useContext } from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, InputLabel, Divider, OutlinedInput, Grid, Box, Container, Stack, FormHelperText, Typography, MenuItem, Alert, Select } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import AddServiceToDoctor from './AddServiceToDoctor';
import { useQueryClient } from 'react-query';

import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';

const AddMedicalServiceForm = () => {


    return (
        <Container sx={{ width: { md: '100%' } }}>
            <Grid container sx={{ width: { md: '100%' } }} spacing={4} rowSpacing={6}>

            <Grid item xs={12}>
                <AddServiceForm />

                </Grid>
                <Grid item xs={12}>
                    <Divider>
                        <Typography variant="caption">Add Service To Doctor</Typography>
                    </Divider>
                </Grid>
            <Grid item xs={12}>
                <AddServiceToDoctor />

            </Grid>
            </Grid>
        </Container>
    );
};



const AddServiceForm = () => {
    const queryClient = useQueryClient();
    const { idToken } = useContext(FirebaseAuthContext);
    const [formMessage, setFormMessage] = useState({});

    const initialValues = {
        serviceName: '',
        description: '',
        duration: '',
        charge:0
    };

    const durations = [{ id: 1, value: 15 }, { id: 2, value: 30 }, { id:3, value: 45 } ]

    const validationSchema = Yup.object().shape({
        serviceName: Yup.string().required('Service name is required'),
        description: Yup.string().required('Description is required'),
        duration: Yup.number().required('Duration is required').positive('Duration must be positive'),
        charge: Yup.number().required('Charge is required').positive('Charge should be a positvie value')
    });

    const onSubmit = async (values, { setSubmitting, resetForm, setErrors, setStatus }) => {
        // Simulate form submission (replace with your logic)
        console.log('Submitting form data:', values);
        setFormMessage({})
        const jsonData = {

            "name": values['serviceName'],
            "description": values['description'],
            "duration": values['duration'],
            "serviceCharge": values['charge'],

        }

        try {

            const response = await fetch('/api/service/add-service', {

                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    "Content-Type": "application/json"
                },
                method: 'post',
                body: JSON.stringify(jsonData),
            });
            if (response.ok) {

                const { data, message } = await response.json()
                console.log(data)
                console.log(message)
                setFormMessage({ success: true, message })
                resetForm();
                queryClient.invalidateQueries('servicesFetchApi');
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

    return (


        <>
            <Box sx={{ my: 2 }}>
                {formMessage && formMessage?.success && <Alert onClose={() => { setFormMessage({}) }} severity={formMessage?.success ? "success" : "error"}>{formMessage?.message}</Alert>}
            </Box>

            <Formik
                initialValues={initialValues}
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

                                            return (<MenuItem key={el.id} value={el.value}>{ el.value } minutes</MenuItem>)
                                        }) }                                                    
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
                                        Add Service
                                    </Button>
                                </AnimateButton>
                            </Grid>
                        </Grid>
                    </form>
                )}
                </Formik>
            </>
  

    );


}

export default AddMedicalServiceForm;