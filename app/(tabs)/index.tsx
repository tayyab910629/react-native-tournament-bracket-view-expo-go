import React from 'react';
import { ScrollView, StyleSheet, View, Text, Image } from 'react-native';
import Svg, { Line } from 'react-native-svg';

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

// Function to calculate the positions of matches
function calculateMatchPositions(stages) {
  const matchHeight = 80;
  const verticalSpacing = 20;
  const positions = [];

  stages.forEach((stage, stageIndex) => {
    const matches = stage.length;
    const stagePositions = [];
    if (stageIndex === 0) {
      // For the first stage, positions are evenly spaced
      for (let i = 0; i < matches; i++) {
        stagePositions.push(i * (matchHeight + verticalSpacing));
      }
    } else {
      // For subsequent stages, positions are based on previous stage
      const prevStagePositions = positions[stageIndex - 1];
      for (let i = 0; i < matches; i++) {
        const pos1 = prevStagePositions[i * 2];
        const pos2 = prevStagePositions[i * 2 + 1];
        const avgPos = (pos1 + pos2) / 2;
        stagePositions.push(avgPos);
      }
    }
    positions.push(stagePositions);
  });
  return positions;
}

export default function HomeScreen() {
  const matchHeight = 80;
  const matchWidth = 150;
  const verticalSpacing = 20;
  const horizontalSpacing = 50;
  const positions = calculateMatchPositions(stages);

  // Calculate totalHeight based on the last match position
  const lastStageIndex = positions.length - 1;
  const lastStagePositions = positions[lastStageIndex];
  const lastMatchIndex = lastStagePositions.length - 1;
  const lastMatchPosition = lastStagePositions[lastMatchIndex];

  const totalHeight = lastMatchPosition + matchHeight;
  const totalWidth = stages.length * (matchWidth + horizontalSpacing);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { width: totalWidth, height: totalHeight },
        ]}
        horizontal
      >
        <View style={styles.bracketContainer}>
          {/* Render Lines */}
          <Svg height={totalHeight} width={totalWidth} style={styles.linesSvg}>
            {stages.map((stage, stageIndex) => {
              if (stageIndex === stages.length - 1) return null;
              return stage.map((match, matchIndex) => {
                const nextMatchIndex = Math.floor(matchIndex / 2);
                const startX =
                  stageIndex * (matchWidth + horizontalSpacing) + matchWidth;
                const startY =
                  positions[stageIndex][matchIndex] + matchHeight / 2;
                const endX =
                  (stageIndex + 1) * (matchWidth + horizontalSpacing);
                const endY =
                  positions[stageIndex + 1][nextMatchIndex] + matchHeight / 2;
                const midX = (startX + endX) / 2;

                return (
                  <React.Fragment key={`line-${stageIndex}-${matchIndex}`}>
                    {/* Horizontal line from current match to midpoint */}
                    <Line
                      x1={startX}
                      y1={startY}
                      x2={midX}
                      y2={startY}
                      stroke="#FFF"
                      strokeWidth="2"
                    />
                    {/* Vertical line from midpoint to next match */}
                    <Line
                      x1={midX}
                      y1={startY}
                      x2={midX}
                      y2={endY}
                      stroke="#FFF"
                      strokeWidth="2"
                    />
                    {/* Horizontal line from midpoint to next match */}
                    <Line
                      x1={midX}
                      y1={endY}
                      x2={endX}
                      y2={endY}
                      stroke="#FFF"
                      strokeWidth="2"
                    />
                  </React.Fragment>
                );
              });
            })}
          </Svg>

          {/* Render Matches */}
          {stages.map((stage, stageIndex) =>
            stage.map((match, matchIndex) => (
              <View
                key={`match-${stageIndex}-${matchIndex}`}
                style={[
                  styles.matchContainer,
                  {
                    top: positions[stageIndex][matchIndex],
                    left: stageIndex * (matchWidth + horizontalSpacing),
                  },
                ]}
              >
                <View style={styles.card}>
                  <Text style={styles.status}>{match.status}</Text>
                  <View style={styles.team}>
                    <Image
                      source={placeholderFlag}
                      style={styles.flag}
                      resizeMode="contain"
                    />
                    <Text style={styles.teamName}>{match.team1}</Text>
                    <Text style={styles.score}>{match.score1}</Text>
                  </View>
                  <View style={styles.team}>
                    <Image
                      source={placeholderFlag}
                      style={styles.flag}
                      resizeMode="contain"
                    />
                    <Text style={styles.teamName}>{match.team2}</Text>
                    <Text style={styles.score}>{match.score2}</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1A', // Set the background color here
  },
  scrollContainer: {
    // No background color here
  },
  bracketContainer: {
    position: 'relative',
    // No background color here
  },
  matchContainer: {
    position: 'absolute',
    // Remove background color to prevent overlapping
  },
  card: {
    backgroundColor: '#1A1A2E',
    padding: 8,
    borderRadius: 8,
    width: 150,
    height: 80,
    justifyContent: 'center',
    // Elevation and zIndex to bring cards above lines if needed
    elevation: 1,
    zIndex: 1,
  },
  status: {
    color: '#FFD700',
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  team: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  flag: {
    width: 24,
    height: 24,
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  teamName: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
  },
  score: {
    color: '#FFF',
    fontSize: 14,
  },
  linesSvg: {
    position: 'absolute',
    left: 0,
    top: 0,
    // No background color here
    // Ensure lines are beneath the cards
    zIndex: 0,
  },
});
