import React, {createContext, useState, useContext, ReactNode} from 'react';

interface DeviceInfo {
  // Define the structure of deviceInfo here
}

interface GlobalState {
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
  deviceInfo: DeviceInfo[] | null;
  setDeviceInfo: (info: DeviceInfo[] | null) => void;
  devices: DeviceInfo[];
  setDevices: (devices: DeviceInfo[]) => void;
  deviceData: string | null;
  setDeviceData: (data: string | null) => void;
}

const defaultGlobalState: GlobalState = {
  currentScreen: 'Connect',
  setCurrentScreen: () => {},
  isConnected: false,
  setIsConnected: () => {},
  deviceInfo: null,
  setDeviceInfo: () => {},
  devices: [],
  setDevices: () => {},
  deviceData: null,
  setDeviceData: () => {},
};

const GlobalStateContext = createContext<GlobalState>(defaultGlobalState);

export const GlobalStateProvider = ({children}: {children: ReactNode}) => {
  const [currentScreen, setCurrentScreen] = useState('Connect');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo[] | null>(null);
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [deviceData, setDeviceData] = useState<string | null>(null);

  return (
    <GlobalStateContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        isConnected,
        setIsConnected,
        deviceInfo,
        setDeviceInfo,
        devices,
        setDevices,
        deviceData,
        setDeviceData,
      }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};
