import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/en-gb';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
//import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';

dayjs.extend(utc);

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright � '}
            <Link color="inherit" href="https://mui.com/">
                MedFuture
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

// TODO remove, this demo shouldn't need to reset the theme.

export default function SignUp() {


    const theme = useTheme();

    const [dobValue, setDobValue] = React.useState(dayjs().subtract(1, 'day'));
    const [genderVal, setGenderVal] = React.useState(1);
    const [termAccepted, setTermAccepted] = React.useState(false);
    const [processing, setProcessing] = React.useState(false);
    const [formErrors, setFormErrors] = React.useState({});


    const navigate = useNavigate();


    const handleInputChange = (event) => {

        var elementId = event.currentTarget.getAttribute("id");

        //console.log(elementId)
        let newErrors = { ...formErrors }
        newErrors[elementId] = null;

        setFormErrors(newErrors);
    }
    const handleGenderValueChange = (event) => {

        setGenderVal(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const jsonData = {
            "firstName": data.get('firstName'),
            "lastName": data.get('lastName'),
            "email": data.get('email'),
            "password": data.get('password'),
            "confirmPassword": data.get('confirmPassword'),
            "dob": dobValue.format()
        }

        //console.log({
        //    email: data.get('email'),
        //    password: data.get('password'),
        //    dob: data.get('dob'),
        //});

        setProcessing(true);
        const response = await fetch('/auth/create-patient', {

            headers: {
                "Content-Type": "application/json",
            },
            method: 'post',
            body: JSON.stringify(jsonData),
        });
        if (response.ok) {

            const { data } = await response.json()
            console.log(data)

            const successMessage = "Successfully Registered!";
            navigate('/auth/login', { state: { successMessage, loginEmail: (data?.user?.email ?? "") } });


        }
        else {
            const { errors, message, success } = await response.json()
          //  console.log(errors)
            setFormErrors(errors)
            if (success != undefined) {
                setFormErrors(() => {

                    return { "Email":[message] }
                })
            }
            setTermAccepted(false)
        }
        setProcessing(false)
    };

    return (

            <Container component="main" maxWidth="xs" >
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="FirstName"
                                    label="First Name"
                                    autoFocus
                                    error={formErrors?.FirstName ? true : false}
                                    helperText={formErrors?.FirstName ? formErrors?.FirstName.join('\n') : ''}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="LastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    error={formErrors?.LastName ? true : false}
                                    helperText={formErrors?.LastName ? formErrors?.LastName.join('\n') : ''}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                             
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                                    <Box sx={{ width:'100%' } } >
                                        <DatePicker
                                            value={dobValue} onChange={setDobValue}
                                            
                                            fullWidth required name="dob" id="dob" label="Date of Birth" sx={{ width: '100%' }} />
                                    </Box>      
                                 </LocalizationProvider>
                                
                            </Grid>
                            <Grid item xs={12} sm={6}>

                                <FormControl sx={{ width: '100%', textAlign:'left' }}>
                                    <InputLabel id="gender-select-helper-label">Gender</InputLabel>
                                    <Select
                                        autoWidth
                                        labelId="gender-select-helper-label"
                                        id="gender-select"
                                        value={genderVal}
                                        label="Gender"
                                        onChange={handleGenderValueChange}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={1}>Male</MenuItem>
                                        <MenuItem value={2}>Female</MenuItem>

                                    </Select>
                                    {/*<FormHelperText error={formErrors?.Gender ? true : false }>With label + helper text</FormHelperText>*/}
                                </FormControl>

                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    onChange={handleInputChange}
                                    required
                                    fullWidth
                                    id="Email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    error={formErrors?.Email ? true : false}
                                    helperText={formErrors?.Email ? formErrors?.Email.join('\n') : ''}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    onChange={handleInputChange }
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="Password"
                                    autoComplete="new-password"
                                    error={formErrors?.Password ? true : false}
                                    helperText={formErrors?.Password ? formErrors?.Password.join('\n'):'' }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    onChange={handleInputChange}
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    id="ConfirmPassword"
                                    autoComplete="new-password"
                                    error={formErrors?.ConfirmPassword ? true : false}
                                    helperText={formErrors?.ConfirmPassword ? formErrors?.ConfirmPassword.join('\n') : ''}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox checked={termAccepted} onChange={(event) => { setTermAccepted(event.target.checked); }} value="allowExtraEmails" color="primary" />}
                                    label="I agree to terms and conditions"
                                />
                            </Grid>
                        </Grid>
                        {processing ? <h5>Processing..</h5> :
                            <Button
                                disabled={!termAccepted}
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                        }
     
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link to="/auth/login" >
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>

    );
}