import React, {useState, useEffect} from 'react';
import {Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Welcome from './src/components/assistant/welcome';
import Step1 from './src/components/assistant/step1';
import Step2 from './src/components/assistant/step2';
import ConfigTank from './src/components/config-tank'; //Step 3
import Default from './src/components/default/default';
import storageService from './src/shared/storage-service';
import * as constants from './src/shared/constants';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

const App = () => {
  const [activated, setActivated] = useState();

  useEffect(() => {
    async function setData(key, value) {
      await storageService.setData(key, value);
    }

    async function getData(key) {
      return await storageService.getData(key);
    }

    const result = getData(constants.ACTIVATED_KEY);
    result.then(value => {
      if (value === undefined || value === null) {
        setActivated(false);
        setData(constants.ACTIVATED_KEY, false);
      } else {
        setActivated(value);
        setData(constants.ACTIVATED_KEY, value);
      }
    });
  }, [activated]);

  let Stack = createNativeStackNavigator();

  if (activated === false) {
    const configAssistantComponent = (
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="welcome"
              component={Welcome}
              options={{title: 'Bienvenido'}}
            />
            <Stack.Screen
              name="step1"
              component={Step1}
              options={{title: 'Paso 1'}}
            />
            <Stack.Screen
              name="step2"
              component={Step2}
              options={{title: 'Paso 2'}}
            />
            <Stack.Screen
              name="step3"
              component={ConfigTank}
              options={{title: 'Paso 3', headerShown: false}}
            />
            <Stack.Screen
              name="default"
              component={Default}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
    return configAssistantComponent;
  } else if (activated === true) {
    const defaultComponent = (
      <SafeAreaProvider>
        <NavigationContainer>
          <Default />
        </NavigationContainer>
      </SafeAreaProvider>
    );
    return defaultComponent;
  } else {
    return <Text>Cargando...</Text>;
  }
};

export default App;
