/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import { useQuery } from 'react-query';

const ageGroupChartOptions = {
  chart: {
    type: 'bar',
    height: 430,
    toolbar: {
      show: true,
      tools: {
          download: true,
          pan: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          reset: true,
          customIcons: []
      }
  },
  },
  plotOptions: {
    bar: {
      columnWidth: '30%',
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 8,
    colors: ['transparent']
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  },
  yaxis: {
    title: {
      text: 'Appointments'
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: (val) => `${val} appointments`
    }
  },
  legend: {
    show: true,
    fontFamily: `'Public Sans', sans-serif`,
    offsetX: 10,
    offsetY: 10,
    labels: {
      useSeriesColors: false
    },
    markers: {
      width: 16,
      height: 16,
      radius: '50%',
      offsexX: 2,
      offsexY: 2
    },
    itemMargin: {
      horizontal: 40,
      vertical: 15
    }
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        yaxis: {
          show: false
        }
      }
    }
  ]
};

const AppointmentsByAgeGroup = ({ idToken }) => {
  const theme = useTheme();
  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;
  const warning = theme.palette.warning.main;
  const primaryMain = theme.palette.primary.main;
  const successDark = theme.palette.success.dark;

    const [series, setSeries] = useState([
        {
            name: '0-18',
            data: [10, 15, 20, 25, 30, 35] // Replace with your actual data for 0-18 age group
        },
        {
            name: '19-64',
            data: [50, 60, 70, 80, 90, 100] // Replace with your actual data for 19-64 age group
        },
        {
            name: '65+',
            data: [20, 25, 30, 35, 40, 45] // Replace with your actual data for 65+ age group
        }
    ]);

    const fetchAppointmentsByAgeGroup = useCallback(async () => {
        const response = await axios.get('/api/admin/stats/appointments-by-age-group', {

            headers: {
                'Authorization': `Bearer ${idToken}`,
                "Content-Type": "application/json"
            },
        });
        return response.data;
    }, [idToken]);


    const { isLoading, error } = useQuery('appointmentsByAgeGroup', fetchAppointmentsByAgeGroup, {
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
            console.log("Kaaham");
            console.log(data);
            let xAxisLabels = data.map(el => el.month);
            let ageGroup0To18Data = data.map(el => el.ageGroup0To18);
            let ageGroup19To64Data = data.map(el => el.ageGroup19To64);
            let ageGroup65PlusData = data.map(el => el.ageGroup65Plus);

            setOptions((prevState) => ({

                ...prevState,
                xaxis: {
                    categories: xAxisLabels
                }
            }));

            setSeries([
                {
                    name: '0-18',
                    data: ageGroup0To18Data
                },
                {
                    name: '19-64',
                    data: ageGroup19To64Data 
                },
                {
                    name: '65+',
                    data: ageGroup65PlusData
                }
            ])
        }
    });



  const [options, setOptions] = useState(ageGroupChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [primaryMain, warning, successDark],
      xaxis: {
        labels: {
          style: {
            colors: [secondary, secondary, secondary, secondary, secondary, secondary]
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      },
      tooltip: {
        theme: 'light'
      },
      legend: {
        position: 'top',
        horizontalAlign: 'center',
        labels: {
          colors: 'grey.500'
        }
      }
    }));
  }, [primary, secondary, line, warning, primaryMain, successDark]);


    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="bar" height={430} />
    </div>
  );
};

export default AppointmentsByAgeGroup;