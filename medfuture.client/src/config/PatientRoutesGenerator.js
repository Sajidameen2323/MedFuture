import { lazy } from "react";
import Loadable from 'components/Loadable';

const Weather = Loadable(lazy(() => import("pages/Weather")));
const PatientProfile = Loadable(lazy(() => import("pages/Patient/Profile")));





export default function GetPatientRoutes(props) {

    return [

        {
            path: "overview",
            loader: props.patientOnlyLoader,
            Component: Weather,
        },
        {
            id: 'patient_profile',
            path: 'profile',
            loader: props.patientOnlyLoader,
            Component: PatientProfile
        },


    ]

}