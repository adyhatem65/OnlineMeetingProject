import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';

import {useTheme} from '../../contexts/ThemeProvider';

import Icon from 'react-native-vector-icons/AntDesign';

import AsyncStorage from '@react-native-async-storage/async-storage';

import RadionButton from '../../components/RadionButton';

import {useDarkMode} from 'react-native-dark-mode';

import MainHeader from '../../components/MainHeader';

import {PADDINGS} from '../../constants/SizesAndPaddings';

import BackButton from '../../components/BackButton';

const {width, height} = Dimensions.get('screen');

const headerHeight = height * 0.08;

// const smallFontSize = height * 0.02;
// const mediumFontSize = height * 0.025;
// const largeFontSize = height * 0.03;

// const smallPadding = height / 40;

const ChooseTheme = ({navigation}) => {
  const [currentIndex, setCurrentIndex] = useState(null);

  // var colorScheme = useColorScheme();

  const {theme, toggleTheme} = useTheme();

  var isDarkMode = useDarkMode();

  const background = theme.background;
  const primary = theme.primary;
  const text = theme.text;
  const text2 = theme.text2;
  const border = theme.border;
  const card = theme.card;
  const navBackground = theme.nav.background;
  const navActive = theme.nav.active;
  const navInActive = theme.nav.inActive;
  const themeMode = theme.themeMode;
  const placeholder = theme.placeholder;
  const ripple = theme.ripple;
  const icon = theme.icon;

  const radioBtns = [
    {
      id: '1',
      label: 'Always light theme',
      value: 'dark',
      selected: false,
    },
    {
      id: '2',
      label: 'Always dark theme',
      value: 'default',
      selected: false,
    },
    {
      id: '3',
      label: 'Same as device theme',
      value: isDarkMode ? 'default' : 'dark',
      selected: false,
    },
  ];

  const getIndex = async () => {
    let index = await AsyncStorage.getItem('index');

    if (index == null) {
      index = 2;
    } else {
      index = JSON.parse(index);
    }

    setCurrentIndex(index);
  };

  const setIndex = async index => {
    await AsyncStorage.setItem('index', JSON.stringify(index));
  };

  const selectTheme = index => {
    setCurrentIndex(index);
    setIndex(index);
  };

  useEffect(() => {
    getIndex();
    // let index = await AsyncStorage.getItem('index');
    // index = JSON.parse(index);
    // if (index == 2) {
    //   if (isDarkMode) {
    //     toggleTheme('default');
    //   } else {
    //     toggleTheme('dark');
    //   }
    // }
  }, []);

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({item, index}) => {
    return (
      <RadionButton
        label={item.label}
        selected={index == currentIndex ? true : false}
        onSelect={() => {
          selectTheme(index);
          toggleTheme(item.value);
        }}
      />
    );
  };

  const goBack = () => navigation.goBack();

  return (
    <View style={{...styles.body, backgroundColor: background}}>
      {/* <View style={styles.header}>
        <View style={styles.titleView}>
          <Text style={{...styles.headerTitle, color: text2}}>
            {'اختيار السمة'}
          </Text>
        </View>
        <View style={styles.backButtonView}>
          <Pressable
            style={styles.backButton}
            android_ripple={{color: ripple, radius: headerHeight * 0.35}}
            onPress={() => navigation.goBack()}>
            <Icon name="arrowright" size={largeFontSize} color={icon} />
          </Pressable>
        </View>
      </View> */}

      {/* header */}
      <MainHeader
        title="Change Theme"
        titlePosition="center"
        headerBackgroundColor={theme.background}
        leftBtn={
          <BackButton
            onPress={goBack}
            rippleColor={theme.ripple}
            iconColor={theme.icon}
            btnBackroundColor={theme.background}
          />
        }
        shadowColor={theme.themeMode == 'default' ? theme.black : theme.white}
      />

      {/* choose theme */}
      <FlatList
        data={radioBtns}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={{paddingVertical: PADDINGS.PADDING}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    // paddingTop: smallPadding,
  },
  header: {
    height: headerHeight,
    width: width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  // headerTitle: {
  //   fontSize: largeFontSize,
  //   fontWeight: '700',
  // },
  titleView: {
    paddingHorizontal: 10,
    maxWidth: width * 0.6,
  },
  backButtonView: {
    width: width * 0.2,
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  backButton: {
    width: headerHeight * 0.7,
    height: headerHeight * 0.7,
    borderRadius: headerHeight,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
});

export default ChooseTheme;
