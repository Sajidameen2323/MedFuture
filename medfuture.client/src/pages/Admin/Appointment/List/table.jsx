/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import * as React from 'react';
import { useQuery } from 'react-query';

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { Stack, IconButton, Box } from '@mui/material';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);


import VisibilityIcon from '@mui/icons-material/Visibility';

import { useState, useContext } from 'react';

import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';
import { Empty } from 'antd';
import { useCallback } from 'react';

import { Descriptions } from 'antd';

import CloseIcon from '@mui/icons-material/Close';
import DataGridOptions from './DataGridOptions';

export default function DataTable({ props }) {


    const columns = [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'patient', headerName: 'Patient', flex: 1, },
        { field: 'doctor', headerName: 'Doctor', flex: 1, },
        { field: 'service', headerName: 'Service', flex: 1, },
        { field: 'date', headerName: 'Date', flex: 1, type: "date", valueGetter: (params) => { return new Date(params.value) ?? new Date() } },
        { field: 'start_at', headerName: 'Start At', flex: 1, type: "string", valueGetter: (params) => { return dayjs(params.value).format('h:mm A') ?? dayjs().format('h:mm A') } },
        {
            field: 'status',
            headerName: 'Status',
            type: 'string',
            flex: 1,
        },
        {
            field: 'actions',
            type: 'actions',
            flex: 1,
            getActions: (params) => [

                <GridActionsCellItem
                    icon={<VisibilityIcon />}
                    label="View"
                    onClick={() => {
                        let { outputObject } = data;

                        let app = outputObject.filter((el) => el?.appointmentId === params.row.id)[0]

                        console.log(app)

                        setSelectedAppointment(app)
                    }}
                />
                ,
                //<GridActionsCellItem
                //    icon={<SecurityIcon />}
                //    label="Set Status"
                //    onClick={() => { }}
                //    showInMenu
                ///>,

            ],
        },
    ];


    const [rows, setRows] = useState([]);
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);

    const { idToken } = useContext(FirebaseAuthContext);
    const { dateRange, statusFilter, prevDateRange, setPrevDateRange } = props;

    const [selectedAppointment, setSelectedAppointment] = useState(null);

    // data fetching logic
    const fetchAppointmentsByRange = useCallback(async () => {
  
        console.log("logging inside api fetcher");

        let startDate = dayjs(dateRange[0], "YYYY-MM-DD").format("YYYY-MM-DD");
        let endDate = dayjs(dateRange[1], "YYYY-MM-DD").format("YYYY-MM-DD");

        try {
            const response = await fetch(`/api/appointment/get-appointments?startDate=${startDate}&endDate=${endDate}`, {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    "Content-Type": "application/json"
                },
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return response.json();
        } catch (error) {
            // Handle fetch errors
            console.error('Fetch error:', error);
            throw error; // Rethrow the error to be caught by React Query
        }
    }, [idToken, dateRange]);


    const { isLoading, isError, data, error } = useQuery(['apiGetAppointmentsForRange', dateRange], fetchAppointmentsByRange, {
        enabled: dateRange !== prevDateRange,
    
        onSuccess: () => {
            // Update the prevDateRange state after a successful query
            setPrevDateRange(dateRange);
        },
    });


    React.useEffect(() => {

        // console.log(data);
        if (data) {
            let tempArr = [];
            let { outputObject } = data;
            if (outputObject) {

                if (statusFilter != "All") {
                   // console.log("filtering")
                    outputObject = outputObject.filter(el => el.status === statusFilter)
                  //  console.log(outputObject.length)
                }

                outputObject.forEach((el) => {

                    tempArr.push({
                        id: el?.appointmentId,
                        patient: el?.patient?.firstName + " " + el?.patient?.lastName,
                        doctor: el?.doctor?.firstName + " " + el?.doctor?.lastName,
                        service: el?.service?.name,
                        date: el?.appointmentDate,
                        start_at: el?.startDateTime,
                        status: el?.status,
                    })

                })
            }

          //  console.log(outputObject)
            setRows(tempArr)
        }


    }, [data, statusFilter]);


    if (isLoading) {
        return <span>Loading...</span>
    }

    if (isError) {
        return (
            <div>
                   <span>Errors: {error.message}</span>
            </div>
        )
    }

    return (
        <>
            <Stack spacing={2}>

                {selectedAppointment && <DetailView selectedAppointment={selectedAppointment} setSelectedAppointment={setSelectedAppointment} />}
       
                <Box sx={{ margin:'100px' }}>
                    <DataGrid
                        sx={{ height: rows.length == 0 ? '300px' : '100%' }}
                        slots={{
                            noRowsOverlay: Empty,
                          
                        }}
                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { page: 0, pageSize: 5 },
                            },
                            columns: {
                                columnVisibilityModel: {
                                    id: false,
                                    fullName: false,
                                },
                            }
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        disableRowSelectionOnClick

                        onRowSelectionModelChange={(newRowSelectionModel) => {
                            console.log(newRowSelectionModel)
                            setRowSelectionModel(newRowSelectionModel);
                        }}
                        rowSelectionModel={rowSelectionModel}

                    />
                </Box>
                {rowSelectionModel && rowSelectionModel.length > 0 && <DataGridOptions rowSelectionModel={rowSelectionModel} setPrevDateRange={setPrevDateRange} />}

            </Stack>
  
        </>
    );
}

function DetailView({ selectedAppointment, setSelectedAppointment }) {

    const items = [
        {
            key: '1',
            label: 'Patient Name',
            children: selectedAppointment?.patient?.firstName + " " + selectedAppointment?.patient?.lastName ,
        },
        {
            key: '2',
            label: 'Service',
            children: selectedAppointment?.service?.name,
        },
        {
            key: '3',
            label: 'Doctor',
            children: selectedAppointment?.doctor?.firstName + " " + selectedAppointment?.doctor?.lastName,
        },
        {
            key: '4',
            label: 'Date',
            span: 1,
            children: dayjs(selectedAppointment?.appointmentDate).format("YYYY-MM-DD"),
        },
        {
            key: '5',
            label: 'Start At',
            children: dayjs(selectedAppointment?.startDateTime).format('h:mm A'),
        },
        {
            key: '6',
            label: 'Duration',
            children: selectedAppointment?.service?.duration + " min",
        },
        {
            key: '7',
            label: 'Email',
            span: 1,
            children: selectedAppointment?.patient?.email ?? "N/A",
        },
        {
            key: '8',
            label: 'Phone',
            span: 1,
            children: selectedAppointment?.patient?.phoneNumber ?? "N/A",
        },
        {
            key: '9',
            label: 'Payment Status',
            children: selectedAppointment?.paymentStatus ?? "N/A",
        },
        {
            key: '10',
            label: 'Payment Method',
            children: "On-site",
        },
        {
            key: '11',
            label: 'Price',
            children: "Rs. "+ (selectedAppointment?.price ?? "200.00"),
        },
    ];

    return (
        <>
            <Descriptions title="Appointment Info" layout="vertical" items={items}
                extra={
                    <IconButton aria-label="delete" size="medium" onClick={() => { setSelectedAppointment(null) } } >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
            />
        </>
    )

}


