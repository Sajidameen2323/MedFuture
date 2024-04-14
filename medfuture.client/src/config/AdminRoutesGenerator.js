import { lazy } from "react";
import Loadable from 'components/Loadable';


const Weather = Loadable(lazy(() => import("../pages/Weather")));
const AddMedicalServiceForm = Loadable(lazy(() => import("../pages/Admin/Service/Add")));
const AddDoctor = Loadable(lazy(() => import("../pages/Admin/Doctor/AddDoctor")));
const ListDoctors = Loadable(lazy(() => import("pages/Admin/Doctor/ListDoctors")));
const ListServices = Loadable(lazy(() => import("pages/Admin/Service/List")));
const EditService = Loadable(lazy(() => import("pages/Admin/Service/EditService") ));

export default function GetAdminRoutes(props) {

    return [

        {
            path: "overview",
            loader: props.protectedLoader,
            Component: Weather,
        },
        {
            path: 'add-service',
            loader: props.protectedLoader,
            Component: AddMedicalServiceForm
        },
        {
            path: 'edit-service',
            loader: props.protectedLoader,
            Component: EditService
        },
        {
            path: 'services',
            loader: props.protectedLoader,
            Component: ListServices
        },
        {
            path: 'add-doctor',
            loader: props.protectedLoader,
            Component: AddDoctor
        },
        {
            path: 'doctors',
            loader: props.adminOnlyLoader,
            Component: ListDoctors
        },
    ]

}