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
            url: '/dashboard/appointment-settings',
            icon: icons.SettingOutlined,
            target: false

        },
        {
            id: 'appointments_list',
            title: 'List Appointments',
            type: 'item',
            url: '/dashboard/appointments',
            icon: icons.UnorderedListOutlined,
            target: false
        },
        {
            id: 'workschedule_settings',
            title: 'Work Schedule Settings',
            type: 'item',
            url: '/dashboard/appointment-settings/workschedule',
            icon: icons.MedicalServicesIcon,
            target: false,
            hidden: true,
            breadcrumbs: false
        },
        {
            id: 'general_settings',
            title: 'General Settings',
            type: 'item',
            url: '/dashboard/appointment-settings/general',
            icon: icons.MedicalServicesIcon,
            target: false,
            hidden: true,
            breadcrumbs: false
        },
    ]
};

export default pages;
