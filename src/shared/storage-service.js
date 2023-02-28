import AsyncStorage from '@react-native-async-storage/async-storage';
//import {AsyncStorage} from 'react-native';

const StorageService = {
  async getData(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      const result = jsonValue !== null ? JSON.parse(jsonValue) : null;
      return result;
    } catch (e) {
      throw e;
    }
  },

  async setData(key, value) {
    try {
      const stringValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
    } catch (exception) {
      throw exception;
    }
  },
};

export default StorageService;
