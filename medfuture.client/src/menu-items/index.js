// project import
import services from './admin/services';
import adminDashboard from './admin/dashboard';
import patientDashboard from './patient/dashboard';
import doctorDashboard from './doctor/dashboard';
import utilities from './admin/utilities';
import support from './admin/support';
import manageDoctors from './admin/manageDoctors';
import manageAppointments from './admin/manageAppointments';
// ==============================|| MENU ITEMS ||============================== //

// doctor imports
import DoctorAppointmentGroup from './doctor/appointment';



const items = {
    items: [adminDashboard, services, manageDoctors, doctorDashboard, manageAppointments, DoctorAppointmentGroup]
};

const getMenuItems = (role) => {

    if (role === "Admin") {
        return {
            items: [adminDashboard, services, manageDoctors, manageAppointments]
        };
    }
    else if (role === "Doctor") {
        return {
            items: [ doctorDashboard]
        }
    }
    else {
        return {
            items: [patientDashboard, DoctorAppointmentGroup]
        }
    }

}

export { getMenuItems }

export default items;