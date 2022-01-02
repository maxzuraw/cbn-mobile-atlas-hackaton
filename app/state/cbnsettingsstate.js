import * as React from "react";
import * as context from "./contexts";
import {useState} from "react";

export const CbnSettingsContext = React.createContext(context.SETTINGS_CONTEXT);

export default function SettingsProvider({children}) {
    const [settings, setSettings] = useState([]);

    const value = {
        settings: settings,
        loadAllSettings: (fetchedSettings) => {
            setSettings(fetchedSettings);
        },
        clearSettings: () => {
            setSettings([]);
        },

    }
    return <CbnSettingsContext.Provider value={value}>{children}</CbnSettingsContext.Provider>
}