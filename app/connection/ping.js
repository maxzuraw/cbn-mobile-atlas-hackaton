export async function ping(connectionSettings, addLog, addError) {
    try {
        let response = await fetch(connectionSettings.pingEndpoint,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': connectionSettings.basicAuthorization
                }});
        let object = await response.json();
        addLog("Ping connection successful! Received: "  + object.checkTime);
        return true;
    } catch( err ) {
        addError(err.message);
    }
    return false;
}