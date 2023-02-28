import React, {useState, useEffect} from 'react';
import {Icon, Button} from 'react-native-elements';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  Pressable,
} from 'react-native';
import storageService from '../shared/storage-service';
import * as constants from '../shared/constants';

async function setData(key, value) {
  await storageService.setData(key, value);
}

const getIconURL = tankType => {
  switch (tankType) {
    default:
    case constants.CONFIG_TANK_10KG:
      return require('../assets/tank10KG.png');
    case constants.CONFIG_TANK_20KG:
      return require('../assets/tank20KG.png');
    case constants.CONFIG_TANK_30KG:
      return require('../assets/tank30KG.png');
    case constants.CONFIG_TANK_45KG:
      return require('../assets/tank45KG.png');
  }
};

const ConfigTank = () => {
  const [tankType, setTankType] = useState();
  const [tankIcon, setTankIcon] = useState();

  useEffect(() => {
    async function setData(key, value) {
      await storageService.setData(key, value);
    }

    async function getData(key) {
      return await storageService.getData(key);
    }

    getData(constants.KEY_TANK_TYPE).then(tankTypeLocal => {
      if (tankTypeLocal === undefined || tankTypeLocal === null) {
        setData(constants.KEY_TANK_TYPE, constants.CONFIG_TANK_10KG).then(
          () => {
            setTankType(constants.CONFIG_TANK_10KG);
          },
        );
      } else {
        setTankType(tankTypeLocal);
      }
      setTankIcon(getIconURL(tankType));
    });
  }, [tankType]);

  const onLeftPress = () => {
    console.log('left');
  };

  return (
    <View style={styles.container}>
      <View style={styles.tanks}>
        <View style={styles.tankView}>
          <View style={styles.tankTop}>
            <Image
              style={styles.tankTopImage}
              source={require('../assets/tankTop.png')}
            />
          </View>
        </View>
        <View style={styles.tankDescription}>
          <Text>Hola</Text>
        </View>
      </View>
      <View style={styles.selectors}>
        <TouchableHighlight style={{flex: 1, padding: 3}} onPress={onLeftPress}>
          <View style={styles.selectorButton}>
            <Icon
              name="chevron-left"
              type="font-awesome"
              color="white"
              size={15}
            />
            <Text style={{fontWeight: 'bold', color: 'white', marginLeft: 5}}>
              Anterior
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={{flex: 1, padding: 3}} onPress={onLeftPress}>
          <View style={styles.selectorButton}>
            <Text style={{fontWeight: 'bold', color: 'white', marginRight: 5}}>
              Siguiente
            </Text>
            <Icon
              name="chevron-right"
              type="font-awesome"
              color="white"
              size={15}
            />
          </View>
        </TouchableHighlight>
      </View>
      <View style={styles.selectButtonView}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
  },
  selectors: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007eff',
    padding: 10,
    flexDirection: 'row',
    borderRadius: 1,
    elevation: 2,
  },
  rightButton: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },
  tanks: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tankView: {
    flex: 1,
    alignItems: 'center',
    borderColor: 'green',
    borderWidth: 1,
  },
  tankDescription: {
    flex: 0.9,
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 1,
  },
  tankTop: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'green',
    borderWidth: 1,
  },
  tankTopImage: {width: '50%'},
  tankMiddle: {
    flex: 1,
  },
  selectButtonView: {
    flex: 0.5,
  },
});

export default ConfigTank;
