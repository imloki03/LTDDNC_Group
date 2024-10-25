import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Appbar, Button, TextInput, List } from 'react-native-paper';

const WorkspaceScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), name: task }]);
      setTask('');
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Workspace" />
      </Appbar.Header>
      <View style={styles.inputContainer}>
        <TextInput
          label="New Task"
          value={task}
          onChangeText={setTask}
          style={styles.input}
        />
        <Button mode="contained" onPress={addTask}>
          Add Task
        </Button>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <List.Item title={item.name} />
        )}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  list: {
    padding: 16,
  },
});

export default WorkspaceScreen;
