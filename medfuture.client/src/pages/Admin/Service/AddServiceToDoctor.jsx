/* eslint-disable react/prop-types */
import { useState, useContext } from 'react';
import { useQuery } from 'react-query';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, Alert, MenuItem, Button, Grid, Box, FormHelperText } from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';

import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';

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

const doctorsResponse = async () => {

    const response = await fetch('/api/doctor/doctors-for-form', {

        headers: {

            "Content-Type": "application/json"
        },
        method: 'GET',

    });
    const data = await response.json();
    console.log(data)
    return data;

};

function AddServiceToDoctor() {

    const { isLoading: serviceLoading, error : serviceError, data: serviceData } = useQuery('servicesFetchApi', servicesResponse);
    const { isLoading: doctorsLoading, error: doctorsError, data: doctorsData } = useQuery('doctorsFetchApi', doctorsResponse);

    if (serviceLoading || doctorsLoading) {

        return (
            <h5>Loading ..</h5>
        )
    }
    if (serviceError || doctorsError) {

        return ( 
            <h5>Loading Error</h5>
        )
    }

    return (
        <>
            <MyForm services={serviceData} doctors={ doctorsData } />
         
        </>
    );

}


const MyForm = ({ services, doctors }) => {

    const [formMessage, setFormMessage] = useState({});
    const { idToken } = useContext(FirebaseAuthContext);

    const validationSchema = Yup.object({
        serviceId: Yup.string().required('Service is required'),
        doctorId: Yup.string().required('Doctor is required'),
    });
    return (
        <>
            <Box sx={{ my: 2 }}>
                {formMessage && formMessage?.success && <Alert onClose={() => { setFormMessage({}) }} severity={formMessage?.success ? "success" : "error"}>{formMessage?.message}</Alert>}
            </Box>
        <Formik
            initialValues={{ serviceId: '', doctorId: '' }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, resetForm, setErrors, setStatus }) => {
                // Submit form data to your backend (replace with your logic)
                console.log(values);
                setFormMessage({})
                try {

                    const response = await fetch('/api/service/add-doctor-to-service', {

                        headers: {
                            'Authorization': `Bearer ${idToken}`,
                            "Content-Type": "application/json"
                        },
                        method: 'post',
                        body: JSON.stringify(values),
                    });
                    if (response.ok) {

                        const { data, message } = await response.json()
                        console.log(data)
                        console.log(message)
                        setFormMessage({ success: true, message })
                        resetForm();

                    }
                    else {
                        const { message } = await response.json()
                        console.log(message)
                        setErrors({ submit: message });
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

            }}
        >
            {({ errors, touched, isSubmitting }) => (
                    <Form>
                        <Grid container spacing={3} sx={{ textAlign: 'start' }}>

                            <Grid item xs={12} md={6}>
                    <Field
                        as={TextField}
                        name="serviceId"
                        label="Service"
                        select
                        helperText={touched.serviceId ? errors.serviceId : null}
                        error={touched.serviceId && errors.serviceId}
                        fullWidth
                        margin="normal"
                    >
                        {services.map((service) => (
                            <MenuItem key={service.serviceID} value={service.serviceID}>
                                {service.name}
                            </MenuItem>
                        ))}
                                </Field>
                            </Grid>

                            <Grid item xs={12} md={6}>
                    <Field
                        as={TextField}
                        name="doctorId"
                        label="Doctor"
                        select
                        helperText={touched.doctorId ? errors.doctorId : null}
                        error={touched.doctorId && errors.doctorId}
                        fullWidth
                        margin="normal"
                    >
                        {doctors.map((doctor) => (
                            <MenuItem key={doctor.doctorID} value={doctor.doctorID}>
                                {doctor.name}
                            </MenuItem>
                        ))}
                                </Field>
                            </Grid>
                            {errors.submit && (
                                <Grid item xs={12}>
                                    <FormHelperText error={errors.submit !== null}>{errors.submit}</FormHelperText>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <AnimateButton>
                                    <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                                        Add Service To Doctor
                                    </Button>
                                </AnimateButton>
                            </Grid>
                    </Grid>
                </Form>
            )}
            </Formik>
        </>
    );
};

export default AddServiceToDoctor;