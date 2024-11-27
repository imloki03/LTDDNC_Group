import React, { useEffect } from 'react';
import { BottomNavigation } from 'react-native-paper';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

const BottomNav = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [index, setIndex] = React.useState(1); // Default to Home

    const routes = [
        { key: 'profile', title: 'Profile', focusedIcon: 'account', unfocusedIcon: 'account-outline', color: '#4CAF50' },
        { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline', color: '#2196F3' },
        { key: 'logout', title: 'Logout', focusedIcon: 'logout', unfocusedIcon: 'logout', color: '#F44336' },
    ];

    useFocusEffect(
        React.useCallback(() => {
            const routeIndex = routes.findIndex(routeItem => routeItem.key === route.name.toLowerCase());
            if (routeIndex !== -1) setIndex(routeIndex);
        }, [route.name])
    );

    const handleIndexChange = (newIndex) => {
        setIndex(newIndex);
        switch (routes[newIndex].key) {
            case 'profile':
                navigation.navigate('Profile');
                break;
            case 'home':
                navigation.navigate('Home');
                break;
            case 'logout':
                navigation.navigate('Login');
                break;
            default:
                break;
        }
    };

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={handleIndexChange}
            renderScene={() => null}
            shifting={true}
            activeColor="black"
            inactiveColor="gray"
            barStyle={{ backgroundColor: 'white' }}
        />
    );
};

export default BottomNav;
