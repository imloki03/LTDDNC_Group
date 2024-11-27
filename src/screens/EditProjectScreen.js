// /screens/EditProjectScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, TouchableOpacity, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProject, updateProjectImage, updateProjectInfo, removeProject } from '../redux/slices/projectSlice';
import Button from '../components/Button';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebaseService';

const EditProjectScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const projectOwner = useSelector(state => state.user.user.username);
  const currentProject = useSelector(state => state.project.currentProject);

  const projectId = currentProject?.id;
  
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [urlEndpoint, setUrlEndpoint] = useState('');
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (projectOwner && projectId) {
      dispatch(fetchProject({ projectOwner, projectId }));
    }
  }, [dispatch, projectOwner, projectId]);

  useEffect(() => {
    if (currentProject) {
      setProjectName(currentProject.name || '');
      setDescription(currentProject.description || '');
      setUrlEndpoint(currentProject.urlName || '');
      setAvatar(currentProject.avatarURL+"?t="+new Date().getTime().toString() || null);
    }
  }, [currentProject]);

  const handleSaveInfo = () => {
    dispatch(updateProjectInfo({ 
      projectId, 
      projectInfo: { name: projectName, description, urlEndpoint } 
    })).then(() => {
      Alert.alert("Success", "Project information updated successfully!");
    });
  };

  const handleEditAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      setAvatar(null);
      // Create a Firebase storage reference and upload the image
      const storageRef = ref(storage, `projectAvatars/${currentProject.name}_avatar.jpg`);
      await uploadBytes(storageRef, blob);

      // Get the download URL
      const imageUrl = await getDownloadURL(storageRef);


      // Update project image with Firebase URL in the database
      dispatch(updateProjectImage({ projectId, imageUrl })).then(() => {
        Alert.alert("Success", "Project image updated successfully!");
      });
    }
  };

  const handleDeleteProject = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this project?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            dispatch(removeProject(projectId)).then(() => {
              Alert.alert("Success", "Project deleted successfully!");
              navigation.navigate('Home')
            });
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Project</Text>
      
      {/* Avatar Section */}
      <TouchableOpacity onPress={handleEditAvatar} style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <Text style={styles.avatarPlaceholder}>Edit Avatar</Text>
        )}
      </TouchableOpacity>
      
      {/* Project Information Form */}
      <TextInput
        style={styles.input}
        placeholder="Project Name"
        value={projectName}
        onChangeText={setProjectName}
      />
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="URL Endpoint"
        value={urlEndpoint}
        onChangeText={setUrlEndpoint}
      />

      {/* Buttons */}
      <Button title="Save" onPress={handleSaveInfo} />
      <Button title="Delete Project" onPress={handleDeleteProject} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    textAlign: 'center',
    lineHeight: 100,
    color: '#666',
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
});

export default EditProjectScreen;
