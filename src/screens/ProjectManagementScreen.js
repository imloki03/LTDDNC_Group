import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../components/Button';
import Drawer from '../components/Drawer';
import TaskTable from '../components/TaskTable';
import HorizontalVersionList from '../components/HorizontalVersionList';
import { getAllCollaborators } from '../api/collaboratorApi';
import {updateRender} from "../redux/slices/renderSlice";

const ProjectManagementScreen = ({ navigation }) => {
    const project = useSelector(state => state.project?.currentProject);
    const user = useSelector(state => state.user?.user);
    const render = useSelector(state => state.render?.isRender);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [currentCollab, setCurrentCollab] = useState(null);

    const toggleDrawer = () => {
        setIsDrawerVisible(!isDrawerVisible);
    };

    useEffect(() => {
        const fetchCollaborators = async () => {
            try {
                const collaborators = await getAllCollaborators(project?.id);
                const matchingCollab = collaborators.find(collab => collab?.username === user?.username);
                setCurrentCollab(matchingCollab);
            } catch (error) {
                console.error('Error fetching collaborators:', error);
            }
        };
        if (project?.id) {
            fetchCollaborators();
        }
    }, [project?.id, user?.username, render]);

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Action icon="menu" onPress={toggleDrawer} />
                <Appbar.Content title={project?.name} />
                <Appbar.Action icon="cogs" onPress={() => navigation.navigate("EditProject")} />
            </Appbar.Header>

            {isDrawerVisible && (
                <Drawer
                    navigation={navigation}
                    visible={isDrawerVisible}
                    currentScreen="Project"
                    onClose={() => setIsDrawerVisible(false)}
                />
            )}

            {/* Render TaskTable only when currentCollab is set */}
            {render && currentCollab && <TaskTable collabId={currentCollab?.id} />}

            {render && <HorizontalVersionList />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
    },
});

export default ProjectManagementScreen;
