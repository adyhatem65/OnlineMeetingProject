import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('screen');

export const SIZES = {
  TITLE_FONT_SIZE: height * 0.03,
  FONT_SIZE: height * 0.02,
  LG_FONT_SIZE: height * 0.034,
  MD_FONT_SIZE: height * 0.021,
  SM_FONT_SIZE: height * 0.018,
  ICON_SIZE: 22,
  LG_ICON: 30,
  SM_ICON: 20,
};

export const PADDINGS = {
  PADDING: 15,
  mdPadding: 10,
  smPadding: 5,
};
