// /screens/CreateProjectScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/Button';
import TextField from '../components/TextField';
import { createNewProject } from '../redux/slices/projectSlice';

const CreateProjectScreen = ({ navigation }) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);

  const handleCreateProject = async () => {
    if (!projectName || !description) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      dispatch(createNewProject({ projectOwner: user.username, name: projectName, description }));

      navigation.navigate('Project', { screen: 'Edit' });
    } catch (error) {
      Alert.alert("Error", "Failed to create project. Please try again.");
      console.error('Create project error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Project</Text>
      <TextField
        label="Project Name"
        value={projectName}
        onChangeText={setProjectName}
      />
      <TextField
        label="Short Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Button title="Create" onPress={handleCreateProject} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
});

export default CreateProjectScreen;
