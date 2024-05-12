/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { List, Typography, Input, Button, Popconfirm, Form, Modal, Collapse, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Box } from '@mui/material';


const { Panel } = Collapse;
const { TextArea } = Input;

const HealthcareConsultationSummary = ({ summary, setSummary, medications, setMedications, additionalNote, setAdditionalNote, generateSummary, isGenerating }) => {

    const [isEditing, setIsEditing] = useState(null);
    const [editingMedication, setEditingMedication] = useState(null);
    const [form] = Form.useForm();

    const handleAddMedication = (values) => {
        setMedications([...medications, values]);
        setIsEditing(null);
        form.resetFields();
    };

    const handleEditMedication = (medication) => {
        setIsEditing(true);
        setEditingMedication(medication);
        form.setFieldsValue(medication);
    };

    const handleUpdateMedication = (values) => {
        const updatedMedications = medications.map((medication) =>
            medication === editingMedication ? values : medication
        );
        setMedications(updatedMedications);
        setIsEditing(null);
        setEditingMedication(null);
        form.resetFields();
    };

    const handleRemoveMedication = (medication) => {
        Modal.confirm({
            title: `Confirm Delete - ${medication.name}`,
            content: 'Are you sure you want to delete this medication?',
            onOk: () => {
                setMedications(medications.filter((med) => med !== medication));
            },
        });
    };

    const handleRegenerateSummary = () => {
        generateSummary()
    };

    return (
        <Box sx={{ textAlign:'left'} }>
            <Typography.Title level={4}>Consultation Summary</Typography.Title>
            <Input.TextArea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                disabled={isGenerating}
                rows={4}
            />
            <Button
                type="primary"
                onClick={handleRegenerateSummary}
                disabled={isGenerating}
                style={{
                    marginTop: '20px',
                    borderRadius: '4px',
                }}
            >
                {isGenerating ? 'Regenerating...' : 'Regenerate Summary'}
            </Button>

            <Typography.Title level={4} style={{ marginTop: '20px' }}>
                Prescribed Medications
            </Typography.Title>
            <Collapse>
                <Panel
                    header={isEditing ? 'Edit Medication' : 'Add Medication'}
                    key="1"
                >
                    <Form form={form} onFinish={isEditing ? handleUpdateMedication : handleAddMedication}>
                        <Form.Item
                            name="name"
                            label="Medication Name"
                            rules={[{ required: true, message: 'Please enter a medication name' }]}
                        >
                            <Input placeholder="Enter medication name" />
                        </Form.Item>
                        <Form.Item
                            name="instruction"
                            label="Instructions"
                            rules={[{ required: true, message: 'Please enter instructions' }]}
                        >
                            <TextArea placeholder="Enter instructions" rows={3} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                {isEditing ? 'Update' : 'Add'}
                            </Button>
                            <Button style={{ marginLeft: '10px' }} onClick={() => {
                                form.resetFields();
                                setIsEditing(false);
                                setEditingMedication(null);
                            }}>
                                Cancel
                            </Button>
                        </Form.Item>
                    </Form>
                </Panel>
            </Collapse>
            {medications.length === 0 ? (
                <Typography.Text>No medications prescribed.</Typography.Text>
            ) : (
                <List
                    dataSource={medications}
                    renderItem={(medication) => (
                        <List.Item
                            actions={[
                                <EditOutlined key="edit" onClick={() => handleEditMedication(medication)} />,
                                <DeleteOutlined key="delete" onClick={() => handleRemoveMedication(medication)} />,
                            ]}
                        >
                            <List.Item.Meta
                                title={medication.name}
                                description={medication.instruction}
                            />
                        </List.Item>
                    )}
                />
            )}

            <Typography.Title level={4} style={{ marginTop: '20px' }}>
                Additional Note
            </Typography.Title>
            <TextArea
                value={additionalNote}
                onChange={(e) => setAdditionalNote(e.target.value)}
                rows={4}
                placeholder="Enter additional notes..."
            />
        </Box>
    );
};

export default HealthcareConsultationSummary;