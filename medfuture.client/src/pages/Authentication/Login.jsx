import { Link } from 'react-router-dom';
import { useEffect, useContext } from 'react';
// material-ui
import { Grid, Stack, Typography, Alert, Box } from '@mui/material';

// project import
import AuthLogin from './auth-forms/AuthLogin';
import AuthWrapper from './AuthWrapper';

import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';

import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
// ================================|| LOGIN ||================================ //

const Login = () => {

    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { successMessage } = location.state || {};

    const { currentUser } = useContext(FirebaseAuthContext);

    useEffect(() => {

        if (currentUser) {
            let navigaetTo = searchParams.get('from');
            console.log(navigaetTo);
            return navigate(navigaetTo);
        }


    }, [currentUser]);

  return (

    <AuthWrapper>
      <Grid container spacing={3}>

        <Grid item xs={12}>
          <Box sx={{mb:2}}>
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
          </Box>

          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Login</Typography>
            <Typography component={Link} to="/auth/signup" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              Don&apos;t have an account?
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthLogin />
        </Grid>
      </Grid>
    </AuthWrapper>
  );

}

export default Login;
