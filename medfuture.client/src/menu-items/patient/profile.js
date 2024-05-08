// assets
import { UserOutlined } from '@ant-design/icons';

// icons
const icons = {
    UserOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const profile = {
    id: 'group-patient-profile',
    title: 'Account',
    type: 'group',
    children: [
        {
            id: 'profile',
            title: 'Profile',
            type: 'item',
            url: '/patient/profile',
            icon: icons.UserOutlined,
            breadcrumbs: false
        }
    ]
};

export default profile;
