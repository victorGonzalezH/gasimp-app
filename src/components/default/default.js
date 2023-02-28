import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Home from './home';
import ConfigTank from '../config-tank';
const Tab = createMaterialTopTabNavigator();

const Default = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="home" component={Home} options={{title: 'Inicio'}} />
      <Tab.Screen
        name="configTank"
        component={ConfigTank}
        options={{title: 'ConfigTank'}}
      />
    </Tab.Navigator>
  );
};

export default Default;
