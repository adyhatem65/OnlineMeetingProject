import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {SIZES, PADDINGS} from '../constants/SizesAndPaddings';

import AntDesign from 'react-native-vector-icons/AntDesign';

const BackButton = ({onPress, rippleColor, iconColor, btnBackroundColor}) => {
  return (
    <View style={[styles.container]}>
      <Pressable
        style={[styles.backBtnStyle, {backgroundColor: btnBackroundColor}]}
        android_ripple={{color: rippleColor}}
        onPress={onPress}>
        <AntDesign name="arrowleft" size={SIZES.ICON_SIZE} color={iconColor} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: -9,
  },
  backBtnStyle: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BackButton;
