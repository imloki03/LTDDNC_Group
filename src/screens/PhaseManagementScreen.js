import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch và useSelector
import { createNewPhase, getAllPhases, deletePhase, updatePhase } from '../api/phaseApi'; // Import API functions
import Button from '../components/Button';
import TextField from '../components/TextField';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Appbar } from 'react-native-paper';
import Drawer from '../components/Drawer';

const PhaseManagementScreen = ({ navigation }) => {
    const projectId = useSelector((state) => state.project.currentProject.id);
    const [phases, setPhases] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [phaseName, setPhaseName] = useState('');
    const [phaseDescription, setPhaseDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedPhase, setSelectedPhase] = useState(null);

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const toggleDrawer = () => {
        setIsDrawerVisible(!isDrawerVisible);
    };

    const formatDateTime = (date) => format(date, 'dd/MM/yyyy');
    const fetchPhases = async () => {
        try {
            const data = await getAllPhases(projectId);
            setPhases(data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchPhases();
    }, [projectId]);

    const handleCreatePhase = async () => {
        if (!phaseName || !phaseDescription || !startDate || !endDate) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }
        const newPhaseRequest = {
            name: phaseName,
            description: phaseDescription,
            startDate: startDate,
            endDate: endDate,
        };

        try {
            await createNewPhase(projectId, newPhaseRequest);
            Alert.alert("Success", "New phase was created successfully!");
            fetchPhases()
            setIsAddModalVisible(false);
        } catch (error) {
            console.error('Error creating new phase:', error);
            Alert.alert("Error", "Failed to create new phase.");
        }
    }

    const handleEditPhase = async () => {
        if (!phaseName || !phaseDescription || !startDate || !endDate) {
            Alert.alert("Error", "Please fill in all fields.");
            return;
        }
        const newPhaseRequest = {
            name: phaseName,
            description: phaseDescription,
            startDate: startDate,
            endDate: endDate,
        };

        try {
            await updatePhase(projectId, selectedPhase.id, newPhaseRequest);
            Alert.alert("Success", "Updated phase successfully!");
            fetchPhases()
            setIsAddModalVisible(false);
        } catch (error) {
            console.error('Error updating phase:', error);
            Alert.alert("Error", "Failed to update phase.");
        }
    }

    // Handle Delete Phase
    const handleDeletePhase = async (phaseId) => {
        try {
            await deletePhase(projectId, phaseId);
            setPhases(phases.filter(phase => phase.id !== phaseId));
        } catch (error) {
            console.error('Error deleting phase:', error);
        }
    };

    const toggleModal = (phase) => {
        setSelectedPhase(phase);
        setIsModalVisible(!isModalVisible);
    };

    const toggleAddModal = (phase) => {
        setSelectedPhase(phase);
        setIsAddModalVisible(!isAddModalVisible);
        if (!isAddModalVisible) {
            resetForm()
        }
    };

    const toggleEditModal = (phase) => {
        setSelectedPhase(phase);
        setIsEditModalVisible(!isEditModalVisible);
        if (!isEditModalVisible) {
            resetForm()
        }
    };

    const handleOptionSelect = (option) => {
        if (option === 'Edit') {
            setIsModalVisible(false);
            setIsEditModalVisible(true);
        } else if (option === 'Delete') {
            handleDeletePhase(selectedPhase.id);
            setIsModalVisible(false); // Close modal
        } else if (option === 'Cancel') {
            setIsModalVisible(false); // Close modal
        }
    };

    const resetForm = () => {
        setPhaseName('')
        setPhaseDescription('');
    };

    const openEditPhaseModal = (phase) => {
        setSelectedPhase(phase);
        setPhaseName(phase.name);
        setPhaseDescription(phase.description);
        if (phase.startDate !== null) {
            setStartDate(new Date(phase.startDate))
        }
        if (phase.endDate !== null) {
            setEndDate(new Date(phase.endDate))
        }
    };

    // Render each phase item
    const renderPhaseItem = ({ item }) => {
        const handleOptionSelect = (option) => {
            setIsModalVisible(false); // Close modal
            switch (option) {
                case 'Edit':
                    openEditPhaseModal(selectedPhase);
                    setIsEditModalVisible(true);
                    break;
                case 'Delete':
                    handleDeletePhase(item.id);
                    break;
                case 'Cancel':
                    setIsModalVisible(false);
                    break;
                default:
                    break;
            }
        };

        return (
            <View style={styles.phaseItem} >
                <View style={styles.phaseDetails}>
                    <TouchableOpacity onPress={() => { navigation.navigate('DetailPhase', { phaseId: item.id }) }}>
                    <Text style={styles.phaseName}>{item.name}</Text>
                        <Text>{`Start Date: ${item.startDate}`}</Text>
                        <Text>{`End Date: ${item.endDate}`}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { toggleModal(item); setSelectedPhase(item) }}>
                        <Text style={styles.optionsText}>...</Text>
                    </TouchableOpacity>
                </View>

                {/* Modal for Edit/Move/Delete/Cancel */}
                {selectedPhase?.id === item.id && (
                    <Modal
                        visible={isModalVisible}
                        transparent={true}
                        animationType="fade"
                        onRequestClose={() => setIsModalVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <TouchableOpacity onPress={() => handleOptionSelect('Edit')}>
                                    <Text style={styles.optionText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleOptionSelect('Delete')}>
                                    <Text style={styles.optionText}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleOptionSelect('Cancel')}>
                                    <Text style={styles.optionText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Appbar outside FlatList */}
            <Appbar.Header>
                <Appbar.Action icon="menu" onPress={toggleDrawer} />
                <Appbar.Content title="Phase Management" />
            </Appbar.Header>

            {isDrawerVisible && (
                <Drawer
                    navigation={navigation}
                    visible={isDrawerVisible}
                    currentScreen="Phase"
                    onClose={() => setIsDrawerVisible(false)}
                />
            )}

            <Button title="+ New Phase" onPress={toggleAddModal} />
            <FlatList
                data={phases}
                renderItem={renderPhaseItem}
                keyExtractor={(item) => item.id.toString()}
            />

            <Modal visible={isAddModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Create New Phase</Text>
                    <TextField label="Phase Name" value={phaseName} onChangeText={setPhaseName} />
                    <TextField label="Description" value={phaseDescription} onChangeText={setPhaseDescription} multiline />

                    <View>
                        <Text>Start Date:</Text>
                        <Text
                            onPress={() => setShowStartDatePicker(true)}
                            style={styles.dateText}
                        >
                            {formatDateTime(startDate)}
                        </Text>

                        {showStartDatePicker && (
                            <DateTimePicker
                                value={startDate}
                                mode="date"
                                display="default"
                                onChange={(e, selectedDate) => {
                                    const currentDate = selectedDate || startDate;
                                    setShowStartDatePicker(false);
                                    setStartDate(currentDate);
                                }}
                            />
                        )}
                    </View>

                    <View>
                        <Text>End Date:</Text>
                        <Text
                            onPress={() => setShowEndDatePicker(true)}
                            style={styles.dateText}
                        >
                            {formatDateTime(endDate)}
                        </Text>

                        {showEndDatePicker && (
                            <DateTimePicker
                                value={endDate}
                                mode="date"
                                display="default"
                                onChange={(e, selectedDate) => {
                                    const currentDate = selectedDate || endDate;
                                    setShowEndDatePicker(false);
                                    setEndDate(currentDate);
                                }}
                            />
                        )}
                    </View>

                    <Button title="Create Phase" onPress={handleCreatePhase} />
                    <Button title="Cancel" onPress={() => setIsAddModalVisible(false)} />
                </View>
            </Modal>

            <Modal visible={isEditModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Edit Phase</Text>
                    <TextField label="Phase Name" value={phaseName} onChangeText={setPhaseName} />
                    <TextField label="Description" value={phaseDescription} onChangeText={setPhaseDescription} multiline />

                    <Button title="Save Changes" onPress={handleEditPhase} />
                    <Button title="Cancel" onPress={() => setIsEditModalVisible(false)} />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 3
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: 'white',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    phaseItem: {
        backgroundColor: 'white',
        marginVertical: 10,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    phaseDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    phaseName: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    optionsText: {
        fontSize: 24,
        color: 'gray',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    optionText: {
        fontSize: 18,
        marginVertical: 8,
    },
    dateText: {
        fontSize: 18,
        color: '#007BFF',
    },
});

export default PhaseManagementScreen;
