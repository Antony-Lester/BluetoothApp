import React from 'react';
import {View, Text} from 'react-native';
import {styles} from './styles';

const Data = () => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Device Data</Text>
      <Text style={styles.centerText}>No device connected</Text>
    </View>
  );
};

export default Data;
