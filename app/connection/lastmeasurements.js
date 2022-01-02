export async function lastMeasurements(connectionSettings) {
    try {
        let response = await fetch(connectionSettings.lastMeasurementsEndpoint,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': connectionSettings.basicAuthorization
                }});
        let _lastMeasurements = await response.json();
        return _lastMeasurements;
    } catch( err ) {
        addError(err.message);
    }
}

export async function getLast10Measurements(connectionSettings, sensorName, addLog, addError) {
    try {
        let response = await fetch(`${connectionSettings.lastMeasurementsEndpoint}/${sensorName}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': connectionSettings.basicAuthorization
                }});
        let _lastMeasurements = await response.json();
        return _lastMeasurements;
    } catch( err ) {
        addError(err.message);
    }
}