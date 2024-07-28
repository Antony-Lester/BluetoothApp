import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {DeviceInfo} from './App';
import {styles} from './styles';
const Device = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  useEffect(() => {
    BleManager.start({showAlert: false});

    const handlerDiscover = (device: {
      name: any;
      id: any;
      advertising: {
        isConnectable: any;
        manufacturerData: any;
        serviceUUIDs: any[];
      };
      rssi: number;
    }) => {
      if (device.name) {
        setDeviceInfo({
          name: device.name,
          id: device.id,
          type: device.advertising.isConnectable
            ? 'Connectable'
            : 'Non-Connectable',
          role: device.advertising.isConnectable ? 'Master' : 'Slave',
          state: '1: Discovery',
          rssi: device.rssi,
          manufacturerData: device.advertising.manufacturerData
            ? Buffer.from(device.advertising.manufacturerData).toString('hex')
            : null,
          serviceUUIDs: device.advertising.serviceUUIDs || null,
        });
      }
    };

    const handlerUpdate = (data: any) => {
      console.log('Received data from device:', data);
    };

    const bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager);
    const discoverSubscription = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handlerDiscover,
    );
    const updateSubscription = bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      handlerUpdate,
    );

    BleManager.scan([], 5, true).then(() => {
      console.log('Scanning...');
    });

    return () => {
      discoverSubscription.remove();
      updateSubscription.remove();
    };
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            {deviceInfo ? (
              <>
                <Text style={styles.sectionTitle}>Bluetooth Device Info</Text>
                {deviceInfo.name && <Text>Name: {deviceInfo.name}</Text>}
                {deviceInfo.id && <Text>ID: {deviceInfo.id}</Text>}
                {deviceInfo.type && <Text>Type: {deviceInfo.type}</Text>}
                {deviceInfo.role && <Text>Role: {deviceInfo.role}</Text>}
                {deviceInfo.state && <Text>State: {deviceInfo.state}</Text>}
                {deviceInfo.rssi !== null && (
                  <Text>RSSI: {deviceInfo.rssi}</Text>
                )}
                {deviceInfo.manufacturerData && (
                  <Text>Manufacturer Data: {deviceInfo.manufacturerData}</Text>
                )}
                {deviceInfo.serviceUUIDs && (
                  <Text>
                    Service UUIDs: {deviceInfo.serviceUUIDs.join(', ')}
                  </Text>
                )}
              </>
            ) : (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Bluetooth Device Info</Text>
                <Text style={styles.centerText}>No device connected</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Device;
