// assets
import { DashboardOutlined, ScheduleOutlined } from '@ant-design/icons';

// icons
const icons = {
    DashboardOutlined,
    ScheduleOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const appointmentGroup = {
    id: 'group-appointment',
    title: 'Appointment',
    type: 'group',
    children: [
        {
            id: 'todays_appointments',
            title: 'Todays Appointments',
            type: 'item',
            url: '/doctor/appointments/today',
            icon: icons.ScheduleOutlined,
            breadcrumbs: false
        },
        {
            id: 'app_action',
            title: 'Appointment Action',
            type: 'item',
            url: '/doctor/appointments/:appointmentId/action',
            icon: icons.MedicalServicesIcon,
            target: false,
            hidden: true,
            breadcrumbs: false
        },
    ]
};

export default appointmentGroup;
