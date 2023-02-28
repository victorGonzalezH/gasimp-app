/**
 * Comments on this file could be in english, espa;ol or spanglish :)
 */
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import * as constants from '../../shared/constants';
import storageService from '../../shared/storage-service';

/**
 * Verify the connection with the sensor device
 * @param {*} parameterName
 * @param {*} parameterValue
 * @returns
 */
const checkConnection = async (timeStampValue, timeOffsetValue) => {
  return axios.get(
    'http://' +
      constants.IP_SERVER_ADDRES +
      '/checkconnection' +
      '?' +
      constants.KEY_TIMESTAMP +
      '=' +
      timeStampValue +
      '&' +
      constants.KEY_TIMEZONEOFFSET +
      '=' +
      timeOffsetValue,
  );
};

const Step1 = ({navigation}) => {
  const [busy, setBusy] = useState(false);

  const onPress = async () => {
    setBusy(true);
    try {
      const timestamp = Date.now();
      const date = new Date();
      const timeOffsetInSeconds = date.getTimezoneOffset() * 60;
      // Se pasa el timestamp actual para checar la conexion
      // el dispositivo respondera con el mismo nombre con el que se
      // registra a la red usando el protocolo MDNS.
      const checkResult = await checkConnection(timestamp, timeOffsetInSeconds);
      setBusy(false);
      if (
        checkResult !== null &&
        checkResult.status === 200 &&
        checkResult.data !== null &&
        checkResult.data !== undefined
      ) {
        // Saving the hostname in the storage
        await storageService.setData(
          constants.KEY_HOSTNAME,
          checkResult.data.data,
        );
        navigation.navigate('step2');
      } else {
      }
    } catch (exception) {
      setBusy(false);
    }
  };
  return (
    <View style={styles.container}>
      {busy && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loading}
          pointerEvents={'none'}
        />
      )}
      <View style={styles.gasimpImageView}>
        <Image
          source={require('../../assets/connectToGasimpWifi.png')}
          style={{width: '100%', height: '85%', resizeMode: 'stretch'}}
        />
      </View>
      <View style={styles.message}>
        <Text style={styles.messageTextView}>
          Asegúrese de que su sensor este encendido y se encuentre cerca de él.
          El sensor creará una red temporal para que usted se conecte desde su
          teléfono y lo pueda configurar.
        </Text>
      </View>
      <Text style={styles.wifiDataTextView}>Red: gasimp</Text>
      <Text style={styles.wifiDataTextView}>Contraseña: gasimp123</Text>

      <View style={styles.buttonView}>
        <TouchableHighlight onPress={onPress}>
          <View style={styles.button}>
            <Text style={{fontWeight: 'bold'}}>Verificar</Text>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'space-around',
    padding: 30,
  },
  gasimpImageView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  message: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  wifiDataTextView: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
  },
  messageTextView: {
    fontSize: 18,
    color: 'black',
    textAlign: 'left',
  },
  buttonView: {
    alignItems: 'stretch',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 15,
  },
  button: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#00ff00',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF88',
    zIndex: 100,
  },
});

export default Step1;
