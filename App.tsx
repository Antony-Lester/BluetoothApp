import React from 'react';
import {View, TouchableOpacity, Text, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {GlobalStateProvider, useGlobalState} from './GlobalState';
// Pages
import Device from './Device';
import Data from './Data';
import Connect from './Connect';
import {styles} from './styles';

const buttons = [
  {label: 'Device', screen: 'Device'},
  {label: 'Data', screen: 'Data'},
  {label: 'Connect', screen: 'Connect'},
];

const App = () => {
  const {isConnected, currentScreen, setCurrentScreen} = useGlobalState();

  const renderScreen = () => {
    if (!isConnected) {
      return <Connect />;
    }
    switch (currentScreen) {
      case 'Device':
        return <Device />;
      case 'Data':
        return <Data />;
      case 'Connect':
      default:
        return <Connect />;
    }
  };

  return (
    <GlobalStateProvider>
      <NavigationContainer>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <View style={styles.container}>
          <View style={styles.screenContainer}>{renderScreen()}</View>
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentScreen(button.screen)}
                style={styles.button}>
                <Text style={styles.buttonText}>{button.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </NavigationContainer>
    </GlobalStateProvider>
  );
};

export default App;
