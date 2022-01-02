import * as React from 'react';
import {StyleSheet, Text, View, ScrollView, TouchableHighlight, Vibration, TouchableOpacity} from "react-native";
import Colors from "../constants/colors";
import {useContext, useEffect, useState} from "react";
import {CbnConnectionContext} from "../state/cbnconnectionstate";
import {Entypo} from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {CbnLogsContext} from "../state/cbnlogsstate";
import MeasurementComponent from "./MeasurementComponent";
import Spinner from 'react-native-loading-spinner-overlay';
import {showAlert} from "./modals/alert";


export default function TemperatureOverviewScreen({navigation}) {

    const ONE_SECOND_IN_MS = 1000;
    const PATTERN = [1 * ONE_SECOND_IN_MS, 2 * ONE_SECOND_IN_MS, 3 * ONE_SECOND_IN_MS];

    let {addLog} = useContext(CbnLogsContext);
    let {connectionSettings, refreshData, wsConnected, wsDisconnect,lastCreatedOn, lastMeasurements, resetLastMeasurements, spinner, vibrations, setVibrations} = useContext(CbnConnectionContext);

    useEffect(() => {
        if(vibrations) {
            showAlert("CHECK ROOM TEMPERATURES!!!!", "One of the sensors detected temperature anomaly! Please check your sensors!");
            Vibration.vibrate(PATTERN, true);
        }
    }, [lastCreatedOn, lastMeasurements, vibrations])

    let disconnect = () => {
        addLog(`Disconnecting from server: ${connectionSettings.backendServer}`);
        wsDisconnect();
        resetLastMeasurements();
    }

    let connect = async () => {
        addLog(`Connecting to server: ${connectionSettings.backendServer}`);
        refreshData(connectionSettings);
    }

    let turnOffVibrations = () => {
        setVibrations(false);
        Vibration.cancel();
    }

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={styles.temperatureOverviewStyle}>
                    {wsConnected && connectionSettings.backendServer &&
                        <TouchableHighlight style={styles.headerButtonStyle} onPress={() => disconnect()} underlayColor={Colors.lightGray}>
                            <View>
                                <Entypo name="controller-stop" size={40} color={Colors.red} />
                            </View>
                        </TouchableHighlight>
                    }
                    {!wsConnected && connectionSettings.backendServer &&
                        <TouchableHighlight style={styles.headerButtonStyle} onPress={() => connect()} underlayColor={Colors.lightGray}>
                            <View>
                                <Entypo name="controller-play" size={40} color={Colors.forestGreen} />
                            </View>
                        </TouchableHighlight>
                    }
                    {wsConnected && connectionSettings.backendServer &&
                    <TouchableOpacity
                        style={styles.headerButtonStyle}
                        onPress={() => turnOffVibrations()}
                        underlayColor={Colors.lightGray}
                        disabled={!vibrations}
                    >
                        <View>
                            <MaterialCommunityIcons name="vibrate-off" size={40} color={vibrations ? Colors.forestGreen : Colors.darkGray} />
                        </View>
                    </TouchableOpacity>
                    }
                </View>
            )
        });
    }, [connectionSettings, wsConnected, vibrations]);

    return (
        <View style={styles.container}>
            <Spinner
                visible={spinner}
                textContent={'Refreshing data from server...'}
                textStyle={styles.spinnerTextStyle}
                overlayColor={Colors.overlayWithTransparency}
            />
            <ScrollView style={styles.temperaturesContainer}>
            {!lastMeasurements.data || lastMeasurements.data.length === 0 &&
                <Text>Nothing to show yet. No measurements fetched yet. (?) Check your server connection (?)</Text>
            }
            {lastMeasurements.data && lastMeasurements.data.length > 0 && lastMeasurements.data.map((measurement, index) =>
                <View key={`measurementcomponentview_${index}`} style={styles.measurementComponentView}>
                    <MeasurementComponent
                        navigation={navigation}
                        key={`measurementcomponent_${index}`}
                        lastMeasurement={measurement}
                        index={index}
                    />
                </View>
            )}
            </ScrollView>
            <Text style={styles.backendServerLabel}>{connectionSettings.backendServer}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.lightGray,
        alignItems: 'center',
        justifyContent: 'center'
    },
    temperaturesContainer: {
        width: "100%",
        maxWidth: 500,
        padding: 20,
    },
    measurementComponentView: {
        paddingVertical: 5
    },
    headerButtonStyle: {
        marginRight: 20
    },
    backendServerLabel: {
        color: Colors.darkSea,
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 10
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
    temperatureOverviewStyle: {
        flex: 1,
        flexDirection: "row"
    }
});