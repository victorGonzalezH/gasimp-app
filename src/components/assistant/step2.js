import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  TextInput,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import axios from 'axios';
import * as constants from '../../shared/constants';
import storageService from '../../shared/storage-service';
import Zeroconf from 'react-native-zeroconf';

const zeroconf = new Zeroconf();

// Confirma que se haya activado el dispositivo
const confirming = async hostName => {
  return axios.get('http://' + hostName + '/confirming');
};

const saveWifiData = async (wifiName, wifiPassword) => {
  var data = new FormData();
  data.append('ssid', wifiName);
  data.append('ssidpassword', wifiPassword);
  return axios.post(
    'http://' + constants.IP_SERVER_ADDRES + '/activate',
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  );
};

const Step2 = ({navigation}) => {
  const [wifiName, setWifiName] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [sensorCurrentIp, setSensorCurrentIp] = useState();
  const [connectedToWifi, setConnectedToWifi] = useState(false);
  const [stopTimeout, setStopTimeout] = useState();
  const [scanTimeout, setScanTimeout] = useState();
  const wifiPasswordRef = useRef();
  const connectButtonRef = useRef();

  useEffect(() => {
    zeroconf.on('resolved', async service => {
      const currentHostName = await storageService.getData(
        constants.KEY_HOSTNAME,
      );
      if (
        service.name.startsWith(currentHostName) === true &&
        service.addresses !== null &&
        service.addresses !== undefined &&
        service.addresses.length > 0
      ) {
        const ip = service.addresses[0];
        setSensorCurrentIp(ip);
        zeroconf.stop();
      }
    });

    zeroconf.on('stop', async () => {
      clearTimeout(stopTimeout);
      clearTimeout(scanTimeout);
      try {
        const confirmingResult = await confirming(sensorCurrentIp);
        setBusy(false);
        if (
          confirmingResult.status === 200 &&
          confirmingResult.data.resultCode ===
            constants.SUCESS_ACTIVATED_CODE &&
          sensorCurrentIp !== undefined
        ) {
          await storageService.setData(constants.ACTIVATED_KEY, true);
          setConnectedToWifi(true);
          setModalMessage('Conectado correctamente');
        } else {
          setModalMessage(
            'No se pudo conectar a su red, por favor verique el nombre y contraseña',
          );
        }
        setModalVisible(true);
      } catch (exception) {
        setModalMessage(
          'No se pudo conectar a su red, por favor verique el nombre y contraseña',
        );
        setModalVisible(true);
      }
    });
  }, [sensorCurrentIp, stopTimeout, scanTimeout]);

  // const [timeout, setTimeout] = useState();
  const onPress = async () => {
    try {
      setBusy(true);
      const saveWifiDataResult = await saveWifiData(wifiName, wifiPassword);
      setBusy(false);
      if (
        saveWifiDataResult !== null &&
        saveWifiDataResult.status === 200 &&
        saveWifiDataResult.data.resultCode === constants.SUCESS_ACTIVATING_CODE
      ) {
        setBusy(true);
        setScanTimeout(
          setTimeout(async function () {
            zeroconf.scan('http', 'tcp', 'local.');
            setStopTimeout(
              setTimeout(async function () {
                zeroconf.stop();
              }, 10000), //<- Se detiene el proceso en este tiempo
            );
          }, 20000), //<- El proceso de escaneo se inicia en lo que indica este tiempo
        );
      } else {
        setModalMessage(
          'No se pudo conectar a su red, por favor verique el nombre y contraseña',
        );
        setModalVisible(true);
      }
    } catch (exception) {
      setBusy(false);
      setModalMessage(
        'No se pudo conectar a su red, por favor verique el nombre y contraseña',
      );
      setModalVisible(true);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            // Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>{modalMessage}</Text>
              <Pressable
                style={[styles.buttonModal, styles.buttonCloseModal]}
                onPress={() => {
                  zeroconf.removeAllListeners();
                  setModalVisible(!modalVisible);
                  if (connectedToWifi === true) {
                    navigation.navigate('step3');
                  } else {
                    navigation.navigate('step1');
                  }
                }}>
                <Text>OK</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        {busy && (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loading}
            pointerEvents={'none'}
          />
        )}
        <View style={styles.container}>
          <View style={styles.gasimpImageView}>
            <Image source={require('../../assets/wifi.png')} />
          </View>
          <View style={styles.message}>
            <Text style={styles.messageTextView}>
              Ingrese el nombre y contraseña de su red doméstica o de trabajo
            </Text>
          </View>
          <TextInput
            style={{
              paddingTop: 30,
              textAlignVertical: 'center',
              textAlign: 'center',
              fontSize: 18,
              borderBottomColor: 'black',
              borderBottomWidth: 1,
            }}
            returnKeyType="next"
            onChangeText={setWifiName}
            value={wifiName}
            placeholder="Escriba el nombre de red"
            autoFocus={true}
            onSubmitEditing={() => {
              wifiPasswordRef.current.focus();
            }}
            blurOnSubmit={false}
          />

          <TextInput
            style={{
              paddingTop: 30,
              textAlignVertical: 'center',
              textAlign: 'center',
              fontSize: 18,
              borderBottomColor: 'black',
              borderBottomWidth: 1,
            }}
            returnKeyType="next"
            onChangeText={setWifiPassword}
            value={wifiPassword}
            placeholder="Escriba la contraseña"
            onSubmitEditing={() => {
              connectButtonRef.current.focus();
            }}
            ref={wifiPasswordRef}
          />

          <View style={styles.buttonView}>
            <TouchableHighlight onPress={onPress} ref={connectButtonRef}>
              <View style={styles.button}>
                <Text style={{fontWeight: 'bold'}}>Conectar</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    textAlignVertical: 'center',
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
    paddingTop: 30,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonModal: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpenModal: {
    backgroundColor: '#F194FF',
  },
  buttonCloseModal: {
    backgroundColor: '#2196F3',
  },
});

export default Step2;
