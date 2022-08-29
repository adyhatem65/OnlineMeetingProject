import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  Pressable,
  Image,
  Animated,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';

import {
  HMSUpdateListenerActions,
  HMSConfig,
  HMSPeer,
  HmsView,
  HMSSpeaker,
  HMSPeerUpdate,
  HMSLeaveRoomRequest,
} from '@100mslive/react-native-hms';
import {useHms} from '../../contexts/HmsProvider';

import {PADDINGS, SIZES} from '../../constants/SizesAndPaddings';

import {PERMISSIONS, RESULTS, requestMultiple} from 'react-native-permissions';

import {useTheme} from '../../contexts/ThemeProvider';

import RoomMemberAvatar from '../../components/RoomMemberAvatar';

import MainHeader from '../../components/MainHeader';
import BackButton from '../../components/BackButton';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';

import {
  Modal,
  NativeBaseProvider,
  Badge,
  Center,
  Switch,
  Avatar,
  // Collapse,
  // Alert,
} from 'native-base';

// bottom sheet
import RBSheet from 'react-native-raw-bottom-sheet';

const {width, height} = Dimensions.get('screen');

const endPoint =
  'https://prod-in.100ms.live/hmsapi/onlinemeeting.app.100ms.live/';

const getToken = async ({roomID, userID, role}) => {
  const url = `${endPoint}api/token`;

  const body = {
    room_id: roomID,
    user_id: userID,
    role: role,
  };

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers,
  });

  const result = await response.json();

  return result;
};

async function joinRoom(hmsInstance, roomID, userID, role) {
  if (!hmsInstance) {
    console.error('hmsInstance not found');
    return;
  }

  const {token} = await getToken({
    roomID,
    userID,
    role,
  });

  const hmsConfig = new HMSConfig({authToken: token, username: userID});

  await hmsInstance.join(hmsConfig);
}

