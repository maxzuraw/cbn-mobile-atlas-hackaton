import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View, ScrollView, TouchableOpacity} from "react-native";
import Input from "../commons/input";
import Colors from "../constants/colors";
import Checkbox from 'expo-checkbox';
import {SETTINGS_SCREEN} from "./ScreenNames";
import {fetchAllSettings, insertSettings, resetDefaultSettings, updateSettings} from "../db/db";
import {CbnSettingsContext} from "../state/cbnsettingsstate";
import {CbnLogsContext} from "../state/cbnlogsstate";
import {showAlert} from "./modals/alert";

export default function SettingsScreen({navigation, route}) {

    let {clearSettings, loadAllSettings} = useContext(CbnSettingsContext);
    let {addLog, addWarn, addError} = useContext(CbnLogsContext);

    const [id, setId] = useState(route.params?.settingsData.id);
    const [name, setName] = useState(route.params?.settingsData.name);
    const [backendServer, setBackendServer] = useState(route.params?.settingsData.backendServer);
    const [user, setUser] = useState(route.params?.settingsData.user);
    const [password, setPassword] = useState(route.params?.settingsData.password);
    const [withSsl, setWithSsl] = useState(route.params?.settingsData.withSsl == 1 ? true : false);
    const [isDefault, setIsDefault] = useState(route.params?.settingsData.isDefault == 1 ? true : false);

    let resetFields = () => {
        setId(null);
        setName("");
        setBackendServer("");
        setUser("");
        setPassword("");
        setWithSsl(false);
        setIsDefault(false);
    }

    let cancelButtonHandler = () => {
        navigation.navigate(SETTINGS_SCREEN);
    }

    let saveOrUpdateSetting = async () => {
        if(name === undefined || name.length === 0){
            showAlert("Settings name not set", "Please set settings name and try again");
            addWarn("Settings name not set. Nothing will be inserted/updated. Verify your input.")
            return;
        }

        if(backendServer === undefined || backendServer.length ===0) {
            showAlert("Backend server not set", "Please set backend server and try again");
            addWarn("BackendServer not set. Nothing will be inserted/updated. Verify your input.");
            return;
        }

        let doNavigateToSettingsList = true;
        // NOTE: if default is set -> reset other default
        if(isDefault) {
            addLog("Resetting defaults, because current settings are selected as default.");
            await resetDefaultSettings().catch(err => {
                showAlert(err.message);
                addError(err.message);
                doNavigateToSettingsList = false;
            });
        }
        // NOTE: if id exists -> this is update
        if(id) {
            addLog("Updating settings: " + name);
            let dbResult = await updateSettings({id, name, backendServer, user, password, withSsl, isDefault})
                .catch(err => {
                    showAlert(err.message);
                    addError(err.message);
                    doNavigateToSettingsList = false;
                });
            addLog("Settings with name: " + name + " updated.");
        } else {
            // NOTE: otherwise insert settings
            addLog("Inserting new settings with name: " + name + ".");
            await insertSettings({name, backendServer, user, password, withSsl, isDefault})
                .catch(err => {
                    showAlert(err.message);
                    addError(err.message);
                    doNavigateToSettingsList = false;
                });
            addLog("Inserted new settings with name: " + name + ".");
        }

        clearSettings();
        fetchAllSettings().then(result => {
            loadAllSettings(result.rows._array);
            addLog("Fetching settings data. OK. Fetched: " + result.rows._array.length + (result.rows._array.length === 0 ? ". Nothing was stored yet." : ""));
        }).catch(err => {
            addError("Fetching settings data. FAILED");
            addError(err.message);
            doNavigateToSettingsList = false;
        });

        if(doNavigateToSettingsList) {
            navigation.navigate(SETTINGS_SCREEN);
        }
    }

    return (
        <View
            style={styles.screen}>
            <ScrollView style={styles.settingsContainer}>
                <Input
                    id={"settingsName"}
                    label={"name of this setting"}
                    placeholder={"name of this setting"}
                    style={styles.input}
                    keyboardType={"default"}
                    autoCapitalize={"none"}
                    value={name}
                    onChangeText={setName}
                />
                <Input
                    id={"backendServer"}
                    label={"backend server base uri"}
                    placeholder={"server base uri (f.e. localhost:8080)"}
                    style={styles.input}
                    keyboardType={"default"}
                    autoCapitalize={"none"}
                    value={backendServer}
                    onChangeText={setBackendServer}
                />
                <Input
                    id={"user"}
                    style={styles.input}
                    label={"user"}
                    placeholder={"user"}
                    keyboardType={"default"}
                    autoCapitalize={"none"}
                    value={user}
                    onChangeText={setUser}
                />
                <Input
                    id={"password"}
                    style={styles.input}
                    label={"password"}
                    placeholder={"password"}
                    keyboardType={"default"}
                    autoCapitalize={"none"}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <View style={styles.section}>
                    <View style={styles.sectionItem}>
                        <Checkbox style={styles.checkbox} value={withSsl} onValueChange={setWithSsl} />
                        <Text style={styles.paragraph}>Secured connection (https vs http)</Text>
                    </View>
                    <View style={styles.sectionItemSetAsDefault}>
                        <Checkbox style={styles.checkbox} value={isDefault} onValueChange={setIsDefault} />
                        <Text style={styles.paragraph}>Connect on app start</Text>
                    </View>
                </View>


                <View style={styles.buttonsContainer}>
                    <View style={styles.buttonItem}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => cancelButtonHandler()}>
                            <View >
                                <Text style={styles.simpleButtonText}>Cancel</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonItem}>
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={resetFields}>
                            <View >
                                <Text style={styles.simpleButtonText}>Reset</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonItem}>
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={saveOrUpdateSetting}>
                            <View>
                                {id && <Text style={styles.simpleButtonText}>
                                    Update
                                </Text>}
                                {(id === undefined || id === null) && <Text style={styles.simpleButtonText}>
                                    Save
                                </Text>}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10
    },
    radioButtonGroup: {
        margin: 20,
        flexDirection: "row"
    },
    containerOptionStyle: {
        paddingHorizontal: 20
    },
    settingsContainer: {
        width: "100%",
        maxWidth: 500,
        padding: 10,
    },
    input: {
        fontSize: 18,
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: Colors.darkGray,
        borderBottomWidth: 1
    },
    buttonItem: {
        flex: 1/2,
        backgroundColor: Colors.header,
        paddingHorizontal: 5
    },
    simpleButtonDisabled: {
        flex: 1,
        width: "100%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.lightGray,
        borderRadius: 10,
    },
    simpleButtonEnabled: {
        flex: 1,
        width: "100%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.sea,
        borderRadius: 10,
    },
    simpleButtonText: {
        color: Colors.white,
        fontSize: 18,
        padding: 10
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: "row",
        marginTop: 10,
        paddingHorizontal: 10,
        marginBottom: 20
    },
    cancelButton: {
        flex: 1,
        width: "100%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.notSoBlack,
        borderRadius: 10,
    },
    saveButton: {
        flex: 1,
        width: "100%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.forestGreen,
        borderRadius: 10,
    },
    resetButton: {
        flex: 1,
        width: "100%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.red,
        borderRadius: 10,
    },
    section: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 30,
        marginTop: 20,
        paddingHorizontal: 10,
    },
    sectionSounds: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 30,
        justifyContent: "space-between"
    },
    sectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        marginTop: 5
    },
    sectionItemSetAsDefault: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        marginTop: 10
    },
    paragraph: {
        fontSize: 15,
    },
    checkbox: {
        margin: 8,
    },
    soundNotificationButton: {
        flex: 1,
        width: "100%",
        height: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.darkGray,
        borderRadius: 10,
        marginLeft: 25
    },
})