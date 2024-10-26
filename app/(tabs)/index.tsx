import React from 'react';
import { ScrollView, StyleSheet, View, Text, Image, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

// Placeholder image for all flags
const placeholderFlag = require('@/assets/placeholder.png');

// Define the data for each stage in the knockout bracket
const stages = [
  // Round of 16
  [
    { team1: 'Spain', score1: 4, team2: 'Georgia', score2: 1, status: 'Full time' },
    { team1: 'Germany', score1: 2, team2: 'Denmark', score2: 0, status: 'Full time' },
    { team1: 'Portugal', score1: 3, team2: 'France', score2: 0, status: 'Full time' },
    { team1: 'Italy', score1: 1, team2: 'Netherlands', score2: 2, status: 'Full time' },
    { team1: 'Belgium', score1: 3, team2: 'Croatia', score2: 2, status: 'Full time' },
    { team1: 'Sweden', score1: 1, team2: 'Norway', score2: 2, status: 'Full time' },
    { team1: 'Switzerland', score1: 2, team2: 'Austria', score2: 0, status: 'Full time' },
    { team1: 'England', score1: 1, team2: 'Scotland', score2: 0, status: 'Full time' },
  ],
  // Quarter-finals
  [
    { team1: 'Spain', score1: 2, team2: 'Germany', score2: 1, status: 'Full time' },
    { team1: 'Portugal', score1: 1, team2: 'Netherlands', score2: 2, status: 'Full time' },
    { team1: 'Belgium', score1: 2, team2: 'Norway', score2: 1, status: 'Full time' },
    { team1: 'Switzerland', score1: 1, team2: 'England', score2: 2, status: 'Full time' },
  ],
  // Semi-finals
  [
    { team1: 'Spain', score1: 2, team2: 'Netherlands', score2: 1, status: 'After extra time' },
    { team1: 'Belgium', score1: 1, team2: 'England', score2: 2, status: 'Full time' },
  ],
  // Final
  [
    { team1: 'Spain', score1: 3, team2: 'England', score2: 1, status: 'Full time' },
  ],
];

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container} horizontal>
      {stages.map((stage, stageIndex) => (
        <View key={stageIndex} style={styles.stageContainer}>
          {stage.map((match, matchIndex) => (
            <View key={matchIndex} style={styles.matchContainer}>
              <View style={styles.card}>
                <Text style={styles.status}>{match.status}</Text>
                <View style={styles.team}>
                  <Image source={placeholderFlag} style={styles.flag} />
                  <Text style={styles.teamName}>{match.team1}</Text>
                  <Text style={styles.score}>{match.score1}</Text>
                </View>
                <View style={styles.team}>
                  <Image source={placeholderFlag} style={styles.flag} />
                  <Text style={styles.teamName}>{match.team2}</Text>
                  <Text style={styles.score}>{match.score2}</Text>
                </View>
              </View>
              {/* Connecting lines for rounds except the Final */}
              {stageIndex < stages.length - 1 && (
                <View style={styles.lineContainer}>
                  <View style={styles.verticalLine} />
                  <View style={styles.horizontalLine} />
                </View>
              )}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    backgroundColor: '#0A0A1A',
    flexDirection: 'row',
    alignItems: 'center',
  },
  stageContainer: {
    width: screenWidth / 2,
    alignItems: 'center',
  },
  matchContainer: {
    marginBottom: 32,
    alignItems: 'center',
    position: 'relative',
  },
  card: {
    backgroundColor: '#1A1A2E',
    padding: 16,
    borderRadius: 8,
    width: 150,
    alignItems: 'center',
  },
  status: {
    color: '#FFD700',
    fontSize: 14,
    marginBottom: 4,
  },
  team: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  flag: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  teamName: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
  },
  score: {
    color: '#FFF',
    fontSize: 16,
  },
  lineContainer: {
    position: 'absolute',
    right: -75, // Adjust to connect to the next round
    top: 20,
    alignItems: 'center',
  },
  verticalLine: {
    width: 2,
    height: 40,
    backgroundColor: '#FFF',
  },
  horizontalLine: {
    width: 75,
    height: 2,
    backgroundColor: '#FFF',
    position: 'relative',
    top: -20,
  },
});
