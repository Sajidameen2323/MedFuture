import  { useContext, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Grid,
  Alert,
} from '@mui/material';
import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';

// Define validation schemas using Yup
const passwordResetSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const emailChangeSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
});



const AccountSettings = () => {

  const { idToken } = useContext(FirebaseAuthContext);
  const [formMessage, setFormMessage] = useState({});

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 2 }}>
        {formMessage && formMessage?.success && <Alert severity={formMessage?.success ? "success" : "error"}>{formMessage?.message}</Alert>}
      </Box>
      <Box my={4}>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Formik
                  initialValues={{
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                  }}
                  validationSchema={passwordResetSchema}
                  onSubmit={async (values, { setSubmitting, resetForm, setStatus, setErrors }) => {
                    try {

                      const response = await fetch('/api/auth/change-password', {

                        headers: {
                          'Authorization': `Bearer ${idToken}`,
                          "Content-Type": "application/json"
                        },
                        method: 'put',
                        body: JSON.stringify(values),
                      });
                      if (response.ok) {

                        const { message } = await response.json()
                        //console.log(data)
                        console.log(message)
                        setFormMessage({ success: true, message })
                        resetForm();

                      }
                      else {
                        const { message } = await response.json()
                        console.log(message)
                        setStatus({ success: false });
                        setErrors({ submit: "Something went wrong!" });
                        setFormMessage({ success: false, message: "Something went wrong! Please try again later" })
                        setSubmitting(false);

                      }
                    } catch (err) {
                      console.error(err);
                      setStatus({ success: false });
                      setErrors({ submit: "Something went wrong!" });
                      setFormMessage({ success: false, message: "Something went wrong! Please try again later" })
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ isSubmitting, errors, touched }) => (
                    <Form>
                      <Typography variant="h6" component="h2" gutterBottom>
                        Change Password
                      </Typography>
                      <Field
                        as={TextField}
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        margin="normal"
                        fullWidth
                        error={touched.currentPassword && Boolean(errors.currentPassword)}
                        helperText={touched.currentPassword && errors.currentPassword}
                      />
                      <Field
                        as={TextField}
                        label="New Password"
                        name="newPassword"
                        type="password"
                        margin="normal"
                        fullWidth
                        error={touched.newPassword && Boolean(errors.newPassword)}
                        helperText={touched.newPassword && errors.newPassword}
                      />
                      <Field
                        as={TextField}
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        margin="normal"
                        fullWidth
                        error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                        helperText={touched.confirmPassword && errors.confirmPassword}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        fullWidth
                        sx={{ mt: 2, ':hover': { color: 'secondary.light' } }}
                      >
                        Change Password
                      </Button>
                    </Form>
                  )}
                </Formik>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Formik
                  initialValues={{ email: '' }}
                  validationSchema={emailChangeSchema}
                  onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(false);
                  }}
                >
                  {({ isSubmitting, errors, touched }) => (
                    <Form>
                      <Typography variant="h6" component="h2" gutterBottom>
                        Change Email
                      </Typography>
                      <Field
                        as={TextField}
                        label="New Email"
                        name="email"
                        type="email"
                        margin="normal"
                        fullWidth
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        fullWidth
                        sx={{ mt: 2, ':hover': { color: 'secondary.light' } }}
                      >
                        Change Email
                      </Button>
                    </Form>
                  )}
                </Formik>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} container justifyContent="center">
            <Button
              variant="contained"
              color="error"
                          onClick={() => { } }
              sx={{ mt: 2, ':hover': { color: 'secondary.light' } }}
            >
              Deactivate Account
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AccountSettings;