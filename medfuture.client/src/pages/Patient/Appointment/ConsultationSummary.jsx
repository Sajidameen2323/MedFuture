import { useEffect } from 'react';
import { List, Typography, Card } from 'antd';
import { Box, styled } from '@mui/material';
import { useLocation, useNavigate } from "react-router-dom";

const StyledCard = styled(Card)`
  background-color: #ffffc0;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StyledTitle = styled(Typography.Title)`
  color: #333;
  font-weight: 600;
  margin-bottom: 16px;
`;

const StyledList = styled(List)`
  .ant-list-item {
    border-bottom: 1px solid #e8e8e8;
    padding: 12px 0;

    &:last-child {
      border-bottom: none;
    }
  }

  .ant-list-item-meta-title {
    font-weight: 600;
    color: #333;
  }

  .ant-list-item-meta-description {
    color: #666;
  }
`;

const HealthcareConsultationSummary = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { consultationData } = location.state || {};
    const { summary, medications, additionalNote } = consultationData;

    useEffect(() => {
        if (!consultationData) {
            navigate(`/doctor/appointments/today`, { state: {} });
        }
    }, [consultationData]);

    return (
        <Box sx={{ textAlign: 'left', padding: '24px', width: { xs:'100%', md:'1100px' } }}>
            <StyledTitle level={4}>Consultation Summary</StyledTitle>
            <StyledCard>
                {summary}
            </StyledCard>

            <StyledTitle level={4} style={{ marginTop: '24px' }}>
                Prescribed Medications
            </StyledTitle>
            {medications.length === 0 ? (
                <Typography.Text>No medications prescribed.</Typography.Text>
            ) : (
                <StyledList
                    dataSource={medications}
                    renderItem={(medication) => (
                        <List.Item>
                            <List.Item.Meta
                                title={medication.name}
                                description={medication.instruction}
                            />
                        </List.Item>
                    )}
                />
            )}

            <StyledTitle level={4} style={{ marginTop: '24px' }}>
                Additional Note
            </StyledTitle>
            <StyledCard>
                {additionalNote}
            </StyledCard>
        </Box>
    );
};

export default HealthcareConsultationSummary;