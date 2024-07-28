import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  ScrollView,
} from 'react-native';
import {styles} from './styles';
import {useGlobalState} from './GlobalState';
import {BleManager} from 'react-native-ble-plx';

const manager = new BleManager();

async function requestBluetoothPermissions() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Bluetooth Permission',
        message: 'This app needs access to your Bluetooth to scan for devices.',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
}

async function startScanningForDevices(
  setDevices: React.Dispatch<React.SetStateAction<Array<object>>>,
) {
  try {
    await manager.enable(); // Ensure Bluetooth is enabled
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Error during scan:', error);
        return;
      }

      if (device) {
        console.log('Found device:', device.name);
        setDevices((prevDevices: Array<object>) => [...prevDevices, device]);
      }
    });

    // Stop scanning after a certain period
    setTimeout(() => {
      manager.stopDeviceScan();
      console.log('Stopped scanning for devices');
    }, 10000); // Scanning for 10 seconds
  } catch (error) {
    console.error('Failed to start scanning:', error);
  }
}

function DeviceCard({device, index}: {device: object; index: number}) {
  const renderObject = (obj: {[key: string]: any}, parentKey = '') => {
    return Object.keys(obj)
      .filter(
        key => !key.startsWith('_manager') && !key.startsWith('_errorCodes'),
      )
      .map(key => {
        const value = obj[key];
        const displayKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof value === 'object' && value !== null) {
          return (
            <View key={displayKey} style={styles.sectionContainer}>
              <Text style={styles.deviceDetailsText}>{displayKey}:</Text>
              {renderObject(value, displayKey)}
            </View>
          );
        } else {
          return (
            <Text key={displayKey} style={styles.deviceDetailsText}>
              {displayKey}: {value}
            </Text>
          );
        }
      });
  };

  return (
    <View
      key={`${device.id || index}-${Math.random()}`}
      style={styles.sectionContainer}>
      {renderObject(device)}
    </View>
  );
}

const Connect = () => {
  const {devices, setDevices} = useGlobalState();
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    if (!permissionsGranted) {
      requestBluetoothPermissions()
        .then(granted => {
          if (granted) {
            setPermissionsGranted(true);
            startScanningForDevices(setDevices);
          } else {
            console.error('Bluetooth permissions not granted');
          }
        })
        .catch(error => console.error('Bluetooth permissions:', error));
    } else {
      startScanningForDevices(setDevices);
    }
  }, [permissionsGranted, setDevices]);

  return (
    <ScrollView>
      {devices.map((device, index) => (
        <DeviceCard
          key={`${index}-${Math.random()}`}
          device={device}
          index={index}
        />
      ))}
    </ScrollView>
  );
};

export default Connect;
