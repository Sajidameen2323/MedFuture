//import Weather from './pages/Weather';
import { FirebaseAuthProvider } from './context/FirebaseAuthProvider';
import './App.css';
//import Dummy from './pages/Dummy';
import CustomRouterProvider from './hooks/CustomRouterProvider';

function App() {

    return (

        <FirebaseAuthProvider>
            <CustomRouterProvider />
        </FirebaseAuthProvider>
    )
}

export default App;