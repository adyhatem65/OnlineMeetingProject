import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

import {SIZES, PADDINGS} from '../constants/SizesAndPaddings';

import Icon from 'react-native-vector-icons/Ionicons';

import LottieView from 'lottie-react-native';

const RoomCard = ({
  roomBackground,
  roomTitle,
  roomTopics,
  roomHostName,
  roomHostImage,
  // roomHostAbout,
  roomStatus,
  roomNumOfListeners,
  onPress,
  rippleColor,
  iconColor,
  textColor,
  calendarDate,
}) => {
  return (
    <View
      style={[styles.cardContainerStyle, {backgroundColor: roomBackground}]}>
      <Pressable
        style={{flex: 1}}
        android_ripple={{color: rippleColor}}
        onPress={onPress}>
        {/* header */}
        <View style={styles.cardHeaderStyle}>
          <View style={styles.roomStatusWrapperStyle}>
            {roomStatus == 'LIVE' ? (
              <View style={styles.lottieLiveWrapper}>
                <LottieView
                  source={require('../assets/lottie/live.json')}
                  autoPlay={true}
                  loop
                  resizeMode="contain"
                  // colorFilters={[
                  //   {
                  //     keypath: 'circle 2',
                  //     color: '#ffffff',
                  //   },
                  //   {
                  //     keypath: 'circle',
                  //     color: '#ffffff',
                  //   },
                  // ]}
                  speed={1}
                />
              </View>
            ) : (
              <Icon
                name="calendar"
                size={SIZES.SM_ICON}
                color={iconColor}
                style={{marginRight: PADDINGS.PADDING}}
              />
            )}
            <View style={{width: '80%'}}>
              <Text
                style={[styles.mdFontSizeStyle, {color: textColor}]}
                numberOfLines={1}>
                {roomStatus == 'LIVE' ? 'LIVE' : calendarDate}
              </Text>
            </View>
          </View>
          <View style={styles.btnWrapperStyle}>
            <Pressable
              style={styles.btnStyle}
              android_ripple={{color: rippleColor}}>
              <Icon
                name="ellipsis-vertical"
                size={SIZES.SM_ICON}
                color={iconColor}
              />
            </Pressable>
          </View>
        </View>

        {/* content */}
        <View style={styles.cardContentStyle}>
          <View>
            <Text style={[styles.lgFontSizeStyle, {color: textColor}]}>
              {roomTitle}
            </Text>
          </View>
          <View style={{marginVertical: PADDINGS.PADDING}}>
            <Text style={[styles.smFontSizeStyle, {color: textColor}]}>
              {roomTopics.join('  -  ')}
            </Text>
          </View>
          <View>
            <Text style={[styles.smFontSizeStyle, {color: textColor}]}>
              {`${roomNumOfListeners} listening`}
            </Text>
          </View>
        </View>

        {/* footer */}
        <View style={[styles.cardFooterStyle, {backgroundColor: '#00000020'}]}>
          <View style={styles.hostAvatarWrapperStyle}>
            <Image
              style={{width: 22, height: 22, borderRadius: 11}}
              resizeMode="cover"
              source={roomHostImage}
            />
          </View>
          <View style={{marginHorizontal: PADDINGS.mdPadding}}>
            <Text style={[styles.mdFontSizeStyle, {color: textColor}]}>
              {roomHostName}
            </Text>
          </View>
          <View
            style={[
              styles.hostTextWrapperStyle,
              {backgroundColor: '#ffffff40'},
            ]}>
            <Text style={[styles.smFontSizeStyle, {color: textColor}]}>
              Host
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainerStyle: {
    width: '100%',
    marginBottom: PADDINGS.PADDING,
    borderRadius: PADDINGS.PADDING,
    elevation: 5,
    overflow: 'hidden',
  },
  cardHeaderStyle: {
    paddingHorizontal: PADDINGS.PADDING,
    paddingTop: PADDINGS.PADDING,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContentStyle: {
    padding: PADDINGS.PADDING,
  },
  cardFooterStyle: {
    padding: PADDINGS.PADDING,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roomTitleWrapperStyle: {
    marginBottom: PADDINGS.mdPadding,
  },
  lgFontSizeStyle: {
    fontSize: SIZES.LG_FONT_SIZE,
    fontWeight: '600',
  },
  mdFontSizeStyle: {
    fontSize: SIZES.MD_FONT_SIZE,
    fontWeight: '600',
  },
  smFontSizeStyle: {
    fontSize: SIZES.SM_FONT_SIZE,
  },
  btnWrapperStyle: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    overflow: 'hidden',
  },
  btnStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostAvatarWrapperStyle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    overflow: 'hidden',
  },
  hostTextWrapperStyle: {
    paddingHorizontal: PADDINGS.smPadding,
    borderRadius: 3,
  },
  roomStatusWrapperStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#000',
  },
  lottieLiveWrapper: {
    width: 15,
    height: 15,
    marginRight: PADDINGS.PADDING,
    // backgroundColor: '#000',
  },
});

export default RoomCard;
