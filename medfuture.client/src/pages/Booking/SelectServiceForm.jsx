/* eslint-disable react/prop-types */
// ServiceSelectionPage.js

import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Container } from '@mui/material';
import { useQuery } from 'react-query';
import axios from 'axios';

const fetchServices = async () => {
    const response = await axios.get('/api/service/get-services');
    console.log(response);
    if (response.status === 200) {
        return response.data
    }
    else {
        throw new Error('Server Error!');
    }   
};

const ServiceSelectionPage = ({ selectedService, setSelectedService }) => {

    const { data: services, isLoading, isError } = useQuery('services', fetchServices, {
        refetchOnWindowFocus: false,
    });

    const [selectedServiceId, setSelectedServiceId] = useState(selectedService.serviceID || "");

    const handleServiceChange = (event) => {
        if (typeof event.target.value === 'number') {
            let service = services.filter((el) => el.serviceID === event.target.value)[0];

            if (service) {
                setSelectedService(service);
                setSelectedServiceId(service.serviceID)
            }
        }
        else {
            setSelectedService({});
            setSelectedServiceId(event.target.value)
        }

        
    };

    if (isLoading) {
        return <div>Loading services...</div>;
    }

    if (isError) {
        return <div>Error fetching services. Please try again later.</div>;
    }


    return (
        <Container sx={{ width:'50%', my:10, textAlign:'left' }}>
            <FormControl fullWidth>
                <InputLabel id="service-label">Select a Service</InputLabel>
                <Select
                    labelId="service-label"
                    id="service-select"
                    value={selectedServiceId}
                    onChange={handleServiceChange}
                >
                    <MenuItem value="">Please select a service</MenuItem>
                    {services.map((service) => (
                        <MenuItem key={service.serviceID} value={service.serviceID}>
                            {service.name} - Rs. {service.serviceCharge}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Container>
    );
};

export default ServiceSelectionPage;
