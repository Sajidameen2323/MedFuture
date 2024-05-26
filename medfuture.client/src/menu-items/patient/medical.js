// assets
import { ProfileOutlined, ClockCircleOutlined,MehOutlined } from '@ant-design/icons';

// icons
const icons = {
    ProfileOutlined,
    ClockCircleOutlined,
    MehOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const medicalNavs = {
    id: 'group-patient-medical-data',
    title: 'Meidcal Data',
    type: 'group',
    children: [
        {
            id: 'dioneses',
            title: 'Past Diognoses',
            type: 'item',
            url: '/patient/diognoses',
            icon: icons.ProfileOutlined,
            breadcrumbs: false
        },
        {
            id: 'reminders',
            title: 'Medication & Reminders',
            type: 'item',
            url: '/patient/medications',
            icon: icons.ClockCircleOutlined,
            breadcrumbs: false
        },
    ]
};

export default medicalNavs;
