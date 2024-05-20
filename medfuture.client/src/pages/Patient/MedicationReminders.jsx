import React, { useState, useContext, useCallback } from 'react';
import { List, Collapse, Typography, Button, Form, Input, Popconfirm, notification, TimePicker, Select } from 'antd';
import { EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons'; 
import { Box } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';
import moment from 'moment';

const { Panel } = Collapse;

const MedicationReminders = () => {
    const { idToken } = useContext(FirebaseAuthContext);
    const queryClient = useQueryClient();
    const [activeKey, setActiveKey] = useState([]);
    const [externalToggle, setExternalToggle] = useState(false);

    // Fetch medication reminders
    const fetchMedicationReminders = async () => {
        const response = await fetch('/api/patient/me/medication-reminders', {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    };

    // Add medication reminder mutation
    const addMedicationReminderMutation = useCallback(async (newReminder) => {
        try {
            const response = await fetch('/api/patient/me/medication-reminders', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newReminder),
            });
            if (response.ok) {
                notification.success({
                    message: 'Success',
                    description: 'Medication reminder added successfully',
                    duration: 2,
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to add medication reminder',
                    duration: 2,
                });
            }
            return response.json();
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'An error occurred while adding the medication reminder',
                duration: 2,
            });
            throw error;
        }
    }, [idToken]);

    // Update medication reminder mutation
    const updateMedicationReminderMutation = useCallback(async (updatedReminder) => {
        try {
            const response = await fetch(`/api/patient/me/medication-reminders/${updatedReminder.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedReminder),
            });
            if (response.ok) {
                notification.success({
                    message: 'Success',
                    description: 'Medication reminder updated successfully',
                    duration: 2,
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to update medication reminder',
                    duration: 2,
                });
            }
            return response.json();
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'An error occurred while updating the medication reminder',
                duration: 2,
            });
            throw error;
        }
    }, [idToken]);

    // Remove medication reminder mutation
    const removeMedicationReminderMutation = useCallback(async (id) => {
        try {
            const response = await fetch(`/api/patient/me/medication-reminders/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                notification.success({
                    message: 'Success',
                    description: 'Medication reminder deleted successfully',
                    duration: 2,
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to delete medication reminder',
                    duration: 2,
                });
            }
            return response.json();
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'An error occurred while deleting the medication reminder',
                duration: 2,
            });
            throw error;
        }
    }, [idToken]);

    const { isLoading: reminderLoading } = useQuery('medication-reminders', fetchMedicationReminders, {
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
            setReminders(data);
        }
    });

    const { mutate: addReminder, isLoading: addingReminder } = useMutation(addMedicationReminderMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries('medication-reminders');
        },
    });

    const { mutate: updateReminder, isLoading: updatingReminder } = useMutation(updateMedicationReminderMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries('medication-reminders');
            setEditingReminder(null);
            form.resetFields();
        },
    });

    const { mutate: removeReminder, isLoading: isDeleting } = useMutation(removeMedicationReminderMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries('medication-reminders');
        },
    });

    const [reminders, setReminders] = useState([]);
    const [editingReminder, setEditingReminder] = useState(null);
    const [form] = Form.useForm();
    const [confirmationModal, setConfirmationModal] = useState({ visible: false, reminderId: null, name: null });

    const handleAddReminder = (values) => {
        const reminderTimeValue = values.reminderTime.format('HH:mm:ss');
        const newReminder = {
            name: values.name,
            dosage: values.dosage,
            reminderTime: reminderTimeValue,
            medicationType: values.medicationType,
            isActive: values.status === 'active',
            visible: values.visible === 'yes',
        };
        addReminder(newReminder);
        form.resetFields();
    };

    const handleEditReminder = (reminder) => {
        setEditingReminder(reminder);
        setActiveKey(['1']); // Open the collapse panel
        form.setFieldsValue({
            name: reminder.name,
            dosage: reminder.dosage,
            reminderTime: moment(reminder.reminderTime, 'HH:mm:ss'),
            medicationType: reminder.medicationType,
            status: reminder.isActive ? 'active' : 'inactive',
            visible: reminder.visible ? 'yes' : 'no',
        });
    };

    const handleCloneReminder = (reminder) => {
        //setEditingReminder(reminder);
        setActiveKey(['1']); // Open the collapse panel
        form.setFieldsValue({
            name: reminder.name,
            dosage: reminder.dosage,
    
            medicationType: reminder.medicationType,
            status: reminder.isActive ? 'active' : 'inactive',
            visible: 'no',
        });
    };

    const handleUpdateReminder = (values) => {
        const updatedReminder = {
            id: editingReminder.id,
            name: values.name,
            dosage: values.dosage,
            reminderTime: values.reminderTime.format('HH:mm:ss'),
            medicationType: values.medicationType,
            isActive: values.status === 'active',
            visible: values.visible === 'yes',
        };
        updateReminder(updatedReminder);
    };

    const handleRemoveReminder = (id, name) => {
        setConfirmationModal({ visible: true, reminderId: id, name });
    };

    const handleConfirmRemove = () => {
        removeReminder(confirmationModal.reminderId);
        setConfirmationModal({ visible: false, reminderId: null, name: null });
    };

    const handleCancelRemove = () => {
        setConfirmationModal({ visible: false, reminderId: null, name: null });
    };

    const collapseItems = [
        {
            key: '1',
            label: editingReminder ? "Update Medication Reminder" : "Add Medication Reminder",
            children: (
                <Form form={form} onFinish={editingReminder ? handleUpdateReminder : handleAddReminder} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Medication Name"
                        rules={[{ required: true, message: 'Please enter a medication name' }]}
                    >
                        <Input placeholder="Enter medication name" />
                    </Form.Item>

                    <Form.Item
                        name="dosage"
                        label="Dosage"
                        rules={[{ required: true, message: 'Please enter the dosage' }]}
                    >
                        <Input placeholder="Enter dosage" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Form.Item
                            style={{ display: 'inline-block', textAlign: 'left', width: 'calc(50%)' }}
                            name="medicationType"
                            label="Medication Type"
                            rules={[{ required: true, message: 'Please select the medication type' }]}
                        >
                            <Select placeholder="Select medication type">
                                <Select.Option value={1}>Tablet</Select.Option>
                                <Select.Option value={2}>Syrup</Select.Option>
                                <Select.Option value={3}>Capsule</Select.Option>
                                <Select.Option value={4}>Injection</Select.Option>
                                <Select.Option value={5}>Other</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            style={{ display: 'inline-block', textAlign: 'left', width: 'calc(50%)' }}
                            name="status"
                            label="Reminder"
                            rules={[{ required: true, message: 'Please select the status' }]}
                        >
                            <Select placeholder="Select Reminder status">
                                <Select.Option value={"active"}>Active</Select.Option>
                                <Select.Option value={"inactive"}>Inactive</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Form.Item
                            style={{ display: 'inline-block', textAlign: 'left', width: 'calc(50%)' }}
                            name="reminderTime"
                            label="Reminder Time"
                            rules={[{ required: true, message: 'Please select the reminder time' }]}
                        >
                            <TimePicker format="HH:mm" minuteStep={30} style={{ width: 'calc(100%)' } } />
                        </Form.Item>
                        <Form.Item
                            style={{ display: 'inline-block', textAlign: 'left', width: 'calc(50%)' }}
                            name="visible"
                            label="Visible To Doctor"
                            rules={[{ required: true, message: 'Please select the visible status' }]}
                        >
                            <Select placeholder="Select Visible status">
                                <Select.Option value={"yes"}>Yes</Select.Option>
                                <Select.Option value={"no"}>No</Select.Option>
                            </Select>
                        </Form.Item>
                    </Form.Item>



                    <Form.Item style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <Button type="primary" htmlType="submit" loading={addingReminder || updatingReminder}>
                            {editingReminder ? 'Update' : 'Add'}
                        </Button>
                        <Button
                            style={{ marginLeft: '10px' }}
                            onClick={() => {
                                form.resetFields();
                                setEditingReminder(null);
                                setActiveKey([]); // Close the collapse panel
                            }}
                        >
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
    ];

    return (
        <Box sx={{ width: { xs: '100%', md: '1000px' } }}>
            <Collapse style={{ marginTop: '50px' }} items={collapseItems} defaultActiveKey={[]} activeKey={activeKey} onChange={(key) => setActiveKey(key)} />

            <List
                loading={reminderLoading}
                size="small"
                header={
                    <List.Item style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f0f0f0', padding: '8px 16px' }}>
                        <Typography.Text strong>Medication</Typography.Text>
                        <Typography.Text strong>Dosage</Typography.Text>
                        <Typography.Text strong>Reminder Time</Typography.Text>
                        <Typography.Text strong>Medication Type</Typography.Text>
                        <Typography.Text strong>Reminder</Typography.Text>
                        <Typography.Text strong>Visible</Typography.Text>
                        <Typography.Text strong>Action</Typography.Text>
                    </List.Item>
                }
                dataSource={reminders}
                renderItem={(reminder, index) => (
                    <List.Item
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', borderBottom: '1px solid #e8e8e8', textAlign: 'left' }}
                        actions={[
                            <CopyOutlined key="copy" onClick={() => handleCloneReminder(reminder)} style={{ color: '#34eb4c', cursor: 'pointer' }} />,
                            <EditOutlined key="edit" onClick={() => handleEditReminder(reminder)} style={{ color: '#1890ff', cursor: 'pointer' }} />,
                            <DeleteOutlined key="delete" onClick={() => handleRemoveReminder(reminder.id, reminder.name)} style={{ color: '#ff4d4f', cursor: 'pointer' }} />,
                        ]}
                    >
                        <List.Item.Meta
                            title={<Typography.Text strong>{reminder.name}</Typography.Text>}
                      
                        />
                        <List.Item.Meta
                            title={<Typography.Text strong>{reminder.dosage}</Typography.Text>}
                          
                        />
                        <List.Item.Meta
                            title={<Typography.Text strong>{reminder.reminderTime.toString()}</Typography.Text>}

                        />
                        <List.Item.Meta
                            title={<Typography.Text strong>{getMedicationTypeString(reminder.medicationType)}</Typography.Text>}
                            style={{ textAlign: 'center' }}
                        />
                        <List.Item.Meta
                            title={<Typography.Text strong>{reminder.isActive ? 'Active' : 'Inactive'}</Typography.Text>}
                            style={{ textAlign:'right' } }
                        />
                        <List.Item.Meta
                            title={<Typography.Text strong>{reminder.visible ? 'Yes' : 'No'}</Typography.Text>}
                            style={{ textAlign: 'right' }}
                        />
                    </List.Item>
                )}
            />

            <Popconfirm
                title={"Confirm Delete - " + confirmationModal.name}
                description="Are you sure you want to delete this medication reminder?"
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
}

const getMedicationTypeString = (medicationType) => {
    switch (medicationType) {
        case 1:
            return 'Tablet';
        case 2:
            return 'Syrup';
        case 3:
            return 'Capsule';
        case 4:
            return 'Injection';
        case 5:
            return 'Other';
        default:
            return '';
    }
}

export default MedicationReminders;