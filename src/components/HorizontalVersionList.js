import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Text, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { getVersionsByProject } from '../api/versionApi';

const HorizontalVersionList = () => {
    const [versions, setVersions] = useState([]);
    const navigation = useNavigation();
    const render = useSelector(state => state.render?.isRender);
    const projectId = useSelector(state => state.project?.currentProject?.id);
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef(null);
    const autoScrollInterval = useRef(null);
    let currentIndex = useRef(0);

    const fetchVersions = async () => {
        try {
            if (projectId) {
                const data = await getVersionsByProject(projectId);
                setVersions(data.data);
            }
        } catch (error) {
            console.error('Error fetching versions:', error);
        }
    };

    useEffect(() => {
        fetchVersions();
    }, [projectId], render);

    useEffect(() => {
        startAutoScroll();
        return () => clearInterval(autoScrollInterval.current);
    }, [versions], render);

    const startAutoScroll = () => {
        if (versions.length > 1) {
            autoScrollInterval.current = setInterval(() => {
                if (flatListRef.current) {
                    currentIndex.current = (currentIndex.current + 1) % 5;
                    flatListRef.current.scrollToIndex({
                        index: currentIndex.current,
                        animated: true,
                    });
                }
            }, 1250);
        }
    };

    const handleCardPress = (versionId) => {
        navigation.navigate('Version', { versionId });
    };

    const handleMorePress = () => {
        navigation.navigate('Version');
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleCardPress(item.id)} style={styles.card}>
            <Text style={styles.cardTitle}>{item.name || 'Unnamed Version'}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.header}>Your Project Targets</Text>
                {versions.length > 5 && (
                    <TouchableOpacity onPress={handleMorePress} style={styles.moreButton}>
                        <Text style={styles.moreText}>More</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.listContainer}>
                <Animated.FlatList
                    ref={flatListRef}
                    horizontal
                    data={versions.slice(0, 5)}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        padding: 10,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    listContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    card: {
        width: 140,
        marginVertical: 5,
        marginHorizontal: 5,
        paddingVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        borderColor: '#dddddd',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    moreButton: {
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    moreText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default HorizontalVersionList;
