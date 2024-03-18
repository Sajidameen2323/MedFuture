import React, { useEffect, useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    Alert,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography,
    Container
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';


import { useNavigate } from "react-router-dom";
// ============================|| FIREBASE - REGISTER ||============================ //

import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';

const AddDoctor = () => {

    const { idToken } = useContext(FirebaseAuthContext);

    const [level, setLevel] = useState();
    const [showPassword, setShowPassword] = useState(false);

    const [formMessage, setFormMessage] = useState({});

    const navigate = useNavigate();

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };


    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setLevel(strengthColor(temp));
    };

    useEffect(() => {
        changePassword('');
    }, []);

    return (
        <>
            <Container>
                <Box sx={{ my:2 }}>
                    {formMessage && formMessage?.success && <Alert severity={formMessage?.success ? "success": "error" }>{formMessage?.message}</Alert>}
                </Box>
       
                <Formik
                    initialValues={{
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                        submit: null

                    }}
                    validationSchema={Yup.object().shape({
                        firstName: Yup.string().max(255).required('First Name is required'),
                        lastName: Yup.string().max(255).required('Last Name is required'),
                        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                        password: Yup.string().max(255).required('Password is required'),
                        confirmPassword: Yup.string().required("Please re-type your password").oneOf([Yup.ref("password")], "Passwords does not match"),
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {

                        const jsonData = {
                            "firstName": values['firstName'],
                            "lastName": values['lastName'],
                            "email": values['email'],
                            "password": values['password'],
                            "confirmPassword": values['confirmPassword'],
                        }
                        console.log(jsonData);
                        try {

                            const response = await fetch('/api/admin/create-doctor', {

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


                            }
                            else {
                                const { errors, message, success } = await response.json()
                                console.log(errors)
                                setErrors({ email: errors?.Email?.join(""), firstName: errors?.FirstName?.join(""), lastName: errors?.LastName?.join(""), password: errors?.Password?.join(""), confirmPassword: errors?.ConfirmPassword?.join(""), });

                                if (success != undefined) {

                                    setErrors({ email: message })
                                }
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
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <Grid container spacing={3} sx={{ textAlign: 'start' }}>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="firstName-signup">First Name*</InputLabel>
                                        <OutlinedInput
                                            id="firstName-login"
                                            type="firstName"
                                            value={values.firstName}
                                            name="firstName"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="John"
                                            fullWidth
                                            error={Boolean(touched.firstName && errors.firstName)}
                                        />
                                        {touched.firstName && errors.firstName && (
                                            <FormHelperText error id="helper-text-firstName-signup">
                                                {errors.firstName}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="lastName-signup">Last Name*</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            error={Boolean(touched.lastName && errors.lastName)}
                                            id="lastName-signup"
                                            type="lastName"
                                            value={values.lastName}
                                            name="lastName"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="Doe"
                                            inputProps={{}}
                                        />
                                        {touched.lastName && errors.lastName && (
                                            <FormHelperText error id="helper-text-lastName-signup">
                                                {errors.lastName}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            error={Boolean(touched.email && errors.email)}
                                            id="email-login"
                                            type="email"
                                            value={values.email}
                                            name="email"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            placeholder="demo@company.com"
                                            inputProps={{}}
                                        />
                                        {touched.email && errors.email && (
                                            <FormHelperText error id="helper-text-email-signup">
                                                {errors.email}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="password-signup">Password</InputLabel>
                                        <OutlinedInput
                                            fullWidth
                                            autoComplete="password"
                                            error={Boolean(touched.password && errors.password)}
                                            id="password-signup"
                                            type={showPassword ? 'text' : 'password'}
                                            value={values.password}
                                            name="password"
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                                handleChange(e);
                                                changePassword(e.target.value);
                                            }}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                        size="large"
                                                    >
                                                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            placeholder="******"
                                            inputProps={{}}
                                        />
                                        {touched.password && errors.password && (
                                            <FormHelperText error id="helper-text-password-signup">
                                                {errors.password}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                                        <OutlinedInput
                                            autoComplete="password"
                                            fullWidth
                                            error={Boolean(touched.password && errors.password)}
                                            id="confirmPassword"
                                            type={showPassword ? 'text' : 'password'}

                                            name="confirmPassword"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                        size="large"
                                                    >
                                                        {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            placeholder="******"
                                            inputProps={{}}
                                        />
                                        {touched.confirmPassword && errors.confirmPassword && (
                                            <FormHelperText error id="helper-text-confirmPassword-signup">
                                                {errors.confirmPassword}
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                    <FormControl fullWidth sx={{ mt: 2 }}>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item>
                                                <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle1" fontSize="0.75rem">
                                                    {level?.label}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </FormControl>
                                </Grid>

                                {errors.submit && (
                                    <Grid item xs={12}>
                                        <FormHelperText error>{errors.submit}</FormHelperText>
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <AnimateButton>
                                        <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                                            Register Doctor
                                        </Button>
                                    </AnimateButton>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
            </Container>
         

        </>
    );
};

export default AddDoctor;
