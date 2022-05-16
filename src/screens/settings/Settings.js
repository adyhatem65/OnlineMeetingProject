import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

import {useTheme} from '../../contexts/ThemeProvider';

const Settings = ({navigation}) => {
  const {theme} = useTheme();

  const background = theme.background;
  const primary = theme.primary;
  const text = theme.text;
  const text2 = theme.text2;
  const border = theme.border;
  const card = theme.card;
  const navBackground = theme.nav.background;
  const navActive = theme.nav.active;
  const navInActive = theme.nav.inActive;
  const themeMode = theme.themeMode;
  const placeholder = theme.placeholder;

  return (
    <View style={{...styles.body, backgroundColor: background}}>
      <Text style={{color: text2}}>Settings</Text>
      <Button
        title="choose theme screen"
        onPress={() => navigation.navigate('ChooseTheme')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Settings;
