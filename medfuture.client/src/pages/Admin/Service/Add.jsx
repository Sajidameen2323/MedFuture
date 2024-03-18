import React from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, TextField, FormControl, FormLabel } from '@mui/material';

const AddMedicalServiceForm = () => {
    const initialValues = {
        serviceName: '',
        description: '',
        duration: '',
    };

    const validationSchema = Yup.object().shape({
        serviceName: Yup.string().required('Service name is required'),
        description: Yup.string().required('Description is required'),
        duration: Yup.number().required('Duration is required').positive('Duration must be positive'),
    });

    const onSubmit = (values, { setSubmitting, resetForm }) => {
        // Simulate form submission (replace with your logic)
        console.log('Submitting form data:', values);
        setSubmitting(false);
        resetForm();
    };

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({ isSubmitting, errors, touched }) => (
                <form onSubmit={(e) => e.preventDefault()}>
                    <FormControl>
                        <FormLabel>Service Name</FormLabel>
                        <Field
                            as={TextField}
                            name="serviceName"
                            helperText={touched.serviceName && errors.serviceName}
                            error={touched.serviceName && errors.serviceName}
                            fullWidth
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Field
                            as={TextField}
                            multiline
                            rows={4}
                            name="description"
                            helperText={touched.description && errors.description}
                            error={touched.description && errors.description}
                            fullWidth
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <Field
                            as={TextField}
                            type="number"
                            name="duration"
                            helperText={touched.duration && errors.duration}
                            error={touched.duration && errors.duration}
                            fullWidth
                        />
                    </FormControl>
                    <Button variant="contained" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Add Service'}
                    </Button>
                    <br />
                    {Object.keys(errors).length > 0 && (
                        <div style={{ color: 'red' }}>Please fix the following errors:</div>
                    )}
                    {Object.keys(errors).map((errorField) => (
                        <ErrorMessage key={errorField} name={errorField} component="div" />
                    ))}
                </form>
            )}
        </Formik>
    );
};

export default AddMedicalServiceForm;
