import React from 'react';
import {StyleSheet, Text, View, Image, TouchableHighlight} from 'react-native';

const Welcome = ({navigation}) => {
  const onPress = () => {
    navigation.navigate('step1');
  };

  return (
    <View style={styles.container}>
      <View style={styles.gasimpImageView}>
        <Image source={require('../../assets/gasimpLogo.png')} />
      </View>
      <View style={styles.welcome}>
        <Text style={styles.welcomeTextView}>Bienvenido</Text>
        <Text style={styles.messageTextView}>
          Este asistente le guiará para configurar su sensor inteligente gasimp
        </Text>
      </View>
      <View style={styles.buttonView}>
        <TouchableHighlight onPress={onPress}>
          <View style={styles.button}>
            <Text style={{fontWeight: 'bold'}}>Iniciar</Text>
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
    padding: 35,
  },
  gasimpImageView: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 2,
  },
  welcome: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  welcomeTextView: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
  },
  messageTextView: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
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
});

export default Welcome;
