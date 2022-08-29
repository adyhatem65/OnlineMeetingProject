import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
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
  Alert,
  AppState,
  RefreshControl,
} from 'react-native';

import {SIZES, PADDINGS} from '../../constants/SizesAndPaddings';

import LottieView from 'lottie-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

// 100ms
import {useHms} from '../../contexts/HmsProvider';

import {ThemeContext, useTheme} from '../../contexts/ThemeProvider';

// header
import MainHeader from '../../components/MainHeader';

// native base
import {
  NativeBaseProvider,
  Avatar,
  Actionsheet,
  Modal,
  Switch,
} from 'native-base';

import RoomCard from '../../components/RoomCard';

// Notifee
import notifee, {
  AndroidCategory,
  AndroidImportance,
  AndroidStyle,
  EventType,
} from '@notifee/react-native';

import messaging from '@react-native-firebase/messaging';

// import NotificationSounds from 'react-native-notification-sounds';

import NotificationService from '../../NotificationsServices/NotificationService';

// axios
import axios from 'axios';

// NetInfo
import NetInfo, {useNetInfo} from '@react-native-community/netinfo';

const {width, height} = Dimensions.get('screen');

// end point
const createRoomEndPoint = 'https://prod-in2.100ms.live/api/v2/rooms';
const getSessionsEndPoint = 'https://api.100ms.live/v2/sessions';

