import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StyleSheet, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { assignTask, updateTaskStatus, moveTaskToBacklog, getAllTasksInPhase } from '../api/phaseApi'; 
import { getAllCollaborators } from '../api/collaboratorApi'
import { Picker } from '@react-native-picker/picker';
import {updateRender} from "../redux/slices/renderSlice";
//chỉnh lại screen để giống bên backlog, test tính năng

const DetailPhaseScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { phaseId } = route.params;
  const projectId = useSelector((state) => state.project.currentProject.id);
  const dispatch = useDispatch();
  const [collaborators, setCollaborators] = useState();
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [isAssigneeVisible, setIsAssigneeVisible] = useState(false)
  const [isStatusVisible, setIsStatusVisible] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  
  useEffect(() => {
    loadCollabs();
    loadTasksOfPhase();
    const status_option = [
      { label: "To do", value: "TODO" },
      { label: "In progress", value: "IN_PROGRESS" },
      { label: "Done", value: "DONE" },
    ]
    setStatus(status_option)
  }, [phaseId]);

  const loadCollabs = async () => {
    try {
      const allCollabs = await getAllCollaborators(projectId);
      const options = allCollabs.map(user => ({
        label: user.name,
        value: user.username,
      }));  
      setSelectedAssignee(options[0]?.value)
      setCollaborators(options)
    } catch (error) {
      console.error('Failed to load collabs:', error);
    }
  };

  const loadTasksOfPhase = async () => {
    try {
        const allTasks = await getAllTasksInPhase(projectId, phaseId);
        setTasks(allTasks);
    } catch (error) {
        console.error('Failed to load tasks:', error);
    }
    finally {
      dispatch(updateRender());
    }
  }

  const handleAssignTask = async (colabId) => {
    await assignTask(projectId, phaseId, selectedTask.id, colabId);
    loadTasksOfPhase()
  };

  const handleChangeTaskStatus = async (status) => {
    await updateTaskStatus(projectId, phaseId, selectedTask.id, status);
    loadTasksOfPhase()
  };

  const handleMoveToBacklog = async () => {
    await moveTaskToBacklog(projectId, phaseId, selectedTask.id);
    Alert.alert("Success", 'Task has been moved to backlog!');
    loadTasksOfPhase()
  };


  const getTaskDepth = (task, tasks) => {
    let depth = 0;
    while (task.parentTaskId) {
      depth++;
      task = tasks.find(t => t.id === task.parentTaskId);
    }
    return depth;
  };

  const PickerModal = ({ visible, onClose, options, selectedValue, onValueChange }) => {
    return (
      <Modal visible={visible} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Picker
              selectedValue={selectedValue}
              onValueChange={onValueChange}
              style={styles.picker}
            >
              {options?.map((option) => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const handleSelectAssignee = async (value) => {
    setIsAssigneeVisible(false)
    await handleAssignTask(value)
    Alert.alert("Success", "Task assigned successfully.");
  }

  const handleSelectStatus = async (status) => {
    setIsStatusVisible(false)
    await handleChangeTaskStatus(status)
    Alert.alert("Success", "Task status change successfully.");
  }

  const renderTask = ({ item }) => {
    const depth = getTaskDepth(item, tasks);
    const handleOptionSelect = (option) => {
      setModalVisible(false);
      switch (option) {
        case 'Assign':
          setIsAssigneeVisible(true)
          break;
        case 'Change status':
          setIsStatusVisible(true)
          break;
        case 'Move':
          handleMoveToBacklog()
          break;
        case 'Cancel':
          setModalVisible(false);
          break;
        default:
          break;
      }
    };
  
    return (
      <View style={[styles.taskCard, { marginLeft: depth * 20 }]}>
        <TouchableOpacity style={styles.taskContent} onLongPress={() => openTaskModal(item)}>
          <Text style={styles.taskTitle}>{item.name}</Text>
          <Text style={styles.taskDescription}>{item.description}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreOptions} onPress={() => {
          setSelectedTask(item)
          setModalVisible(true)
        }}>
          <Text style={styles.moreOptionsText}>...</Text>
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => handleOptionSelect('Assign')}>
                <Text style={styles.optionText}>Assign</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleOptionSelect('Change status')}>
                <Text style={styles.optionText}>Change status</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleOptionSelect('Move')}>
                <Text style={styles.optionText}>Move</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleOptionSelect('Cancel')}>
                  <Text style={styles.optionText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tasks List</Text>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id.toString()}
      />

    <PickerModal
      visible={isAssigneeVisible}
      onClose={() => setIsAssigneeVisible(false)}
      options={collaborators}
      selectedValue={selectedAssignee}
      onValueChange={(value) => handleSelectAssignee(value)}
    />

    <PickerModal
      visible={isStatusVisible}
      onClose={() => setIsStatusVisible(false)}
      options={status}
      selectedValue={"TODO"}
      onValueChange={(value) => handleSelectStatus(value)}
    />
    </View> 
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskCard: {
    flexDirection: 'row',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 4,
    textAlign: 'center',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 14,
    color: '#555',
  },
  moreOptions: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreOptionsText: {
    fontSize: 20,
    color: '#888',
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginTop: 16,
  },
  // moreOptions: {
  //   padding: 10,
  // },
  // moreOptionsText: {
  //   fontSize: 20,
  //   color: '#333',
  // },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: 200,
  },
  plusSign: {
    fontSize: 24,
    color: '#00f',
    marginRight: 8,
  },
  optionText: {
    paddingVertical: 10,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default DetailPhaseScreen;


