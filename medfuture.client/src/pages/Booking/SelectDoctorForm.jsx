/* eslint-disable react/prop-types */
// ServiceSelectionPage.js

import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Container } from '@mui/material';


const DoctorSelectionPage = ({ doctors, setSelectedDoctor, selectedDoctor }) => {

    const [selectedDoctorID, setSelectedDoctorID] = useState(selectedDoctor?.doctorID||'');

    const handleServiceChange = (event) => {


        if (typeof event.target.value === 'number') {
            let doctor = doctors.filter((el) => el.doctorID === event.target.value)[0];

            if (doctor) {
                setSelectedDoctor(doctor);
                setSelectedDoctorID(doctor.doctorID)
            }
        }
        else {
            setSelectedDoctor(undefined);
            setSelectedDoctorID(event.target.value)
        }

    };


    return (
        <Container sx={{ width: '50%', my: 10, textAlign: 'left' }}>
            <FormControl fullWidth>
                <InputLabel id="service-label">Select a Doctor</InputLabel>
                <Select
                    labelId="service-label"
                    id="service-select"
                    value={selectedDoctorID}
                    onChange={handleServiceChange}
                >
                    <MenuItem value="">Please select a doctor</MenuItem>
                    {doctors.map((doctor) => (
                        <MenuItem key={doctor.doctorID} value={doctor.doctorID}>
                            {doctor.fullName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Container>
    );
};

export default DoctorSelectionPage;
