// project import
import services from './admin/services';
import adminDashboard from './admin/dashboard';
import patientDashboard from './patient/dashboard';
import doctorDashboard from './doctor/dashboard';
import utilities from './admin/utilities';
import support from './admin/support';
import manageDoctors from './admin/manageDoctors';

// ==============================|| MENU ITEMS ||============================== //

const items = {
    items: [adminDashboard, services, manageDoctors, utilities, support, doctorDashboard]
};

const getMenuItems = (role) => {

    if (role === "Admin") {
        return {
            items: [adminDashboard, services, manageDoctors, utilities, support]
        };
    }
    else if (role === "Doctor") {
        return {
            items: [support, doctorDashboard]
        }
    }
    else {
        return {
            items: [patientDashboard]
        }
    }

}

export { getMenuItems }

export default items;