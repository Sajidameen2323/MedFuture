import React, { useState, useContext, useCallback } from 'react';
import { List, Collapse, Typography, Button, Form, Input, Popconfirm, notification } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Box } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';

const { Panel } = Collapse;

const Allergies = () => {
    const { idToken } = useContext(FirebaseAuthContext);
    const queryClient = useQueryClient();
    const [activeKey, setActiveKey] = useState([]);
    const [externalToggle, setExternalToggle] = useState(false);

    // Fetch allergies
    const fetchAllergies = async () => {
        const response = await fetch('/api/patient/me/allergies', {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    };

    // Add allergy mutation
    const addAllergyMutation = useCallback(async (newAllergy) => {
        try {
            const response = await fetch('/api/patient/me/allergies', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newAllergy),
            });
            if (response.ok) {
                notification.success({
                    message: 'Success',
                    description: 'Allergy added successfully',
                    duration: 2,
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to add allergy',
                    duration: 2,
                });
            }
            return response.json();
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'An error occurred while adding the allergy',
                duration: 2,
            });
            throw error;
        }
    }, [idToken]);

    // Update allergy mutation
    const updateAllergyMutation = useCallback(async (updatedAllergy) => {
        try {
            const response = await fetch(`/api/patient/me/allergies/${updatedAllergy.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedAllergy),
            });
            if (response.ok) {
                notification.success({
                    message: 'Success',
                    description: 'Allergy updated successfully',
                    duration: 2,
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to update allergy',
                    duration: 2,
                });
            }
            return response.json();
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'An error occurred while updating the allergy',
                duration: 2,
            });
            throw error;
        }
    }, [idToken]);

    // Remove allergy mutation
    const removeAllergyMutation = useCallback(async (id) => {
        try {
            const response = await fetch(`/api/patient/me/allergies/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                notification.success({
                    message: 'Success',
                    description: 'Allergy deleted successfully',
                    duration: 2,
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to delete allergy',
                    duration: 2,
                });
            }
            return response.json();
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'An error occurred while deleting the allergy',
                duration: 2,
            });
            throw error;
        }
    }, [idToken]);

    const { isLoading: allergyLoading } = useQuery('allergies', fetchAllergies, {
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
            setAllergies(data);
        }
    });

    const { mutate: addAllergy, isLoading: addingAllergy } = useMutation(addAllergyMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries('allergies');
        },
    });

    const { mutate: updateAllergy, isLoading: updatingAllergy } = useMutation(updateAllergyMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries('allergies');
            setEditingAllergy(null);
            form.resetFields();
        },
    });

    const { mutate: removeAllergy, isLoading: isDeleting } = useMutation(removeAllergyMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries('allergies');
        },
    });

    const [allergies, setAllergies] = useState([]);
    const [editingAllergy, setEditingAllergy] = useState(null);
    const [form] = Form.useForm();
    const [confirmationModal, setConfirmationModal] = useState({ visible: false, allergyId: null, name: null });

    const handleAddAllergy = (values) => {
        const newAllergy = {
            name: values.name,
            reaction: values.reaction
        };
        addAllergy(newAllergy);
        form.resetFields();
    };

    const handleEditAllergy = (allergy) => {
        setEditingAllergy(allergy);
        setActiveKey(['1']); // Open the collapse panel
        form.setFieldsValue({
            name: allergy.name,
            reaction: allergy.reaction
        });
    };

    const handleUpdateAllergy = (values) => {
        const updatedAllergy = {
            id: editingAllergy.id,
            name: values.name,
            reaction: values.reaction
        };
        updateAllergy(updatedAllergy);
    };

    const handleRemoveAllergy = (id, name) => {
        setConfirmationModal({ visible: true, allergyId: id, name });
    };

    const handleConfirmRemove = () => {
        removeAllergy(confirmationModal.allergyId);
        setConfirmationModal({ visible: false, allergyId: null, name: null });
    };

    const handleCancelRemove = () => {
        setConfirmationModal({ visible: false, allergyId: null, name: null });
    };

    return (
        <Box sx={{ width: { xs: '100%', md: '1000px' } }} >
            <Collapse style={{ marginTop: '50px' }} activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
                <Panel header={editingAllergy ? "Update Allergy" : "Add Allergy"} key="1">
                    <Form form={form} onFinish={editingAllergy ? handleUpdateAllergy : handleAddAllergy} layout="vertical">
                        <Form.Item
                            name="name"
                            label="Allergy Name"
                            rules={[{ required: true, message: 'Please enter an allergy name' }]}
                        >
                            <Input placeholder="Enter allergy name" />
                        </Form.Item>
                        <Form.Item
                            name="reaction"
                            label="Reaction"
                        >
                            <Input placeholder="Enter reaction (optional)" />
                        </Form.Item>
                        <Form.Item style={{
                            display: 'flex', justifyContent: 'space-evenly'
                        }} >
                            <Button type="primary" htmlType="submit" loading={addingAllergy || updatingAllergy}>
                                {editingAllergy ? 'Update' : 'Add'}
                            </Button>
                            <Button style={{ marginLeft: '10px' }} onClick={() => {
                                form.resetFields();
                                setEditingAllergy(null);
                                setActiveKey([]); // Close the collapse panel
                            }}>
                                Cancel
                            </Button>
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>

            <Typography.Title style={{ textAlign: 'left' }} level={5}> Allergies </Typography.Title>

            <List
                loading={allergyLoading}
                size="small"
                header={
                    <List.Item style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f0f0f0', padding: '8px 16px' }}>
                        <Typography.Text strong>Name</Typography.Text>
                        <Typography.Text strong>Reaction</Typography.Text>
                        <Typography.Text strong>Action</Typography.Text>
                    </List.Item>
                }
                dataSource={allergies}
                renderItem={(allergy, index) => (
                    <List.Item
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', borderBottom: '1px solid #e8e8e8' }}
                        actions={[
                            <EditOutlined key="edit" onClick={() => handleEditAllergy(allergy)} style={{ color: '#1890ff', cursor: 'pointer' }} />,
                            <DeleteOutlined key="delete" onClick={() => handleRemoveAllergy(allergy.id, allergy.name)} style={{ color: '#ff4d4f', cursor: 'pointer' }} />,
                        ]}
                    >
                        <Typography.Text strong>{allergy.name}</Typography.Text>
                        <Typography.Text  >{allergy.reaction}</Typography.Text>
                    </List.Item>
                )}
            />
            <Popconfirm
                title={"Confirm Delete - " + confirmationModal.name}
                description="Are you sure you want to delete this allergy?"
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



export default Allergies;