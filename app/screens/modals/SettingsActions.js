import {Alert, Modal, Pressable, StyleSheet, Text, View} from "react-native";
import * as React from "react";
import Colors from "../../constants/colors";

export default function SettingsActions(props) {

    let {actionsDialogVisible, setActionsDialogVisible, settingsData, handleEdit, handleDelete, handleConnection} = props;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={actionsDialogVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setActionsDialogVisible(!actionsDialogVisible);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>What do you want to do with "{settingsData.name}" settings?</Text>
                    <View style={styles.modalButtonContainer}>
                        <Pressable
                            style={[styles.button, styles.buttonConnect]}
                            onPress={handleConnection}>
                            <Text style={styles.textStyle}>Connect</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonEdit]}
                            onPress={handleEdit}>
                            <Text style={styles.textStyle}>Edit</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonDelete]}
                            onPress={handleDelete}>
                            <Text style={styles.textStyle}>Delete</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setActionsDialogVisible(!actionsDialogVisible)}>
                            <Text style={styles.textStyle}>Cancel</Text>
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
});