import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Modal, StyleSheet } from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import { getAllTasks, createTask, updateTask, moveTaskToPhase, deleteTask } from '../api/backlogApi';
import { getAllCollaborators } from '../api/collaboratorApi';
import { getAllPhases } from '../api/phaseApi'
import Button from '../components/Button';
import TextField from '../components/TextField';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import Drawer from "../components/Drawer";
import { Appbar } from 'react-native-paper';
import {updateRender} from "../redux/slices/renderSlice";

const BacklogManagementScreen = ({navigation}) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);
  const [isMovingTask, setIsMovingTask] = useState(false);

  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskType, setTaskType] = useState('TASK')
  const [taskPriority, setTaskPriority] = useState('MEDIUM');
  const [assignee, setAssignee] = useState('');
  const [selectedPhase, setSelectedPhase] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const dispatch = useDispatch();
  const [collabs, setCollabs] = useState([])
  const [phases, setPhases] = useState([])

  const [modalVisible, setModalVisible] = useState(false);

  const project = useSelector((state) => state.project.currentProject);
  const user = useSelector((state) => state.user.user);

  const formatDateTime = (date) => format(date, 'dd/MM/yyyy   HH:mm');

  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const toggleDrawer = () => {
    setIsDrawerVisible(!isDrawerVisible);
  };

  useEffect(() => {
    dispatch(updateRender());
    loadTasks();
  }, []);

  useEffect(() => {
    loadCollabs();
  }, []);

  useEffect(() => {
    loadPhases();
  }, []);

  const loadCollabs = async () => {
    try {
      const allCollabs = await getAllCollaborators(project.id);
      console.log(allCollabs)
      setCollabs(allCollabs)
      setAssignee(allCollabs[0].username)
      console.log("assignee: "+allCollabs[0].username)
    } catch (error) {
      console.error('Failed to load collabs:', error);
    }
  };

  const loadPhases = async () => {
    try {
      const allPhases = await getAllPhases(project.id);
      console.log(allPhases[0].id+"-----")
      setSelectedPhase(allPhases[0])
      setPhases(allPhases)
    } catch (error) {
      console.error('Failed to load phases:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const allTasks = await getAllTasks(project.id);
      setTasks(allTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const handleCreateTask = async () => {
    if (!taskName || !taskDescription) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    try {
      await createTask(project.id, {
        name: taskName,
        type: taskType,
        description: taskDescription,
        priority: taskPriority,
        parentTaskId: selectedTask?selectedTask.id:null
      });
      Alert.alert("Success", `New ${taskType} was created successfully!`);
      loadTasks();
      closeTaskModal();
    } catch (error) {
      console.error("Failed to create Task:", error);
    }
  };

  const handleUpdateTask = async () => {
    if (!taskName || !taskDescription || !taskPriority) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    try {
      await updateTask(project.id, selectedTask.id, {
        name: taskName,
        type: taskType,
        description: taskDescription,
        //startTime: startDate,
        //endTime: endDate,
        priority: taskPriority,
        //assigneeUsername: assignee
      });
      Alert.alert("Success", "Update task successfully.");
      loadTasks();
      closeUpdateTaskModal();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleMoveTask = async () => {
    if (!taskName || !taskDescription || !taskPriority) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    try {
      await updateTask(project.id, selectedTask.id, {
        name: taskName,
        type: taskType,
        description: taskDescription,
        startTime: startDate,
        endTime: endDate,
        priority: taskPriority,
        assigneeUsername: assignee
      });
      //console.log(selectedPhase);
      await moveTaskToPhase(selectedTask.id, selectedPhase.id);
      Alert.alert("Success", "Task moved successfully.");
      loadTasks();
      closeMoveTaskModal();
    } catch (error) {
      console.error("Failed to move task:", error);
    }
  };
  
  const handleDeleteTask = async () => {
    try {
      await deleteTask(selectedTask.id)
      Alert.alert("Success", "Task deleted successfully.");
      loadTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  }

  const openTaskModal = (task) => {
    setSelectedTask(task);
    setIsCreatingTask(true);
  };

  const closeTaskModal = () => {
    setIsCreatingTask(false);
    resetForm();
  };

  const openUpdateTaskModal = (task) => {
    setSelectedTask(task);
    setTaskName(task.name);
    setTaskDescription(task.description);
    setTaskType(task.type)
    setTaskPriority(task.priority);
    setIsUpdatingTask(true);
  };

  const closeUpdateTaskModal = () => {
    setIsUpdatingTask(false);
    resetForm();
  };

  const openMoveTaskModal = (task) => {
    setSelectedTask(task);
    setTaskName(task.name);
    setTaskDescription(task.description);
    setTaskType(task.type)
    setTaskPriority(task.priority);
    setIsMovingTask(true);
  };

  const closeMoveTaskModal = () => {
    setIsMovingTask(false);
    resetForm();
  };

  const resetForm = () => {
    setTaskName('');
    setTaskDescription('');
    setTaskType('TASK');
    setTaskPriority('MEDIUM');
  };
  
  const getTaskDepth = (task, tasks) => {
    let depth = 0;
    while (task.parentTaskId) {
      depth++;
      task = tasks.find(t => t.id === task.parentTaskId);
    }
    return depth;
  };

  const renderTask = ({ item }) => {
    const depth = getTaskDepth(item, tasks);
    console.log(depth)
    const handleOptionSelect = (option) => {
      setModalVisible(false);
      // setSelectedTask(item);
      // console.log("---"+selectedTask.name)
      switch (option) {
        case 'Edit':
          openUpdateTaskModal(selectedTask);
          break;
        case 'Move':
          openMoveTaskModal(selectedTask);
          break;
        case 'Delete':
          handleDeleteTask();
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
        <TouchableOpacity onPress={() => openTaskModal(item)}>
          <Text style={styles.plusSign}>+ </Text>
        </TouchableOpacity>
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
              <TouchableOpacity onPress={() => handleOptionSelect('Edit')}>
                <Text style={styles.optionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleOptionSelect('Move')}>
                <Text style={styles.optionText}>Move</Text>
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
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={toggleDrawer} />
        <Appbar.Content title="Backlog Management" />
      </Appbar.Header>

      {isDrawerVisible && (
          <Drawer
              navigation={navigation}
              visible={isDrawerVisible}
              currentScreen="Backlog"
              onClose={() => setIsDrawerVisible(false)}
          />
      )}

      <Button title="+ New issue" onPress={() => openTaskModal(null) } />
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id.toString()}
      />

      <Modal visible={isCreatingTask} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Create New Task</Text>
          <TextField label="Task Name" value={taskName} onChangeText={setTaskName} />
          <TextField label="Description" value={taskDescription} onChangeText={setTaskDescription} multiline />

          <Text style={styles.label}>Type</Text>
          <Picker
            selectedValue={taskType}
            onValueChange={(value) => setTaskType(value)}
          >
            <Picker.Item label="Story" value="STORY" />
            <Picker.Item label="Task" value="TASK" />
            <Picker.Item label="Bug" value="BUG" />
          </Picker>

          <Text style={styles.label}>Priority</Text>
          <Picker
            selectedValue={taskPriority}
            onValueChange={(value) => setTaskPriority(value)}
          >
            <Picker.Item label="Very High" value="VERY_HIGH" />
            <Picker.Item label="High" value="HIGH" />
            <Picker.Item label="Medium" value="MEDIUM" />
            <Picker.Item label="Low" value="LOW" />
            <Picker.Item label="Very Low" value="VERY_LOW" />
          </Picker>

          <Button title="Create" onPress={handleCreateTask} />
          <Button title="Cancel" onPress={closeTaskModal} />
        </View>
      </Modal>

      <Modal visible={isUpdatingTask} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Update Task</Text>
          <TextField label="Task Name" value={taskName} onChangeText={setTaskName} />
          <TextField label="Description" value={taskDescription} onChangeText={setTaskDescription} multiline />
          
          <Text style={styles.label}>Type</Text>
          <Picker
            selectedValue={taskType}
            onValueChange={(value) => setTaskType(value)}
          >
            <Picker.Item label="Story" value="STORY" />
            <Picker.Item label="Task" value="TASK" />
            <Picker.Item label="Bug" value="BUG" />
          </Picker>

          <Text style={styles.label}>Priority</Text>
          <Picker
            selectedValue={taskPriority}
            onValueChange={(value) => setTaskPriority(value)}
          >
            <Picker.Item label="Very High" value="VERY_HIGH" />
            <Picker.Item label="High" value="HIGH" />
            <Picker.Item label="Medium" value="MEDIUM" />
            <Picker.Item label="Low" value="LOW" />
            <Picker.Item label="Very Low" value="VERY_LOW" />
          </Picker>

          <Button title="Save" onPress={handleUpdateTask} />
          <Button title="Cancel" onPress={closeUpdateTaskModal} />
        </View>
      </Modal>

      <Modal visible={isMovingTask} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Move task</Text>
          <TextField label="Task Name" value={taskName} onChangeText={setTaskName} />
          <TextField label="Description" value={taskDescription} onChangeText={setTaskDescription} multiline />
          
          <Text style={styles.label}>Type</Text>
          <Picker
            selectedValue={taskType}
            onValueChange={(value) => setTaskType(value)}
          >
            <Picker.Item label="Story" value="STORY" />
            <Picker.Item label="Task" value="TASK" />
            <Picker.Item label="Bug" value="BUG" />
          </Picker>

          <Text style={styles.label}>Priority</Text>
          <Picker
            selectedValue={taskPriority}
            onValueChange={(value) => setTaskPriority(value)}
          >
            <Picker.Item label="Very High" value="VERY_HIGH" />
            <Picker.Item label="High" value="HIGH" />
            <Picker.Item label="Medium" value="MEDIUM" />
            <Picker.Item label="Low" value="LOW" />
            <Picker.Item label="Very Low" value="VERY_LOW" />
          </Picker>

          <Text style={styles.label}>Move to phase</Text>
          <Picker
            selectedValue={selectedPhase}
            onValueChange={(value) => setSelectedPhase(value)}
          >
            {phases.map(phase => (
              <Picker.Item key={phase.id} label={phase.name} value={phase.name} />
            ))}
          </Picker>

          <Text style={styles.label}>Assignee</Text>
          <Picker
            selectedValue={assignee}
            onValueChange={(value) => setAssignee(value)}
          >
            {collabs.map(collab => (
              <Picker.Item key={collab.userId} label={collab.name} value={collab.username} />
            ))}
          </Picker>

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
                onChange={(event, date) => {
                  setShowStartDatePicker(false);
                  if (date) {
                    const newDate = new Date(startDate);
                    newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                    setStartDate(newDate);
                    setShowStartTimePicker(true);
                  }
                }}
              />
            )}

            {showStartTimePicker && (
              <DateTimePicker
                value={startDate}
                mode="time"
                display="default"
                onChange={(event, time) => {
                  setShowStartTimePicker(false);
                  if (time) {
                    const newDate = new Date(startDate);
                    newDate.setHours(time.getHours(), time.getMinutes());
                    setStartDate(newDate);
                  }
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
                onChange={(event, date) => {
                  setShowEndDatePicker(false);
                  if (date) {
                    const newDate = new Date(endDate);
                    newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                    setEndDate(newDate);
                    setShowEndTimePicker(true);
                  }
                }}
              />
            )}

            {showEndTimePicker && (
              <DateTimePicker
                value={endDate}
                mode="time"
                display="default"
                onChange={(event, time) => {
                  setShowEndTimePicker(false);
                  if (time) {
                    const newDate = new Date(endDate);
                    newDate.setHours(time.getHours(), time.getMinutes());
                    setEndDate(newDate);
                  }
                }}
              />
            )}
          </View>

          <Button title="Move" onPress={handleMoveTask} />
          <Button title="Cancel" onPress={closeMoveTaskModal} />
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal : 5,
    backgroundColor: '#fff',
  },
  taskCard: {
    flexDirection: 'row',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  plusSign: {
    fontSize: 24,
    color: '#00f',
    marginRight: 8,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: 200,
  },
  optionText: {
    paddingVertical: 10,
    fontSize: 18,
    textAlign: 'center',
  },
});


export default BacklogManagementScreen;
