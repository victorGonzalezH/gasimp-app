import React, {useState, useEffect} from 'react';
import {Icon} from 'react-native-elements';
import {StyleSheet, View, Text, Image} from 'react-native';
import storageService from '../shared/storageService';
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

  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: 'row',
          justifyContent: 'center',
        },
      ]}>
      <View
        style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center'}}>
        <Icon
          raised
          name="chevron-left"
          type="font-awesome"
          color="#f50"
          onPress={() => {
            let tankTypeNewValue;
            if (tankType === constants.CONFIG_TANK_10KG) {
              tankTypeNewValue = constants.CONFIG_TANK_45KG;
            } else {
              tankTypeNewValue = tankType - 1;
            }

            setData(constants.KEY_TANK_TYPE, tankTypeNewValue).then(() => {
              setTankType(tankTypeNewValue);
              setTankIcon(getIconURL(tankType));
            });
          }}
        />
      </View>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image source={tankIcon} />
      </View>
      <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
        <Icon
          raised
          name="chevron-right"
          type="font-awesome"
          color="#f50"
          onPress={() => {
            let tankTypeNewValue;
            if (tankType === constants.CONFIG_TANK_45KG) {
              tankTypeNewValue = constants.CONFIG_TANK_10KG;
            } else {
              tankTypeNewValue = tankType + 1;
            }

            setData(constants.KEY_TANK_TYPE, tankTypeNewValue).then(() => {
              setTankType(tankTypeNewValue);
              setTankIcon(getIconURL(tankType));
            });
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'green',
  },
  triangleLeft: {
    transform: [{rotate: '-90deg'}],
  },
});

export default ConfigTank;
