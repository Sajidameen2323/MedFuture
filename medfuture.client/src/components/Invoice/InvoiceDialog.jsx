/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import { Modal, Typography, Divider, Row, Col, Space, Table, Button } from 'antd';
import dayjs from 'dayjs';
import Logo from 'components/Logo';
import { SaveOutlined, PrinterOutlined, CloseOutlined } from '@ant-design/icons';
import ReactToPrint from 'react-to-print';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const InvoiceDialog = ({ open, onClose, appointment }) => {
    if (!appointment) {
        return null;
    }

    const taxPercentage = appointment?.payment?.taxPercentage ?? 0;
    const taxAmount = appointment.payment ? appointment.payment.amount * taxPercentage : 0; // Assuming 10% tax
    const totalAmount = appointment.payment ? appointment.payment.amount + taxAmount : 0;

    const columns = [
        {
            title: 'Item',
            dataIndex: 'item',
            key: 'item',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (value) => <span>{value.toFixed(2)}</span>,
        },
    ];

    const dataSource = [
        {
            key: '1',
            item: 'Service',
            description: appointment.service.name,
            amount: appointment.payment ? appointment.payment.amount : 0,
        },
        {
            key: '2',
            item: 'Tax',
            description: `${taxPercentage * 100}% Tax`,
            amount: taxAmount,
        },
        {
            key: '3',
            item: 'Total',
            description: '',
            amount: totalAmount,
        },
    ];
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const componentRef = useRef(null);

    const handleDownloadPdf = () => {
        const input = componentRef.current;
        html2canvas(input, { scale: 2 }) // Increase the scale to improve resolution
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4'); // Set the PDF dimensions
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const widthRatio = pageWidth / canvas.width;
                const heightRatio = pageHeight / canvas.height;
                const ratio = widthRatio < heightRatio ? widthRatio : heightRatio;
                const canvasWidth = canvas.width * ratio;
                const canvasHeight = canvas.height * ratio;

                // Add margins
                const marginX = 10;
                const marginY = 10;
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = canvasWidth * imgProps.width / canvas.width;
                const pdfHeight = canvasHeight * imgProps.height / canvas.height;
                pdf.addImage(imgData, 'PNG', marginX, marginY, pdfWidth, pdfHeight);
                pdf.save('invoice.pdf');
            })
            .catch((error) => {
                console.error('Error generating PDF:', error);
            });
    };

    return (
     
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={800}
            zIndex={9999}
            style={{ padding: '24px' }}
            closable={false}
        >
            <div ref={componentRef}>
                <Row justify="center" style={{ marginTop: '20px' }}>
                    <Logo to="#" />

                </Row>
                <Row justify="center" style={{ marginTop: '20px' }}>
                    {contactDetails}
                </Row>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Typography.Title level={4} style={{ display: 'flex', alignItems: 'center' }}>
                        Appointment Details
                        <Typography.Text type="secondary" style={{ display: 'flex', alignItems: 'center', marginLeft: '8px' }}>
                            REF NO {appointment.appointmentId}
                        </Typography.Text>
                    </Typography.Title>
                </Col>
                <Col span={8}>
                    <Typography.Text strong>Patient Name:</Typography.Text>
                </Col>
                <Col span={16}>
                    <Typography.Text>{`${appointment.patient.firstName} ${appointment.patient.lastName}`}</Typography.Text>
                </Col>
                <Col span={8}>
                    <Typography.Text strong>Doctor Name:</Typography.Text>
                </Col>
                <Col span={16}>
                    <Typography.Text>{`${appointment.doctor.name}`}</Typography.Text>
                </Col>
                <Col span={8}>
                    <Typography.Text strong>Appointment Date:</Typography.Text>
                </Col>
                <Col span={16}>
                    <Typography.Text>{dayjs(appointment.appointmentDate).format('YYYY-MM-DD')}</Typography.Text>
                </Col>
                <Col span={8}>
                    <Typography.Text strong>Time Interval:</Typography.Text>
                </Col>
                <Col span={16}>
                    <Typography.Text>
                        {dayjs(appointment.startDateTime).format('h:mm A')} - {dayjs(appointment.endDateTime).format('h:mm A')}
                    </Typography.Text>
                </Col>
            </Row>

            <Divider />

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Typography.Title level={4}>Payment Details</Typography.Title>
                </Col>
                <Col span={8}>
                    <Typography.Text strong>Payment Mode:</Typography.Text>
                </Col>
                <Col span={16}>
                    <Typography.Text>{appointment.payment ? appointment.payment.paymentMode : 'N/A'}</Typography.Text>
                </Col>
                <Col span={8}>
                    <Typography.Text strong>Payment Date:</Typography.Text>
                </Col>
                <Col span={16}>
                    <Typography.Text>{appointment.payment ? dayjs(appointment.payment.paymentDate).format('YYYY-MM-DD') : 'N/A'}</Typography.Text>
                </Col>
            </Row>
        
            <Divider />

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        pagination={false}
                        summary={(pageData) => (
                            <Table.Summary.Row>
                                <Table.Summary.Cell></Table.Summary.Cell>
                                <Table.Summary.Cell>Total</Table.Summary.Cell>
                                <Table.Summary.Cell>
                                    <span>{totalAmount.toFixed(2)}</span>
                                </Table.Summary.Cell>
                            </Table.Summary.Row>
                        )}
                    />
                </Col>
                </Row>
                <Row justify="center" style={{ marginTop: '20px' }}>
                    <Typography.Text type="secondary" style={{ fontSize: '0.8rem' }}>

                        For any questions regarding this invoice, please contact our billing department at (123) 456-7890 or billing@healthcareprovider.com.
                    </Typography.Text>
                </Row>
            </div>
            <Divider />

            <Row justify="end" gutter={[16, 16]}>
                <Col>
                    <Button type="primary" icon={<SaveOutlined />} onClick={handleDownloadPdf}>
                        Download PDF
                    </Button>
                </Col>
                <Col>
                    <ReactToPrint
                        trigger={() => <Button type="default" icon={<PrinterOutlined />}>Print</Button>}
                        content={() => componentRef.current}
                        pageStyle="@page { size: A4; margin: 20mm; }"
                    />
                </Col>
                <Col>
                    <Button type="default" icon={<CloseOutlined />} onClick={onClose}>
                        Close
                    </Button>
                </Col>
            </Row>
            </Modal>
   
    );
};

const contactDetails = (
    <Typography.Text type="secondary" style={{ fontSize: '0.8rem' }}>
     
        Tel: (123) 456-7890 &nbsp;&nbsp;&nbsp;
        Email: info@medfuture.com &nbsp;&nbsp;&nbsp;
        Address: 123 Main St, Cityville, ST 12345
    </Typography.Text>
);

export default InvoiceDialog;