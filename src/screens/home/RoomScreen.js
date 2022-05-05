import React, {useState, useEffect, useRef} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
} from 'react-native';

import {HMSUpdateListenerActions, HMSConfig} from '@100mslive/react-native-hms';
import {useHms} from '../../contexts/HmsProvider';

import {SIZES} from '../../constants/SizesAndPaddings';

import {defaultTheme} from '../../constants/Theme';

import {PERMISSIONS, RESULTS, requestMultiple} from 'react-native-permissions';

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

async function joinRoom(hmsInstance, roomID, userID) {
  if (!hmsInstance) {
    console.error('hmsInstance not found');
    return;
  }

  const {token} = await getToken({
    roomID,
    userID,
    role: 'host',
  });

  const hmsConfig = new HMSConfig({authToken: token, username: userID});

  hmsInstance.join(hmsConfig);
}

const RoomScreen = ({route, navigation}) => {
  // params
  const {room_id} = route.params;

  const hmsInstance = useHms();
  const [isMute, setisMute] = useState(false);
  const [participants, setParticipants] = useState([]);

  const userID = useRef('Test User').current;
  const roomID = useRef(room_id).current;

  const ON_JOIN = ({room, localPeer, remotePeers}) => {
    // Host
    const localParticipant = {
      id: localPeer?.peerID,
      name: localPeer?.name,
      role: localPeer?.role?.name,
      avatar: (
        <View
          style={{
            width: width * 0.2,
            height: width * 0.2,
            borderRadius: (width * 0.2) / 2,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: defaultTheme.card,
          }}>
          <Text
            style={{
              fontSize: SIZES.TITLE_FONT_SIZE,
              fontWeight: '600',
              color: defaultTheme.text,
            }}>
            {localPeer?.name?.substring(0, 2)?.toUpperCase()}
          </Text>
        </View>
      ),
      isMute: localPeer?.audioTrack?.isMute(),
    };

    // Guest
    const remoteParticipants = remotePeers.map(remotePeer => {
      return {
        id: remotePeer?.peerID,
        name: remotePeer?.name,
        role: remotePeer?.role?.name,
        avatar: (
          <View
            style={{
              width: width * 0.2,
              height: width * 0.2,
              borderRadius: (width * 0.2) / 2,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: defaultTheme.card,
            }}>
            <Text
              style={{
                fontSize: SIZES.TITLE_FONT_SIZE,
                fontWeight: '600',
                color: defaultTheme.text,
              }}>
              {remotePeer?.name?.substring(0, 2)?.toUpperCase()}
            </Text>
          </View>
        ),
        isMute: remotePeer?.audioTrack?.isMute(),
      };
    });

    setParticipants([localParticipant, ...remoteParticipants]);
    console.log('Joined');
  };

  // ON_PEER_UPDATE
  const ON_PEER_UPDATE = ({localPeer, remotePeers}) => {
    // Host
    const localParticipant = {
      id: localPeer?.peerID,
      name: localPeer?.name,
      role: localPeer?.role?.name,
      avatar: (
        <View
          style={{
            width: width * 0.2,
            height: width * 0.2,
            borderRadius: (width * 0.2) / 2,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: defaultTheme.card,
          }}>
          <Text
            style={{
              fontSize: SIZES.TITLE_FONT_SIZE,
              fontWeight: '600',
              color: defaultTheme.text,
            }}>
            {localPeer?.name?.substring(0, 2)?.toUpperCase()}
          </Text>
        </View>
      ),
      isMute: localPeer?.audioTrack?.isMute(),
    };

    // Guest
    const remoteParticipants = remotePeers.map(remotePeer => {
      return {
        id: remotePeer?.peerID,
        name: remotePeer?.name,
        role: remotePeer?.role?.name,
        avatar: (
          <View
            style={{
              width: width * 0.2,
              height: width * 0.2,
              borderRadius: (width * 0.2) / 2,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: defaultTheme.card,
            }}>
            <Text
              style={{
                fontSize: SIZES.TITLE_FONT_SIZE,
                fontWeight: '600',
                color: defaultTheme.text,
              }}>
              {remotePeer?.name?.substring(0, 2)?.toUpperCase()}
            </Text>
          </View>
        ),
        isMute: remotePeer?.audioTrack?.isMute(),
      };
    });

    setParticipants([localParticipant, ...remoteParticipants]);
  };

  const ON_TRACK_UPDATE = ({localPeer, remotePeers}) => {
    // Host
    const localParticipant = {
      id: localPeer?.peerID,
      name: localPeer?.name,
      role: localPeer?.role?.name,
      avatar: (
        <View
          style={{
            width: width * 0.2,
            height: width * 0.2,
            borderRadius: (width * 0.2) / 2,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: defaultTheme.card,
          }}>
          <Text
            style={{
              fontSize: SIZES.TITLE_FONT_SIZE,
              fontWeight: '600',
              color: defaultTheme.text,
            }}>
            {localPeer?.name?.substring(0, 2)?.toUpperCase()}
          </Text>
        </View>
      ),
      isMute: localPeer?.audioTrack?.isMute(),
    };

    // Guest
    const remoteParticipants = remotePeers.map(remotePeer => {
      return {
        id: remotePeer?.peerID,
        name: remotePeer?.name,
        role: remotePeer?.role?.name,
        avatar: (
          <View
            style={{
              width: width * 0.2,
              height: width * 0.2,
              borderRadius: (width * 0.2) / 2,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: defaultTheme.card,
            }}>
            <Text
              style={{
                fontSize: SIZES.TITLE_FONT_SIZE,
                fontWeight: '600',
                color: defaultTheme.text,
              }}>
              {remotePeer?.name?.substring(0, 2)?.toUpperCase()}
            </Text>
          </View>
        ),
        isMute: remotePeer?.audioTrack?.isMute(),
      };
    });

    setParticipants([localParticipant, ...remoteParticipants]);
  };

  // const onRemovedFromRoom = ()

  useEffect(() => {
    if (hmsInstance) {
      // ON_ERROR
      hmsInstance.addEventListener(HMSUpdateListenerActions.ON_ERROR, error =>
        console.error('ON_ERROR', error),
      );

      // ON_JOIN
      hmsInstance.addEventListener(HMSUpdateListenerActions.ON_JOIN, ON_JOIN);

      // ON_ROOM_UPDATE
      hmsInstance.addEventListener(
        HMSUpdateListenerActions.ON_ROOM_UPDATE,
        data => {
          console.log(`ON ROOM UPDATE`, data);
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
        data => {
          console.log(`ON_REMOVED_FROM_ROOM`, data);
        },
      );

      // ON_PREVIEW ==> will be called on Preview success
      hmsInstance.addEventListener(HMSUpdateListenerActions.ON_PREVIEW, () => {
        console.log('ON_PREVIEW');
      });
    }

    // Join To Room
    requestMultiple([
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
    ]).then(results => {
      if (
        results['android.permission.CAMERA'] === RESULTS.GRANTED &&
        results['android.permission.RECORD_AUDIO'] === RESULTS.GRANTED
      ) {
        joinRoom(hmsInstance, roomID, userID);
      }
    });
  }, [hmsInstance, userID, roomID]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 20, fontStyle: 'italic'}}>
        Hello from RoomScreen!
      </Text>
      <FlatList
        data={participants}
        renderItem={({item, index}) => (
          <View>
            <Text>{item.name}</Text>
            {item.avatar}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button
        title="leave"
        onPress={async () => {
          await hmsInstance.leave().then(() => {
            console.log('leaved');
          });
        }}
      />
      <Button
        title="endRoom"
        onPress={async () => {
          await hmsInstance.endRoom(false, 'Host ended the room');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default RoomScreen;
