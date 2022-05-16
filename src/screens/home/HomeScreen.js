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
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import {SIZES, PADDINGS} from '../../constants/SizesAndPaddings';

import LottieView from 'lottie-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// 100ms
import {useHms} from '../../contexts/HmsProvider';

import {ThemeContext, useTheme} from '../../contexts/ThemeProvider';

// header
import MainHeader from '../../components/MainHeader';

// native base
import {NativeBaseProvider, Avatar, Actionsheet} from 'native-base';

import RoomCard from '../../components/RoomCard';

const {width, height} = Dimensions.get('screen');

const HomeScreen = ({navigation}) => {
  const {theme, toggleTheme} = useTheme();

  const [hmsInstanceLoading, setHmsInstanceLoading] = useState(true);

  const hmsInstance = useHms();

  // const [isDark, setIsDark] = useState(false);

  const [allRooms, setAllRooms] = useState([
    {
      room_id: '#1',
      room_title: 'My name is Ady Hatem Mostafa Mostafa Othman',
      room_host_name: 'Ady Hatem',
      room_host_image: require('../../assets/images/ady.jpg'),
      room_status: 'LIVE',
      room_topics: ['Music', 'Love', 'Quran'],
      room_num_of_listeners: 100,
      room_calendar_date: null,
    },
    {
      room_id: '#2',
      room_title: 'My name is Ady Hatem Mostafa Mostafa Othman',
      room_host_name: 'Ady Hatem',
      room_host_image: require('../../assets/images/ady.jpg'),
      room_status: 'LIVE',
      room_topics: ['Music', 'Love', 'Quran'],
      room_num_of_listeners: 100,
      room_calendar_date: null,
    },
    {
      room_id: '#3',
      room_title: 'My name is Ady Hatem Mostafa Mostafa Othman',
      room_host_name: 'Ady Hatem',
      room_host_image: require('../../assets/images/ady.jpg'),
      room_status: 'LIVE',
      room_topics: ['Music', 'Love', 'Quran'],
      room_num_of_listeners: 100,
      room_calendar_date: null,
    },
    {
      room_id: '#4',
      room_title: 'Calendar Calendar Calendar Calendar Calendar Calendar',
      room_host_name: 'Ady Hatem',
      room_host_image: require('../../assets/images/ady.jpg'),
      room_status: 'CALENDAR',
      room_topics: ['Music', 'Love', 'Quran'],
      room_num_of_listeners: 100,
      room_calendar_date: new Date(),
    },
    {
      room_id: '#4',
      room_title: 'Calendar Calendar Calendar Calendar Calendar Calendar',
      room_host_name: 'Ady Hatem',
      room_host_image: require('../../assets/images/ady.jpg'),
      room_status: 'CALENDAR',
      room_topics: ['Music', 'Love', 'Quran'],
      room_num_of_listeners: 100,
      room_calendar_date: new Date(),
    },
  ]);

  const [filteredRooms, setFilteredRooms] = useState([]);

  const [isLive, setIsLive] = useState(true);

  // const lottieRef = useRef(null);

  const scrollY = useRef(new Animated.Value(0)).current;

  const diffClamp = Animated.diffClamp(scrollY, 0, 100);

  const translateY = diffClamp.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });

  // navigate to screens
  const navigateTo = (screen_name, params) => {
    navigation.navigate(screen_name, params);
  };

  const _renderRoom = useCallback(
    ({item, index, separators}) => {
      const numbers = '123456789';
      let randomColor = '#';

      for (let i = 1; i <= 6; i++) {
        randomColor += numbers[Math.floor(Math.random() * numbers.length)];
      }

      return (
        <RoomCard
          roomTitle={item.room_title}
          roomHostName={item.room_host_name}
          roomHostImage={item.room_host_image}
          roomStatus={item.room_status}
          roomTopics={item.room_topics}
          roomNumOfListeners={item.room_num_of_listeners}
          roomBackground={randomColor}
          textColor={theme.white}
          iconColor={theme.white}
          rippleColor={theme.ripple}
          onPress={() =>
            navigateTo('Room', {
              room_id: '61c08b2eb682a91dd54b72b2',
            })
          }
          calendarDate={
            item.room_calendar_date ? item.room_calendar_date.toString() : null
          }
          key={index}
        />
      );
    },
    [theme],
  );

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  useEffect(() => {
    if (hmsInstance) {
      setHmsInstanceLoading(false);
    }
    // if (theme.themeMode == 'dark') {
    //   lottieRef.current.play(0, 90);
    // }

    if (filteredRooms.length == 0) {
      handleTabPress(false);
    }
  }, []);

  // const changeTheme = async () => {
  //   if (theme.themeMode == 'dark') {
  //     lottieRef.current.play(90, 180);
  //   } else {
  //     lottieRef.current.play(0, 90);
  //   }

  //   setTimeout(() => {
  //     toggleTheme(theme.themeMode);
  //   }, 100);
  // };

  // header right buttons
  const rightBtns = [
    {
      id: '1',
      color: theme.background,
      children: (
        <Ionicons name="search" size={SIZES.ICON_SIZE} color={theme.icon} />
      ),
      onPress: () => alert('test'),
    },
    {
      id: '2',
      color: theme.background,
      children: (
        <Ionicons
          name="notifications"
          size={SIZES.ICON_SIZE}
          color={theme.icon}
        />
      ),
      onPress: () => alert('test'),
    },
    {
      id: '3',
      color: theme.background,
      children: (
        <Ionicons name="settings" size={SIZES.ICON_SIZE} color={theme.icon} />
      ),
      onPress: () => navigateTo('SettingStack', {}),
    },
  ];

  // on tab press
  const handleTabPress = isLive => {
    if (isLive) {
      const calendarFilter = allRooms.filter(
        room => room.room_status == 'CALENDAR',
      );

      setIsLive(false);
      setFilteredRooms([...calendarFilter]);
    } else {
      const liveRooms = allRooms.filter(room => room.room_status == 'LIVE');

      setIsLive(true);
      setFilteredRooms([...liveRooms]);
    }
  };

  return (
    <View style={[styles.body, {backgroundColor: theme.background}]}>
      <NativeBaseProvider>
        {/* <View
        style={[styles.headerContainer, {backgroundColor: theme.background}]}>
        <View>
          <Text
            style={[styles.title, {color: theme.text}]}>{`All Spaces`}</Text>
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
      </View> */}

        {/* Header */}
        <MainHeader
          title="Spaces"
          titlePosition="left"
          headerBackgroundColor={theme.background}
          leftBtn={
            <TouchableOpacity activeOpacity={0.9}>
              <Avatar
                bg={theme.primary}
                size="sm" // 32
                source={{
                  uri: 'https://avatars.githubusercontent.com/u/72977824?v=4',
                }}>
                AH
              </Avatar>
            </TouchableOpacity>
          }
          rightBtns={rightBtns}
          shadowColor={theme.themeMode == 'default' ? theme.black : theme.white}
        />

        {/* multiple rooms */}
        <View style={{flex: 1}}>
          {/* <Animated.View
            style={{
              ...styles.animatedView,
              transform: [{translateY}],
              backgroundColor: theme.background,
            }}>
            <View
              style={{
                ...styles.searchbarContainer,
                backgroundColor: theme.search,
              }}>
              <View style={styles.searchIconContainer}>
                <Ionicons
                  name="search"
                  size={SIZES.ICON_SIZE}
                  color={theme.icon}
                />
              </View>
              <TextInput
                style={styles.searchbar}
                selectionColor={theme.selectionColor}
              />
            </View>
          </Animated.View> */}

          <Animated.View
            style={{
              ...styles.animatedView,
              transform: [{translateY}],
              backgroundColor: theme.background,
            }}>
            <TouchableOpacity
              activeOpacity={0.4}
              disabled={isLive}
              onPress={() => handleTabPress(false)}
              style={[
                styles.tabStyle,
                {backgroundColor: isLive ? theme.primary : theme.disabled},
              ]}>
              <Ionicons
                name="ios-radio"
                size={SIZES.ICON_SIZE}
                color={isLive ? theme.white : theme.icon}
              />
              <Text
                style={[
                  styles.mdTextStyle,
                  {
                    color: isLive ? theme.white : theme.text,
                    marginLeft: PADDINGS.PADDING,
                  },
                ]}>
                Live
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.4}
              disabled={!isLive}
              onPress={() => handleTabPress(true)}
              style={[
                styles.tabStyle,
                {
                  backgroundColor: isLive ? theme.disabled : theme.primary,
                  marginRight: 0,
                },
              ]}>
              <Ionicons
                name="calendar"
                size={SIZES.ICON_SIZE}
                color={isLive ? theme.icon : theme.white}
              />
              <Text
                style={[
                  styles.mdTextStyle,
                  {
                    color: isLive ? theme.text : theme.white,
                    marginLeft: PADDINGS.PADDING,
                  },
                ]}>
                Calendar
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {hmsInstanceLoading ? (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              {/* <View style={{width: width * 0.33, height: width * 0.33}}>
                <LottieView
                  source={require('../../assets/lottie/loading.json')}
                  autoPlay={true}
                  loop
                  resizeMode="contain"
                />
              </View> */}
              <ActivityIndicator
                size={SIZES.LG_ICON + height * 0.027}
                color={theme.primary}
              />
            </View>
          ) : (
            // <ScrollView>
            <FlatList
              data={filteredRooms}
              renderItem={_renderRoom}
              keyExtractor={keyExtractor}
              // ListHeaderComponent={
              //   <View style={styles.liveNowWrapper}>
              //     <Text style={styles.lgTextStyle}>Live Now 🔴</Text>
              //   </View>
              // }
              showsVerticalScrollIndicator={false}
              onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {y: scrollY}}}],
                {useNativeDriver: false},
              )}
              scrollEventThrottle={16}
              contentContainerStyle={styles.contentContainerStyle}
            />
            // </ScrollView>
          )}
        </View>

        {/* create and join metting */}
        {/* <View style={styles.mainContainer}>
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
                <Ionicons
                  name="enter-outline"
                  size={90}
                  color={theme.primary}
                />
                <View>
                  <Text style={[styles.newRoomText, {color: theme.text2}]}>
                    Join Room
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
          <View style={{flex: 1}} />
        </View> */}
      </NativeBaseProvider>
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
  roomContainer: {
    flex: 1,
    marginBottom: PADDINGS.PADDING,
    borderRadius: 20,
    elevation: 2,
    overflow: 'hidden',
    // height: height * 0.26,
  },
  themeBtnContainer: {
    width: height * 0.07,
    height: height * 0.04,
    // backgroundColor: '#f00',
    overflow: 'hidden',
  },
  animatedView: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: PADDINGS.PADDING,
    paddingTop: PADDINGS.PADDING,
    paddingBottom: PADDINGS.PADDING / 2,
    zIndex: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchbarContainer: {
    width: '100%',
    padding: 0,
    height: 40,
    borderRadius: 7,
    paddingHorizontal: 12.5,
    flexDirection: 'row',
    // overflow: 'hidden',
  },
  searchIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchbar: {
    flex: 1,
    height: '100%',
    padding: 0,
    paddingLeft: 12.5,
    fontSize: SIZES.FONT_SIZE,
  },
  contentContainerStyle: {
    paddingTop: 75,
    paddingHorizontal: PADDINGS.PADDING,
  },
  roomBtn: {
    flex: 1,
    padding: PADDINGS.PADDING,
  },
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
  lgTextStyle: {
    fontSize: SIZES.LG_FONT_SIZE,
    fontWeight: '600',
  },
  mdTextStyle: {
    fontSize: SIZES.MD_FONT_SIZE,
    fontWeight: '600',
  },
  liveNowWrapper: {
    marginBottom: 2 * PADDINGS.PADDING,
    // marginTop: PADDINGS.PADDING,
    width: '100%',
    // paddingHorizontal: PADDINGS.PADDING,
  },
  tabStyle: {
    flex: 1,
    height: 45,
    marginRight: PADDINGS.PADDING,
    borderRadius: 500,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
