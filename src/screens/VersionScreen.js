import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert, ScrollView } from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { getVersionsByProject, getVersionById, createVersion, editVersion, deleteVersion, VersionRequest, getAvailableTasksInPhase, getAvailableTasksInBacklog } from '../api/versionApi';
import { getAllPhases } from '../api/phaseApi';
import {
    Modal,
    Portal,
    Button,
    Card,
    TextInput,
    Text,
    Provider,
    ProgressBar,
    IconButton,
    Appbar
} from 'react-native-paper';
import {useRoute} from "@react-navigation/native";
import Drawer from "../components/Drawer";
import {updateRender} from "../redux/slices/renderSlice";

const VersionListScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const projectId = useSelector((state) => state.project.currentProject.id);
    const [versions, setVersions] = useState([]);
    const [phases, setPhases] = useState([]);
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [newVersionName, setNewVersionName] = useState('');
    const [newVersionDescription, setNewVersionDescription] = useState('');
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [expandedPhases, setExpandedPhases] = useState({});
    const [phaseTasks, setPhaseTasks] = useState({});
    const route = useRoute();
    const { versionId } = route.params || {};
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [backlogTasks, setBacklogTasks] = useState([]);
    const [isBacklogExpanded, setIsBacklogExpanded] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerVisible(!isDrawerVisible);
    };

    useEffect(() => {
        const fetchVersions = async () => {
            try {
                const response = await getVersionsByProject(projectId);
                setVersions(response?.data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)));
            } catch (error) {
                console.error('Error fetching versions:', error);
            }
        };

        const fetchPhases = async () => {
            try {
                const response = await getAllPhases(projectId);
                setPhases(response || []);
            } catch (error) {
                console.error('Error fetching phases:', error);
            }
        };

        const fetchBacklogTasks = async () => {
            try {
                const response = await getAvailableTasksInBacklog(projectId);
                setBacklogTasks(response?.data || []);
                console.log(response)
            } catch (error) {
                console.error('Error fetching backlog tasks:', error);
            }
        };

        fetchVersions();
        fetchPhases();
        fetchBacklogTasks();
        dispatch(updateRender());
        if (versionId) {
            handleVersionPress(versionId);
        }

    }, [projectId]);


    const calculateProgress = (tasks) => {
        if (!tasks || tasks.length === 0) return 0;
        const completedTasks = tasks.filter(task => task.status === 'DONE').length;
        return completedTasks / tasks.length;
    };

    const handleVersionPress = async (versionId) => {
        try {
            const response = await getVersionById(versionId);
            const versionData = response?.data;
            setSelectedVersion({
                ...versionData,
                progress: calculateProgress(versionData.taskList),
            });
            setIsModalVisible(true);
        } catch (error) {
            console.error('Error fetching version details:', error);
        }
    };

    const handleAddVersion = async () => {
        if (!newVersionName.trim()) {
            Alert.alert('Validation Error', 'Version name cannot be blank.');
            return;
        }

        try {
            const newVersionRequest = VersionRequest(newVersionName, newVersionDescription, selectedTasks);
            await createVersion(projectId, newVersionRequest);
            setIsAddModalVisible(false);
            setNewVersionName('');
            setNewVersionDescription('');
            setSelectedTasks([]);
            const response = await getVersionsByProject(projectId);
            setVersions(response?.data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)));
            setExpandedPhases({});
        } catch (error) {
            console.error('Error adding version:', error);
        }
    };

    const handleEditVersion = async () => {
        if (!newVersionName.trim()) {
            Alert.alert('Validation Error', 'Version name cannot be blank.');
            return;
        }

        try {
            const updatedVersionRequest = VersionRequest(newVersionName, newVersionDescription, selectedTasks);
            await editVersion(selectedVersion.id, updatedVersionRequest);
            setIsEditModalVisible(false);
            const response = await getVersionsByProject(projectId);
            setVersions(response?.data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)));
            setExpandedPhases({});
        } catch (error) {
            console.error('Error editing version:', error);
        }
    };

    const handleDeleteVersion = async () => {
        try {
            await deleteVersion(selectedVersion.id);
            setIsModalVisible(false);
            const response = await getVersionsByProject(projectId);
            setVersions(response?.data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)));
        } catch (error) {
            console.error('Error deleting version:', error);
        }
    };

    const togglePhaseExpansion = async (phaseId) => {
        const isExpanded = expandedPhases[phaseId];

        // Set the phase as expanded or collapsed
        setExpandedPhases((prevExpandedPhases) => ({
            ...prevExpandedPhases,
            [phaseId]: !isExpanded,
        }));

        if (!isExpanded) {
            try {
                const response = await getAvailableTasksInPhase(phaseId);
                setPhaseTasks((prevPhaseTasks) => ({
                    ...prevPhaseTasks,
                    [phaseId]: response?.data || [],
                }));
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        } else {
            setPhaseTasks((prevPhaseTasks) => ({
                ...prevPhaseTasks,
                [phaseId]: [],
            }));
        }
    };


    const handleTaskSelection = (taskId) => {
        setSelectedTasks((prevSelectedTasks) =>
            prevSelectedTasks.includes(taskId)
                ? prevSelectedTasks.filter((id) => id !== taskId)
                : [...prevSelectedTasks, taskId]
        );
    };


    return (
        <Provider>
            <View style={styles.container}>
                <Appbar.Header>
                    <Appbar.Action icon="menu" onPress={toggleDrawer} />
                    <Appbar.Content title="Version Management" />
                </Appbar.Header>

                {isDrawerVisible && (
                    <Drawer
                        navigation={navigation}
                        visible={isDrawerVisible}
                        currentScreen="Version"
                        onClose={() => setIsDrawerVisible(false)}
                    />
                )}

                <FlatList
                    data={versions}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <Card style={styles.versionItem} onPress={() => handleVersionPress(item.id)}>
                            <Card.Title title={item.name} subtitle={`Created: ${new Date(item.createdDate).toLocaleDateString()}`} />
                        </Card>
                    )}
                />

                <Button mode="contained" onPress={() => setIsAddModalVisible(true)} style={styles.addButton}>
                    Add Version
                </Button>

                <Portal>
                    <Modal visible={isAddModalVisible} onDismiss={() => setIsAddModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>Add New Version</Text>
                            <TextInput
                                label="Version Name"
                                value={newVersionName}
                                onChangeText={setNewVersionName}
                                mode="outlined"
                                style={styles.input}
                            />
                            <TextInput
                                label="Description"
                                value={newVersionDescription}
                                onChangeText={setNewVersionDescription}
                                mode="outlined"
                                multiline
                                style={styles.input}
                            />

                            <View style={styles.phaseItem}>
                                <View style={styles.phaseHeader}>
                                    <Text style={styles.phaseName}>Backlog</Text>
                                    <IconButton
                                        icon={isBacklogExpanded ? 'chevron-up' : 'chevron-down'}
                                        size={24}
                                        onPress={() => setIsBacklogExpanded(!isBacklogExpanded)}
                                    />
                                </View>

                                {isBacklogExpanded && (
                                    <View style={styles.taskListContainer}>
                                        {backlogTasks.length > 0 ? (
                                            backlogTasks.map((task) => (
                                                <Button
                                                    key={task.id}
                                                    mode={selectedTasks.includes(task.id) ? 'contained' : 'outlined'}
                                                    onPress={() => handleTaskSelection(task.id)}
                                                    style={styles.taskButton}
                                                >
                                                    {task.name}
                                                </Button>
                                            ))
                                        ) : (
                                            <Text>No tasks available in backlog.</Text>
                                        )}
                                    </View>
                                )}
                            </View>

                            <Text style={styles.phasesTitle}>Phases</Text>
                            {phases.map((phase) => (
                                <View key={phase.id} style={styles.phaseItem}>
                                    <View style={styles.phaseHeader}>
                                        <Text style={styles.phaseName}>{phase.name}</Text>
                                        <IconButton
                                            icon={expandedPhases[phase.id] ? 'chevron-up' : 'chevron-down'}
                                            size={24}
                                            onPress={() => togglePhaseExpansion(phase.id)}
                                        />
                                    </View>

                                    {expandedPhases[phase.id] && (
                                        <View style={styles.taskListContainer}>
                                            {phaseTasks[phase.id]?.length > 0 &&
                                                phaseTasks[phase.id].map((task) => (
                                                    <Button
                                                        key={task.id}
                                                        mode={selectedTasks.includes(task.id) ? 'contained' : 'outlined'}
                                                        onPress={() => handleTaskSelection(task.id)}
                                                        style={styles.taskButton}
                                                    >
                                                        {task.name}
                                                    </Button>
                                                ))}
                                        </View>
                                    )}
                                </View>
                            ))}
                            <Button mode="contained" onPress={handleAddVersion} style={styles.addButton}>
                                Add Version
                            </Button>
                        </ScrollView>
                    </Modal>
                </Portal>

                <Portal>
                    <Modal visible={isModalVisible} onDismiss={() => setIsModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                        {selectedVersion && (
                            <View>
                                <Text style={styles.modalTitle}>Version Details</Text>
                                <Text>Name: {selectedVersion.name}</Text>
                                <Text>Description: {selectedVersion.description}</Text>
                                <Text>Created Date: {new Date(selectedVersion.createdDate).toLocaleDateString()}</Text>
                                <Text style={styles.tasksTitle}>Tasks:</Text>
                                {selectedVersion.taskList.map((task) => (
                                    <Text key={task.id}>- {task.name} ({task.status})</Text>
                                ))}
                                <Text style={styles.progressTitle}>Progress:</Text>
                                <ProgressBar progress={selectedVersion.progress} color="green" style={styles.progressBar} />
                                <Text>{(selectedVersion.progress * 100).toFixed(2)}%</Text>

                                <Button mode="outlined" onPress={() => {
                                    setNewVersionName(selectedVersion.name);
                                    setNewVersionDescription(selectedVersion.description);
                                    setSelectedTasks(selectedVersion.taskList.map(task => task.id));
                                    setIsModalVisible(false);
                                    setIsEditModalVisible(true);
                                }} style={styles.editButton}>Edit</Button>

                                <Button mode="outlined" onPress={handleDeleteVersion} style={styles.deleteButton}>Delete</Button>
                            </View>
                        )}
                    </Modal>
                </Portal>

                <Portal>
                    <Modal visible={isEditModalVisible} onDismiss={() => setIsEditModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>Edit Version</Text>
                            <TextInput
                                label="Version Name"
                                value={newVersionName}
                                onChangeText={setNewVersionName}
                                mode="outlined"
                                style={styles.input}
                            />
                            <TextInput
                                label="Description"
                                value={newVersionDescription}
                                onChangeText={setNewVersionDescription}
                                mode="outlined"
                                multiline
                                style={styles.input}
                            />

                            <Text style={styles.phasesTitle}>Backlog</Text>
                            <View style={styles.phaseItem}>
                                <View style={styles.phaseHeader}>
                                    <Text style={styles.phaseName}>Backlog</Text>
                                    <IconButton
                                        icon={isBacklogExpanded ? 'chevron-up' : 'chevron-down'}
                                        size={24}
                                        onPress={() => setIsBacklogExpanded(!isBacklogExpanded)}
                                    />
                                </View>

                                {isBacklogExpanded && (
                                    <View style={styles.taskListContainer}>
                                        {backlogTasks.length > 0 ? (
                                            backlogTasks.map((task) => (
                                                <Button
                                                    key={task.id}
                                                    mode={selectedTasks.includes(task.id) ? 'contained' : 'outlined'}
                                                    onPress={() => handleTaskSelection(task.id)}
                                                    style={styles.taskButton}
                                                >
                                                    {task.name}
                                                </Button>
                                            ))
                                        ) : (
                                            <Text>No tasks available in backlog.</Text>
                                        )}
                                    </View>
                                )}
                            </View>

                            <Text style={styles.phasesTitle}>Phases</Text>
                            {phases.map((phase) => (
                                <View key={phase.id} style={styles.phaseItem}>
                                    <View style={styles.phaseHeader}>
                                        <Text style={styles.phaseName}>{phase.name}</Text>
                                        <IconButton
                                            icon={expandedPhases[phase.id] ? 'chevron-up' : 'chevron-down'}
                                            size={24}
                                            onPress={() => togglePhaseExpansion(phase.id)}
                                        />
                                    </View>

                                    {expandedPhases[phase.id] && (
                                        <View style={styles.taskListContainer}>
                                            {phaseTasks[phase.id]?.length > 0 &&
                                                phaseTasks[phase.id].map((task) => (
                                                    <Button
                                                        key={task.id}
                                                        mode={selectedTasks.includes(task.id) ? 'contained' : 'outlined'}
                                                        onPress={() => handleTaskSelection(task.id)}
                                                        style={styles.taskButton}
                                                    >
                                                        {task.name}
                                                    </Button>
                                                ))}
                                        </View>
                                    )}
                                </View>
                            ))}
                            <Button mode="contained" onPress={handleEditVersion} style={styles.addButton}>
                                Save Changes
                            </Button>
                        </ScrollView>
                    </Modal>
                </Portal>
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    versionItem: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10
    },
    addButton: {
        marginTop: 10,
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        marginBottom: 10,
    },
    phasesTitle: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    phaseItem: {
        marginBottom: 10,
    },
    phaseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    phaseName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    taskListContainer: {
        paddingLeft: 10,
    },
    taskButton: {
        marginBottom: 5,
    },
    editButton: {
        marginTop: 10,
    },
    deleteButton: {
        marginTop: 10,
        marginBottom: 20,
    },
    progressBar: {
        marginVertical: 10,
    },
    tasksTitle: {
        fontWeight: 'bold',
        marginTop: 10,
    },
    progressTitle: {
        fontWeight: 'bold',
        marginTop: 10,
    },
});

export default VersionListScreen;
