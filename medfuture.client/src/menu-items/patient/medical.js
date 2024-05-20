// assets
import { UnorderedListOutlined, ClockCircleOutlined } from '@ant-design/icons';

// icons
const icons = {
    UnorderedListOutlined,
    ClockCircleOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const medicalNavs = {
    id: 'group-patient-medical-data',
    title: 'Meidcal Data',
    type: 'group',
    children: [
        {
            id: 'allergies',
            title: 'Allergies',
            type: 'item',
            url: '/patient/allergies',
            icon: icons.UnorderedListOutlined,
            breadcrumbs: false
        },
        {
            id: 'dioneses',
            title: 'Past Diognoses',
            type: 'item',
            url: '/patient/diognoses',
            icon: icons.UnorderedListOutlined,
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
