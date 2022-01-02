import {Alert} from "react-native";

export function showAlert(title, msg) {
    Alert.alert(title, msg, [
        {
            text: "OK",
            onPress: () => console.log("OK pressed"),
            style: "cancel"
        }
    ])
}