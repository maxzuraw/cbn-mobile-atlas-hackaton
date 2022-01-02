import React from 'react';
import { StyleSheet, Text, View, ScrollView} from "react-native";
import {StatusBar} from "expo-status-bar";
import Colors from "../constants/colors";
import {TouchableHighlight} from "react-native";
import { Entypo } from '@expo/vector-icons';
import {useContext, useEffect} from "react";
import {CbnLogsContext} from "../state/cbnlogsstate";

export default function Console({navigation}) {

    let {logs, resetLogs} = useContext(CbnLogsContext);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableHighlight style={styles.headerButtonStyle} onPress={resetLogs} underlayColor={Colors.lightGray}>
                    <View>
                        <Entypo name="trash" size={40} color={Colors.red} />
                    </View>
                </TouchableHighlight>
            )
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <ScrollView style={styles.settingsContainer}>
                {logs.length === 0 ? <Text id={-1} key={-1} style={styles.containerText}>Nothing to log...</Text> : logs.map(function(item, index, _) {
                    return (
                        <Text id={index} key={index} style={styles.containerText}>{item}</Text>
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
        backgroundColor: Colors.notSoBlack,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginBottom: 10
    },
    settingsContainer: {
        width: "100%",
        maxWidth: 500,
        padding: 10,
        marginBottom: 20
    },
    containerText: {
        color: Colors.sea,
        paddingBottom: 10
    },
    headerButtonStyle: {
        marginRight: 20
    }
});