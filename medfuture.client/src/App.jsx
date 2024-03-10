//import Weather from './pages/Weather';
import { FirebaseAuthProvider } from './context/FirebaseAuthProvider';
import './App.css';
//import Dummy from './pages/Dummy';
import CustomRouterProvider from './context/CustomRouterProvider';
import CustomThemeProvider from './context/CustomThemeProvider';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from 'store';
import ThemeCustomization from 'themes';

function App() {

    return (
        <ReduxProvider store={store}>
        <FirebaseAuthProvider>
            <ThemeCustomization>
                <CustomRouterProvider />
            </ThemeCustomization>
        </FirebaseAuthProvider>
        </ReduxProvider>
    )
}

export default App;