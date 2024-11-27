import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getAllAssignedTask } from '../api/collaboratorApi';
import { format } from 'date-fns';
import {useSelector} from "react-redux";

const TaskTable = ({ collabId }) => {
    const [tasks, setTasks] = useState([]);
    const render = useSelector(state => state.render?.isRender);
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getAllAssignedTask(collabId);
                setTasks(data.data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchTasks();
    }, [collabId, render]);

    const renderTask = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.name}</Text>
            <Text style={styles.cell}>{item.priority}</Text>
            <Text style={styles.cell}>{format(new Date(item.startTime), 'dd/MM/yyyy HH:mm')}</Text>
            <Text style={styles.cell}>{format(new Date(item.endTime), 'dd/MM/yyyy HH:mm')}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Your Tasks</Text>
            <View style={styles.tableHeader}>
                <Text style={styles.headerCell}>Name</Text>
                <Text style={styles.headerCell}>Priority</Text>
                <Text style={styles.headerCell}>Start Time</Text>
                <Text style={styles.headerCell}>End Time</Text>
            </View>
            <FlatList
                data={tasks}
                renderItem={renderTask}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 10,
    },
    cell: {
        flex: 1,
    },
});

export default TaskTable;
