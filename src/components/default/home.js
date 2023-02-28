import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, Text, View, Image, Animated} from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import storageService from '../../shared/storage-service';
import networkService from '../../shared/network-service';
import * as constants from '../../shared/constants';
import {LinearProgress} from 'react-native-elements';

import axios from 'axios';

const calculateGasLevel = (currentWeight, tank, suffix) => {
  switch (suffix) {
    case '%':
    default:
      return (currentWeight / tank.TOTAL_WEIGHT_KG) * 100;
  }
};

const Home = () => {
  const [currentWeight, setCurrentWeight] = useState();
  const [gasLevelSuffix, setGasLevelSuffix] = useState();
  const [calculatedGasLevel, setCalculatedGasLevel] = useState(0);
  const [calculatedGasLevelPercentage, setCalculatedGasLevelPercentage] =
    useState('0');
  const [remainingTime, setRemainingTime] = useState();
  const [consumption, setConsumption] = useState();
  const [gasLevelUnitMeasure, setgasLevelUnitMeasure] = useState();
  const [remainingTimeUnitMeasure, setRemainingTimeUnitMeasure] = useState();
  const [consumptionUnitMeasure, setConsumptionUnitMeasure] = useState();
  const [currentDeviceIp, setCurrentDeviceIp] = useState(null);
  const [currentDeviceHostName, setCurrentDeviceHostName] = useState(null);
  const [stopTimeout, setStopTimeout] = useState();
  const [scanTimeout, setScanTimeout] = useState();
  const [tankType, setTankType] = useState();
  const [kpiLevelColor, setKpiLevelColor] = useState();
  const [kpiConsumptionColor, setKpiConsumptionColor] = useState();

  const calculateKpiColor = percentage => {
    if (percentage >= 70) {
      return '#58ff00';
    } else if (percentage >= 30 && percentage < 70) {
      return '#FFEB3B';
    } else {
      return '#F44336';
    }
  };

  const getWeight = async hostName => {
    return axios.get('http://' + hostName + '/weight');
  };

  const getStorageData = async (key, setMethod, defaultValue) => {
    const storagedValue = await storageService.getData(key);
    if (storagedValue === null || storageService === undefined) {
      setMethod(defaultValue);
    } else {
      setMethod(storagedValue);
    }
  };

  const calculateHeight = {
    height: calculatedGasLevelPercentage + '%',
    backgroundColor: '#007eff',
    borderRadius: 20,
  };

  const stopScan = ip => {
    setCurrentDeviceIp(ip);
  };

  useEffect(() => {
    if (gasLevelSuffix === '%' && calculatedGasLevel !== 0) {
      setCalculatedGasLevelPercentage(calculatedGasLevel.toString());
    }

    setKpiLevelColor(calculateKpiColor(calculatedGasLevelPercentage));
  }, [calculatedGasLevel, gasLevelSuffix, calculatedGasLevelPercentage]);

  useEffect(() => {
    if (
      currentDeviceIp !== null &&
      tankType !== null &&
      gasLevelSuffix !== null
    ) {
      getWeight(currentDeviceIp).then(response => {
        const weight = response.data.data;
        const tank = constants.TANKS[tankType];
        setCalculatedGasLevel(calculateGasLevel(weight, tank, gasLevelSuffix));
      });
    }
  }, [currentDeviceIp, tankType, gasLevelSuffix]);

  // Second useEffect, this will be fired in the first render and when
  // the currentDeviceHostName value change
  useEffect(() => {
    // If the currentDeviceHostName is not null and undefined we init
    // the network service and star scanning to find the current ip of the
    // device
    if (currentDeviceHostName !== undefined && currentDeviceHostName !== null) {
      // We pass the sopScan function
      networkService.removeAllListeners();
      networkService.init(currentDeviceHostName, stopScan);
      networkService.scan('http', 'tcp', 'local.');
    }
  }, [currentDeviceHostName]);

  // First useEffect, this will be fired only in the first render
  useEffect(() => {
    // Se obtiene el hostname del dispositivo
    getStorageData(constants.KEY_HOSTNAME, setCurrentDeviceHostName, '');
    getStorageData(
      constants.KEY_GAS_LEVEL_SUFFIX,
      setGasLevelSuffix,
      constants.DEFAULT_GAS_LEVEL_SUFFIX,
    );
    getStorageData(
      constants.KEY_TANK_TYPE,
      setTankType,
      constants.CONFIG_TANK_10KG,
    );
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>Header</Text>
      </View>
      <View style={styles.main}>
        <View style={styles.mainLeft}>
          <View style={styles.wifiStatus}>
            <Image
              style={styles.wifiStatusImage}
              source={require('../../assets/wifi.png')}
            />
          </View>
          <View style={styles.tankTop}>
            <Image
              style={styles.tankTopImage}
              source={require('../../assets/tankTop.png')}
            />
          </View>
          <View style={styles.tankMiddle}>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <Animated.View
                  style={([StyleSheet.absoluteFill], calculateHeight)}
                />
              </View>
            </View>
          </View>
          <View style={styles.tankBottom}>
            <Image
              style={styles.tankBottomImage}
              source={require('../../assets/tankBottom.png')}
            />
          </View>
        </View>
        <View style={styles.mainRight}>
          <View style={styles.kpisContainer}>
            <View style={styles.kpi}>
              <CircularProgress
                valueSuffix={gasLevelSuffix}
                radius={75}
                value={calculatedGasLevel}
                activeStrokeWidth={15}
                inActiveStrokeWidth={15}
                activeStrokeColor={kpiLevelColor}
                textColor={'#9C9C9C'}
              />
              <Text>Nivel de gas</Text>
            </View>
            <View style={styles.kpi}>
              <CircularProgress
                radius={75}
                value={58}
                activeStrokeWidth={15}
                inActiveStrokeWidth={15}
                textColor={'#9C9C9C'}
              />
              <Text>Consumo</Text>
            </View>
            <View style={styles.kpi}>
              <CircularProgress
                radius={75}
                value={58}
                activeStrokeWidth={15}
                inActiveStrokeWidth={15}
                textColor={'#9C9C9C'}
              />
              <Text>Tiempo restante</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Text>Footer</Text>
        <LinearProgress color="primary" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 0.7,
  },
  footer: {
    flex: 1,
  },
  main: {
    flex: 7,
    flexDirection: 'row',
  },
  mainLeft: {
    flex: 1,
  },
  mainRight: {
    flex: 1,
  },
  wifiStatus: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wifiStatusImage: {
    resizeMode: 'center',
  },
  tankTop: {
    flex: 0.8,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  tankTopImage: {
    width: '53%',
    height: '90%',
  },
  tankBottomImage: {
    width: '53%',
    height: '70%',
  },
  tankBottom: {
    flex: 0.5,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tankMiddle: {
    flex: 4,
  },
  progressBarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },

  progressBar: {
    height: '100%',
    width: '80%',
    borderColor: '#494646',
    borderWidth: 5,
    borderRadius: 25,
    justifyContent: 'flex-end',
    backgroundColor: '#8A8A8A',
  },

  absoluteFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  kpisContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 1,
  },
  kpi: {
    flex: 1,
    alignItems: 'center',
  },
});

export default Home;
