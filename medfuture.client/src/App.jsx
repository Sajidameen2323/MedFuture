//import Weather from './pages/Weather';
import { FirebaseAuthProvider } from './context/FirebaseAuthProvider';
 import './App.css';
//import Dummy from './pages/Dummy';
import CustomRouterProvider from './context/CustomRouterProvider';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from 'store';
import ThemeCustomization from 'themes';
import {
    QueryClient,
    QueryClientProvider,
} from 'react-query';

// Create a client
const queryClient = new QueryClient()

function App() {

    return (
        <ReduxProvider store={store}>
            <QueryClientProvider client={queryClient}>
                <FirebaseAuthProvider>
                    <ThemeCustomization>
                        <CustomRouterProvider />
                    </ThemeCustomization>
                </FirebaseAuthProvider>
            </QueryClientProvider>
        </ReduxProvider>
    )
}

export default App;