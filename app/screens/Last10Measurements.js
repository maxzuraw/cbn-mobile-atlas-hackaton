import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from "react-native";
import {getLast10Measurements} from "../connection/lastmeasurements";
import {CbnLogsContext} from "../state/cbnlogsstate";
import {CbnConnectionContext} from "../state/cbnconnectionstate";
import Colors from "../constants/colors";
import {LineChart} from "react-native-chart-kit";
import { Rect, Text as TextSVG, Svg } from "react-native-svg";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from "moment";

export default function Last10Measurements({route, navigation}) {

    let {sensorName} = route.params;
    let {addError, addLog} = useContext(CbnLogsContext);
    let {connectionSettings} = useContext(CbnConnectionContext);

    const [chartData, setChartData] = useState(null);
    let [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, value: 0 })
    const [spinner, setSpinner] = useState(false);

    useEffect(() => {
        setSpinner(true);
        getLast10Measurements(connectionSettings, sensorName, addLog, addError).then(result => {
            addLog(`reading last 10 measurements for ${sensorName}`);
            setChartData(prepareData(result));
        }).catch(err => {
            addError(err.message);
        }).finally(() => {
            setSpinner(false);
        })
    }, [sensorName])

    let chartConfig = {
        backgroundGradientFrom: '#1E2923',
        backgroundGradientTo: '#08130D',
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 3 // optional, default 3
    }

    let prepareData = (measurements) => {
        let dateLabels = [];
        let hourLabels = [];
        let data = [];
        measurements.map(m => {
            dateLabels.push(moment(m.createdOn).format("DD/MM/YY"));
            hourLabels.push(moment(m.createdOn).format("HH:mm"))
            data.push(m.value);
        })
        return {
            labels: dateLabels,
            datasets: [
                {
                    data: data,
                    color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional,
                    strokeWidth: 2, // optional
                    dateLabels: dateLabels,
                    hourLabels: hourLabels
                }
            ]
        }
    }

    return (
        <View style={styles.container}>
            <Spinner
                visible={spinner}
                textContent={`Fetching data for ${sensorName}...`}
                textStyle={styles.spinnerTextStyle}
                overlayColor={Colors.overlayWithTransparency}
            />
            {chartData && <Text style={styles.titleLabel}>Last 10 measurements for {sensorName}</Text>}
            {chartData  &&
                <LineChart
                    data={chartData}
                    width={350}
                    height={450}
                    chartConfig={chartConfig}
                    verticalLabelRotation={80}
                    bezier
                    // NOTE: used tooltip solution from https://levelup.gitconnected.com/adding-tooltip-to-react-native-charts-67606c5d3182
                    decorator={() => {
                        return tooltipPos.visible ? <View>
                            <Svg>
                                <Rect x={tooltipPos.x - 55}
                                      y={tooltipPos.y + 10}
                                      width="120"
                                      height="30"
                                      fill="black" />
                                <TextSVG
                                    x={tooltipPos.x + 5}
                                    y={tooltipPos.y + 30}
                                    fill="white"
                                    fontSize="14"
                                    fontWeight="normal"
                                    textAnchor="middle">
                                    {tooltipPos.value}
                                </TextSVG>
                            </Svg>
                        </View> : null
                    }}
                    onDataPointClick={(data) => {
                        let isSamePoint = (tooltipPos.x === data.x
                            && tooltipPos.y === data.y)
                        isSamePoint ? setTooltipPos((previousState) => {
                                return {
                                    ...previousState,
                                    value: `${data.value} °C at ${data.dataset.hourLabels[data.index]}`,
                                    visible: !previousState.visible
                                }
                            }) : setTooltipPos({ x: data.x, value: `${data.value} °C at ${data.dataset.hourLabels[data.index]}`, y: data.y, visible: true });
                    }}
                />
            }

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.lightGray,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleLabel: {
        paddingVertical: 20,
        fontWeight: "bold",
        fontSize: 16
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
});