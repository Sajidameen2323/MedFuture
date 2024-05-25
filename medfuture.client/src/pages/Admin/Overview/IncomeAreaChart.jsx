import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-query';
import ReactApexChart from 'react-apexcharts';
import { Box, Skeleton } from '@mui/material';



const areaChartOptions = {
    chart: {
        height: 450,
        type: 'area',
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
        },
        dropShadow: {
            enabled: false,
            enabledOnSeries: undefined,
            top: 0,
            left: 0,
            blur: 3,
            color: '#000',
            opacity: 0.35
        }
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        curve: 'smooth',
        width: 2,
    },
    grid: {
        strokeDashArray: 0,
    },
};

const RevenueAreaChart = ({ slot, idToken }) => {


    const fetchRevenueData = useCallback(async () => {

        try {
            const response = await fetch(`/api/admin/stats/get-revenue`, {
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

    const { data, isLoading, error } = useQuery('revenueData', fetchRevenueData, {

        refetchOnWindowFocus: false

    });
    const [options, setOptions] = useState(areaChartOptions);
    const [series, setSeries] = useState([]);

    useEffect(() => {
        //console.log(slot)
        //console.log(data)
        if (data) {
            let obj = data[slot]
            if (obj) {
                console.log(obj)
                setSeries([
                    {
                        name: 'Revenue',
                        data: obj.map((item) => item.revenue),
                    },
                ]);

                setOptions((prevState) => ({
                    ...prevState,
                    xaxis: {
                        categories: obj.map((item) => item.label),
                    },
                }));
            }

        }
    }, [data, slot]);

    if (isLoading) {
        return (
            <Box height={450} m={2 }>
                <Skeleton variant="rectangular" height={450} />
            </Box>
        );
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return <ReactApexChart options={options} series={series} type="area" height={450} />;
};

RevenueAreaChart.propTypes = {
    slot: PropTypes.string,
    idToken: PropTypes.string
};

export default RevenueAreaChart;