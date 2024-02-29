
import { useState, useContext } from 'react';
import { FirebaseAuthContext } from "../context/FirebaseAuthProvider";

function Weather() {

    const [forecasts, setForecasts] = useState();
    const { idToken } = useContext(FirebaseAuthContext);

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
}

export default Weather;