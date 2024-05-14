/* eslint-disable react/prop-types */
import { useRef, useEffect, useState, useContext, useCallback } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import moment from 'moment';
import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, Button, Chip, Divider } from '@mui/material';
import { Alert } from 'antd';
import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';
import { Link as RouterLink } from 'react-router-dom';
import { Empty } from "antd";
import { useTheme } from '@mui/material/styles';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);


const AppointmentList = ({ props }) => {
    const { idToken } = useContext(FirebaseAuthContext);
    const theme = useTheme();
    const { dateRange, statusFilter, prevDateRange, setPrevDateRange } = props;
    const [appointments, setAppointments] = useState([]);

    const fetchAppointments = useCallback(async () => {

        let startDate = dayjs(dateRange[0], "YYYY-MM-DD").format("YYYY-MM-DD");
        let endDate = dayjs(dateRange[1], "YYYY-MM-DD").format("YYYY-MM-DD");

        const response = await axios.get(`/api/patient/me/appointments?startDate=${startDate}&endDate=${endDate}`, {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
        });
        console.log(response.data)
        let dd = [

        ]
        if (response.data) {

            response.data.forEach(el => {

                dd.push({
                    id: el?.appointmentId,
                    doctor: el?.doctor,
                    startTime: moment(new Date(el?.startDateTime), 'HH:mm').format("HH:mm"),
                    endTime: moment(new Date(el?.endDateTime), 'HH:mm').format("HH:mm"),
                    reason: el?.name,
                    status: el?.status ?? "Pending",
                    appointmentDate: el?.appointmentDate
                })
            })
        }
        return dd
    },[dateRange, idToken]);

    const { isLoading, error, data: appointmentData } = useQuery(['apiGetPatientAppointmentsForRange', dateRange], fetchAppointments, {
        enabled: dateRange !== prevDateRange,
        refetchOnWindowFocus: false,
        onSuccess: () => {
            // Update the prevDateRange state after a successful query
            setPrevDateRange(dateRange);
        },

    });

    useEffect(() => {

        if (appointmentData) {
   
            let outputObject = [...appointmentData];
            if (statusFilter != "All") {
                // console.log("filtering")
                outputObject = outputObject.filter(el => el.status === statusFilter)
                //  console.log(outputObject.length)
            }
            setAppointments(outputObject)
        }

    },[appointmentData, statusFilter])

    if (isLoading) return <Typography variant="h6">Loading appointments...</Typography>;
    if (error) return <Alert message={`Error: ${error.message}`} type="error" />;

 

    return (
        <Card sx={{ width: { xs: '450px', md: '100%' }, my:2 }}>
            <CardContent>
                {appointments.length == 0 && <Empty />}

                <List>
                    {appointments.map(appointment => (
                        <div key={appointment.id}>
                        <ListItem
                            key={appointment.id}
                            button             
                            style={{
                                backgroundColor: theme.palette.background.default
                            }}
                           
                        >
                            <ListItemText
                                primary={`${appointment.reason} - ${appointment?.doctor?.name}`}
                                secondary={`${appointment?.appointmentDate} | ${appointment.startTime} - ${appointment.endTime} `}
                            />

                            <ListItemSecondaryAction>
                                <Chip sx={{ mr: 2 }} label={appointment.status} color={getChipColorByStatus(appointment.status)} variant="outlined" size="small" />

                                    {appointment?.status !== "Missed" && <Button variant="contained" size="small" disableElevation component={RouterLink} to={`/patient/appointments/${appointment.id}/action`} >
                                        Action
                                    </Button>}

                            </ListItemSecondaryAction>
                            </ListItem>
                            <Divider style={{
                                backgroundColor: theme.palette.text.primary
                            }}
                            variant="middle" component="li" />
                        </div>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

const getChipColorByStatus = (status) => {

    switch (status) {

        case "Pending":
            return "warning";
        case "Completed":
            return "info";
        case "Missed":
            return "error";
        default:
            return "primary"
    }

}


export default AppointmentList;