import {ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import * as React from "react";
import {useContext, useEffect, useState} from "react";
import Colors from "../constants/colors";
import {CbnSettingsContext} from "../state/cbnsettingsstate";
import {Entypo} from "@expo/vector-icons";
import {ADD_SETTINGS_SCREEN, TEMPERATURES_SCREEN} from "./ScreenNames";
import SettingsActions from "./modals/SettingsActions";
import DeleteConfirmationDialog from "./modals/DeleteConfirmationDialog";
import {deleteSettings, fetchAllSettings} from "../db/db";
import {CbnLogsContext} from "../state/cbnlogsstate";
import {CbnConnectionContext} from "../state/cbnconnectionstate";
import Spinner from 'react-native-loading-spinner-overlay';

export default function SettingsList({navigation}) {

    const [actionsDialogVisible, setActionsDialogVisible] = useState(false)
    const [confirmationDialogVisible, setConfirmationDialogVisible] = useState(false);
    const [settingsData, setSettingsData] = useState({});
    let {settings, clearSettings, loadAllSettings} = useContext(CbnSettingsContext);
    let {addError, addLog, logs} = useContext(CbnLogsContext);

    let {spinner, initiateConnection} = useContext(CbnConnectionContext);

    useEffect(() => {

    }, [logs])

    let addNewSettings = () => {
        navigation.navigate(ADD_SETTINGS_SCREEN);
    }

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableHighlight style={styles.headerButtonStyle} onPress={addNewSettings} underlayColor={Colors.lightGray}>
                    <View>
                        <Entypo name="circle-with-plus" size={40} color={Colors.forestGreen} />
                    </View>
                </TouchableHighlight>
            )
        });
    }, [navigation]);

    let openDialogWithOptions = (item) => {
        setSettingsData(item);
        setActionsDialogVisible(true);
    }

    let handleConfirmationDelete = async () => {
        deleteSettings(settingsData.id).then(() => {
            addLog(`Settings with name ${settingsData.name} deleted successfully`);
        }).catch(err => addError(err.message));
        clearSettings();
        fetchAllSettings().then(result => {
            loadAllSettings(result.rows._array);
            addLog("Fetching settings data. OK. Fetched: " + result.rows._array.length + (result.rows._array.length === 0 ? ". Nothing was stored yet." : ""));
        }).catch(err => {
            addError("Fetching settings data. FAILED");
            addError(err.message);
        });
        setConfirmationDialogVisible(false);
    }

    let handleDelete = async () => {
        setActionsDialogVisible(false);
        setConfirmationDialogVisible(true);
    }

    let handleEdit = () => {
        setActionsDialogVisible(false);
        navigation.navigate(ADD_SETTINGS_SCREEN, {
            settingsData: settingsData
        });
    }

    let handleConnection = async () => {
        let connectionResult = await initiateConnection(settingsData);
        setActionsDialogVisible(false);
        if(connectionResult) {
            navigation.navigate(TEMPERATURES_SCREEN);
        }
    }

    return (
        <View style={styles.container}>
            <Spinner
                visible={spinner}
                textContent={'Connecting to server...'}
                textStyle={styles.spinnerTextStyle}
                overlayColor={Colors.overlayWithTransparency}
            />
            <SettingsActions
                actionsDialogVisible={actionsDialogVisible}
                setActionsDialogVisible={setActionsDialogVisible}
                settingsData={settingsData}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleConnection={handleConnection}
                />

            <DeleteConfirmationDialog
                confirmationDialogVisible={confirmationDialogVisible}
                setConfirmationDialogVisible={setConfirmationDialogVisible}
                settingsData={settingsData}
                handleDelete={handleConfirmationDelete}
            />

            <ScrollView style={styles.settingsContainer}>
                {settings.length === 0 ? <Text id={-1} key={-1} style={styles.containerText}>No stored sessions yet...</Text> : settings.map(function(item, index, _) {
                    return (
                        <View id={index} key={index} style={styles.buttonItem}>
                            <TouchableOpacity
                                style={item.isDefault ? styles.settingsButtonDefault : styles.settingsButton}
                                onPress={() => openDialogWithOptions(item)}>
                                <View >
                                    <Text style={styles.simpleButtonText}>{item.name} => ({item.backendServer})</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </ScrollView>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.lightGray,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    settingsContainer: {
        width: "100%",
        maxWidth: 500,
        padding: 10,
    },
    containerText: {
        color: Colors.black
    },
    headerButtonStyle: {
        marginRight: 20
    },
    buttonItem: {
        flex: 1/2,
        backgroundColor: Colors.header,
        paddingHorizontal: 5,
        paddingVertical: 5
    },
    settingsButton: {
        flex: 1,
        width: "100%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        backgroundColor: Colors.forestGreen,
        borderRadius: 5,
    },
    settingsButtonDefault: {
        flex: 1,
        width: "100%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        backgroundColor: Colors.red,
        borderRadius: 5,
    },
    simpleButtonText: {
        color: Colors.white,
        fontSize: 18,
        padding: 10
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        margin: 5
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    buttonConnect: {
        backgroundColor: Colors.darkYellow
    },
    buttonEdit: {
        backgroundColor: Colors.forestGreen
    },
    buttonDelete: {
        backgroundColor: Colors.red
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
});