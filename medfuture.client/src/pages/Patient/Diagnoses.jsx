import React, { useState, useContext, useCallback } from 'react';
import { List, Collapse, Typography, Button, Form, Input, Popconfirm, notification, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Box } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { FirebaseAuthContext } from 'context/FirebaseAuthProvider';
import moment from 'moment';

const { Panel } = Collapse;

const Diagnoses = () => {
    const { idToken } = useContext(FirebaseAuthContext);
    const queryClient = useQueryClient();
    const [activeKey, setActiveKey] = useState([]);
    const [externalToggle, setExternalToggle] = useState(false);

    // Fetch diagnoses
    const fetchDiagnoses = async () => {
        const response = await fetch('/api/patient/me/diagnoses', {
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    };

    // Add diagnosis mutation
    const addDiagnosisMutation = useCallback(async (newDiagnosis) => {
        try {
            const response = await fetch('/api/patient/me/diagnoses', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newDiagnosis),
            });
            if (response.ok) {
                notification.success({
                    message: 'Success',
                    description: 'Diagnosis added successfully',
                    duration: 2,
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to add diagnosis',
                    duration: 2,
                });
            }
            return response.json();
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'An error occurred while adding the diagnosis',
                duration: 2,
            });
            throw error;
        }
    }, [idToken]);

    // Update diagnosis mutation
    const updateDiagnosisMutation = useCallback(async (updatedDiagnosis) => {
        try {
            const response = await fetch(`/api/patient/me/diagnoses/${updatedDiagnosis.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedDiagnosis),
            });
            if (response.ok) {
                notification.success({
                    message: 'Success',
                    description: 'Diagnosis updated successfully',
                    duration: 2,
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to update diagnosis',
                    duration: 2,
                });
            }
            return response.json();
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'An error occurred while updating the diagnosis',
                duration: 2,
            });
            throw error;
        }
    }, [idToken]);

    // Remove diagnosis mutation
    const removeDiagnosisMutation = useCallback(async (id) => {
        try {
            const response = await fetch(`/api/patient/me/diagnoses/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                notification.success({
                    message: 'Success',
                    description: 'Diagnosis deleted successfully',
                    duration: 2,
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Failed to delete diagnosis',
                    duration: 2,
                });
            }
            return response.json();
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'An error occurred while deleting the diagnosis',
                duration: 2,
            });
            throw error;
        }
    }, [idToken]);

    const { isLoading: diagnosisLoading } = useQuery('diagnoses', fetchDiagnoses, {
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
            setDiagnoses(data);
        }
    });

    const { mutate: addDiagnosis, isLoading: addingDiagnosis } = useMutation(addDiagnosisMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries('diagnoses');
        },
    });

    const { mutate: updateDiagnosis, isLoading: updatingDiagnosis } = useMutation(updateDiagnosisMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries('diagnoses');
            setEditingDiagnosis(null);
            form.resetFields();
        },
    });

    const { mutate: removeDiagnosis, isLoading: isDeleting } = useMutation(removeDiagnosisMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries('diagnoses');
        },
    });

    const [diagnoses, setDiagnoses] = useState([]);
    const [editingDiagnosis, setEditingDiagnosis] = useState(null);
    const [form] = Form.useForm();
    const [confirmationModal, setConfirmationModal] = useState({ visible: false, diagnosisId: null, name: null });

    const handleAddDiagnosis = (values) => {
        const newDiagnosis = {
            name: values.name,
            diagnosisDate: values.diagnosisDate.format('YYYY-MM-DD')
        };
        addDiagnosis(newDiagnosis);
        form.resetFields();
    };

    const handleEditDiagnosis = (diagnosis) => {
        setEditingDiagnosis(diagnosis);
        setActiveKey(['1']); // Open the collapse panel
        form.setFieldsValue({
            name: diagnosis.name,
            diagnosisDate: moment(diagnosis.diagnosisDate)
        });
    };

    const handleUpdateDiagnosis = (values) => {
        const updatedDiagnosis = {
            id: editingDiagnosis.id,
            name: values.name,
            diagnosisDate: values.diagnosisDate.format('YYYY-MM-DD')
        };
        updateDiagnosis(updatedDiagnosis);
    };

    const handleRemoveDiagnosis = (id, name) => {
        setConfirmationModal({ visible: true, diagnosisId: id, name });
    };

    const handleConfirmRemove = () => {
        removeDiagnosis(confirmationModal.diagnosisId);
        setConfirmationModal({ visible: false, diagnosisId: null, name: null });
    };

    const handleCancelRemove = () => {
        setConfirmationModal({ visible: false, diagnosisId: null, name: null });
    };

    return (
        <Box sx={{ width: { xs: '100%', md: '1000px' } }} >
            <Collapse style={{ marginTop: '50px' }} activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
                <Panel header={editingDiagnosis ? "Update Diagnosis" : "Add Diagnosis"} key="1">
                    <Form form={form} onFinish={editingDiagnosis ? handleUpdateDiagnosis : handleAddDiagnosis} layout="vertical">
                        <Form.Item
                            name="name"
                            label="Diagnosis Name"
                            rules={[{ required: true, message: 'Please enter a diagnosis name' }]}
                        >
                            <Input placeholder="Enter diagnosis name" />
                        </Form.Item>
                        <Form.Item
                            name="diagnosisDate"
                            label="Diagnosis Date"
                            rules={[{ required: true, message: 'Please select a diagnosis date' }]}
                        >
                            <DatePicker />
                        </Form.Item>
                        <Form.Item style={{ display: 'flex', justifyContent: 'space-evenly' }} >
                            <Button type="primary" htmlType="submit" loading={addingDiagnosis || updatingDiagnosis}>
                                {editingDiagnosis ? 'Update' : 'Add'}
                            </Button>
                            <Button style={{ marginLeft: '10px' }} onClick={() => {
                                form.resetFields();
                                setEditingDiagnosis(null);
                                setActiveKey([]); // Close the collapse panel
                            }}>
                                Cancel
                            </Button>
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>

            <Typography.Title style={{ textAlign: 'left' }} level={5}> Diagnoses </Typography.Title>

            <List
                loading={diagnosisLoading}
                size="small"
                header={
                    <List.Item>
                        <Typography.Text strong>Name</Typography.Text>
                        <Typography.Text strong style={{ marginLeft: '20px' }}>Diagnosis Date</Typography.Text>
                        <Typography.Text strong>Action</Typography.Text>
                    </List.Item>
                }
                dataSource={diagnoses}
                renderItem={(diagnosis, index) => (
                    <List.Item
                        actions={[
                            <EditOutlined key="edit" onClick={() => handleEditDiagnosis(diagnosis)} />,
                            <DeleteOutlined key="delete" onClick={() => handleRemoveDiagnosis(diagnosis.id, diagnosis.name)} />,
                        ]}
                    >
                        <Typography.Text>{diagnosis.name}</Typography.Text>
                        <Typography.Text>{moment(diagnosis.diagnosisDate).format('YYYY-MM-DD')}</Typography.Text>
                    </List.Item>
                )}
            />
            <Popconfirm
                title={"Confirm Delete - " + confirmationModal.name}
                description="Are you sure you want to delete this diagnosis?"
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

export default Diagnoses;