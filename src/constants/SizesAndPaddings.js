import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('screen');

export const SIZES = {
  TITLE_FONT_SIZE: height * 0.03,
  FONT_SIZE: height * 0.02,
  ICON_SIZE: height * 0.03,
};

export const PADDINGS = {
  PADDING: 15,
};
