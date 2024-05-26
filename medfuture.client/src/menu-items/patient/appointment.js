// assets
import { CalendarOutlined } from '@ant-design/icons';

// icons
const icons = {
    CalendarOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const appointment = {
    id: 'group-patient-appointment',
    title: 'Appointment',
    type: 'group',
    children: [
        {
            id: 'patient_appointments',
            title: 'List Appointments',
            type: 'item',
            url: '/patient/appointments',
            icon: icons.CalendarOutlined,
            breadcrumbs: false
        }
    ]
};

export default appointment;
