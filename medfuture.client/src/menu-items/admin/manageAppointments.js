// assets
import { UserAddOutlined, UnorderedListOutlined, SettingOutlined } from '@ant-design/icons';


// icons
const icons = {
    UserAddOutlined,
    UnorderedListOutlined,
    SettingOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
    id: 'manage-appointments',
    title: 'Appointments',
    type: 'group',
    children: [
        {
            id: 'appointment_settings',
            title: 'Configure Appointments',
            type: 'item',
            url: '/account/appointment-settings',
            icon: icons.SettingOutlined,
            target: false
        },
        {
            id: 'appointments_list',
            title: 'List Appointments',
            type: 'item',
            url: '/account/appointments',
            icon: icons.UnorderedListOutlined,
            target: false
        }
    ]
};

export default pages;
