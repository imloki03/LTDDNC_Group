import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../components/Button';
import ProjectCard from '../components/ProjectCard';
import { fetchProject, fetchAllProjects, updateCurrentProject } from '../redux/slices/projectSlice';
import BottomNav from "../components/BottomNav";
import {Appbar} from "react-native-paper";

const WorkspaceScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const projects = useSelector((state) => state.project.allProjects);
    const currentProject = useSelector((state) => state.project.currentProject);
    const user = useSelector((state) => state.user.user);
    const projectOwner = useSelector(state => state.user.user);

    useEffect(() => {
        if (user) {
            dispatch(fetchAllProjects(user?.username));
        }
    }, [currentProject, user]);

    const handleCreateProject = () => {
        navigation.navigate('NewProject');
    };

    const handleNavProject = (id) => {
        dispatch(fetchProject({ projectOwner: projectOwner.username, projectId: id }));
        dispatch(updateCurrentProject(id));
        navigation.navigate('Project');
    };

    const renderProject = ({ item }) => (
        <ProjectCard project={item} onPress={() => handleNavProject(item?.id)} />
    );

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Workspace" style={styles.title} />
                {/* Create Project Button */}
                <Button title="+ Project" onPress={handleCreateProject} style={styles.createButton} />
            </Appbar.Header>


            {/* Project List */}
            <View style={styles.listContainer}>
                <FlatList
                    data={projects}
                    renderItem={renderProject}
                    keyExtractor={(item) => item?.id.toString()}
                    contentContainerStyle={styles.projectList}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text style={styles.emptyText}>No projects available.</Text>}
                />
            </View>

            {/* Bottom Navigation Bar */}
            <BottomNav currentRoute="home" style={styles.bottomNav} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    createButton: {
        marginBottom: 16,
    },
    listContainer: {
        flex: 7
    },
    projectList: {
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#999',
    },
    bottomNav: {
        flex: 2
    },
});

export default WorkspaceScreen;
