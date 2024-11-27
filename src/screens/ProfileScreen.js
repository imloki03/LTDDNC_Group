import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TextInput,
    Text,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Appbar, Avatar, Button, Title, Portal, Modal, Checkbox } from 'react-native-paper';
import { getUserInfo, updateAvatar, editProfile, EditProfileRequest } from '../api/userApi';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { getAllTags } from "../api/tagApi";
import DropdownTextField from '../components/DropdownTextField';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebaseService';
import ProfileField from '../components/ProfileField';
import {useSelector} from "react-redux";
import BottomNav from "../components/BottomNav";

const editProfileValidationSchema = Yup.object().shape({
    name: Yup.string().required('Full name is required'),
    gender: Yup.string()
        .oneOf(['Male', 'Female', 'Other'], 'Invalid gender')
        .required('Gender is required'),
});

const ProfileScreen = () => {
    const username  = useSelector(state => (state.user.user.username))
    const [user, setUser] = useState(null);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUserInfo();
        fetchTags();
    }, [username]);

    const fetchUserInfo = async () => {
        try {
            const data = (await getUserInfo(username)).data;
            setUser(data);
            setSelectedTags(data.tagList || []);
        } catch (error) {
            Alert.alert('Error', 'Unable to fetch user info.');
            console.error('Error fetching user info:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTags = async () => {
        try {
            const allTags = (await getAllTags()).data;
            setTags(Array.isArray(allTags) ? allTags : []);
        } catch (error) {
            console.error('Error fetching tags:', error);
            setTags([]);
        }
    };

    const handleSaveProfile = async (values) => {
        try {
            const tagIds = selectedTags.map((tag) => tag.id);
            const editProfileRequest = EditProfileRequest(values.name, values.gender, tagIds);
            await editProfile(username, editProfileRequest);
            setUser((prevUser) => ({
                ...prevUser,
                name: values.name,
                gender: values.gender,
                tagList: selectedTags,
            }));

            setIsEditing(false);
            Alert.alert('Success', 'Profile updated successfully.');
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile.');
        }
    };

    const selectAvatar = async () => {
        const hasPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            const newAvatarUri = result.assets[0].uri;
            const response = await fetch(newAvatarUri);
            const blob = await response.blob();
            const avatarRef = ref(storage, `avatars/${username}/${Date.now()}`);

            try {
                const snapshot = await uploadBytes(avatarRef, blob);
                const downloadURL = await getDownloadURL(snapshot.ref);
                await updateAvatar(username, { avatarURL: downloadURL });
                setUser((prevUser) => ({ ...prevUser, avatarURL: downloadURL }));

                Alert.alert('Success', 'Avatar updated successfully.');
            } catch (error) {
                console.error('Error uploading or updating avatar:', error);
                Alert.alert('Error', 'Failed to update avatar.');
            }
        }
    };

    const renderTags = (tags) => (
        <>
            {Array.isArray(tags) && tags.length > 0 ? (
                tags.map((tag) => (
                    <ProfileField key={tag.id} label={tag.name} value={tag.description} icon="tag" />
                ))
            ) : (
                <Title>No tags available</Title>
            )}
        </>
    );

    const handleTagSelect = (tag) => {
        if (selectedTags.some(selected => selected.id === tag.id)) {
            setSelectedTags(prev => prev.filter(selected => selected.id !== tag.id));
        } else {
            setSelectedTags(prev => [...prev, tag]);
        }
    };

    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <ActivityIndicator style={styles.loader} />;
    }

    if (!user) {
        return (
            <View style={styles.errorContainer}>
                <Appbar.Header>
                    <Appbar.Content title="Profile" />
                </Appbar.Header>
                <View style={styles.center}>
                    <Button onPress={fetchUserInfo}>Retry</Button>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Main content */}
            <View style={styles.mainContent}>
                <Appbar.Header>
                    <Appbar.Content title="Profile" />
                    <Appbar.Action icon="pencil" onPress={() => setIsEditing(true)} />
                </Appbar.Header>

                <View style={styles.avatarContainer}>
                    <TouchableOpacity onPress={selectAvatar}>
                        <Avatar.Image
                            size={120}
                            source={{ uri: user.avatarURL || 'https://via.placeholder.com/120' }}
                        />
                    </TouchableOpacity>
                </View>

                <Formik
                    initialValues={{ name: user.name || '', gender: user.gender || '' }}
                    validationSchema={editProfileValidationSchema}
                    onSubmit={handleSaveProfile}
                >
                    {({ handleChange, handleSubmit, values, errors, touched }) => (
                        <Portal>
                            <Modal visible={isEditing} onDismiss={() => setIsEditing(false)} contentContainerStyle={styles.modal}>
                                <Title style={styles.modalTitle}>Edit Profile</Title>

                                <Text style={styles.label}>Name</Text>
                                <TextInput
                                    value={values.name}
                                    onChangeText={handleChange('name')}
                                    style={styles.input}
                                    placeholder="Enter your name"
                                />
                                {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

                                <Text style={styles.label}>Gender</Text>
                                <DropdownTextField
                                    selectedValue={values.gender}
                                    onValueChange={handleChange('gender')}
                                    options={[
                                        { label: 'Male', value: 'Male' },
                                        { label: 'Female', value: 'Female' },
                                        { label: 'Other', value: 'Other' },
                                    ]}
                                />
                                {touched.gender && errors.gender && <Text style={styles.error}>{errors.gender}</Text>}

                                {/*<Text style={styles.label}>Tags</Text>*/}
                                {/*<TextInput*/}
                                {/*    mode="outlined"*/}
                                {/*    placeholder="Search tags..."*/}
                                {/*    value={searchQuery}*/}
                                {/*    onChangeText={setSearchQuery}*/}
                                {/*    style={styles.input}*/}
                                {/*/>*/}
                                {/*<ScrollView>*/}
                                {/*    {filteredTags.map(tag => (*/}
                                {/*        <View key={tag.id} style={styles.checkboxContainer}>*/}
                                {/*            <Checkbox*/}
                                {/*                status={selectedTags.some(selected => selected.id === tag.id) ? 'checked' : 'unchecked'}*/}
                                {/*                onPress={() => handleTagSelect(tag)}*/}
                                {/*            />*/}
                                {/*            <Text>{tag.name}</Text>*/}
                                {/*        </View>*/}
                                {/*    ))}*/}
                                {/*</ScrollView>*/}

                                <Button mode="contained" onPress={handleSubmit} style={styles.saveButton}>
                                    Save
                                </Button>
                            </Modal>
                        </Portal>
                    )}
                </Formik>

                <ProfileField label="Username" value={user.username} icon="account" />
                <ProfileField label="Full name" value={user.name} icon="account-box" />
                <ProfileField label="Email" value={user.email} icon="email" />
                <ProfileField label="Gender" value={user.gender} icon="gender-male-female" />
            </View>

            {/* Bottom Navigation */}
            <View style={styles.bottomNavContainer}>
                <BottomNav currentRoute="profile" />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    avatarContainer: { alignItems: 'center', marginVertical: 20 },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    center: { justifyContent: 'center', alignItems: 'center' },
    modal: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10 },
    modalTitle: { textAlign: 'center', marginBottom: 20 },
    input: { marginBottom: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10 },
    error: { color: 'red', marginBottom: 10 },
    saveButton: { marginTop: 20 },
    label: { fontWeight: 'bold', marginBottom: 5 },
    checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    tagHeader: { marginTop: 20, marginLeft: 20, fontSize: 24 },
    logoutButton: { marginTop: 20, alignSelf: 'center' },
    mainContent: { flex: 1, paddingBottom: 60 }, // Give space for bottom navigation
    bottomNavContainer: { paddingTop: 69 }, // Adds spacing to the bottom nav
});


export default ProfileScreen;
