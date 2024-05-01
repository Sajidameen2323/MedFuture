
import { Box, Typography, styled, Container } from '@mui/material';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: theme.spacing(2),
}));

const SettingBox = styled(Box)(({ theme }) => ({
    maxWidth: 300,
    padding: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
}));

const IconContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(1),
}));

const SettingsComponent = () => {
    const theme = useTheme();

    return (
        <Container maxWidth="lg" sx={{ width: { md: '1100px' } }}>
            <StyledBox>
                <SettingBox>
                    <IconContainer>
                        <SettingsIcon fontSize="large" />
                    </IconContainer>
                    <Typography variant="h6" component="h2" gutterBottom>
                        General Settings
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Use these settings to define plugin general settings and default settings for your appointments
                    </Typography>
                    <Typography component={RouterLink} to="/dashboard/appointment-settings/general" variant="button" sx={{ color: theme.palette.primary.main ?? 'black' }} >VIEW GENERAL SETTINGS</Typography>
                </SettingBox>
            <SettingBox>
                <IconContainer>
                    <AccessTimeIcon fontSize="large" />
                </IconContainer>
                <Typography variant="h6" component="h2" gutterBottom>
                    Working Hours & Weekly Days Off
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Use these settings to set company working hours and days off which will be applied for every employee
                </Typography>
                    <Typography component={RouterLink} to="/dashboard/appointment-settings/workschedule" variant="button" sx={{ color: theme.palette.primary.main ?? 'black' } } >VIEW WORKING HOURS & DAYS OFF SETTINGS</Typography>
            </SettingBox>

                <SettingBox>
                    <IconContainer>
                        <CalendarTodayIcon fontSize="large" />
                    </IconContainer>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Holidays & Days Off
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Use these settings to set company Holidays and days off which will be applied for all employee in the system.
                    </Typography>
                    <Typography component={RouterLink} to="/dashboard/appointment-settings/holidays" variant="button" sx={{ color: theme.palette.primary.main ?? 'black' }} >VIEW HOLIDAYS & DAYS OFF SETTINGS</Typography>
                </SettingBox>

            </StyledBox>
        </Container>
    );
};

export default SettingsComponent;