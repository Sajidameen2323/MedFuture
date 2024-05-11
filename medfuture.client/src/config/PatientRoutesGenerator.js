import { lazy } from "react";
import Loadable from 'components/Loadable';

const Weather = Loadable(lazy(() => import("pages/Weather")));
const PatientProfile = Loadable(lazy(() => import("pages/Patient/Profile")));
const Allergies = Loadable(lazy(() => import("pages/Patient/Allergies")));
const Diagnoses = Loadable(lazy(() => import("pages/Patient/Diagnoses")));





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
        {
            id: 'patient_allergies',
            path: 'allergies',
            loader: props.patientOnlyLoader,
            Component: Allergies
        },
        {
            id: 'patient_diagnoses',
            path: 'diognoses',
            loader: props.patientOnlyLoader,
            Component: Diagnoses
        },
    ]

}