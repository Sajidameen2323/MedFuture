/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import { format, subMonths } from 'date-fns';
import { Box } from '@mui/material';
import {
    LoadingOutlined,

} from '@ant-design/icons';
// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const areaChartOptions = {
    chart: {
        height: 340,
        type: 'line',
        toolbar: {
            show: true,
            tools: {
                download: true,
                pan: false,
                selection:false,
                zoom: false,
                zoomin: true,
                zoomout: true,
                reset: true,
                customIcons: []
            }
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: 1.5
    },
    grid: {
        strokeDashArray: 4
    },
    xaxis: {
        type: 'datetime',
        labels: {
            format: 'MMM' // Display month abbreviations on the x-axis
        },
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        }
    },
    yaxis: {
        show: false
    },
    tooltip: {
        x: {
            format: 'MMM' // Display month abbreviations in the tooltip
        }
    }
};



// ==============================|| REPORT AREA CHART ||============================== //
// eslint-disable-next-line react/prop-types
const ReportAreaChart = ({ idToken }) => {
    const theme = useTheme();
    const { primary, secondary } = theme.palette.text;
    const line = theme.palette.divider;
    const [options, setOptions] = useState(areaChartOptions);
    const [series, setSeries] = useState([]);
    const fetchPastSixMonthsAppointments = useCallback(async () => {
        const response = await axios.get('/api/admin/stats/get-this-year-appointments', {

            headers: {
                'Authorization': `Bearer ${idToken}`,
                "Content-Type": "application/json"
            },
        });
        return response.data;
    },[idToken]);

    const { data, isLoading, error } = useQuery('thisYearAppointmentsByMonth', fetchPastSixMonthsAppointments, {

        refetchOnWindowFocus : false

    });

    useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            colors: [theme.palette.warning.main],
            xaxis: {
                type: 'datetime',
                categories: data?.map((item) => item.month) || [
                    '2018-05-19T00:00:00.000Z',
                    '2018-06-19T00:00:00.000Z',
                    '2018-07-19T01:30:00.000Z',
                    '2018-08-19T02:30:00.000Z',
                    '2018-09-19T03:30:00.000Z',
                    '2018-10-19T04:30:00.000Z',
                    '2018-11-19T05:30:00.000Z',
                    '2018-12-19T06:30:00.000Z'
                ], // Set the x-axis categories to the months
                labels: {
                    style: {
                        colors: Array(6).fill(secondary) // Set the color of the x-axis labels
                    },
                    format: 'MMM'
                }
            },
            grid: {
                borderColor: line
            },
            tooltip: {
                theme: 'light'
            },
            legend: {
                labels: {
                    colors: 'grey.500'
                }
            }
        }));

        setSeries([
            {
                name: 'Appointments',
                data: data?.map((item) => item.count) || [58, 115, 28, 83, 63, 75, 35, 55] // Set the series data to the appointment counts
            }
        ])

    }, [primary, secondary, line, theme, data]);

  

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                <LoadingOutlined size={80} />
            </Box>
        )
    }

    //if (error) {
    //    return <div>Error: {error.message}</div>; // Render an error message
    //}

    return <ReactApexChart options={options} series={series} type="line" height={345} />;
};

export default ReportAreaChart;