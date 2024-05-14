// assets
import { UserOutlined } from '@ant-design/icons';

// icons
const icons = {
    UserOutlined
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
            icon: icons.UserOutlined,
            breadcrumbs: false
        }
    ]
};

export default appointment;
