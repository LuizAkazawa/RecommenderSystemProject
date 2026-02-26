import React from 'react';
import { Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GRADIENT_PALETTE = [
  ['#FF6B6B', '#FFE66D'],
  ['#4ECDC4', '#556270'],
  ['#A8EDEA', '#FED6E3'],
  ['#5C258D', '#4389A2'],
  ['#F7971E', '#FFD200'],
  ['#42275A', '#734B6D'],
  ['#11998E', '#38EF7D'],
  ['#C94B4B', '#4B134F'],
  ['#2193B0', '#6DD5ED'],
  ['#CC2B5E', '#753A88'],
  ['#1D976C', '#93F9B9'],
  ['#373B44', '#4286F4'],
];

// Turns a string into a consistent index
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

const getGradientColors = (trackName) => {
  const index = hashString(trackName) % GRADIENT_PALETTE.length;
  return GRADIENT_PALETTE[index];
};

const MusicCover = ({ trackName, style }) => {
  const colors = getGradientColors(trackName || '');
  // Initials from track name for a nice visual touch
  const initials = trackName
    ? trackName.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : '?';

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.cover, style]}
    >
      <Text style={styles.initials}>{initials}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  cover: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 2,
  },
});

export default MusicCover;