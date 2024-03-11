import { Link } from 'react-router-dom';

// material-ui
import { Grid, Stack, Typography, Alert, Box } from '@mui/material';

// project import
import AuthLogin from './auth-forms/AuthLogin';
import AuthWrapper from './AuthWrapper';

import { useSearchParams, Navigate, useLocation } from "react-router-dom";
// ================================|| LOGIN ||================================ //

const Login = () => {

  const location = useLocation();
  const { successMessage } = location.state || {};

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