const HomeScreen = ({navigation}) => {
  const {theme, toggleTheme} = useTheme();

  const [hmsInstanceLoading, setHmsInstanceLoading] = useState(true);

  const [getSessionsLoading, setGetSessionsLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [createRoomLoading, setCreateRoomLoading] = useState(false);

  const [deviceToken, setDeviceToken] = useState('');

  const hmsInstance = useHms();

  const [roomData, setRoomData] = useState({
    name: '',
    // description: '',
    template: 'default_createown_69de3312-5624-4890-bea5-7df030a4681a',
    // ...
  });

  const [roomTopics, setRoomTopics] = useState([]);

  const [managementToken, setManagementToken] = useState('');
  const managementTokenRef = useRef(null);

  const [lastSessionId, setLastSessionId] = useState('');

  // const [isDark, setIsDark] = useState(false);

  const [allSessions, setAllSessions] = useState([
    // {
    //   room_id: '#1',
    //   room_title: 'My name is Ady Hatem Mostafa Mostafa Othman',
    //   room_host_name: 'Ady Hatem',
    //   room_host_image: require('../../assets/images/ady.jpg'),
    //   room_status: 'LIVE',
    //   room_topics: ['Music', 'Love', 'Quran'],
    //   room_num_of_listeners: 100,
    //   room_calendar_date: null,
    // },
    // {
    //   room_id: '#2',
    //   room_title: 'My name is Ady Hatem Mostafa',
    //   room_host_name: 'Ady Hatem',
    //   room_host_image: require('../../assets/images/ady.jpg'),
    //   room_status: 'LIVE',
    //   room_topics: ['Music', 'Love', 'Quran'],
    //   room_num_of_listeners: 100,
    //   room_calendar_date: null,
    // },
    // {
    //   room_id: '#3',
    //   room_title: 'My name is Ady Hatem',
    //   room_host_name: 'Ady Hatem',
    //   room_host_image: require('../../assets/images/ady.jpg'),
    //   room_status: 'LIVE',
    //   room_topics: ['Music', 'Love', 'Quran'],
    //   room_num_of_listeners: 100,
    //   room_calendar_date: null,
    // },
    // {
    //   room_id: '#4',
    //   room_title: 'Calendar Calendar Calendar Calendar Calendar Calendar',
    //   room_host_name: 'Ady Hatem',
    //   room_host_image: require('../../assets/images/ady.jpg'),
    //   room_status: 'CALENDAR',
    //   room_topics: ['Music', 'Love', 'Quran'],
    //   room_num_of_listeners: 100,
    //   room_calendar_date: new Date(),
    // },
    // {
    //   room_id: '#4',
    //   room_title: 'Calendar Calendar Calendar Calendar Calendar Calendar',
    //   room_host_name: 'Ady Hatem',
    //   room_host_image: require('../../assets/images/ady.jpg'),
    //   room_status: 'CALENDAR',
    //   room_topics: ['Music', 'Love', 'Quran'],
    //   room_num_of_listeners: 100,
    //   room_calendar_date: new Date(),
    // },
  ]);

  const allSessionsRef = useRef();

  const [rooms, setRooms] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [filteredSessions, setFilteredSessions] = useState([]);

  const [isLive, setIsLive] = useState(true);
  // const [roomTitle, setRoomTitle] = useState('');

  const [openRaisedHands, setOpenRaisedHands] = useState(true);

  // const [enableRoomPress, setEnableRoomPress] = useState(true);

  // const lottieRef = useRef(null);

  const scrollY = useRef(new Animated.Value(0)).current;

  const diffClamp = Animated.diffClamp(scrollY, 0, 100);

  const translateY = diffClamp.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  // const get_room = useRef(null);

  // const getRoom = async () => {
  //   get_room.current = await hmsInstance.getRoom();
  // };

  const [connectionStatus, setConnectionStatus] = useState(true);
  const [connectionType, setConnectionType] = useState(null);
  const [connectionReachable, setConnectionReachable] = useState(true);

  // const netInfo = useNetInfo();

  const isConnectedRef = useRef();
  const isInternetReachableRef = useRef();

  // navigate to screens
  const navigateTo = (screen_name, params) => {
    navigation.navigate(screen_name, params);
  };

  const onSessionPressed = async (item, room) => {
    if (isConnectedRef.current && isInternetReachableRef.current) {
      await hmsInstance.leave().then(() => console.log('leave first'));
      navigateTo('Room', {
        room_id: item.room_id, // '62d59cc4c166400656956984', //  62cd23bb76f8697390a7648a 61c08a6437f6edb72d7e2ce9 61c08b2eb682a91dd54b72b2
        // get_room: get_room.current,
        session: item,
        room: room,
        role: 'listener',
      });
    } else {
      alert(
        'Sorry, you can not join to room now! please check your internet connection.',
      );
    }
  };

  // generate random color
  const generateRandomColor = () => {
    const numbers = '123456789';
    let randomColor = '#';

    for (let i = 1; i <= 6; i++) {
      randomColor += numbers[Math.floor(Math.random() * numbers.length)];
    }

    return randomColor;
  };

  const _renderSession = ({item, index, separators}) => {
    const [roomSession] = rooms?.filter(room => room?.id == item?.room_id);
    let namearr = roomSession.name.split('_:ADYS:_');
    let roomName = namearr[0].replace(/-:-/g, ' ');
    const peers = Object.values(item?.peers);
    const activePeers = peers.filter(peer => !('left_at' in peer));
    const [host] = activePeers?.filter(peer => peer?.role == 'host');
    const hostName = host?.name;
    const hostImage = roomSession.user_info?.user_image;
    const peersLength = activePeers.length;

    return (
      <RoomCard
        roomTitle={roomName}
        roomHostName={hostName}
        roomHostImage={hostImage}
        roomStatus={item.active}
        // roomTopics={roomSession.topics}
        roomNumOfListeners={peersLength}
        roomBackground={roomSession.bgColor}
        textColor={theme.white}
        iconColor={theme.white}
        rippleColor={theme.ripple}
        // // disablePress={!enableRoomPress}
        onPress={() => onSessionPressed(item, roomSession)}
        // calendarDate={
        //   item.room_calendar_date ? item.room_calendar_date.toString() : null
        // }
        theme={theme}
        key={index}
      />
    );
  };

  const keyExtractor = useCallback((item, index) => index.toString(), []);

  // const getAsyncManagementToken = async () => {
  //   let token = await AsyncStorage.getItem('token');

  //   if (token !== null) {
  //     token = token;
  //   } else {
  //     token = '';
  //   }

  //   return token;
  // };

  // store it in AsyncStorage
  const getManagementToken = async () => {
    await axios
      .get('http://192.168.1.18/OnlineMeetingApi/generate_management_token.php')
      .then(res => {
        if (res.status == 200) {
          if (res.data) {
            setManagementToken(res.data);
            managementTokenRef.current = res.data;
          } else {
            console.log('not found');
          }
        }
      })
      .catch(err => {
        if (err.request) {
          console.log(err.request);
        } else {
          console.log(err.message);
        }
      });
  };

  // get rooms
  const getRooms = async () => {
    await axios
      .get('http://192.168.1.18/OnlineMeetingApi/get_rooms.php')
      .then(res => {
        if (res.status == 200) {
          if (res.data != 'Empty Rooms') {
            if (res.data != 'User Not Found') {
              // console.log(res.data);
              setRooms(res.data);
            } else {
              alert('Something wrong!');
            }
          } else {
            alert('There no rooms yet!');
          }
        }
      });
  };

  useEffect(() => {
    // getRoom();

    // setTimeout(() => {
    //   console.log('current joined room: =>', get_room.current);
    // }, 2000);

    // AsyncStorage.clear();

    // console.log(managementToken);

    // NetInfo
    NetInfo.fetch().then(state => {
      setConnectionStatus(state.isConnected);
      setConnectionType(state.type);
      setConnectionReachable(state.isInternetReachable);
    });

    const unsubscribeNetInfo = NetInfo.addEventListener(async state => {
      isConnectedRef.current = state.isConnected;
      isInternetReachableRef.current = state.isInternetReachable;

      if (state.isConnected && state.isInternetReachable) {
        getRooms();
        setGetSessionsLoading(true);
        await setConnectionStatus(state.isConnected);
        await setConnectionReachable(state.isInternetReachable);

        getManagementToken().then(() => {
          getSessions(managementTokenRef.current);
        });
      }
    });

    requestPermission(); // case ios

    // get token
    messaging()
      .getToken()
      .then(token => {
        // save token to database...
        setDeviceToken(token);
        console.log('token ==> ', token);
      });

    // on click on notification in background
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      alert(
        'Notification caused app to open from background state && navigating to settings screen',
      );
      navigation.navigate('SettingStack');
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('remoteMessage: ', JSON.stringify(remoteMessage));
      alert('remote message recieved');
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      let notificationTitle = remoteMessage.notification.title,
        notificationBody = remoteMessage.notification.body;

      NotificationService.displayRemoteNotification(
        notificationTitle,
        notificationBody,
        theme,
      );
    });

    // when the the app opened we cancel all notifications
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // console.log('App has come to the foreground!');
        notifee.cancelAllNotifications();
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      // console.log('AppState', appState.current);
    });

    if (hmsInstance) {
      setHmsInstanceLoading(false);
    }

    // if (theme.themeMode == 'dark') {
    //   lottieRef.current.play(0, 90);
    // }

    return (
      unsubscribe,
      // when app is opened
      notifee.onForegroundEvent(({type, detail}) => {
        switch (type) {
          case EventType.DISMISSED:
            console.log('User dismissed notification', detail.notification);
            alert('User dismissed notification');
            break;
          case EventType.PRESS:
            console.log('User pressed notification', detail.notification);
            alert('user pressed notification && navigating to settings screen');
            navigateTo('SettingStack');
            break;
        }
      }),
      () => {
        subscription.remove();
      },
      messaging().onTokenRefresh(token => {
        // saveTokenToDatabase(token); // save token to database
        setDeviceToken(token);
      }),
      () => unsubscribeNetInfo()
    );
  }, []);

  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
  };

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
      onPress: () => {
        console.log('search');
      },
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
      onPress: () => {
        // displayLocalNotification(theme);
        navigateTo('NotificationsScreen', {
          token: deviceToken,
        });
      },
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
    let sessions = [...allSessionsRef.current];

    // console.log(sessions);

    if (isLive) {
      sessions = sessions.filter(session => !session.active);

      setIsLive(false);
    } else {
      sessions = sessions.filter(session => session.active);

      setIsLive(true);
    }

    setFilteredSessions([...sessions]);
  };

  // const onTouchMove = e => {
  //   setEnableRoomPress(false);
  // };

  // const onTouchEnd = e => {
  //   setEnableRoomPress(true);
  // };

  const onChangeRoomTitle = value => {
    setRoomData({...roomData, name: value}); // accept more than 40 characters ==> "add unique value to room name"
  };

  const generateRandomText = () => {
    let result = '';
    let characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  };

  // create room
  const createRoom = token => {
    setCreateRoomLoading(true);

    let name = roomData.name
      ? roomData.name.trim().replace(/ /g, '-:-')
      : 'New-Room';
    name += '_:ADYS:_' + generateRandomText();

    let data = {...roomData, name: name};

    console.log(data);

    let config = {
      method: 'post',
      url: createRoomEndPoint,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      data: data, // accept more than 40 characters ==> "add unique value to room name"
    };

    if (isConnectedRef.current && isInternetReachableRef.current) {
      axios(config)
        .then(res => {
          if (res.status == 200) {
            console.log(res.data);

            const newRoom = {
              id: res.data.id,
              name: res.data.name,
              active: res.data.active,
              template: res.data.template,
              template_id: res.data.template_id,
              created_at: res.data.created_at,
              updated_at: res.data.updated_at,
              customer: res.data.customer,
              user: res.data.user,
              topics: 'Messi, Ady, hatem, othman',
              bgColor: generateRandomColor(),
              room_user_id: 1,
            };
            // setRooms([newRoom, ...rooms]);
            // setRoomsToAsync([newRoom, ...rooms]);

            addRoom({...newRoom});
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      alert(
        'Sorry, you can not create room now! please check your internet connection.',
      );
    }
  };

  // add room
  const addRoom = data => {
    axios
      .post('http://192.168.1.18/OnlineMeetingApi/add_room.php', data)
      .then(res => {
        if (res.status == 200) {
          if (res.data != 'Empty Data') {
            if (res.data == 'Success') {
              alert('Room added successfully🎉');

              setCreateRoomLoading(false);
              setRoomData({...roomData, name: ''});
              setShowModal(false);

              navigateTo('Room', {
                room_id: data.id, //  62cd23bb76f8697390a7648a 61c08a6437f6edb72d7e2ce9 61c08b2eb682a91dd54b72b2
                // get_room: get_room.current,
                room: data,
                role: 'host',
              });
            } else {
              alert('Error!');
            }
            console.log(res.data);
          } else {
            alert('data to send is empty!');
          }
        }
      });
  };

  // get sesseions
  const getSessions = token => {
    let config = {
      method: 'get',
      url:
        getSessionsEndPoint +
        '?active=true' +
        `${lastSessionId ? '&start=' + lastSessionId : ''}`,
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };

    axios(config)
      .then(res => {
        if (res.status == 200) {
          const sessions = res.data.data ? [...res.data.data] : [];
          // alert(JSON.stringify(sessions));
          // setAllSessions([...sessions]);
          allSessionsRef.current = [...sessions];

          setGetSessionsLoading(false);
          // console.log(res.data.data[0].peers);
          // navigateTo('Room', {
          //   room_id: res.data.id, //  62cd23bb76f8697390a7648a 61c08a6437f6edb72d7e2ce9 61c08b2eb682a91dd54b72b2
          //   get_room: get_room.current,
          //   room: res.data,
          // });
        }
      })
      .catch(err => {
        console.log(err.message);
      })
      .finally(() => handleTabPress(false));
  };

  // get sesseions
  const getSessionsFromRefreshing = token => {
    let config = {
      method: 'get',
      url:
        getSessionsEndPoint +
        '?active=true' +
        `${lastSessionId ? '&start=' + lastSessionId : ''}`,
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };

    axios(config)
      .then(res => {
        if (res.status == 200) {
          const sessions = res.data.data ? [...res.data.data] : [];
          // alert(JSON.stringify(sessions));
          // setAllSessions([...sessions]);
          allSessionsRef.current = [...sessions];

          setRefreshing(false);
          // console.log(res.data.data[0].peers);
          // navigateTo('Room', {
          //   room_id: res.data.id, //  62cd23bb76f8697390a7648a 61c08a6437f6edb72d7e2ce9 61c08b2eb682a91dd54b72b2
          //   get_room: get_room.current,
          //   room: res.data,
          // });
        }
      })
      .catch(err => {
        console.log(err.message);
      })
      .finally(() => handleTabPress(!isLive));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // let token = await AsyncStorage.getItem('token');
    getRooms().then(() => getSessionsFromRefreshing(managementToken));
  };

  return (
    <View style={[styles.body, {backgroundColor: theme.background}]}>
      <NativeBaseProvider>
        {/* Header */}
        <MainHeader
          title="Spaces"
          titlePosition="left"
          headerBackgroundColor={theme.background}
          leftBtn={
            <TouchableOpacity activeOpacity={0.9}>
              <Avatar
                bg={theme.card}
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
          elevation={1}
        />

        {/* multiple rooms */}
        <View style={{flex: 1}}>
          <Animated.View
            style={{
              ...styles.animatedView,
              transform: [{translateY}],
              backgroundColor: theme.background,
            }}>
            <TouchableOpacity
              activeOpacity={0.4}
              disabled={isLive || getSessionsLoading || refreshing}
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
              disabled={!isLive || getSessionsLoading || refreshing}
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

          {connectionStatus ? (
            connectionReachable ? (
              hmsInstanceLoading || getSessionsLoading ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator
                    size={SIZES.LG_ICON + height * 0.027}
                    color={theme.primary}
                  />
                </View>
              ) : filteredSessions.length == 0 ? (
                <View
                  style={{
                    flex: 1,
                  }}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                      <RefreshControl
                        colors={[theme.primary]}
                        progressBackgroundColor={theme.card}
                        progressViewOffset={65}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                      />
                    }>
                    <View
                      style={{
                        width: '100%',
                        height: height - 60 - StatusBar.currentHeight,
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: PADDINGS.PADDING,
                        // backgroundColor: '#f00',
                      }}>
                      <Text
                        style={[
                          styles.lgTextStyle,
                          {color: theme.text, textAlign: 'center'},
                        ]}>
                        There's no rooms yet!
                      </Text>
                    </View>
                  </ScrollView>
                </View>
              ) : (
                <FlatList
                  data={filteredSessions}
                  renderItem={_renderSession}
                  keyExtractor={keyExtractor}
                  // ListHeaderComponent={
                  //   <View style={styles.liveNowWrapper}>
                  //     <Text style={styles.lgTextStyle}>Live Now 🔴</Text>
                  //   </View>
                  // }
                  // onTouchMove={onTouchMove}
                  // onTouchEnd={onTouchEnd}
                  showsVerticalScrollIndicator={false}
                  onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: scrollY}}}],
                    {useNativeDriver: false},
                  )}
                  scrollEventThrottle={16}
                  contentContainerStyle={styles.contentContainerStyle}
                  refreshControl={
                    <RefreshControl
                      colors={[theme.primary]}
                      progressBackgroundColor={theme.card}
                      progressViewOffset={65}
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  maxToRenderPerBatch={7}
                  windowSize={7}
                />
              )
            ) : (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: PADDINGS.PADDING,
                }}>
                <Text
                  style={[
                    styles.lgTextStyle,
                    {color: theme.text, textAlign: 'center'},
                  ]}>
                  Unreachable Internet, Please check your internet.
                </Text>
              </View>
            )
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                padding: PADDINGS.PADDING,
              }}>
              <Text
                style={[
                  styles.lgTextStyle,
                  {color: theme.text, textAlign: 'center'},
                ]}>
                No Internet Connnection! Please reconnect to the internet.
              </Text>
            </View>
          )}
        </View>

        {/* ADD ROOM */}
        <View
          style={[
            styles.addRoomWrapper,
            {
              backgroundColor: theme.primary,
              // shadowColor:
              //   theme.themeMode == 'default' ? theme.black : theme.white,
            },
          ]}>
          <Pressable
            style={styles.addRoomBtn}
            android_ripple={{color: theme.ripple}}
            onPress={() => {
              setShowModal(true);
              // console.log(allSessions);
            }}>
            <MaterialCommunityIcons
              name="microphone-plus"
              size={SIZES.LG_ICON}
              color={theme.white}
            />
          </Pressable>
        </View>

        {/* Modal */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content
            width={width - 2 * PADDINGS.PADDING}
            style={{backgroundColor: theme.card, zIndex: 3, elevation: 3}}>
            <Modal.Header
              style={{
                backgroundColor: theme.card,
                borderBottomWidth: 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={[
                  styles.lgTextStyle,
                  {
                    color: theme.text,
                    fontWeight: '500',
                  },
                ]}>
                Create your Room
              </Text>
              <View
                style={[
                  styles.circleViewStyle,
                  {marginTop: PADDINGS.smPadding},
                ]}>
                <Pressable
                  style={styles.pressableStyle}
                  android_ripple={{color: theme.ripple, radius: 17.5}}
                  onPress={() => setShowModal(false)}>
                  <Ionicons
                    name="ios-close"
                    size={SIZES.LG_ICON}
                    color={theme.icon}
                  />
                </Pressable>
              </View>
            </Modal.Header>
            <Modal.Body>
              <TextInput
                value={roomData.name}
                onChangeText={onChangeRoomTitle}
                style={[
                  styles.roomTitleInputStyle,
                  {backgroundColor: theme.background, color: theme.text},
                ]}
                placeholder="Room Title"
                placeholderTextColor={theme.placeholder}
                maxLength={40}
              />

              <View
                style={[
                  styles.modalViewStyle,
                  {
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                    backgroundColor: theme.background,
                  },
                ]}>
                <Pressable
                  style={styles.modalPressableStyle}
                  android_ripple={{
                    color: theme.ripple,
                  }}>
                  <Text style={[styles.mdTextStyle, {color: theme.text}]}>
                    Add Topics
                  </Text>
                  <Feather
                    name="plus"
                    size={SIZES.ICON_SIZE}
                    color={theme.icon}
                  />
                </Pressable>
              </View>
              <View style={{height: 1}} />
              <View
                style={[
                  styles.modalViewStyle,
                  {
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10,
                    backgroundColor: theme.background,
                  },
                ]}>
                <Pressable
                  style={styles.modalPressableStyle}
                  android_ripple={{
                    color: theme.ripple,
                  }}
                  onPress={() => setOpenRaisedHands(!openRaisedHands)}>
                  <Text style={[styles.mdTextStyle, {color: theme.text}]}>
                    Open Hand Raising
                  </Text>
                  <Switch
                    size="md"
                    // defaultIsChecked={true}
                    isChecked={openRaisedHands}
                    onTrackColor={theme.selectionColor}
                    onThumbColor={theme.primary}
                    offThumbColor={theme.card}
                    onToggle={() => {
                      setOpenRaisedHands(!openRaisedHands);
                    }}
                  />
                </Pressable>
              </View>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: PADDINGS.PADDING,
                }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={[
                    styles.createRoomButton,
                    {backgroundColor: theme.primary},
                  ]}
                  onPress={async () => {
                    createRoom(managementToken);
                  }}
                  disabled={createRoomLoading}>
                  {createRoomLoading ? (
                    <ActivityIndicator size="large" color={theme.white} />
                  ) : (
                    <Text style={[styles.mdTextStyle, {color: theme.white}]}>
                      Start Room
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={[
                    styles.calendarButton,
                    {backgroundColor: theme.background},
                  ]}>
                  <Ionicons
                    name="ios-calendar"
                    size={SIZES.ICON_SIZE}
                    color={theme.primary}
                  />
                </TouchableOpacity>
              </View>
            </Modal.Body>
          </Modal.Content>
        </Modal>
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
  addRoomWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    position: 'absolute',
    bottom: PADDINGS.PADDING,
    right: PADDINGS.PADDING,
    elevation: 5,
  },
  addRoomBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleViewStyle: {
    width: 35,
    height: 35,
    overflow: 'hidden',
    borderRadius: 17.5,
  },
  pressableStyle: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomTitleInputStyle: {
    padding: 0,
    paddingHorizontal: PADDINGS.PADDING,
    marginBottom: PADDINGS.PADDING,
    height: 50,
    borderRadius: 10,
    fontSize: SIZES.MD_FONT_SIZE,
    fontWeight: '500',
  },
  modalViewStyle: {
    height: 50,
    overflow: 'hidden',
  },
  modalPressableStyle: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PADDINGS.PADDING,
    flexDirection: 'row',
  },
  createRoomButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    height: 50,
    marginRight: PADDINGS.PADDING,
  },
  calendarButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
