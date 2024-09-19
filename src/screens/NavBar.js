import React, { useMemo } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useNavBarContext } from './NavBarContext';

const NavBar = () => {
  const navigation = useNavigation();
  const { activeKey, setActiveKey } = useNavBarContext();
  const [scales, setScales] = React.useState({
    user: new Animated.Value(1),
    home: new Animated.Value(1),
    bell: new Animated.Value(1),
  });

  const handlePressIn = (key) => {
    Animated.spring(scales[key], {
      toValue: 1.2,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (key) => {
    Animated.spring(scales[key], {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleNavigation = (key) => {
    setActiveKey(key);
    switch (key) {
      case 'user':
        navigation.navigate('EditProfile');
        break;
      case 'home':
        navigation.navigate('Home');
        break;
      case 'bell':
        navigation.navigate('Home');
        break;
      default:
        break;
    }
  };

  const buttons = useMemo(() => [
    { key: 'user', icon: 'user' },
    { key: 'home', icon: 'home' },
    { key: 'bell', icon: 'bell' },
  ], []);

  return (
    <View style={styles.container}>
      {buttons.map((button) => (
        <TouchableOpacity
          key={button.key}
          onPressIn={() => handlePressIn(button.key)}
          onPressOut={() => handlePressOut(button.key)}
          onPress={() => handleNavigation(button.key)}
          style={styles.button}
        >
          <Animated.View
            style={[
              styles.iconContainer,
              { transform: [{ scale: scales[button.key] }] },
              activeKey === button.key && styles.activeButton,
            ]}
          >
            <FontAwesome
              name={button.icon}
              size={30}
              color={activeKey === button.key ? '#00f' : '#ffffff'}
            />
          </Animated.View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingVertical: 10,
  },
  button: {
    alignItems: 'center',
  },
  iconContainer: {
    borderRadius: 30,
    padding: 10,
  },
  activeButton: {
    backgroundColor: '#444',
  },
});

export default NavBar;