const RoomScreen = ({route, navigation}) => {
  // params
  const {room_id, session, room, role} = route.params; // get_room

  // contexts
  const {theme} = useTheme();

  const hmsInstance = useHms();

  // states
  const [isMute, setisMute] = useState(false);
  const [participants, _setParticipants] = useState([]);
  const participantsRef = useRef(participants);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [animIcon, setAnimIcon] = useState(null);
  const [disableAnimBtns, setDisableAnimBtns] = useState(false);
  const [openRaisedHands, setOpenRaisedHands] = useState(true);
  const [handRaisedMemmbers, setHandRaisedMemmbers] = useState([]);
  const [loadingHandRaised, setLoadingHandRaised] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestedBy, setRequestedBy] = useState('');
  const [suggestedRole, setSuggestedRole] = useState('');
  const [currentPressedPeer, setCurrentPressedPeer] = useState({});
  const [currentPeerIndex, setCurrentPeerIndex] = useState(-1);
  // const [RBSheetHeight, setRBSheetHeight] = useState();
  const [removePeerLoading, setRemovePeerLoading] = useState(false);

  const userID = useRef('Test User').current;
  const roomID = useRef(room_id).current;

  const scaleAnim = useRef(new Animated.Value(0)).current;

  // bottom sheet ref
  const RBSheetRef = useRef();
  const RBSheetRef2 = useRef();

  // custom set participants fun
  const setParticipants = newValue => {
    participantsRef.current = newValue;
    _setParticipants(newValue);
  };

  const ON_JOIN = ({room, localPeer, remotePeers}) => {
    // Host
    const localParticipant = {
      id: localPeer?.peerID,
      name: localPeer?.name,
      role: localPeer?.role?.name,
      image: 'https://avatars.githubusercontent.com/u/72977824?v=4',
      // avatar: (
      //   <View
      //     style={{
      //       width: width * 0.2,
      //       height: width * 0.2,
      //       borderRadius: (width * 0.2) / 2,
      //       alignItems: 'center',
      //       justifyContent: 'center',
      //       backgroundColor: theme.card,
      //     }}>
      //     <Text
      //       style={{
      //         fontSize: SIZES.TITLE_FONT_SIZE,
      //         fontWeight: '600',
      //         color: theme.text,
      //       }}>
      //       {localPeer?.name?.substring(0, 2)?.toUpperCase()}
      //     </Text>
      //   </View>
      // ),
      isMute: localPeer?.audioTrack?.isMute(),
      audio_level: 0,
      meta_data: localPeer?.metadata ? JSON.parse(localPeer?.metadata) : null,
    };

    // Guest
    const remoteParticipants = remotePeers.map(remotePeer => {
      return {
        id: remotePeer?.peerID,
        name: remotePeer?.name,
        role: remotePeer?.role?.name,
        image: 'https://avatars.githubusercontent.com/u/72977824?v=4',
        // avatar: (
        //   <View
        //     style={{
        //       width: width * 0.2,
        //       height: width * 0.2,
        //       borderRadius: (width * 0.2) / 2,
        //       alignItems: 'center',
        //       justifyContent: 'center',
        //       backgroundColor: theme.card,
        //     }}>
        //     <Text
        //       style={{
        //         fontSize: SIZES.TITLE_FONT_SIZE,
        //         fontWeight: '600',
        //         color: theme.text,
        //       }}>
        //       {remotePeer?.name?.substring(0, 2)?.toUpperCase()}
        //     </Text>
        //   </View>
        // ),
        isMute: remotePeer?.audioTrack?.isMute(),
        audio_level: 0,
        meta_data: remotePeer?.metadata
          ? JSON.parse(remotePeer?.metadata)
          : null,
      };
    });

    let list = [localParticipant, ...remoteParticipants];
    let orderedList = [];

    let hosts = list.filter(member => member.role == 'host');
    let speakers = list.filter(member => member.role == 'speaker');
    let listeners = list.filter(member => member.role == 'listener');

    orderedList = orderedList.concat(hosts, speakers, listeners);

    setParticipants([...orderedList]);
    console.log('Joined');

    // set audio and video to be mute
    hmsInstance?.localPeer?.localVideoTrack()?.setMute(true);
    hmsInstance?.localPeer?.localAudioTrack()?.setMute(true);

    filterHandRaisedMembers();

    setIsLoading(false);
    // console.log(get_room);
  };

  // ON_PEER_UPDATE
  const ON_PEER_UPDATE = async ({peer, type, localPeer, remotePeers}) => {
    // Host
    const localParticipant = {
      id: localPeer?.peerID,
      name: localPeer?.name,
      role: localPeer?.role?.name,
      image: 'https://avatars.githubusercontent.com/u/72977824?v=4',
      // avatar: (
      //   <View
      //     style={{
      //       width: width * 0.2,
      //       height: width * 0.2,
      //       borderRadius: (width * 0.2) / 2,
      //       alignItems: 'center',
      //       justifyContent: 'center',
      //       backgroundColor: theme.card,
      //     }}>
      //     <Text
      //       style={{
      //         fontSize: SIZES.TITLE_FONT_SIZE,
      //         fontWeight: '600',
      //         color: theme.text,
      //       }}>
      //       {localPeer?.name?.substring(0, 2)?.toUpperCase()}
      //     </Text>
      //   </View>
      // ),
      isMute: localPeer?.audioTrack?.isMute(),
      audio_level: 0,
      // speaking: type == 'NO_DOMINANT_SPEAKER' ? false : true,
      meta_data: localPeer?.metadata ? JSON.parse(localPeer?.metadata) : null,
    };

    // Guest
    const remoteParticipants = remotePeers.map(remotePeer => {
      return {
        id: remotePeer?.peerID,
        name: remotePeer?.name,
        role: remotePeer?.role?.name,
        image: 'https://avatars.githubusercontent.com/u/72977824?v=4',
        // avatar: (
        //   <View
        //     style={{
        //       width: width * 0.2,
        //       height: width * 0.2,
        //       borderRadius: (width * 0.2) / 2,
        //       alignItems: 'center',
        //       justifyContent: 'center',
        //       backgroundColor: theme.card,
        //     }}>
        //     <Text
        //       style={{
        //         fontSize: SIZES.TITLE_FONT_SIZE,
        //         fontWeight: '600',
        //         color: theme.text,
        //       }}>
        //       {remotePeer?.name?.substring(0, 2)?.toUpperCase()}
        //     </Text>
        //   </View>
        // ),
        isMute: remotePeer?.audioTrack?.isMute(),
        audio_level: 0,
        // speaking: type == 'NO_DOMINANT_SPEAKER' ? false : true,
        meta_data: remotePeer?.metadata
          ? JSON.parse(remotePeer?.metadata)
          : null,
      };
    });

    let list = [localParticipant, ...remoteParticipants];
    let orderedList = [];

    let hosts = list.filter(member => member.role == 'host');
    let speakers = list.filter(member => member.role == 'speaker');
    let listeners = list.filter(member => member.role == 'listener');

    orderedList = orderedList.concat(hosts, speakers, listeners);

    setParticipants([...orderedList]);

    const parsedMetadata = hmsInstance?.localPeer?.metadata
      ? JSON.parse(hmsInstance?.localPeer?.metadata)
      : {};

    if (type === HMSPeerUpdate.METADATA_CHANGED) {
      setIsHandRaised(parsedMetadata.isHandRaised);

      console.log(hmsInstance?.localPeer?.metadata);

      filterHandRaisedMembers();

      // ! يااااااااااااااااااااااا غبى منقدرش نوصل لقيمة الستيت الحالية فى الليسينر يا اغبى الاغبياء
      // setTimeout(() => {
      //   console.log(isHandRaised);
      // }, 2000);
    }

    // on role changed ==> set isHandRaised => false
    if (type === HMSPeerUpdate.ROLE_CHANGED) {
      // for (let i = 0; i < hmsInstance?.remotePeers?.length; i++) {
      //   const metaData = hmsInstance?.remotePeers[i]?.metadata
      //     ? JSON.parse(hmsInstance?.remotePeers[i]?.metadata)
      //     : {};

      //   const role = hmsInstance?.remotePeers[i]?.role?.name;

      //   if (metaData.isHandRaised && (role == 'host' || role == 'speaker')) {
      //     await hmsInstance?.changeMetadata(
      //       JSON.stringify({
      //         ...metaData,
      //         isHandRaised: false,
      //       }),
      //     );
      //   }
      // }

      if (parsedMetadata.isHandRaised) {
        await hmsInstance?.changeMetadata(
          JSON.stringify({
            ...parsedMetadata,
            isHandRaised: false,
          }),
        );
      }
    }

    console.log(type);
  };

  const ON_TRACK_UPDATE = ({type, localPeer, remotePeers}) => {
    // Host
    const localParticipant = {
      id: localPeer?.peerID,
      name: localPeer?.name,
      role: localPeer?.role?.name,
      image: 'https://avatars.githubusercontent.com/u/72977824?v=4',
      // avatar: (
      //   <View
      //     style={{
      //       width: width * 0.2,
      //       height: width * 0.2,
      //       borderRadius: (width * 0.2) / 2,
      //       alignItems: 'center',
      //       justifyContent: 'center',
      //       backgroundColor: theme.card,
      //     }}>
      //     <Text
      //       style={{
      //         fontSize: SIZES.TITLE_FONT_SIZE,
      //         fontWeight: '600',
      //         color: theme.text,
      //       }}>
      //       {localPeer?.name?.substring(0, 2)?.toUpperCase()}
      //     </Text>
      //   </View>
      // ),
      isMute: localPeer?.audioTrack?.isMute(),
      audio_level: 0,
      meta_data: localPeer?.metadata ? JSON.parse(localPeer?.metadata) : null,
    };

    // Guest
    const remoteParticipants = remotePeers.map(remotePeer => {
      return {
        id: remotePeer?.peerID,
        name: remotePeer?.name,
        role: remotePeer?.role?.name,
        image: 'https://avatars.githubusercontent.com/u/72977824?v=4',
        // avatar: (
        //   <View
        //     style={{
        //       width: width * 0.2,
        //       height: width * 0.2,
        //       borderRadius: (width * 0.2) / 2,
        //       alignItems: 'center',
        //       justifyContent: 'center',
        //       backgroundColor: theme.card,
        //     }}>
        //     <Text
        //       style={{
        //         fontSize: SIZES.TITLE_FONT_SIZE,
        //         fontWeight: '600',
        //         color: theme.text,
        //       }}>
        //       {remotePeer?.name?.substring(0, 2)?.toUpperCase()}
        //     </Text>
        //   </View>
        // ),
        isMute: remotePeer?.audioTrack?.isMute(),
        audio_level: 0,
        meta_data: remotePeer?.metadata
          ? JSON.parse(remotePeer?.metadata)
          : null,
      };
    });

    let list = [localParticipant, ...remoteParticipants];
    let orderedList = [];

    let hosts = list.filter(member => member.role == 'host');
    let speakers = list.filter(member => member.role == 'speaker');
    let listeners = list.filter(member => member.role == 'listener');

    orderedList = orderedList.concat(hosts, speakers, listeners);

    setParticipants([...orderedList]);

    filterHandRaisedMembers();

    // console.log(type);
  };

  const onRemovedFromRoom = data => {
    console.log(data);

    // redirect to home screen
    navigateTo('Home');
  };

  // ON_SPEAKER

  // change role Request
  const onRoleChangeRequest = ({requestedBy, suggestedRole}) => {
    // open a promt to accept or reject the request
    // Alert.alert(
    //   'Request to speak',
    //   `${requestedBy.name} has requested you to change your role to ${suggestedRole.name}`,
    //   [
    //     {
    //       text: 'Cancel',
    //       onPress: () => console.log('Cancel Pressed'),
    //       style: 'cancel',
    //     },
    //     {text: 'OK', onPress: acceptRequest},
    //   ],
    // );

    const name = requestedBy.name;
    const role = suggestedRole.name;

    setRequestedBy(name);
    setSuggestedRole(role);

    setShowRequestModal(true);
  };

  // accept role change
  const acceptRequest = async () => {
    await hmsInstance.acceptRoleChange();
    setShowRequestModal(false);
  };

  useEffect(() => {
    // Join To Room
    requestMultiple([
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
    ]).then(results => {
      if (
        results['android.permission.CAMERA'] === RESULTS.GRANTED &&
        results['android.permission.RECORD_AUDIO'] === RESULTS.GRANTED
      ) {
        joinRoom(hmsInstance, roomID, userID, role);
      }
    });

    if (hmsInstance) {
      // ON_ERROR
      hmsInstance.addEventListener(HMSUpdateListenerActions.ON_ERROR, error =>
        console.error('ON_ERROR: ', error),
      );

      // ON_JOIN
      hmsInstance.addEventListener(HMSUpdateListenerActions.ON_JOIN, ON_JOIN);

      // ON_ROOM_UPDATE
      hmsInstance.addEventListener(
        HMSUpdateListenerActions.ON_ROOM_UPDATE,
        data => {
          console.log(`ON ROOM UPDATE: `, data);
        },
      );

      // ON_PEER_UPDATE
      hmsInstance.addEventListener(
        HMSUpdateListenerActions.ON_PEER_UPDATE,
        ON_PEER_UPDATE,
      );

      // ON_TRACK_UPDATE
      hmsInstance.addEventListener(
        HMSUpdateListenerActions.ON_TRACK_UPDATE,
        ON_TRACK_UPDATE,
      );

      // ON_REMOVED_FROM_ROOM
      hmsInstance.addEventListener(
        HMSUpdateListenerActions.ON_REMOVED_FROM_ROOM,
        onRemovedFromRoom,
      );

      // ON_PREVIEW ==> will be called on Preview success
      hmsInstance.addEventListener(HMSUpdateListenerActions.ON_PREVIEW, () => {
        console.log('ON_PREVIEW');
      });

      // ON_SPEAKER ==> will be called while speaking
      hmsInstance.addEventListener(
        HMSUpdateListenerActions.ON_SPEAKER,
        data => {
          // console.log(data);
          // console.log(JSON.stringify(peer.peer)),
          // console.log(peer.peer.peerID);

          // let speakers = data.peers;

          // console.log(participantsRef.current);

          if (data.peers.length != 0) {
            data.peers.map((speaker, index) => {
              let memberIndex = participantsRef.current.findIndex(
                member => member.id == speaker.peer.peerID,
              );
              // console.log(memberIndex);
              if (memberIndex != -1) {
                participantsRef.current[memberIndex].audio_level =
                  speaker.level;
                setParticipants([...participantsRef.current]);
              }
            });
          }

          // for (let i = 0; i < participants.length; i++) {
          //   console.log(participants[i].id);
          //   for (let j = 0; j < speakers.length; j++) {
          //     if (participants[i].id == speakers[j].peer.peerID) {
          //       participants[i].audio_level = speakers[j].level;
          //       console.log('true');
          //     }
          //   }
          // }
        },
      );

      // role change request
      hmsInstance.addEventListener(
        HMSUpdateListenerActions.ON_ROLE_CHANGE_REQUEST,
        onRoleChangeRequest,
      );
    }

    return () => {
      hmsInstance.removeAllListeners();
    };
    // getSessions()
  }, [hmsInstance, userID, roomID]);

  const _renderMember = ({item, index}) => (
    <RoomMemberAvatar
      theme={theme}
      member_name={item.name}
      member_role={item.role}
      member_image={item.image}
      is_mute={item.isMute}
      audio_level={item.audio_level}
      // speaking={item.speaking}
      meta_data={item.meta_data}
      item={item}
      local_peer_id={hmsInstance?.localPeer?.peerID}
      animation_icon={animIcon}
      scale_anim={scaleAnim}
      onAvatarPress={() => onMemberPressed(item, index)}
    />
  );

  const keyExtractor = (item, index) => index.toString();

  // navigate to screens
  const navigateTo = (screen_name, params) => {
    navigation.navigate(screen_name, params);
  };

  // Leave Room
  const leaveRoom = async () => {
    await hmsInstance.leave().then(() => console.log('leaved'));
    setShowModal(false);
    navigateTo('Home');
  };

  // End Room
  const endRoom = async () => {
    await hmsInstance.endRoom(false, 'Bye my friends');
    setShowModal(false);
    navigateTo('Home');
  };

  // Handle Exit Room
  function handleExitRoom(role) {
    // or we can check ==> role.permissions.endRoom;
    if (role == 'host') {
      setShowModal(true);
    } else {
      leaveRoom();
    }
  }

  // header right buttons
  const rightBtns = [
    {
      id: '1',
      color: theme.background,
      children: (
        <Ionicons
          name="ellipsis-horizontal"
          size={SIZES.ICON_SIZE}
          color={theme.icon}
        />
      ),
      onPress: () => {
        console.log('report call');
      },
    },
    {
      id: '2',
      color: theme.background,
      children: (
        <Ionicons name="ios-call" size={SIZES.ICON_SIZE} color={theme.red} />
      ),
      onPress: () => handleExitRoom(hmsInstance?.localPeer?.role?.name),
    },
  ];

  // mute & unmute & isHandRaised
  const handleMicButtonPress = async (isMute, is_hand_raised) => {
    const parsedMetadata = hmsInstance?.localPeer?.metadata
      ? JSON.parse(hmsInstance?.localPeer?.metadata)
      : {};

    if (hmsInstance?.localPeer?.role?.name != 'listener') {
      hmsInstance?.localPeer?.localAudioTrack().setMute(isMute);
    } else {
      // handle when some one raise hand

      // Raise Hand
      await hmsInstance?.changeMetadata(
        JSON.stringify({
          ...parsedMetadata,
          isHandRaised: is_hand_raised,
        }),
      );

      // setIsHandRaised(parsedMetadata.isHandRaised);
      // console.log(hmsInstance?.localPeer?.metadata);
      // console.log(isHandRaised);
    }
  };

  // heart or laugh animation
  const handleAnimation = icon_name => {
    setAnimIcon(icon_name);
    setDisableAnimBtns(true);

    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: 50,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 0,
        delay: 50,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setDisableAnimBtns(false);
    }, 1000);
  };

  // Test Switch
  // useEffect(() => {
  //   console.log(openRaisedHands);
  // }, [openRaisedHands]);

  // HandRaised peoples
  const filterHandRaisedMembers = () => {
    setLoadingHandRaised(true);
    const filteredMembers = participantsRef.current.filter(
      member => member.meta_data?.isHandRaised == true,
    );
    setHandRaisedMemmbers(filteredMembers);
    setLoadingHandRaised(false);
  };

  // speak request
  const requestToSpeak = async ID => {
    const index = hmsInstance?.remotePeers?.findIndex(
      item => item.peerID == ID,
    );
    const peer = hmsInstance?.remotePeers[index];
    const roles = hmsInstance?.knownRoles;
    const newRole = roles[0];
    const force = false;

    await hmsInstance.changeRole(peer, newRole, force); // request role change
  };

  // on member press
  const onMemberPressed = async (item, index) => {
    await setCurrentPressedPeer(item);
    await setCurrentPeerIndex(index);

    RBSheetRef2.current.open();
    // console.log(item);
    // console.log(index);
  };

  // get height of View inside bottom sheet
  // const onLayout = async event => {
  //   let {x, y, height, width} = event.nativeEvent.layout;
  //   setRBSheetHeight(height);
  // };

  // remove peer
  const removePeer = async () => {
    setRemovePeerLoading(true);

    const reason = 'removed from room';

    // const peer = hmsInstance?.remotePeers[currentPeerIndex];

    await hmsInstance.removePeer(currentPressedPeer.id, reason);

    setRemovePeerLoading(false);
  };

  useEffect(() => {
    if (!removePeerLoading) {
      setTimeout(() => {
        RBSheetRef2.current.close();
      }, 100);
    }
  }, [removePeerLoading]);

  return (
    <View style={[styles.containerStyle, {backgroundColor: theme.background}]}>
      {/* Header */}
      <MainHeader
        title={isLoading ? 'connecting...' : 'Room'}
        titlePosition="left"
        headerBackgroundColor={theme.background}
        leftBtn={
          <BackButton
            btnBackroundColor={theme.background}
            iconColor={theme.icon}
            rippleColor={theme.ripple}
            onPress={() => navigation.goBack()}
          />
        }
        rightBtns={rightBtns}
        shadowColor={theme.themeMode == 'default' ? theme.black : theme.white}
        elevation={0}
      />

      {/* Body */}
      <NativeBaseProvider>
        {!isLoading ? (
          <>
            {/* Room Title */}
            <View style={styles.sectionStyle}>
              <Text
                style={[
                  styles.mdTextStyle,
                  {
                    color: theme.text,
                    marginBottom: 3,
                    fontSize: SIZES.TITLE_FONT_SIZE,
                  },
                ]}>
                {room.name.split('_:ADYS:_')[0].replace(/-:-/g, ' ')}
              </Text>
              {room.topics.length > 0 ? (
                <Text style={[styles.smTextStyle, {color: theme.text2}]}>
                  {room.topics}
                </Text>
              ) : null}
            </View>

            {/* Room Members */}
            <FlatList
              style={{flex: 1}}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingLeft: PADDINGS.PADDING,
                paddingTop: PADDINGS.mdPadding,
              }}
              numColumns={4}
              // columnWrapperStyle={{
              //   alignItems: 'center',
              // }}
              data={participants}
              renderItem={_renderMember}
              keyExtractor={keyExtractor}
            />

            {/* Footer */}
            <View
              style={[
                styles.footerStyle,
                {
                  backgroundColor: theme.background,
                  borderTopWidth: 0.5,
                  borderTopColor: theme.border,
                },
              ]}>
              <Pressable
                style={[
                  styles.iconWrapperStyle,
                  {
                    backgroundColor: theme.primary_overlay,
                    flexDirection: 'row',
                    paddingHorizontal: PADDINGS.mdPadding,
                  },
                ]}>
                <Ionicons
                  name="ios-share-social-outline"
                  color={theme.icon}
                  size={SIZES.ICON_SIZE}
                  style={{marginRight: PADDINGS.smPadding}}
                />
                <Text style={[styles.textStyle, {color: theme.text}]}>
                  Share
                </Text>
              </Pressable>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                <View
                  style={[
                    styles.circleViewStyle,
                    {backgroundColor: theme.background},
                  ]}>
                  <Pressable
                    disabled={disableAnimBtns}
                    style={[styles.pressableStyle]}
                    android_ripple={{color: theme.ripple, radius: 20}}
                    onPress={() => {
                      handleAnimation('laugh');
                    }}>
                    <Image
                      source={require('../../assets/icons/laugh.png')}
                      resizeMode="contain"
                      style={{width: 36, height: 36}}
                    />
                  </Pressable>
                </View>
                <View
                  style={[
                    styles.circleViewStyle,
                    {backgroundColor: theme.background},
                  ]}>
                  <Pressable
                    disabled={disableAnimBtns}
                    style={[styles.pressableStyle]}
                    android_ripple={{color: theme.ripple, radius: 20}}
                    onPress={() => {
                      handleAnimation('heart');
                    }}>
                    <Ionicons
                      name="ios-heart"
                      size={SIZES.ICON_SIZE + 4}
                      color={theme.primary}
                    />
                  </Pressable>
                </View>
                {hmsInstance?.localPeer?.role?.name == 'host' && (
                  <View
                    style={[
                      styles.circleViewStyle,
                      {backgroundColor: theme.background, overflow: 'visible'},
                    ]}>
                    <Pressable
                      style={[styles.pressableStyle]}
                      android_ripple={{color: theme.ripple, radius: 20}}
                      onPress={() => RBSheetRef.current.open()}>
                      {handRaisedMemmbers.length > 0 ? (
                        <Badge // bg="red.400"
                          colorScheme="danger"
                          rounded="full"
                          zIndex={1}
                          variant="solid"
                          alignSelf="flex-end"
                          style={{
                            position: 'absolute',
                            minWidth: 23,
                            height: 23,
                            alignItems: 'center',
                            justifyContent: 'center',
                            top: 0,
                            right: 0,
                          }}
                          _text={{
                            fontSize: 10,
                            fontWeight: 'bold',
                          }}>
                          {handRaisedMemmbers.length}
                        </Badge>
                      ) : null}

                      <FontAwesome5
                        name="clipboard-list"
                        size={SIZES.ICON_SIZE - 1}
                        color={theme.primary}
                      />
                    </Pressable>
                  </View>
                )}
                <Pressable
                  style={[
                    styles.iconWrapperStyle,
                    {
                      backgroundColor: theme.primary_overlay,
                      width: 60,
                      height: 60,
                      marginLeft: PADDINGS.PADDING,
                    },
                  ]}
                  onPress={() => {
                    handleMicButtonPress(
                      !hmsInstance?.localPeer?.audioTrack?.isMute(),
                      !isHandRaised,
                    );
                  }}>
                  {hmsInstance?.localPeer?.role?.name == 'host' ||
                  hmsInstance?.localPeer?.role?.name == 'speaker' ? (
                    hmsInstance?.localPeer?.audioTrack?.isMute() ? (
                      <Ionicons
                        name="ios-mic-off-outline"
                        color={theme.red}
                        size={SIZES.LG_ICON}
                      />
                    ) : (
                      <Ionicons
                        name="ios-mic"
                        color={theme.primary}
                        size={SIZES.LG_ICON}
                      />
                    )
                  ) : isHandRaised ? (
                    <Ionicons
                      name="ios-hand-right"
                      color={theme.yellow}
                      size={SIZES.LG_ICON}
                    />
                  ) : (
                    <Ionicons
                      name="ios-hand-right-outline"
                      color={theme.icon}
                      size={SIZES.LG_ICON}
                    />
                  )}
                </Pressable>
              </View>
            </View>
          </>
        ) : null}

        {/* Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          // size="sm"
          overlayVisible={true}
          _backdrop={{
            bg: 'transparent',
          }}>
          <Modal.Content
            width={width * 0.4 + 2 * PADDINGS.mdPadding}
            style={[styles.menuContainerStyle, {backgroundColor: theme.card}]}>
            <View
              style={[
                styles.btnStyle,
                {
                  marginBottom: PADDINGS.mdPadding,
                  backgroundColor: '#00000070',
                },
              ]}>
              <Pressable
                style={styles.pressableStyle}
                android_ripple={{color: theme.ripple}}
                onPress={leaveRoom}>
                <Text style={[styles.textStyle, {color: theme.white}]}>
                  Just Leave
                </Text>
              </Pressable>
            </View>
            <View style={[styles.btnStyle, {backgroundColor: theme.red}]}>
              <Pressable
                style={styles.pressableStyle}
                android_ripple={{color: theme.ripple}}
                onPress={endRoom}>
                <Text style={[styles.textStyle, {color: theme.white}]}>
                  End Room
                </Text>
              </Pressable>
            </View>
          </Modal.Content>
        </Modal>

        {/* Request to speak modal */}
        <Modal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          // size="sm"
          overlayVisible={true}
          closeOnOverlayClick={false}
          _backdrop={{
            bg: 'transparent',
          }}
          // animationPreset="slide"
          // _slide={{
          //   placement: 'top',
          // }}
        >
          <Modal.Content
            width={width}
            style={[
              styles.requestSpeakModalStyle,
              {backgroundColor: theme.card},
            ]}>
            <View style={{marginBottom: PADDINGS.PADDING}}>
              <Text
                style={[
                  styles.mdTextStyle,
                  {color: theme.text},
                ]}>{`${requestedBy} has requested you to change your role to ${suggestedRole}`}</Text>
            </View>
            <View style={styles.buttonsModalView}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setShowRequestModal(false)}
                style={{
                  flex: 1,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 20,
                  backgroundColor: theme.card,
                  marginRight: PADDINGS.PADDING,
                  borderWidth: 2,
                  borderColor: theme.primary,
                }}>
                <Text style={[styles.mdTextStyle, {color: theme.primary}]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={acceptRequest}
                style={{
                  flex: 1,
                  height: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 20,
                  backgroundColor: theme.primary,
                }}>
                <Text style={[styles.mdTextStyle, {color: theme.white}]}>
                  accept invite
                </Text>
              </TouchableOpacity>
            </View>
          </Modal.Content>
        </Modal>

        {/* bottom sheet */}
        <RBSheet
          ref={RBSheetRef}
          height={height * 0.5}
          animationType="fade"
          closeOnDragDown
          closeOnPressMask
          closeOnPressBack
          openDuration={1000}
          closeDuration={800}
          dragFromTopOnly
          customStyles={{
            // wrapper: {
            //   backgroundColor: 'transparent',
            // },
            draggableIcon: {
              backgroundColor: theme.gray,
            },
            container: {
              // minHeight: 300,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              backgroundColor: theme.card,
              elevation: 15,
              zIndex: 5,
            },
          }}>
          <View style={styles.bottomSheetHeaderStyle}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <FontAwesome5
                name="clipboard-list"
                size={SIZES.ICON_SIZE}
                color={theme.icon}
              />
              <Text
                style={[
                  styles.mdTextStyle,
                  {
                    color: theme.text,
                    marginHorizontal: PADDINGS.PADDING,
                  },
                ]}>
                Raised Hands
              </Text>
            </View>
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
          </View>

          {handRaisedMemmbers.length > 0 ? (
            loadingHandRaised ? (
              <View style={styles.emptyViewStyle}>
                <ActivityIndicator size="large" color={theme.primary} />
              </View>
            ) : (
              <FlatList
                style={{flex: 1}}
                contentContainerStyle={{paddingTop: PADDINGS.PADDING}}
                data={handRaisedMemmbers}
                renderItem={({item, index}) => {
                  const fullName = item.name.split(' ');
                  const firstName = fullName.shift();
                  const lastName = fullName.pop();
                  const capLetters = firstName?.charAt(0) + lastName?.charAt(0);

                  return (
                    <View style={styles.handRaisedItemStyle}>
                      <Pressable
                        style={{flexDirection: 'row', alignItems: 'center'}}
                        onPress={() => alert('dfdf')}>
                        <Avatar
                          bg={theme.card}
                          size="md"
                          source={{
                            uri: item.image, // 'https://avatars.githubusercontent.com/u/72977824?v=4',
                          }}>
                          {capLetters.toUpperCase()}
                        </Avatar>
                        <View>
                          <Text
                            style={[
                              styles.mdTextStyle,
                              {
                                color: theme.text,
                                marginHorizontal: PADDINGS.PADDING,
                              },
                            ]}>
                            {item.name}
                          </Text>
                        </View>
                      </Pressable>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        style={[
                          styles.requestSpeakBtnStyle,
                          {backgroundColor: theme.primary},
                        ]}
                        onPress={() => requestToSpeak(item.id)}>
                        <Feather
                          name="plus"
                          size={SIZES.SM_ICON}
                          color={theme.white}
                        />
                        <Feather
                          name="mic"
                          size={SIZES.SM_ICON}
                          color={theme.white}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                }}
                keyExtractor={keyExtractor}
              />
            )
          ) : (
            <View style={styles.emptyViewStyle}>
              <Text style={[styles.mdTextStyle, {color: theme.text}]}>
                No hands Raised yet!
              </Text>
            </View>
          )}
        </RBSheet>

        {/* member details RBSheet */}
        <RBSheet
          ref={RBSheetRef2}
          height={
            hmsInstance?.localPeer?.peerID == currentPressedPeer.id
              ? 63 + 7 * PADDINGS.PADDING + 1 * 40 + height * 0.018 * 4
              : hmsInstance?.localPeer?.role?.name == 'host'
              ? 63 + 9 * PADDINGS.PADDING + 3 * 40 + height * 0.018 * 4
              : 63 + 8 * PADDINGS.PADDING + 2 * 40 + height * 0.018 * 4
          }
          animationType="fade"
          closeOnDragDown
          closeOnPressMask
          closeOnPressBack
          openDuration={1000}
          closeDuration={800}
          dragFromTopOnly
          customStyles={{
            // wrapper: {
            //   backgroundColor: 'transparent',
            // },
            draggableIcon: {
              backgroundColor: theme.gray,
            },
            container: {
              // flex: 1,
              // minHeight: 300,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              backgroundColor: theme.card,
              elevation: 15,
              zIndex: 5,
            },
          }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{paddingHorizontal: PADDINGS.PADDING}}>
              <View
                style={{
                  ...styles.rowViewStyle,
                  width: '100%',
                  justifyContent: 'space-between',
                  // backgroundColor: '#f00',
                }}>
                <View style={{...styles.rowViewStyle, flex: 1}}>
                  <Avatar
                    bg={theme.disabled}
                    size="lg"
                    source={{
                      uri: currentPressedPeer.image, // 'https://avatars.githubusercontent.com/u/72977824?v=4',
                    }}>
                    {currentPressedPeer?.name
                      ?.split(' ')
                      .shift()
                      ?.charAt(0)
                      .toUpperCase() +
                      currentPressedPeer?.name
                        ?.split(' ')
                        .pop()
                        ?.charAt(0)
                        .toUpperCase()}
                  </Avatar>
                  <View style={{marginLeft: PADDINGS.mdPadding, flex: 1}}>
                    <Text
                      style={[styles.mdTextStyle, {color: theme.text}]}
                      numberOfLines={1}>
                      {currentPressedPeer.name}
                    </Text>
                    <Text
                      style={[
                        styles.mdTextStyle,
                        {color: theme.gray, fontWeight: '400'},
                      ]}
                      numberOfLines={1}>
                      @adyhatem65
                    </Text>
                  </View>
                </View>
                {/* <View style={styles.circleViewStyle}>
                <Pressable
                  style={styles.pressableStyle}
                  android_ripple={{color: theme.ripple, radius: 20}}
                  onPress={() => RBSheetRef2.current.close()}>
                  <Ionicons
                    name="ios-close"
                    size={SIZES.ICON_SIZE}
                    color={theme.icon}
                  />
                </Pressable>
              </View> */}

                {hmsInstance?.localPeer?.peerID != currentPressedPeer.id ? (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={[
                      styles.followBtnStyle,
                      {backgroundColor: theme.primary},
                    ]}>
                    <Text style={[styles.mdTextStyle, {color: theme.white}]}>
                      Follow
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {/* followers & following */}
              <View
                style={{
                  ...styles.rowViewStyle,
                  width: '100%',
                  // justifyContent: 'space-between',
                  marginVertical: PADDINGS.PADDING,
                }}>
                <Text
                  style={[
                    styles.smTextStyle,
                    {
                      color: theme.text,
                      fontWeight: '500',
                      marginRight: 2 * PADDINGS.PADDING,
                    },
                  ]}>
                  100 followers
                </Text>
                <Text
                  style={[
                    styles.smTextStyle,
                    {color: theme.text, fontWeight: '500'},
                  ]}>
                  250 following
                </Text>
              </View>

              <View
                style={{
                  width: '100%',
                  marginBottom: PADDINGS.PADDING,
                  // backgroundColor: '#f00',
                }}>
                <Text
                  style={[
                    styles.smTextStyle,
                    {color: theme.text, fontWeight: '500'},
                  ]}
                  numberOfLines={3}>
                  Description pla pla pla pla pla pla pla pla pla pla pla pla
                  pla pla pla pla pla pla pla pla pla pla pla pla pla pla pla
                  pla pla pla pla pla pla pla pla pla pla pla pla pla pla pla
                  pla pla
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.5}
                style={[
                  styles.bottomSheetBtnStyle,
                  {backgroundColor: theme.disabled},
                ]}>
                <Text
                  style={[
                    styles.smTextStyle,
                    {color: theme.text, fontWeight: '600'},
                  ]}>
                  View full profile
                </Text>
              </TouchableOpacity>

              {(hmsInstance?.localPeer?.role?.name == 'host' ||
                hmsInstance?.localPeer?.role?.permissions?.removeOthers) &&
              hmsInstance?.localPeer?.peerID != currentPressedPeer.id ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={[
                    styles.bottomSheetBtnStyle,
                    {backgroundColor: theme.disabled},
                  ]}
                  onPress={removePeer}>
                  {removePeerLoading ? (
                    <ActivityIndicator size="large" color={theme.red} />
                  ) : (
                    <Text
                      style={[
                        styles.smTextStyle,
                        {color: theme.red, fontWeight: '600'},
                      ]}>
                      Remove from room
                    </Text>
                  )}
                </TouchableOpacity>
              ) : null}

              {hmsInstance?.localPeer?.peerID != currentPressedPeer.id ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={[
                    styles.bottomSheetBtnStyle,
                    {backgroundColor: theme.red},
                  ]}>
                  <Text
                    style={[
                      styles.smTextStyle,
                      {color: theme.white, fontWeight: '600'},
                    ]}>
                    Block
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </ScrollView>
        </RBSheet>
      </NativeBaseProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    width: width,
    height: height,
  },
  loadingTextStyle: {
    fontSize: SIZES.FONT_SIZE,
  },
  sectionStyle: {
    width: width,
    padding: PADDINGS.PADDING,
  },
  smTextStyle: {
    fontSize: SIZES.SM_FONT_SIZE,
  },
  textStyle: {
    fontSize: SIZES.FONT_SIZE,
  },
  mdTextStyle: {
    fontSize: SIZES.MD_FONT_SIZE,
    fontWeight: '600',
  },
  lgTextStyle: {
    fontSize: SIZES.LG_FONT_SIZE,
    fontWeight: '600',
  },
  menuContainerStyle: {
    elevation: 3,
    position: 'absolute',
    top: PADDINGS.mdPadding + 40,
    right: PADDINGS.PADDING,
    padding: PADDINGS.mdPadding,
    borderRadius: 5,
  },
  btnStyle: {
    width: width * 0.4,
    height: 40,
    borderRadius: 5,
    overflow: 'hidden',
  },
  pressableStyle: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerStyle: {
    width: width,
    padding: PADDINGS.PADDING,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapperStyle: {
    height: 40,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
  },
  circleViewStyle: {
    width: 40,
    height: 40,
    overflow: 'hidden',
    borderRadius: 20,
  },
  bottomSheetHeaderStyle: {
    width: width,
    padding: PADDINGS.PADDING,
    paddingLeft: PADDINGS.PADDING + PADDINGS.smPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emptyViewStyle: {
    width: width,
    // height: height * 0.5 - (4 * PADDINGS.PADDING + SIZES.ICON_SIZE),
    flex: 1,
    paddingHorizontal: PADDINGS.PADDING,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#f00',
  },
  handRaisedItemStyle: {
    width: width,
    paddingHorizontal: PADDINGS.PADDING,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: PADDINGS.PADDING,
  },
  requestSpeakBtnStyle: {
    paddingHorizontal: PADDINGS.PADDING,
    paddingVertical: PADDINGS.smPadding + 2,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestSpeakModalStyle: {
    elevation: 3,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    padding: PADDINGS.PADDING,
    zIndex: 5,
    borderRadius: 0,
  },
  buttonsModalView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  followBtnStyle: {
    paddingHorizontal: 1.5 * PADDINGS.PADDING,
    height: 37,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
  },
  rowViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomSheetBtnStyle: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 40,
    marginBottom: PADDINGS.PADDING,
  },
});

export default RoomScreen;
