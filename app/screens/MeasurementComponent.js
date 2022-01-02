import React from 'react';
import {StyleSheet, Text, View, ScrollView, TouchableOpacity} from "react-native";
import Colors from "../constants/colors";
import { Entypo } from '@expo/vector-icons';
import moment from "moment";
import {LAST_10_MEASUREMENTS_SCREEN} from "./ScreenNames";

export default function MeasurementComponent({navigation, lastMeasurement, index}){

    let navigateToLast10Measurements = () => {
        navigation.navigate({
            name: LAST_10_MEASUREMENTS_SCREEN,
            params: {sensorName: lastMeasurement.sensor}
        });
    }

    return (
        <View key={`mainview_${index}`} style={styles.wholeContainer}>
            <TouchableOpacity key={`touchable_${index}`} onPress={navigateToLast10Measurements}>
                    <View key={`view_${index}`} style={styles.resultsContainer}>
                        <Text key={`sensor_${index}`} style={styles.sensorLabel}>{lastMeasurement.sensor}</Text>
                        <Text key={`value_${index}`} style={lastMeasurement.level === "HIGH" ? styles.valueTextHigh : lastMeasurement.level === "LOW" ? styles.valueTextLow : styles.valueText}>{lastMeasurement.value} °C</Text>
                        {lastMeasurement.level === "HIGH" &&
                            <Entypo name="arrow-long-up" size={30} color={Colors.red} />
                        }
                        {lastMeasurement.level === "LOW" &&
                            <Entypo name="arrow-long-down" size={30} color={Colors.sea} />
                        }
                    </View>
                    <View key={`labelview_${index}`} style={styles.labelContainer}>
                        <Text key={`label_${index}`}>on {moment(lastMeasurement.createdOn).format("LLL")}</Text>
                    </View>

            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    wholeContainer: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        paddingVertical: 30,
        borderWidth: 1,
        borderRadius: 20

    },
    resultsContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    labelContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "flex-end",
    },
    sensorLabel: {
        fontSize: 20,
        color: Colors.black,
        fontWeight: "bold",
        paddingRight: 20
    },
    valueText: {
        fontSize: 40,
        color: Colors.forestGreen,
        fontWeight: "bold"
    },
    valueTextHigh: {
        fontSize: 40,
        color: Colors.red,
        fontWeight: "bold"
    },
    valueTextLow: {
        fontSize: 40,
        color: Colors.sea,
        fontWeight: "bold"
    }
});