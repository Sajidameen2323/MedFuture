/* eslint-disable react/prop-types */
import { DatePicker, Space, Segmented, ConfigProvider, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';


import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;

const rangePresets = [
    {
        label: 'Last 7 Days',
        value: [dayjs().add(-7, 'd'), dayjs()],
    },
    {
        label: 'Next 14 Days',
        value: [dayjs().add(14, 'd'), dayjs()],
    },
    {
        label: 'Next 30 Days',
        value: [dayjs().add(30, 'd'), dayjs()],
    },
    {
        label: 'Last 90 Days',
        value: [dayjs().add(-90, 'd'), dayjs()],
    },
];

function Toolbar({ props }) {

    const dateFormat = 'YYYY/MM/DD';

  return (
      <Space direction="horizontal" size={12}>
          <Button onClick={() => { props?.setPrevDateRange(null) } } type="text" icon={<ReloadOutlined />}>
              Refresh
          </Button>
          <RangePicker 
              defaultValue={[dayjs(), dayjs().add(7, 'd')]}
              format={dateFormat}
              presets={rangePresets}
              variant="filled"
              placement={"topLeft"}
              onChange={(value) => {
                  if (value)
                  {
                      var startDate = new Date(value[0].$d);
                      console.log(startDate);
                      startDate = dayjs(startDate);

                      var endDate = new Date(value[1].$d);
                      console.log(endDate);
                      endDate = dayjs(endDate);

                      props.setDateRange([startDate, endDate]);
                    //  console.log(dayjs(value[0].$d, "YYYY-MM-DD").format("YYYY-MM-DD"))
                  }
              }}
          />
          <ConfigProvider
              theme={{
                  token: {
                      // Seed Token
                      colorPrimary: '#00b96b',
                      borderRadius: 2,
                
                      // Alias Token
                      colorBgContainer: '#f6ffed',
                  },
                  components: {
                      Button: {
                          colorPrimary: '#00b96b',
                          algorithm: true, // Enable algorithm
                      },
                      Segmented: {
                          trackPadding: 1
                      }
                  }
              }}
          >
          <Segmented
             
              options={['All', 'Pending', 'Cancelled', 'Missed', 'Completed']}
                  onChange={(value) => {

                      props.setStatusFilter(value) // string
              }}
              />
          </ConfigProvider>
      </Space>
  );
}

export default Toolbar;