import { useState, useContext, useCallback } from 'react';

// material-ui
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Grid,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';

// project import
import AppointmentsTable from './AppointmentsTable';
import IncomeAreaChart from './IncomeAreaChart';
import MonthlyBarChart from './MonthlyBarChart';
import ReportAreaChart from './ReportAreaChart';
import AppointmentsByAgeGroupChart from './AppointmentsByAgeGroupChart';
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';

// assets
import { SettingOutlined, CloseCircleOutlined, DollarOutlined } from '@ant-design/icons';
import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';

import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';
import { useQuery } from 'react-query';
// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};


// ==============================|| DASHBOARD - DEFAULT ||============================== //

const DashboardDefault = () => {

    const [slot, setSlot] = useState('week');
    const { idToken } = useContext(FirebaseAuthContext);


    const fetchGeneralStats = useCallback(async () => {

        try {
            const response = await fetch(`/api/admin/stats/get-general`, {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    "Content-Type": "application/json"
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            //return areaChartOptions;
            return response.json();
        } catch (error) {
            // Handle fetch errors
            console.error('Fetch error:', error);
            throw error; // Rethrow the error to be caught by React Query
        }

    }, [idToken]);

    const { data, isLoading } = useQuery('generalStatData', fetchGeneralStats, {

        refetchOnWindowFocus: false,

        onSuccess: (data) => {
            console.log(data)
        }

    });

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      {/*<Grid item xs={12} sx={{ mb: -2.25 }}>*/}
      {/*  <Typography variant="h5">Dashboard</Typography>*/}
      {/*</Grid>*/}
          <Grid item xs={12} sm={6} md={4} lg={3}>
              <AnalyticEcommerce
                  title="Total Bookings"
                  extraPrefix="You have an extra "
                  count={formatNumber(data?.totalBookings ?? 0)}
                  percentage={data?.totalBookingsPercentageChange ?? 0}
                  extra={formatNumber(data?.totalBookingsThisYear ?? 0)}
                  color={getStatColorByPercentage(data?.totalBookingsPercentageChange ?? 0)}
                  isLoss={isLossCalc(data?.totalBookingsPercentageChange ?? 0)}
                  isLoading={isLoading}
              />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
              <AnalyticEcommerce
                  title="Total Completed"
                  extraPrefix="You have an extra "
                  count={formatNumber(data?.totalCompleted ?? 0)}
                  percentage={data?.totalCompletedPercentageChange ?? 0}
                  extra={formatNumber(data?.totalCompletedThisYear ?? 0)}
                  color={getStatColorByPercentage(data?.totalCompletedPercentageChange ?? 0)}
                  isLoss={isLossCalc(data?.totalCompletedPercentageChange ?? 0)}
                  isLoading={isLoading}
              />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
              <AnalyticEcommerce
                  title="Total Missed"
                  extraPrefix="You have an extra "
                  count={formatNumber(data?.totalMissed ?? 0)}
                  percentage={data?.totalMissedPercentageChange ?? 0}
                  extra={formatNumber(data?.totalMissedThisYear ?? 0)}
                  isLoss={isLossCalc(data?.totalMissedPercentageChange ?? 0)}
                  color={getStatColorByPercentageInvert(data?.totalMissedPercentageChange ?? 0)}
                  isLoading={isLoading}
              />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
              <AnalyticEcommerce
                  title="Total Revenue"
                  count={formatNumber(data?.totalRevenue ?? 0)}
                  percentage={data?.totalRevenuePercentageChange ?? 0}
                  extra={formatNumber(data?.totalRevenueThisYear ?? 0)}
                  color={getStatColorByPercentage(data?.totalRevenuePercentageChange ?? 0)}
                  isLoss={isLossCalc(data?.totalRevenuePercentageChange ?? 0)}
                  isLoading={isLoading}
              />
          </Grid>


      <Grid item md={8} sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} />

      {/* row 2 */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Revenue</Typography>
          </Grid>
          <Grid item>
                      <Stack direction="row" alignItems="center" spacing={0}>
                          <Button
                              size="small"
                              onClick={() => setSlot('year')}
                              color={slot === 'year' ? 'primary' : 'secondary'}
                              variant={slot === 'year' ? 'outlined' : 'text'}
                              sx={{
                                  '&:hover': {
                                      
                                      color: 'primary.main',
                                  },
                              }}
                          >
                              Year
                          </Button>
              <Button
                size="small"
                onClick={() => setSlot('month')}
                color={slot === 'month' ? 'primary' : 'secondary'}
                              variant={slot === 'month' ? 'outlined' : 'text'}
                              sx={{
                                  '&:hover': {

                                      color: 'primary.main',
                                  },
                              }}
              >
                Month
              </Button>
              <Button
                size="small"
                onClick={() => setSlot('week')}
                color={slot === 'week' ? 'primary' : 'secondary'}
                              variant={slot === 'week' ? 'outlined' : 'text'}
                              sx={{
                                  '&:hover': {

                                      color: 'primary.main',
                                  },
                              }}
              >
                Week
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <MainCard content={false} sx={{ mt: 1.5 }}>
          <Box sx={{ pt: 1, pr: 2 }}>
                      <IncomeAreaChart idToken={idToken} slot={slot} />
          </Box>
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Weekly Overview</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack spacing={2}>
              <Typography variant="h6" color="textSecondary">
                This Week Revenue
              </Typography>
                          <Typography variant="h3">Rs {' '+(data?.weeklyRevenue ?? 0)}</Typography>
            </Stack>
          </Box>
                  <MonthlyBarChart data={data?.weeklyRevenueByDay ?? [] } />
        </MainCard>
      </Grid>

      {/* row 3 */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
                      <Typography variant="h5">Today&apos;s Appointments</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
                  <AppointmentsTable idToken={idToken} />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Analytics Report</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
            <ListItemButton divider>
              <ListItemText primary="Company Appointments Growth" />
                          <Typography variant="h5">{data?.totalBookingsPercentageChange ?? 0}%</Typography>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemText primary="Company Expenses Ratio" />
              <Typography variant="h5">N/A</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Business Risk Cases" />
              <Typography variant="h5">N/A</Typography>
            </ListItemButton>
          </List>
                  <ReportAreaChart idToken={idToken} />
        </MainCard>
      </Grid>

      {/* row 4 */}
      <Grid item xs={12} md={7} lg={8}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Appointments By Age Group</Typography>
          </Grid>

        </Grid>
        <MainCard sx={{ mt: 1.75 }}>

                  <AppointmentsByAgeGroupChart idToken={idToken} />
        </MainCard>
      </Grid>
      <Grid item xs={12} md={5} lg={4}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Administration History</Typography>
          </Grid>
          <Grid item />
        </Grid>
              <MainCard sx={{ mt: 2 }} content={false}>
                  <List
                      component="nav"
                      sx={{
                          px: 0,
                          py: 0,
                          '& .MuiListItemButton-root': {
                              py: 1.5,
                              '& .MuiAvatar-root': avatarSX,
                              '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                          }
                      }}
                  >
                      <ListItemButton divider>
                          <ListItemAvatar>
                              <Avatar
                                  sx={{
                                      color: 'warning.main',
                                      bgcolor: 'warning.lighter'
                                  }}
                              >
                                  <CloseCircleOutlined />
                              </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={<Typography variant="subtitle1">Appointment #12345</Typography>} secondary="15 minutes ago" />
                          <ListItemSecondaryAction>
                              <Stack alignItems="flex-end">
                                  <Typography variant="subtitle1" noWrap>
                                      Cancelled
                                  </Typography>
                              </Stack>
                          </ListItemSecondaryAction>
                      </ListItemButton>

                      <ListItemButton divider>
                          <ListItemAvatar>
                              <Avatar
                                  sx={{
                                      color: 'success.main',
                                      bgcolor: 'success.lighter'
                                  }}
                              >
                                  <DollarOutlined />
                              </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={<Typography variant="subtitle1">Payment #67890</Typography>} secondary="2 hours ago" />
                          <ListItemSecondaryAction>
                              <Stack alignItems="flex-end">
                                  <Typography variant="subtitle1" noWrap>
                                      Rs 1150
                                  </Typography>
                              </Stack>
                          </ListItemSecondaryAction>
                      </ListItemButton>

                      <ListItemButton divider>
                          <ListItemAvatar>
                              <Avatar
                                  sx={{
                                      color: 'success.main',
                                      bgcolor: 'success.lighter'
                                  }}
                              >
                                  <DollarOutlined />
                              </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={<Typography variant="subtitle1">Payment #67887</Typography>} secondary="3 hours ago" />
                          <ListItemSecondaryAction>
                              <Stack alignItems="flex-end">
                                  <Typography variant="subtitle1" noWrap>
                                      Rs 1800
                                  </Typography>
                              </Stack>
                          </ListItemSecondaryAction>
                      </ListItemButton>

                      <ListItemButton>
                          <ListItemAvatar>
                              <Avatar
                                  sx={{
                                      color: 'primary.main',
                                      bgcolor: 'primary.lighter'
                                  }}
                              >
                                  <SettingOutlined />
                              </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={<Typography variant="subtitle1">System Configuration</Typography>} secondary="6 hours ago" />
                          <ListItemSecondaryAction>
                              <Stack alignItems="flex-end">
                                  <Typography variant="subtitle1" noWrap>
                                      Updated
                                  </Typography>
                              </Stack>
                          </ListItemSecondaryAction>
                      </ListItemButton>
                  </List>
              </MainCard>
        <MainCard sx={{ mt: 2 }}>
          <Stack spacing={3}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Stack>
                  <Typography variant="h5" noWrap>
                    Help & Support Chat
                  </Typography>
                  <Typography variant="caption" color="secondary" noWrap>
                    Typical replay within 5 min
                  </Typography>
                </Stack>
              </Grid>
              <Grid item>
                <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                  <Avatar alt="Remy Sharp" src={avatar1} />
                  <Avatar alt="Travis Howard" src={avatar2} />
                  <Avatar alt="Cindy Baker" src={avatar3} />
                  <Avatar alt="Agnes Walker" src={avatar4} />
                </AvatarGroup>
              </Grid>
            </Grid>
            <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>
              Need Help?
            </Button>
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export default DashboardDefault;


const getStatColorByPercentage = function (stat) {

    if (stat < 10) {

        return "error";
    }
    else if (stat < 50) {

        return "warning";
    }
    else if (stat >= 50 && stat < 80) {

        return "primary";
    }
    else if (stat >= 80) {

        return "success"
    }

    return "primary"

}

const isLossCalc = function (stat) {

    if (stat < 50) {

        return true
    }
    else if (stat > 49) {

        return false
    }

    return false
}

const getStatColorByPercentageInvert = function (stat) {

    if (stat < 10) {

        return "success";
    }
    else if (stat < 50) {

        return "primary";
    }
    else if (stat >= 50 && stat < 80) {

        return "warning";
    }
    else if (stat >= 80) {

        return "error"
    }

    return "primary"

}
function formatNumber(num) {
    if (num >= 1000000) {
        // If the number is in millions, format it with 'M'
        return (num / 1000000).toFixed(2).replace(/\.00$/, '') + ' M';
    } else if (num >= 1000) {
        // If the number is in thousands, format it with 'K'
        return (num / 1000).toFixed(2).replace(/\.00$/, '') + ' K';
    } else {
        // If the number is less than a thousand, return it as it is
        return num.toString();
    }
}