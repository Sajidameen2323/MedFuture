import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';
import {
    LoadingOutlined,

} from '@ant-design/icons';
// material-ui
import { Box, Link, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// third-party
import { format } from 'date-fns';

// project import
import Dot from 'components/@extended/Dot';

function createData(appointmentId, patientName, service, appointmentDate, status) {
    return { appointmentId, patientName, service, appointmentDate, status };
}

const dummy_rows = [
    createData(1, 'John Doe', 'Consultation' , new Date('2023-05-25T10:00:00'), 'Pending'),
    createData(2, 'Jane Smith', 'Consultation' , new Date('2023-05-26T14:00:00'), 'Completed'),
    createData(3, 'Michael Brown', 'Consultation' , new Date('2023-05-27T09:00:00'), 'Cancelled'),
    createData(4, 'Emily Johnson' ,'Consultation' , new Date('2023-05-28T11:30:00'), 'Pending'),
    createData(5, 'David Thompson', 'Consultation' , new Date('2023-05-29T15:00:00'), 'Completed'),
    createData(6, 'Sarah Wilson' ,'Consultation', new Date('2023-05-30T09:45:00'), 'Cancelled'),
    createData(7, 'Robert Anderson' , 'Consultation' , new Date('2023-05-31T13:15:00'), 'Pending'),
    createData(8, 'Jessica Taylor' , 'Consultation' , new Date('2023-06-01T16:30:00'), 'Completed'),
    createData(9, 'Christopher Clark', 'Consultation' , new Date('2023-06-02T10:00:00'), 'Cancelled'),
    createData(10, 'Amanda Lee', 'Consultation' , new Date('2023-06-03T14:00:00'), 'Pending')
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// ==============================|| ORDER TABLE - HEADER CELL ||============================== //

const headCells = [
    {
        id: 'appointmentId',
        align: 'right',
        disablePadding: false,
        label: 'App ID'
    },
    {
        id: 'patientName',
        align: 'left',
        disablePadding: true,
        label: 'Patient Name'
    },
    {
        id: 'service',
        align: 'left',
        disablePadding: true,
        label: 'Service'
    },
    {
        id: 'appointmentDate',
        align: 'left',
        disablePadding: false,
        label: 'Date'
    },
    {
        id: 'status',
        align: 'left',
        disablePadding: false,
        label: 'Status'
    }
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function AppointmentTableHead({ order, orderBy }) {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}


AppointmentTableHead.propTypes = {
    order: PropTypes.string,
    orderBy: PropTypes.string
};

// ==============================|| ORDER TABLE - STATUS ||============================== //

const AppointmentStatus = ({ status }) => {
    let color;
    let title;

    switch (status) {
        case 'Pending':
            color = 'warning';
            title = 'Pending';
            break;
        case 'Completed':
            color = 'success';
            title = 'Completed';
            break;
        case 'Cancelled':
            color = 'error';
            title = 'Cancelled';
            break;
        case 'Missed':
            color = 'error';
            title = 'Missed';
            break;
        default:
            color = 'primary';
            title = 'None';
    }

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Dot color={color} />
            <Typography>{title}</Typography>
        </Stack>
    );
};

AppointmentStatus.propTypes = {
    status: PropTypes.string
};


// ==============================|| ORDER TABLE ||============================== //


export default function AppointmentTable({ idToken }) {

    const [tableRows, setTableRows] = useState(dummy_rows);

    const [order] = useState('asc');
    const [orderBy] = useState('appointmentId');
    const [selected] = useState([]);

    const isSelected = (appointmentId) => selected.indexOf(appointmentId) !== -1;
    const fetchTodaysAppointmentStats = useCallback(async () => {
        const response = await axios.get('/api/admin/stats/get-todays-apps', {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                "Content-Type": "application/json"
            },
        });
        return response.data;
    }, [idToken]);

    const { isLoading, error } = useQuery('todaysAppointmentStats', fetchTodaysAppointmentStats, {

        refetchOnWindowFocus: false,
        onSuccess: (data) => {
            let rows = data.map((appointment) =>
                createData(
                    appointment.appointmentId,
                    appointment.patientName,
                    appointment.serviceName,
                    format(new Date(appointment.date), 'yyyy-MM-dd hh:mm a'),
                    appointment.status
                )
            );
            let tempRows = [...rows,...dummy_rows].splice(0,10);
            console.log(tempRows);
            setTableRows(tempRows);
        }

    });
    if (isLoading) {
        return <LoadingComponent />;
    }

    if (error) {
        return <ErrorComponent error={error} />;
    }
    return (
        <Box>
            <TableContainer
                sx={{
                    width: '100%',
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': { whiteSpace: 'nowrap' }
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    sx={{
                        '& .MuiTableCell-root:first-of-type': {
                            pl: 2
                        },
                        '& .MuiTableCell-root:last-of-type': {
                            pr: 3
                        }
                    }}
                >
                    <AppointmentTableHead order={order} orderBy={orderBy} />
                    <TableBody>
                        {stableSort(tableRows, getComparator(order, orderBy)).map((row, index) => {
                            const isItemSelected = isSelected(row.appointmentId);
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.appointmentId}
                                    selected={isItemSelected}
                                >
                                    <TableCell component="th" id={labelId} scope="row" align="left">
                                        <Link color="secondary" component={RouterLink} to="">
                                            {row.appointmentId}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="left">{row.patientName}</TableCell>
                                    <TableCell align="left">{row.service}</TableCell>
                                    <TableCell align="left">{format(row.appointmentDate, 'yyyy-MM-dd hh:mm a')}</TableCell>
                                    <TableCell align="left">
                                        <AppointmentStatus status={row.status} />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

AppointmentTable.propTypes = {

    idToken: PropTypes.string.isRequired
};

const LoadingComponent = () => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <LoadingOutlined size={80} />
        </Box>
    );
};

// eslint-disable-next-line react/prop-types
const ErrorComponent = ({ error }) => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">

            <Typography variant="h5" color="error">
                { /* eslint-disable-next-line react/prop-types */}
                Error: {error.message}
            </Typography>
        </Box>
    );
};