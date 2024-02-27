import { useEffect, useState } from 'react';
import './App.css';
import Login from './pages/Login';
import { auth } from '../config/firebaseConfig';
import { signInWithCustomToken } from "firebase/auth";
function App() {
    const [forecasts, setForecasts] = useState();
    const [idToken, setIdToken] = useState("");

    useEffect(() => {
        //populateWeatherData();
        getCustomToken();
    }, [idToken]);

    const contents = forecasts === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <table className="table table-striped" aria-labelledby="tabelLabel">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Temp. (C)</th>
                    <th>Temp. (F)</th>
                    <th>Summary</th>
                </tr>
            </thead>
            <tbody>
                {forecasts.map(forecast =>
                    <tr key={forecast.date}>
                        <td>{forecast.date}</td>
                        <td>{forecast.temperatureC}</td>
                        <td>{forecast.temperatureF}</td>
                        <td>{forecast.summary}</td>
                    </tr>
                )}
            </tbody>
        </table>;

    return (
        <div>
            <Login setToken={setIdToken} />
            <h1 id="tabelLabel">Weather forecast</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
            <button onClick={() => { populateWeatherData(); }} >Get Data</button>
        </div>
    );
    
    async function populateWeatherData() {

        const response = await fetch('weatherforecast', {
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });
        const data = await response.json();
        console.log("Auth to get data")
        setForecasts(data);
    }

    async function getCustomToken() {

        const response = await fetch('weatherforecast/set-custom-claims', {
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });
        const data = await response.json();
        const { newToken } = data;
       // setIdToken(newToken);
        console.log(newToken);

        signInWithCustomToken(auth, newToken)
            .then( async(userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log("Successfully logged in with cutom token");
                var idTokenResult = await user.getIdTokenResult(true);

                console.log(idTokenResult.claims)
                
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
       
                console.log("Error sign in with custom token - code : "+ errorCode+"| message : "+ errorMessage)
            });

    }
}

export default App;