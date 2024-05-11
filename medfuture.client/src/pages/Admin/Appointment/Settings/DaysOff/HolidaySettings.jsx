import React, { useState, useContext, useCallback } from 'react';
import { List, Collapse, Typography, Button, Form, Input, Popconfirm, DatePicker } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Box } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';

const { Panel } = Collapse;
const { RangePicker } = DatePicker;


const HolidaySettings = () => {

    const { idToken } = useContext(FirebaseAuthContext);
    const queryClient = useQueryClient();


    // Add holiday mutation
    const addHolidayMutation = useCallback(async (newHoliday) => {
        const response = await fetch('/api/appointment/holidays', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newHoliday),
        });
        return response.json();
    }, [idToken]);

    // Remove holiday mutation
    const removeHolidayMutation = useCallback(async (id) => {
        const response = await fetch(`/api/appointment/holidays/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
        });
        return response.json();
    },[idToken]);

    const { data: holidaysFromServer, isLoading } = useQuery('holidays', fetchHolidays, {
        refetchOnWindowFocus: false,
        onSuccess: (data) => {

            console.log(data)
            if (data) {
                let temp = [];
                data.forEach(el => {

                    temp.push({ name: el?.name || "", dateRange: [new Date(el?.startDate || ""), new Date(el?.endDate || "")], id: el?.id || 0  })
                })
                console.log(temp);

                setHolidays(temp)
            }
        }
    });

    const { mutate: addHoliday } = useMutation(addHolidayMutation, {

        onSuccess: () => {
            queryClient.invalidateQueries('holidays');
        },
    });
    const { mutate: removeHoliday, isLoading: isDeleting } = useMutation(removeHolidayMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries('holidays');
        },
    });

    const [holidays, setHolidays] = useState([


    ]);
    const [form] = Form.useForm();
    const [confirmationModal, setConfirmationModal] = useState({ visible: false, holidayId: null, name: null });

    const handleAddHoliday = (values) => {
        const newHoliday = {
            name: values.name,
            startDate: values.dateRange[0].toISOString(),
            endDate: values.dateRange[1].toISOString()
        };
        addHoliday(newHoliday);
        form.resetFields();
    };

    const handleRemoveHoliday = (id,name) => {
        setConfirmationModal({ visible: true, holidayId: id, name });
    };

    const handleConfirmRemove = () => {
        removeHoliday(confirmationModal.holidayId);
        setConfirmationModal({ visible: false, holidayId: null, name: null });
    };

    const handleCancelRemove = () => {
        setConfirmationModal({ visible: false, holidayId: null, name: null });
    };

    return (
        <Box sx={{ width: { xs: '100%', md: '1000px' } }} >

            <Collapse style={{ marginTop:'50px' }} >
                <Panel header="Add Day Off" key="1">
                    <Form form={form} onFinish={handleAddHoliday} layout="vertical">
                        <Form.Item
                            name="name"
                            label="Day Off name"
                            rules={[{ required: true, message: 'Please enter a holiday or day off name' }]}
                        >
                            <Input placeholder="Enter holiday or day off name" />
                        </Form.Item>
                        <Form.Item
                            name="dateRange"
                            label="Date"
                            rules={[{ required: true, message: 'Please select a date range' }]}
                          
                        >
                            <RangePicker  size="small" format="MM/DD/YYYY" />
                        </Form.Item>

                        <Form.Item style={{ display: 'flex', justifyContent:'space-evenly' } } >
                            <Button type="primary" htmlType="submit">
                                Add Day Off
                            </Button>
                            <Button style={{ marginLeft: '10px' }} onClick={() => form.resetFields()}>
                                Cancel
                            </Button>
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>

            <Typography.Title style={{ textAlign:'left' } } level={5}> Upcoming Holidays </Typography.Title>

            <List
                loading={isLoading}
                size="small"
                header={
                    <List.Item style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f0f0f0', padding: '8px 16px' }}>
                        <Typography.Text strong>Holiday</Typography.Text>

                        <Typography.Text strong>Action</Typography.Text>
                    </List.Item>
                }
                dataSource={holidays}
                renderItem={(holiday, index) => (

                    <List.Item
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', borderBottom: '1px solid #e8e8e8', textAlign: 'left' }}
                        actions={[
                            <DeleteOutlined key="delete" onClick={() => handleRemoveHoliday(holiday.id, holiday.name)} style={{ color: '#ff4d4f', cursor: 'pointer' }} />,
                        ]}
                    >
                        <List.Item.Meta

                            title={<Typography.Text strong>{holiday.name}</Typography.Text>}
                            description={holiday?.dateRange[0]?.toLocaleDateString() +" - "+ holiday?.dateRange[1]?.toLocaleDateString()}
                        />
                    </List.Item>

                )}
            />

            <Popconfirm
                title={"Confirm Delete - " + confirmationModal.name}
                description="Are you sure you want to delete this holiday?"
                open={confirmationModal.visible}
                onConfirm={handleConfirmRemove}
                okButtonProps={{
                    loading: isDeleting,
                }}
                onCancel={handleCancelRemove}
            >

            </Popconfirm>

        </Box>
    );
};

// Fetch holidays
const fetchHolidays = async () => {
    const response = await fetch('/api/appointment/holidays');
    return response.json();
};




export default HolidaySettings;