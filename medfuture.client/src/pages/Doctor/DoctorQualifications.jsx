import React, { useState, useContext, useCallback } from 'react';
import { List, Collapse, Typography, Button, Form, Input, Popconfirm, notification, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Box, Stack } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';
import moment from 'moment';

const { Panel } = Collapse;

const DoctorQualifications = () => {
    const { idToken } = useContext(FirebaseAuthContext);
    const queryClient = useQueryClient();
    const [activeKey, setActiveKey] = useState([]);

    // Fetch qualifications
    const fetchQualifications = async () => {
        const response = await fetch('/api/doctor/me/qualifications', {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    };

    // Add qualification mutation
    const addQualificationMutation = useCallback(async (newQualification) => {
        try {
            const response = await fetch('/api/doctor/me/qualifications', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newQualification),
            });
            if (response.ok) {
                notification.success({
                    message: 'Success',
                    description: 'Qualification added successfully',
                    duration: 2,
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to add qualification',
                    duration: 2,
                });
            }
            return response.json();
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'An error occurred while adding the qualification',
                duration: 2,
            });
            throw error;
        }
    }, [idToken]);

    // Update qualification mutation
    const updateQualificationMutation = useCallback(async (updatedQualification) => {
        try {
            const response = await fetch(`/api/doctor/me/qualifications/${updatedQualification.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedQualification),
            });
            if (response.ok) {
                notification.success({
                    message: 'Success',
                    description: 'Qualification updated successfully',
                    duration: 2,
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to update qualification',
                    duration: 2,
                });
            }
            return response.json();
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'An error occurred while updating the qualification',
                duration: 2,
            });
            throw error;
        }
    }, [idToken]);

    // Remove qualification mutation
    const removeQualificationMutation = useCallback(async (id) => {
        try {
            const response = await fetch(`/api/doctor/me/qualifications/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                notification.success({
                    message: 'Success',
                    description: 'Qualification deleted successfully',
                    duration: 2,
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to delete qualification',
                    duration: 2,
                });
            }
            return response.json();
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'An error occurred while deleting the qualification',
                duration: 2,
            });
            throw error;
        }
    }, [idToken]);

    const { isLoading: qualificationsLoading } = useQuery('qualifications', fetchQualifications, {
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
            setQualifications(data);
        }
    });

    const { mutate: addQualification, isLoading: addingQualification } = useMutation(addQualificationMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries('qualifications');
        },
    });

    const { mutate: updateQualification, isLoading: updatingQualification } = useMutation(updateQualificationMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries('qualifications');
            setEditingQualification(null);
            form.resetFields();
        },
    });

    const { mutate: removeQualification, isLoading: isDeleting } = useMutation(removeQualificationMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries('qualifications');
        },
    });

    const [qualifications, setQualifications] = useState([]);
    const [editingQualification, setEditingQualification] = useState(null);
    const [form] = Form.useForm();
    const [confirmationModal, setConfirmationModal] = useState({ visible: false, qualificationId: null, name: null });

    const handleAddQualification = (values) => {
        const newQualification = {
            name: values.name,
            institute: values.institute,
            acquiredDate: values.acquiredDate.format('YYYY-MM-DD')
        };
        addQualification(newQualification);
        form.resetFields();
    };

    const handleEditQualification = (qualification) => {
        setEditingQualification(qualification);
        setActiveKey(['1']); // Open the collapse panel
        form.setFieldsValue({
            name: qualification.name,
            institute: qualification.institute,
            acquiredDate: moment(qualification.acquiredDate)
        });
    };

    const handleUpdateQualification = (values) => {
        const updatedQualification = {
            id: editingQualification.id,
            name: values.name,
            institute: values.institute,
            acquiredDate: values.acquiredDate.format('YYYY-MM-DD')
        };
        updateQualification(updatedQualification);
    };

    const handleRemoveQualification = (id, name) => {
        setConfirmationModal({ visible: true, qualificationId: id, name });
    };

    const handleConfirmRemove = () => {
        removeQualification(confirmationModal.qualificationId);
        setConfirmationModal({ visible: false, qualificationId: null, name: null });
    };

    const handleCancelRemove = () => {
        setConfirmationModal({ visible: false, qualificationId: null, name: null });
    };

    const collapseItems = [
        {
            key: '1',
            label: editingQualification ? "Update Qualification" : "Add Qualification",
            children: (
                <Form form={form} onFinish={editingQualification ? handleUpdateQualification : handleAddQualification} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Qualification Name"
                        rules={[{ required: true, message: 'Please enter a qualification name' }]}
                    >
                        <Input placeholder="Enter qualification name" />
                    </Form.Item>
                    <Form.Item
                        name="institute"
                        label="Institute"
                        rules={[{ required: true, message: 'Please enter the institute name' }]}
                    >
                        <Input placeholder="Enter institute name" />
                    </Form.Item>
                    <Form.Item
                        name="acquiredDate"
                        label="Acquired Date"
                        rules={[{ required: true, message: 'Please select the acquired date' }]}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item style={{ display: 'flex', justifyContent: 'space-evenly' }} >
                        <Button type="primary" htmlType="submit" loading={addingQualification || updatingQualification}>
                            {editingQualification ? 'Update' : 'Add'}
                        </Button>
                        <Button style={{ marginLeft: '10px' }} onClick={() => {
                            form.resetFields();
                            setEditingQualification(null);
                            setActiveKey([]); // Close the collapse panel
                        }}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
    ];

    return (
        <Box sx={{ width: { xs: '100%', md: '1000px' } }} >
            <Collapse style={{ marginTop: '50px' }} items={collapseItems} defaultActiveKey={[]} activeKey={activeKey} onChange={(key) => setActiveKey(key)} />

            <List
                loading={qualificationsLoading}
                size="small"
                header={
                    <List.Item style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f0f0f0', padding: '8px 16px' }}>
                        <Typography.Text strong>Qualification</Typography.Text>
 
                        <Typography.Text strong>Action</Typography.Text>
                    </List.Item>
                }
                dataSource={qualifications}
                renderItem={(qualification, index) => (
                    <List.Item
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', borderBottom: '1px solid #e8e8e8', textAlign: 'left' }}
                        actions={[
                            <EditOutlined key="edit" onClick={() => handleEditQualification(qualification)} style={{ color: '#1890ff', cursor: 'pointer' }} />,
                            <DeleteOutlined key="delete" onClick={() => handleRemoveQualification(qualification.id, qualification.name)} style={{ color: '#ff4d4f', cursor: 'pointer' }} />,
                        ]}
                    >
                        <List.Item.Meta
                            title={<Typography.Text strong>{qualification.name}</Typography.Text>}
                            description={<Stack>
                                <Typography.Text>{qualification.institute}</Typography.Text>
                                <Typography.Text>{moment(qualification.acquiredDate).format('YYYY-MM-DD')}</Typography.Text>
                            </Stack> }
                        />


                    </List.Item>
                )}
            />

            <Popconfirm
                title={"Confirm Delete - " + confirmationModal.name}
                description="Are you sure you want to delete this qualification?"
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

export default DoctorQualifications;