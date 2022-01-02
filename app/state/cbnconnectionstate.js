import * as React from "react";
import {decode, encode} from 'base-64'
import {useContext, useState} from "react";
import {lastMeasurements as fetchLastMeasurements} from "../connection/lastmeasurements";
import {showAlert} from "../screens/modals/alert";
import {CbnLogsContext} from "./cbnlogsstate";

import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
let wsConnected =false;
let socket ='';
let stompClient = '';
let subscription = '';

export const CbnConnectionContext = React.createContext({});

export default function ConnectionProvider({children}) {
    const [connectionSettings, setConnectionSettings] = useState({});
    const [lastMeasurements, setLastMeasurements] = useState({data:[]});
    const [lastPing, setLastPing] = useState({});
    const [spinner, setSpinner] = useState(false);
    const [lastCreatedOn, setLastCreatedOn] = useState(null);
    const [vibrations, setVibrations] = useState(false);


    let {addError, addLog} = useContext(CbnLogsContext);


    let resetConnectionContext = () => {
        setConnectionSettings({});
        setLastMeasurements({...lastMeasurements, data: []});
        setLastPing({});
    }

    let buildCredentialsString = (settingsData) => {
        return encode(`${settingsData.user}:${settingsData.password}`);
    }

    let updateConnectionSettings = (settingsData) => {
        let newConnectionSettings = {
            sensorsEndpoint: (settingsData.withSsl ? 'https://' : 'http://') + settingsData.backendServer + '/api/sensors',
            lastMeasurementsEndpoint: (settingsData.withSsl ? 'https://' : 'http://') + settingsData.backendServer + '/api/lastMeasurements',
            pingEndpoint: (settingsData.withSsl ? 'https://' : 'http://') + settingsData.backendServer + '/api/ping',
            wsEndpoint: (settingsData.withSsl ? 'https://' : 'http://') + `${settingsData.user}:${settingsData.password}@` + settingsData.backendServer + '/cold-room-notifier',
            temperatureChannel: "/temperatures",
            alertVibrationEnabled: settingsData.alertVibrationEnabled,
            basicAuthorization: `Basic ${buildCredentialsString(settingsData)}`,
            backendServer: settingsData.backendServer
        };
        setConnectionSettings(newConnectionSettings);
        return newConnectionSettings;
    }

    let initiateConnection = async (settingsData) => {
        setSpinner(true);
        resetConnectionContext();
        addLog(`Creating connection to ${settingsData.backendServer}...`)
        let newConnectionSettings = updateConnectionSettings(settingsData);
        addLog(`Connection to ${settingsData.backendServer} created successfully`);
        return await refreshData(newConnectionSettings);
    }

    let refreshData = async (newConnectionSettings) => {
        setSpinner(true);
        let results =  await fetchLastMeasurements(newConnectionSettings)
            .catch(err => {
                let msg = "Cannot get last measurements." + err.message;
                addError(msg);
                showAlert("Connection failure", msg);
                return false;
            }).finally(() => {
                setSpinner(false);
            })
        if(results) {
            addLog(`Last measurements fetched. Amount: ${results.length}`);
            setLastMeasurements({...lastMeasurements, data: results});
            checkMeasurementsLevel(results);
            wsConnect(newConnectionSettings, results);
        }
        return true;
    }

    let wsConnect =(connectionSettings, measurements)=> {
        socket = new SockJS(connectionSettings.wsEndpoint);
        stompClient = Stomp.over(socket);
        stompClient.connect(
            {},
            frame => {
                wsConnected = true;
                addLog("Websocket connection created. Subscribing to STOMP channel...");
                addLog("STOMP subscription established. Waiting for messages");
                subscription = stompClient.subscribe(connectionSettings.temperatureChannel, (message) => {
                    addLog(`Received data from server over STOMP: ${message}`);
                    message.nack();
                    let dto = JSON.parse(message.body);
                    console.log(measurements);
                    updateMeasurementsFromWebSocket(dto, measurements);
                });
            },
            error => {
                addError(`Failed to establish web socket STOMP connection. Error: ${error}`);
                console.log(error);
                wsConnected = false;
            }
        );
    }

    let checkMeasurementsLevel = (measurements) => {
        setVibrations(false);
        measurements.forEach(m => {
            if(m.level !== "NORMAL") {
                setVibrations(true);
            }
        })
    }

    let wsDisconnect =()=> {
        if (stompClient) {
            addLog("Disconnecting from websocket.")
            subscription.unsubscribe();
            stompClient.disconnect();
            socket.close();
            addLog("STOMP connection closed");
        }
        wsConnected = false;
    }

    let resetLastMeasurements = () => {
        setLastMeasurements({...lastMeasurements, data:[]});
    }

    let updateMeasurementsFromWebSocket = (measurement, measurements) => {
        let dto = JSON.parse(measurement);
        let _lastMeasurements = measurements;
        let index = _lastMeasurements.findIndex(el => el.sensor === dto.sensor);
        if(index >= 0) {
            _lastMeasurements[index] = dto;
        } else {
            _lastMeasurements.push(dto);
        }
        checkMeasurementsLevel(_lastMeasurements);
        setLastCreatedOn(dto.createdOn);
        setLastMeasurements({...lastMeasurements, data: _lastMeasurements})
    }

    return <CbnConnectionContext.Provider value={
        {
            resetLastMeasurements,
            connectionSettings,
            lastMeasurements,
            initiateConnection,
            spinner,
            refreshData,
            wsConnected,
            wsDisconnect,
            lastCreatedOn,
            vibrations,
            setVibrations
        }}>{children}</CbnConnectionContext.Provider>
}
