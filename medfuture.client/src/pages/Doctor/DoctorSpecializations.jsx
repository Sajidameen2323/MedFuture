import React, { useState, useContext, useCallback } from 'react';
import { List, Collapse, Typography, Button, Form, Input, Popconfirm, notification, Select } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Box } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';

const { Panel } = Collapse;
const { Option } = Select;

const DoctorSpecializations = () => {
    const { idToken } = useContext(FirebaseAuthContext);
    const queryClient = useQueryClient();
    const [activeKey, setActiveKey] = useState([]);

    // Popular doctor and dental specializations
    const specializations_options = [
        'Cardiology',
        'Dermatology',
        'Endocrinology',
        'Gastroenterology',
        'General Surgery',
        'Gynecology',
        'Internal Medicine',
        'Nephrology',
        'Neurology',
        'Oncology',
        'Ophthalmology',
        'Orthopedics',
        'Pediatrics',
        'Psychiatry',
        'Pulmonology',
        'Radiology',
        'Urology',
        'Dentistry',
        'Orthodontics',
        'Periodontics',
        'Endodontics',
        'Oral Surgery'
    ];

    // Fetch specializations
    const fetchSpecializations = async () => {
        const response = await fetch('/api/doctor/me/specializations', {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    };

    // Add specialization mutation
    const addSpecializationMutation = useCallback(async (newSpecialization) => {
        try {
            const response = await fetch('/api/doctor/me/specializations', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newSpecialization),
            });
            if (response.ok) {
                notification.success({
                    message: 'Success',
                    description: 'Specialization added successfully',
                    duration: 2,
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to add specialization',
                    duration: 2,
                });
            }
            return response.json();
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'An error occurred while adding the specialization',
                duration: 2,
            });
            throw error;
        }
    }, [idToken]);

    // Update specialization mutation
    const updateSpecializationMutation = useCallback(async (updatedSpecialization) => {
        try {
            const response = await fetch(`/api/doctor/me/specializations/${updatedSpecialization.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedSpecialization),
            });
            if (response.ok) {
                notification.success({
                    message: 'Success',
                    description: 'Specialization updated successfully',
                    duration: 2,
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to update specialization',
                    duration: 2,
                });
            }
            return response.json();
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'An error occurred while updating the specialization',
                duration: 2,
            });
            throw error;
        }
    }, [idToken]);

    // Remove specialization mutation
    const removeSpecializationMutation = useCallback(async (id) => {
        try {
            const response = await fetch(`/api/doctor/me/specializations/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                notification.success({
                    message: 'Success',
                    description: 'Specialization deleted successfully',
                    duration: 2,
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to delete specialization',
                    duration: 2,
                });
            }
            return response.json();
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'An error occurred while deleting the specialization',
                duration: 2,
            });
            throw error;
        }
    }, [idToken]);

    const { isLoading: specializationsLoading } = useQuery('specializations', fetchSpecializations, {
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
            setSpecializations(data);
        }
    });

    const { mutate: addSpecialization, isLoading: addingSpecialization } = useMutation(addSpecializationMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries('specializations');
        },
    });

    const { mutate: updateSpecialization, isLoading: updatingSpecialization } = useMutation(updateSpecializationMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries('specializations');
            setEditingSpecialization(null);
            form.resetFields();
        },
    });

    const { mutate: removeSpecialization, isLoading: isDeleting } = useMutation(removeSpecializationMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries('specializations');
        },
    });

    const [specializations, setSpecializations] = useState([]);
    const [editingSpecialization, setEditingSpecialization] = useState(null);
    const [form] = Form.useForm();
    const [confirmationModal, setConfirmationModal] = useState({ visible: false, specializationId: null, name: null });

    const handleAddSpecialization = (values) => {
        const newSpecialization = {
            name: values.name
        };
        addSpecialization(newSpecialization);
        form.resetFields();
    };

    const handleEditSpecialization = (specialization) => {
        setEditingSpecialization(specialization);
        setActiveKey(['1']); // Open the collapse panel
        form.setFieldsValue({
            name: specialization.name
        });
    };

    const handleUpdateSpecialization = (values) => {
        const updatedSpecialization = {
            id: editingSpecialization.id,
            name: values.name
        };
        updateSpecialization(updatedSpecialization);
    };

    const handleRemoveSpecialization = (id, name) => {
        setConfirmationModal({ visible: true, specializationId: id, name });
    };

    const handleConfirmRemove = () => {
        removeSpecialization(confirmationModal.specializationId);
        setConfirmationModal({ visible: false, specializationId: null, name: null });
    };

    const handleCancelRemove = () => {
        setConfirmationModal({ visible: false, specializationId: null, name: null });
    };

    const collapseItems = [
        {
            key: '1',
            label: editingSpecialization ? "Update Specialization" : "Add Specialization",
            children: (
                <Form form={form} onFinish={editingSpecialization ? handleUpdateSpecialization : handleAddSpecialization} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Specialization Name"
                        rules={[{ required: true, message: 'Please select a specialization' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Select a specialization"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {specializations_options.map((specialization) => (
                                <Option key={specialization} value={specialization}>
                                    {specialization}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <Button type="primary" htmlType="submit" loading={addingSpecialization || updatingSpecialization}>
                            {editingSpecialization ? 'Update' : 'Add'}
                        </Button>
                        <Button
                            style={{ marginLeft: '10px' }}
                            onClick={() => {
                                form.resetFields();
                                setEditingSpecialization(null);
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
            <Collapse
                style={{ marginTop: '50px' }}
                items={collapseItems}
                defaultActiveKey={[]}
                activeKey={activeKey}
                onChange={(key) => setActiveKey(key)}
            />

            <List
                loading={specializationsLoading}
                size="small"
                header={
                    <List.Item
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            backgroundColor: '#f0f0f0',
                            padding: '8px 16px',
                        }}
                    >
                        <Typography.Text strong>Specialization</Typography.Text>
                        <Typography.Text strong>Action</Typography.Text>
                    </List.Item>
                }
                dataSource={specializations}
                renderItem={(specialization, index) => (
                    <List.Item
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px 16px',
                            borderBottom: '1px solid #e8e8e8',
                            textAlign: 'left',
                        }}
                        actions={[
                            <EditOutlined
                                key="edit"
                                onClick={() => handleEditSpecialization(specialization)}
                                style={{ color: '#1890ff', cursor: 'pointer' }}
                            />,
                            <DeleteOutlined
                                key="delete"
                                onClick={() => handleRemoveSpecialization(specialization.id, specialization.name)}
                                style={{ color: '#ff4d4f', cursor: 'pointer' }}
                            />,
                        ]}
                    >
                        <List.Item.Meta title={<Typography.Text strong>{specialization.name}</Typography.Text>} />
                    </List.Item>
                )}
            />

            <Popconfirm
                title={"Confirm Delete - " + confirmationModal.name}
                description="Are you sure you want to delete this specialization?"
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

export default DoctorSpecializations;