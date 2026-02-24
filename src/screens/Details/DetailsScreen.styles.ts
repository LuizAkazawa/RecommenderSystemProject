import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text,
  },
  trackId: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 20,
  },
  albumArt: {
    width: 200,
    height: 200,
    marginVertical: 20,
    borderRadius: 10,
  },
  sliderContainer: {
    width: '80%',
    marginTop: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default styles;