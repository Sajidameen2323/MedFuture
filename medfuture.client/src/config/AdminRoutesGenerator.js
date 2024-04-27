import { lazy } from "react";
import Loadable from 'components/Loadable';

const Weather = Loadable(lazy(() => import("../pages/Weather")));
const AddMedicalServiceForm = Loadable(lazy(() => import("../pages/Admin/Service/Add")));

const AddDoctor = Loadable(lazy(() => import("../pages/Admin/Doctor/AddDoctor")));
const ListDoctors = Loadable(lazy(() => import("pages/Admin/Doctor/ListDoctors")));

const ListServices = Loadable(lazy(() => import("pages/Admin/Service/List")));
const EditService = Loadable(lazy(() => import("pages/Admin/Service/EditService")));

const ListAppointments = Loadable(lazy(() => import("pages/Admin/Appointment/List")));
const SettingsComponent = Loadable(lazy(() => import("pages/Admin/Appointment/Settings/index")));

export default function GetAdminRoutes(props) {

    return [

        {
            path: "overview",
            loader: props.adminOnlyLoader,
            Component: Weather,
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
    ]

}