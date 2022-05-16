import React, {useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';

import Icon from 'react-native-vector-icons/AntDesign';

const {width, height} = Dimensions.get('screen');

import {useTheme} from '../contexts/ThemeProvider';

const btnHeight = height * 0.07;

const smallFontSize = height * 0.02;
const mediumFontSize = height * 0.025;
const largeFontSize = height * 0.03;

const RadionButton = ({label, selected, onSelect}) => {
  const {theme} = useTheme();

  const background = theme.background;
  const border = theme.border;
  const primary = theme.primary;
  const text2 = theme.text2;
  const white = theme.white;

  const scale = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const endAnimation = () => {
    Animated.spring(scale, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (selected) {
      startAnimation();
    } else {
      endAnimation();
    }
  }, [selected]);

  return (
    <TouchableOpacity activeOpacity={1} style={styles.btn} onPress={onSelect}>
      <View>
        <Text style={{...styles.label, color: theme.text}}>{label}</Text>
      </View>
      <View
        style={{
          ...styles.circle,
          borderColor: border,
          borderWidth: 1.5,
        }}>
        {/* {selected && ( */}
        <Animated.View
          style={{
            width: btnHeight / 2,
            height: btnHeight / 2,
            backgroundColor: primary,
            transform: [{scale: scale}],
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: btnHeight / 4,
          }}>
          <Icon name="check" size={mediumFontSize} color={white} />
        </Animated.View>
        {/* )} */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: width * 0.9,
    height: btnHeight,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circle: {
    width: btnHeight / 2,
    height: btnHeight / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: btnHeight / 4,
  },
  label: {
    fontSize: mediumFontSize,
  },
});

export default RadionButton;
