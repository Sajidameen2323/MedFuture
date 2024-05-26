// assets
import { UserOutlined, MehOutlined } from '@ant-design/icons';

// icons
const icons = {
    UserOutlined,
    MehOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const profile = {
    id: 'group-patient-profile',
    title: 'Profile',
    type: 'group',
    children: [
        {
            id: 'profile',
            title: 'Profile',
            type: 'item',
            url: '/patient/profile',
            icon: icons.UserOutlined,
            breadcrumbs: false
        },
        {
            id: 'allergies',
            title: 'Allergies',
            type: 'item',
            url: '/patient/allergies',
            icon: icons.MehOutlined,
            breadcrumbs: false
        },
    ]
};

export default profile;
