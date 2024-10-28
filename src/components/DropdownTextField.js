import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { TextInput } from 'react-native-paper';
import { MaterialIcons } from 'react-native-vector-icons'; // Correct import

const DropdownTextField = ({ label, selectedValue, onValueChange, options }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleSelect = (value) => {
        onValueChange(value);
        setModalVisible(false);
    };

    const displayValue = selectedValue ?
        options.find(option => option.value === selectedValue)?.label :
        "Select an option";

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.inputContainer}>
                <TextInput
                    label={label}
                    mode="outlined"
                    value={displayValue}
                    editable={false}
                    style={styles.textInput}
                />
                <MaterialIcons name="arrow-drop-down" size={24} color="black" style={styles.arrowIcon} />
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleSelect(item.value)} style={styles.optionButton}>
                                    <Text style={styles.optionText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    inputContainer: {
        position: 'relative',
    },
    textInput: {
        backgroundColor: 'white',
    },
    arrowIcon: {
        position: 'absolute',
        right: 10,
        top: 15,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    optionButton: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    optionText: {
        fontSize: 16,
    },
    closeButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    closeText: {
        color: 'blue',
        fontSize: 16,
    },
});

export default DropdownTextField;
