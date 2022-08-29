import React from 'react';
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {PADDINGS, SIZES} from '../constants/SizesAndPaddings';

import {Avatar, NativeBaseProvider} from 'native-base';

import Icon from 'react-native-vector-icons/Feather';

import Ionicons from 'react-native-vector-icons/Ionicons';

import LottieView from 'lottie-react-native';

const {width, height} = Dimensions.get('screen');

const RoomMemberAvatar = ({
  theme,
  member_name,
  member_role,
  member_image,
  is_mute,
  audio_level,
  speaking,
  meta_data,
  item,
  local_peer_id,
  animation_icon,
  scale_anim,
  onAvatarPress,
}) => {
  const fullName = member_name.split(' ');
  const firstName = fullName.shift();
  const lastName = fullName.pop();
  const capLetters = firstName?.charAt(0) + lastName?.charAt(0);

  return (
    <View
      style={[
        styles.avatarContainer,
        {
          // backgroundColor: theme.card,
        },
      ]}>
      <NativeBaseProvider>
        <TouchableOpacity
          activeOpacity={0.5}
          style={{alignItems: 'center', justifyContent: 'center'}}
          onPress={onAvatarPress}>
          <Avatar
            bg={theme.card}
            size="md"
            source={{
              uri: member_image, // 'https://avatars.githubusercontent.com/u/72977824?v=4',
            }}>
            {capLetters.toUpperCase()}
          </Avatar>

          {item.id == local_peer_id ? (
            animation_icon == 'heart' ? (
              <Animated.View
                style={[
                  styles.animatedViewStyle,
                  {
                    transform: [{scale: scale_anim}],
                    // backgroundColor: 'red',
                  },
                ]}>
                <Ionicons
                  name="ios-heart"
                  size={SIZES.LG_ICON + 13}
                  color={theme.primary}
                />
              </Animated.View>
            ) : (
              <Animated.View
                style={[
                  styles.animatedViewStyle,
                  {
                    transform: [{scale: scale_anim}],
                    // backgroundColor: 'red',
                  },
                ]}>
                <Image
                  source={require('../assets/icons/laugh.png')}
                  resizeMode="contain"
                  style={{width: 60, height: 60}}
                />
              </Animated.View>
            )
          ) : null}

          {/* hand */}
          {meta_data ? (
            meta_data.isHandRaised && member_role == 'listener' ? (
              <View
                style={[
                  styles.handContainer,
                  {backgroundColor: theme.background},
                ]}>
                <Ionicons
                  name="ios-hand-right"
                  size={SIZES.ICON_SIZE}
                  color={theme.yellow}
                />
              </View>
            ) : null
          ) : null}
        </TouchableOpacity>
      </NativeBaseProvider>
      <View
        style={{
          width: '100%',
          // backgroundColor: '#f00',
          // alignItems: 'center',
        }}>
        <Text
          style={[
            styles.memberNameStyle,
            {color: theme.text, textAlign: 'center'},
          ]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {member_name}
        </Text>
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center', minHeight: 20}}>
        {member_role == 'host' || member_role == 'speaker' ? (
          !is_mute ? (
            audio_level ? (
              <LottieView
                source={require('../assets/lottie/mic-on.json')}
                autoPlay
                loop
                style={{
                  position: 'relative',
                  height: 20,
                  width: 20,
                  marginRight: -2,
                  marginLeft: -2,
                }}
                resizeMode="contain"
                colorFilters={[
                  {
                    keypath: 'Shape Layer 1',
                    color: theme.background,
                  },
                ]}
              />
            ) : null
          ) : (
            <Icon
              name="mic-off"
              color={theme.red}
              size={SIZES.SM_ICON - 7}
              style={{marginRight: PADDINGS.smPadding - 1}}
            />
          )
        ) : null}
        <Text style={[styles.memberRoleStyle, {color: theme.text2}]}>
          {member_role}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    width: (width - 5 * PADDINGS.PADDING) / 4,
    marginBottom: PADDINGS.PADDING,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: PADDINGS.smPadding,
    marginRight: PADDINGS.PADDING,
  },
  memberNameStyle: {
    fontSize: SIZES.FONT_SIZE - 2,
    marginTop: PADDINGS.smPadding,
    fontWeight: '600',
  },
  memberRoleStyle: {
    fontSize: SIZES.SM_FONT_SIZE - 2,
  },
  handContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    position: 'absolute',
    top: -7,
    right: -7,
    elevation: 2,
  },
  animatedViewStyle: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RoomMemberAvatar;
