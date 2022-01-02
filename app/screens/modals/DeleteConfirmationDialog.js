import {Modal, Pressable, StyleSheet, Text, View} from "react-native";
import * as React from "react";
import Colors from "../../constants/colors";

export default function DeleteConfirmationDialog(props) {

    let {confirmationDialogVisible, setConfirmationDialogVisible, settingsData, handleDelete} = props;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={confirmationDialogVisible}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Are you sure you want to delete "{settingsData.name}" settings?</Text>
                    <View style={styles.modalButtonContainer}>
                        <Pressable
                            style={[styles.button, styles.buttonConfirm]}
                            onPress={handleDelete}>
                            <Text style={styles.textStyle}>Yes, delete it</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonCancel]}
                            onPress={() => setConfirmationDialogVisible(!confirmationDialogVisible)}>
                            <Text style={styles.textStyle}>No, I am not sure, stop!</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
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
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    modalButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        margin: 5
    },
    buttonConfirm: {
        backgroundColor: Colors.red
    },
    buttonCancel: {
        backgroundColor: Colors.sea
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});