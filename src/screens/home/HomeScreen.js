import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  Button,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated,
  FlatList,
  StatusBar,
} from 'react-native';

import {SIZES, PADDINGS} from '../../constants/SizesAndPaddings';

import LottieView from 'lottie-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

// import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// import {useHms} from '../../contexts/HmsProvider';
import {useTheme} from '../../contexts/ThemeProvider';

const {width, height} = Dimensions.get('screen');

const HomeScreen = ({navigation}) => {
  const {theme, toggleTheme} = useTheme();

  const [isDark, setIsDark] = useState(false);

  // const [rooms, setRooms] = useState([
  //   {
  //     room_id: '#1',
  //     room_name: 'Test Room',
  //     room_author: 'Ady Hatem',
  //   },
  //   {
  //     room_id: '#2',
  //     room_name: 'Test Room',
  //     room_author: 'Ady Hatem',
  //   },
  //   {
  //     room_id: '#3',
  //     room_name: 'Test Room',
  //     room_author: 'Ady Hatem',
  //   },
  //   {
  //     room_id: '#4',
  //     room_name: 'Test Room',
  //     room_author: 'Ady Hatem',
  //   },
  //   {
  //     room_id: '#5',
  //     room_name: 'Test Room',
  //     room_author: 'Ady Hatem',
  //   },
  //   {
  //     room_id: '#6',
  //     room_name: 'Test Room',
  //     room_author: 'Ady Hatem',
  //   },
  // ]);

  const lottieRef = useRef(null);

  // const scrollY = useRef(new Animated.Value(0)).current;

  // const diffClamp = Animated.diffClamp(scrollY, 0, 55);

  // const translateY = diffClamp.interpolate({
  //   inputRange: [0, 55],
  //   outputRange: [0, -55],
  //   extrapolate: 'clamp',
  // });

  // const _renderRoom = useCallback(({item, index, separators}) => {
  //   return (
  //     <View
  //       style={[
  //         styles.roomContainer,
  //         {marginTop: index === 0 ? PADDINGS.PADDING * 0.5 : 0},
  //       ]}>
  //       <Pressable
  //         style={styles.roomBtn}
  //         android_ripple={{color: theme.ripple}}
  //         onPress={() =>
  //           navigation.navigate('Room', {
  //             room_id: '61c08b2eb682a91dd54b72b2',
  //           })
  //         }>
  //         <Text>{item.room_name}</Text>
  //         <Text>{item.room_author}</Text>
  //       </Pressable>
  //     </View>
  //   );
  // }, []);

  // const keyExtractor = useCallback((item, index) => index.toString(), []);

  // const [hmsInstanceLoading, setHmsInstanceLoading] = useState(true);

  // const hmsInstance = useHms();

  useEffect(() => {
    // if (hmsInstance) {
    //   setHmsInstanceLoading(false);
    // }

    if (theme.themeMode == 'dark') {
      lottieRef.current.play(0, 90);
    }
  }, []);

  const changeTheme = async () => {
    if (theme.themeMode == 'dark') {
      lottieRef.current.play(90, 180);
    } else {
      lottieRef.current.play(0, 90);
    }

    setTimeout(() => {
      toggleTheme(theme.themeMode);
    }, 100);
  };

  return (
    <View style={[styles.body, {backgroundColor: theme.background}]}>
      <View
        style={[styles.headerContainer, {backgroundColor: theme.background}]}>
        <View>
          <Text
            style={[
              styles.title,
              {color: theme.text},
            ]}>{`Create & Join Meeting`}</Text>
        </View>
        <View style={styles.themeBtnContainer}>
          <Pressable style={{flex: 1}} onPress={() => changeTheme()}>
            <LottieView
              resizeMode="contain"
              ref={lottieRef}
              source={require('../../assets/lottie/themebutton.json')}
              loop={false}
              speed={4}
              colorFilters={[
                {
                  keypath: 'Bg-blue',
                  color: theme.card,
                },
                {
                  keypath: 'Bg-black',
                  color: theme.card,
                },
              ]}
            />
          </Pressable>
        </View>
      </View>

      {/* multiple rooms */}
      {/* <View style={{flex: 1}}>
        <Animated.View
          style={{
            ...styles.animatedView,
            transform: [{translateY}],
          }}>
          <View style={{...styles.searchbarContainer}}>
            <View style={styles.searchIconContainer}>
              <Icon
                name="search1"
                size={SIZES.ICON_SIZE}
                color={theme.icon}
              />
            </View>
            <TextInput
              style={styles.searchbar}
              selectionColor={theme.selectionColor}
            />
          </View>
        </Animated.View>
        {hmsInstanceLoading ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{width: width * 0.33, height: width * 0.33}}>
              <LottieView
                source={require('../../assets/lottie/loading.json')}
                autoPlay={true}
                loop
                resizeMode="contain"
              />
            </View>
          </View>
        ) : (
          <FlatList
            data={rooms}
            renderItem={_renderRoom}
            keyExtractor={keyExtractor}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scrollY}}}],
              {useNativeDriver: false},
            )}
            scrollEventThrottle={16}
            contentContainerStyle={styles.contentContainerStyle}
          />
        )}
      </View> */}

      {/* create and join metting */}
      <View style={styles.mainContainer}>
        <View style={{flex: 1}} />
        <View style={{flex: 3, alignItems: 'center'}}>
          <View
            style={[
              styles.createRoomBtnContainer,
              {backgroundColor: theme.card},
            ]}>
            <Pressable
              style={styles.createRoomBtn}
              android_ripple={{color: theme.ripple}}
              onPress={() => console.log('createRoom!')}>
              <Ionicons name="videocam" size={90} color={theme.primary} />
              <View>
                <Text style={[styles.newRoomText, {color: theme.text2}]}>
                  New Room
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
        <View style={{flex: 1}} />
        <View
          style={{
            flex: 3,
            alignItems: 'center',
          }}>
          <View
            style={[
              styles.joinRoomBtnContainer,
              {backgroundColor: theme.card},
            ]}>
            <Pressable
              style={styles.joinRoomBtn}
              android_ripple={{color: theme.ripple}}
              onPress={() => console.log('createRoom!')}>
              <Ionicons name="enter-outline" size={90} color={theme.primary} />
              <View>
                <Text style={[styles.newRoomText, {color: theme.text2}]}>
                  Join Room
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
        <View style={{flex: 1}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  headerContainer: {
    width,
    padding: PADDINGS.PADDING,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: SIZES.TITLE_FONT_SIZE,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  // roomContainer: {
  //   flex: 1,
  //   marginBottom: PADDINGS.PADDING,
  //   borderRadius: 20,
  //   elevation: 2,
  //   overflow: 'hidden',
  //   height: height * 0.26,
  // },
  themeBtnContainer: {
    width: height * 0.07,
    height: height * 0.04,
    // backgroundColor: '#f00',
    overflow: 'hidden',
  },
  // animatedView: {
  //   position: 'absolute',
  //   left: 0,
  //   right: 0,
  //   paddingVertical: PADDINGS.PADDING * 0.5,
  //   paddingHorizontal: PADDINGS.PADDING,
  //   zIndex: 5,
  //
  // },
  // searchbarContainer: {
  //   width: '100%',
  //   padding: 0,
  //   height: 40,
  //   borderRadius: 7,
  //   paddingHorizontal: 7,
  //   flexDirection: 'row',
  // },
  // searchIconContainer: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // searchbar: {
  //   flex: 1,
  //   height: '100%',
  //   padding: 0,
  //   paddingLeft: 7,
  //   fontSize: SIZES.FONT_SIZE,
  // },
  // contentContainerStyle: {
  //   paddingTop: 55,
  //   paddingHorizontal: PADDINGS.PADDING,
  // },
  // roomBtn: {
  //   flex: 1,
  //   padding: PADDINGS.PADDING,
  // },
  mainContainer: {
    flex: 1,
  },
  createRoomBtnContainer: {
    flex: 1,
    borderRadius: 20,
    elevation: 2,
    overflow: 'hidden',
    width: width * 0.8,
  },
  createRoomBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinRoomBtnContainer: {
    flex: 1,
    borderRadius: 20,
    elevation: 2,
    overflow: 'hidden',
    width: width * 0.8,
  },
  joinRoomBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newRoomText: {
    fontSize: SIZES.TITLE_FONT_SIZE,
  },
  joinRoomText: {
    fontSize: SIZES.TITLE_FONT_SIZE,
  },
});

export default HomeScreen;
