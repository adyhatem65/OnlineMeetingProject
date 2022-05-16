import React from 'react';
import {StyleSheet, Text, View, Dimensions, Pressable} from 'react-native';

import {SIZES, PADDINGS} from '../constants/SizesAndPaddings';

import {useTheme} from '../contexts/ThemeProvider';

const {width, height} = Dimensions.get('screen');

const MainHeader = ({
  title,
  headerBackgroundColor,
  leftBtn,
  rightBtns,
  titlePosition,
  shadowColor,
}) => {
  const {theme, toggleTheme} = useTheme();

  const _renderRightIcon = (item, index) => {
    return (
      <View
        style={[
          styles.btnStyle,
          {
            marginRight: index == rightBtns.length - 1 ? 0 : PADDINGS.smPadding,
            // marginLeft: index == 0 ? PADDINGS.PADDING : PADDINGS.smPadding,
          },
        ]}
        key={index}>
        <Pressable
          onPress={item.onPress}
          android_ripple={{color: theme.ripple}}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: item.color,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {item.children}
        </Pressable>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: headerBackgroundColor,
          shadowColor: shadowColor,
        },
      ]}>
      {leftBtn}
      <View
        style={[
          styles.titleContainer,
          {
            alignItems:
              titlePosition == 'left'
                ? 'flex-start'
                : titlePosition == 'center'
                ? 'center'
                : titlePosition == 'right'
                ? 'flex-end'
                : 'baseline',
          },
        ]}>
        <Text
          style={[styles.titleStyle, {color: theme.text}]}
          numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View style={styles.rightStyle}>
        {rightBtns
          ? rightBtns.map((item, index) => _renderRightIcon(item, index))
          : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    // minHeight: 100,
    // height: height * 0.1,
    paddingHorizontal: PADDINGS.PADDING,
    paddingVertical: PADDINGS.mdPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
    elevation: 1,
    // borderBottomWidth: 0.5,
  },
  titleContainer: {
    justifyContent: 'center',
    // backgroundColor: '#f00',
    // maxWidth: width - (3 * PADDINGS.PADDING + 150),
    flex: 1,
    overflow: 'hidden',
    marginHorizontal: PADDINGS.PADDING,
  },
  titleStyle: {
    fontSize: SIZES.TITLE_FONT_SIZE,
    fontWeight: '600',
  },
  rightStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: 40,
    // backgroundColor: '#0f0',
    height: '100%',
    marginRight: -9,
  },
  btnStyle: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
});

export default MainHeader;
