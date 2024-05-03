import { useContext, useState } from 'react';
import { useFormik } from 'formik';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { InputLabel, OutlinedInput, FormHelperText, Box, Button, Typography, Stack, Alert } from '@mui/material';
import * as Yup from 'yup';
import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';
import { useCallback } from 'react';
import { useEffect } from 'react';

const GeneralSettings = () => {

    const { idToken } = useContext(FirebaseAuthContext);
    const queryClient = useQueryClient();
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);




    const updateAppointmentSettings = useCallback(async (formData) => {
        // Send data to your API or server
        const response = await fetch('/api/appointment/settings', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            return response.json();
        }
        else {

            // Assuming the response provides error data
            const errorMessage = response.status === 400
                ? 'Validation error: Please check your input.'
                : response.status === 401
                    ? 'Unauthorized: Please check your credentials.'
                    : 'Something went wrong. Please try again later.';

            throw new Error(errorMessage);
        }
    }, [idToken]);



    const { data, isLoading, isError } = useQuery('ApiAppointmentSettings', fetchAppointmentSettings, {
        refetchOnWindowFocus: false, // Prevent refetching when the window regains focus
        onSuccess: (resData) => {
            console.log(resData);
            formik.setValues({
                minimumTimeBeforeBookingInDays: data?.minimumTimeBeforeBookingInDays || 1,
                minimumTimeBeforeCancelingInDays: data?.minimumTimeBeforeCancelingInDays || 1,
                minimumTimeBeforeReschedulingInDays: data?.minimumTimeBeforeReschedulingInDays || 1,
                bookingPeriodInDays: data?.bookingPeriodInDays || 30,
            });
        }
    });
    const { mutate, isLoading: isMutating, isError: isUpdateError, error: updateError, reset: updateReset } = useMutation(updateAppointmentSettings, {

        onSuccess: (resData) => {
            console.log(resData);
            setSuccessMessage(resData?.message);
            queryClient.invalidateQueries('ApiAppointmentSettings');
  
        },
        onError: (err) => {
            console.log(err.message);
            setErrorMessage(err.message || "Something went wrong")
        }
    });

    const validationSchema = Yup.object().shape({
        minimumTimeBeforeBookingInDays: Yup.number().required('Minimum time before booking is required').min(0, 'Minimum time before booking must be a non-negative value'),
        minimumTimeBeforeCancelingInDays: Yup.number().required('Minimum time before canceling is required').min(0, 'Minimum time before canceling must be a non-negative value'),
        minimumTimeBeforeReschedulingInDays: Yup.number().required('Minimum time before rescheduling is required').min(0, 'Minimum time before rescheduling must be a non-negative value'),
        bookingPeriodInDays: Yup.number().required('Booking period is required').min(0, 'Booking period must be a non-negative value'),
    });

    const formik = useFormik({
        initialValues: {

            minimumTimeBeforeBookingInDays: data?.minimumTimeBeforeBookingInDays || 1,
            minimumTimeBeforeCancelingInDays: data?.minimumTimeBeforeCancelingInDays || 1,
            minimumTimeBeforeReschedulingInDays: data?.minimumTimeBeforeReschedulingInDays || 1,
            bookingPeriodInDays: data?.bookingPeriodInDays || 30,

        },
        validationSchema,
        onSubmit: (values) => {
            mutate(values);

        },
    });


    useEffect(() => {
        console.log("effect running")
        formik.setValues({
            minimumTimeBeforeBookingInDays: data?.minimumTimeBeforeBookingInDays || 1,
            minimumTimeBeforeCancelingInDays: data?.minimumTimeBeforeCancelingInDays || 1,
            minimumTimeBeforeReschedulingInDays: data?.minimumTimeBeforeReschedulingInDays || 1,
            bookingPeriodInDays: data?.bookingPeriodInDays || 30,
        });

    }, [data]);



    const handleCancel = () => {
        formik.resetForm({
            values: {
                minimumTimeBeforeBookingInDays: data?.minimumTimeBeforeBookingInDays || 1,
                minimumTimeBeforeCancelingInDays: data?.minimumTimeBeforeCancelingInDays || 1,
                minimumTimeBeforeReschedulingInDays: data?.minimumTimeBeforeReschedulingInDays || 1,
                bookingPeriodInDays: data?.bookingPeriodInDays || 30,
            },
        });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error occurred while fetching data.</div>;
    }

    return (
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: { xs: '100%', md: '600px' }, textAlign:'left' }}>
            <Typography variant="h4">Appointment Booking Settings</Typography>
            <Typography variant="info" color="secondary" >Below Settings Are Measured In Days</Typography>

            {(errorMessage || successMessage) &&
            <>
                <Box sx={{ my: 2 }}>
                    {successMessage && <Alert onClose={() => { setSuccessMessage(null) }} severity="success">{successMessage}</Alert>}
                    {errorMessage && <Alert onClose={() => { setErrorMessage(null) }} severity="error">{ errorMessage }</Alert>}
                </Box>
            </>
            }
            

            <Stack spacing={1}>
                <InputLabel htmlFor="minimumTimeBeforeBookingInDays">Minimum time required before booking*</InputLabel>
                <OutlinedInput
                    id="minimumTimeBeforeBookingInDays"
                    type="number"
                    value={formik.values.minimumTimeBeforeBookingInDays}
                    name="minimumTimeBeforeBookingInDays"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    fullWidth
                    error={Boolean(formik.touched.minimumTimeBeforeBookingInDays && formik.errors.minimumTimeBeforeBookingInDays)}
                />
                {formik.touched.minimumTimeBeforeBookingInDays && formik.errors.minimumTimeBeforeBookingInDays && (
                    <FormHelperText error>{formik.errors.minimumTimeBeforeBookingInDays}</FormHelperText>
                )}
            </Stack>

            <Stack spacing={1}>
                <InputLabel htmlFor="minimumTimeBeforeCancelingInDays">Minimum time required before canceling*</InputLabel>
                <OutlinedInput
                    id="minimumTimeBeforeCancelingInDays"
                    type="number"
                    value={formik.values.minimumTimeBeforeCancelingInDays}
                    name="minimumTimeBeforeCancelingInDays"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    fullWidth
                    error={Boolean(formik.touched.minimumTimeBeforeCancelingInDays && formik.errors.minimumTimeBeforeCancelingInDays)}
                />
                {formik.touched.minimumTimeBeforeCancelingInDays && formik.errors.minimumTimeBeforeCancelingInDays && (
                    <FormHelperText error>{formik.errors.minimumTimeBeforeCancelingInDays}</FormHelperText>
                )}
            </Stack>

            <Stack spacing={1}>
                <InputLabel htmlFor="minimumTimeBeforeReschedulingInDays">Minimum time required before rescheduling*</InputLabel>
                <OutlinedInput
                    id="minimumTimeBeforeReschedulingInDays"
                    type="number"
                    value={formik.values.minimumTimeBeforeReschedulingInDays}
                    name="minimumTimeBeforeReschedulingInDays"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    fullWidth
                    error={Boolean(formik.touched.minimumTimeBeforeReschedulingInDays && formik.errors.minimumTimeBeforeReschedulingInDays)}
                />
                {formik.touched.minimumTimeBeforeReschedulingInDays && formik.errors.minimumTimeBeforeReschedulingInDays && (
                    <FormHelperText error>{formik.errors.minimumTimeBeforeReschedulingInDays}</FormHelperText>
                )}
            </Stack>

            <Stack spacing={1}>
                <InputLabel htmlFor="bookingPeriodInDays">Period available for booking in advance*</InputLabel>
                <OutlinedInput
                    id="bookingPeriodInDays"
                    type="number"
                    value={formik.values.bookingPeriodInDays}
                    name="bookingPeriodInDays"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    fullWidth
                    error={Boolean(formik.touched.bookingPeriodInDays && formik.errors.bookingPeriodInDays)}
                />
                {formik.touched.bookingPeriodInDays && formik.errors.bookingPeriodInDays && (
                    <FormHelperText error>{formik.errors.bookingPeriodInDays}</FormHelperText>
                )}
            </Stack>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" type="button" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button variant="contained" disabled={isMutating} type="submit">
                    Save
                </Button>
            </Box>
        </Box>
    );
};

// Fetch and update functions for React Query
const fetchAppointmentSettings = async () => {
    // Fetch data from your API or server
    const response = await fetch('/api/appointment/settings');
    return response.json();
};



export default GeneralSettings;