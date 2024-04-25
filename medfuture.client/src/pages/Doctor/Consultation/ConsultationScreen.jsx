import React from 'react';
import { styled } from '@mui/system';
import {
    Box,
    Container,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
} from '@mui/material';

const StyledContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#F5F5F5',
});

const StyledBox = styled('div')({
    padding: 24,
    backgroundColor: '#FFFFFF',
});

const StyledStepLabel = styled(StepLabel)({
    cursor: 'pointer',
});

const StyledTableContainer = styled(TableContainer)({
    marginTop: 16,
    marginBottom: 16,
});

const StyledNote = styled('div')({
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FFF9C4',
    borderRadius: 4,
});

const ConsultationScreen = () => {
    return (
        <Container maxWidth="md">
            <StyledContainer>
                <StyledBox>
                    <Typography variant="h5" gutterBottom>
                        Consultation
                    </Typography>
                    <Stepper>
                        <Step>
                            <StyledStepLabel>1</StyledStepLabel>
                        </Step>
                        <Step>
                            <StyledStepLabel>2</StyledStepLabel>
                        </Step>
                        <Step>
                            <StyledStepLabel>3</StyledStepLabel>
                        </Step>
                    </Stepper>
                    <Typography variant="body1" gutterBottom>
                        Summary
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus, nulla ut commodo sagittis, sapien dui
                        mattis dui, non pulvinar lorem felis nec erat
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus, nulla ut commodo sagittis, sapien dui
                        mattis dui, non pulvinar lorem felis nec erat
                    </Typography>
                    <StyledTableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Frequency</TableCell>
                                    <TableCell>Dosage</TableCell>
                                    <TableCell>Note</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Panadole</TableCell>
                                    <TableCell>every ...</TableCell>
                                    <TableCell>1.5</TableCell>
                                    <TableCell>after m...</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Panadole</TableCell>
                                    <TableCell>every ...</TableCell>
                                    <TableCell>1.5</TableCell>
                                    <TableCell>before ...</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </StyledTableContainer>
                    <StyledNote>
                        <Typography variant="body2">Additional Note</Typography>
                    </StyledNote>
                    <Box mt={2}>
                        <Chip label="NEXT" clickable />
                    </Box>
                </StyledBox>
            </StyledContainer>
        </Container>
    );
};

export default ConsultationScreen;