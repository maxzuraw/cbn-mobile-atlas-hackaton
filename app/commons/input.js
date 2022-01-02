import React from "react";
import {View, Text, TextInput, StyleSheet} from "react-native";

const Input = props => {
    return (
        <View style={styles.formControl}>
            {props.enableLabel && <Text style={styles.label}>{props.label}</Text>}
            <TextInput
                {...props}
                style={{...styles.input, ...props.style}}
                value={props.value}
                placeholder={props.placeholder}
                // onChangeText={textChangeHandler.bind(this, "title")}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    formControl: {
        width: "100%"
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        marginVertical: 8
    }
})

export default Input;