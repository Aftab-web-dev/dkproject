import { Text, TextProps } from './Themed';

export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'SpaceMono' }]} />;
}
export function RobotoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'RobotoRegular' }]} />;
}

export function RobotoBoldText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'RobotoBold' }]} />;
}

export function RobotoLightText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'RobotoLight' }]} />;
}

export function RobotoMediumText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'RobotoMedium' }]} />;
}

export function RobotoSemiBoldText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'RobotoSemiBold' }]} />;
}

export function RobotoThinText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'RobotoThin' }]} />;
}

