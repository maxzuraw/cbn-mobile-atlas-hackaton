import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TemperatureOverviewScreen from "./app/screens/TemperatureOverviewScreen";
import SettingsScreen from "./app/screens/SettingsScreen";
import { Ionicons } from '@expo/vector-icons';
import {init, dropTable, fetchAllSettings} from "./app/db/db";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsList from "./app/screens/SettingsList";
import Console from "./app/screens/Console";
import {CONSOLE_SCREEN, SETTINGS_SCREEN, ADD_SETTINGS_SCREEN, TEMPERATURES_SCREEN, LAST_10_MEASUREMENTS_SCREEN} from "./app/screens/ScreenNames";
import {useContext, useEffect} from "react";
import LogsProvider from "./app/state/cbnlogsstate";
import {CbnLogsContext} from "./app/state/cbnlogsstate";
import SettingsProvider, {CbnSettingsContext} from "./app/state/cbnsettingsstate";
import ConnectionProvider, {CbnConnectionContext} from "./app/state/cbnconnectionstate";
import Last10Measurements from "./app/screens/Last10Measurements";

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function MainTabs() {

    let {addLog,addError} = useContext(CbnLogsContext);
    let {loadAllSettings} = useContext(CbnSettingsContext);
    let {initiateConnection} = useContext(CbnConnectionContext);

    useEffect(() => {

        // dropTable().then(() => {
        //     addLog("Table dropped");
        // }).catch(err => {
        //     addLog("Dropping table failed");
        //     addLog(err.message);
        // });

        addLog("== STARTING APP ==");
        init().then(() => {
            addLog("Initializing database. OK");
        }).catch(err => {
            addLog("Initializing database. FAILED");
            addLog(err.message);
        })

        fetchAllSettings().then(result => {
            let settingsDatas = result.rows._array;
            loadAllSettings(settingsDatas);
            let index = settingsDatas.findIndex(el => el.isDefault);
            if(index >= 0) {
                let settingsData = settingsDatas[index];
                initiateConnection(settingsData);
            }
            addLog("Fetching settings data. OK. Fetched: " + result.rows._array.length + (result.rows._array.length === 0 ? ". Nothing was stored yet." : ""));
        }).catch(err => {
            addError("Fetching settings data. FAILED");
            addError(err.message);
        })

    }, []);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === TEMPERATURES_SCREEN) {
                        iconName = focused
                            ? 'bar-chart'
                            : 'bar-chart-outline';
                    } else if (route.name === SETTINGS_SCREEN) {
                        iconName = focused ? 'ios-settings-sharp' : 'ios-settings-outline';
                    } else if (route.name === CONSOLE_SCREEN) {
                        iconName = focused ? 'ios-terminal-sharp' : 'ios-terminal-outline';
                    }
                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name={CONSOLE_SCREEN} component={Console} />
            <Tab.Screen name={TEMPERATURES_SCREEN} component={TemperatureOverviewScreen} />
            <Tab.Screen name={SETTINGS_SCREEN} component={SettingsList} />
        </Tab.Navigator>
    )
}

export default function App() {
  return (
      <LogsProvider>
          <SettingsProvider>
              <NavigationContainer>
                  <ConnectionProvider>
                      <Stack.Navigator>
                          <Stack.Screen name={"Main"} component={MainTabs} options={{headerShown: false}}/>
                          <Stack.Screen name={ADD_SETTINGS_SCREEN} component={SettingsScreen}/>
                          <Stack.Screen name={LAST_10_MEASUREMENTS_SCREEN} component={Last10Measurements}/>
                      </Stack.Navigator>
                  </ConnectionProvider>
              </NavigationContainer>
          </SettingsProvider>
      </LogsProvider>
  );
}


