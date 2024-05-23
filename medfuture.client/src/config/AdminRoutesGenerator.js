import { lazy } from "react";
import Loadable from 'components/Loadable';

const Weather = Loadable(lazy(() => import("../pages/Weather")));
const DashboardOverview = Loadable(lazy(() => import("pages/Admin/Overview/DashboardOverview")));

const AddMedicalServiceForm = Loadable(lazy(() => import("../pages/Admin/Service/Add")));

const AddDoctor = Loadable(lazy(() => import("../pages/Admin/Doctor/AddDoctor")));
const ListDoctors = Loadable(lazy(() => import("pages/Admin/Doctor/ListDoctors")));

const ListServices = Loadable(lazy(() => import("pages/Admin/Service/List")));
const EditService = Loadable(lazy(() => import("pages/Admin/Service/EditService")));

const ListAppointments = Loadable(lazy(() => import("pages/Admin/Appointment/List")));

const SettingsComponent = Loadable(lazy(() => import("pages/Admin/Appointment/Settings/index")));
const DoctorSchedule = Loadable(lazy(() => import("pages/Admin/Appointment/Settings/DoctorWorkSchedule/DoctorWorkSchedule")));
const GeneralSettings = Loadable(lazy(() => import("pages/Admin/Appointment/Settings/General/GeneralSettings")));
const HolidaySettings = Loadable(lazy(() => import("pages/Admin/Appointment/Settings/DaysOff/HolidaySettings")));


export default function GetAdminRoutes(props) {

    return [

        {
            path: "overview",
            loader: props.adminOnlyLoader,
            Component: DashboardOverview,
        },
        {
            path: 'add-service',
            loader: props.adminOnlyLoader,
            Component: AddMedicalServiceForm
        },
        {
            path: 'edit-service',
            loader: props.adminOnlyLoader,
            Component: EditService
        },
        {
            path: 'services',
            loader: props.adminOnlyLoader,
            Component: ListServices
        },
        {
            path: 'add-doctor',
            loader: props.adminOnlyLoader,
            Component: AddDoctor
        },
        {
            path: 'doctors',
            loader: props.adminOnlyLoader,
            Component: ListDoctors
        },
        {
            path: 'appointments',
            loader: props.adminOnlyLoader,
            Component: ListAppointments
        },
        {
            path: 'appointment-settings',
            loader: props.adminOnlyLoader,
            Component: SettingsComponent
        },
        {
            id: 'workschedule_settings',
            path: 'appointment-settings/workschedule',
            loader: props.adminOnlyLoader,
            Component: DoctorSchedule

        },
        {
            id: 'general_settings',
            path: 'appointment-settings/general',
            loader: props.adminOnlyLoader,
            Component: GeneralSettings

        },
        {
            id: 'holiday_settings',
            path: 'appointment-settings/holidays',
            loader: props.adminOnlyLoader,
            Component: HolidaySettings

        },
    ]

}