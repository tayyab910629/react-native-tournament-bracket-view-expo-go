import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, Image } from 'react-native';
import Svg, { Line } from 'react-native-svg';

const API_URL =
  'https://socca.leisureleagues.net/api/tournaments/seasons/7/fixtures?stage=2';

const levelOrder = [
  'ROUND_OF_32',
  'ROUND_OF_16',
  'QUATER_FINAL',
  'SEMI_FINAL',
  'THIRD_PLACE',
  'FINAL',
];

function processApiData(apiData) {
  const stagesMap = new Map();
  const matchMap = {};

  // Build match map and group matches by level
  apiData.forEach((match) => {
    matchMap[match.id] = match;
    const level = match.level;
    if (!stagesMap.has(level)) {
      stagesMap.set(level, []);
    }
    stagesMap.get(level).push(match);
  });

  // Sort stages
  const stages = levelOrder
    .filter((level) => stagesMap.has(level))
    .map((level) => stagesMap.get(level));

  // Assign nextMatchId based on progression
  for (let i = 0; i < stages.length - 1; i++) {
    const currentStage = stages[i];
    const nextStage = stages[i + 1];
    const ratio = Math.ceil(currentStage.length / nextStage.length);

    currentStage.forEach((match, index) => {
      const nextMatchIndex = Math.floor(index / ratio);
      const nextMatch = nextStage[nextMatchIndex];
      if (nextMatch) {
        match.nextMatchId = nextMatch.id;
      }
    });
  }

  return stages;
}

function calculateMatchPositions(stages) {
  const matchHeight = 80;
  const verticalSpacing = 20;
  const positions = [];
  const matchPositionMap = {};

  stages.forEach((stage, stageIndex) => {
    const stagePositions = [];

    stage.forEach((match, matchIndex) => {
      let posY;

      if (stageIndex === 0) {
        // For the first stage, positions are evenly spaced
        posY = matchIndex * (matchHeight + verticalSpacing);
      } else {
        // Position based on parent matches
        const parentMatches = stages[stageIndex - 1].filter(
          (m) => m.nextMatchId === match.id
        );

        if (parentMatches.length > 0) {
          const parentPositions = parentMatches.map(
            (m) => matchPositionMap[m.id]
          );
          posY =
            parentPositions.reduce((sum, pos) => sum + pos, 0) /
            parentPositions.length;
        } else {
          // If no parent matches, position sequentially
          posY = matchIndex * (matchHeight + verticalSpacing);
        }
      }

      matchPositionMap[match.id] = posY;
      stagePositions.push(posY);
    });

    positions.push(stagePositions);
  });

  return positions;
}

export default function HomeScreen() {
  const [stages, setStages] = useState([]);
  const [positions, setPositions] = useState([]);
  const matchHeight = 80;
  const matchWidth = 150;
  const verticalSpacing = 20;
  const horizontalSpacing = 50;

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((json) => {
        if (json.status && json.data) {
          const processedStages = processApiData(json.data);
          setStages(processedStages);
          const calculatedPositions = calculateMatchPositions(processedStages);
          setPositions(calculatedPositions);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  if (stages.length === 0 || positions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading tournament data...</Text>
      </View>
    );
  }

  // Calculate totalHeight
  const allPositions = positions.flat();
  const maxPosition = Math.max(...allPositions);
  const totalHeight = maxPosition + matchHeight;

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
          <Svg
            height={totalHeight}
            width={totalWidth}
            style={styles.linesSvg}
          >
            {stages.map((stage, stageIndex) => {
              if (stageIndex === stages.length - 1) return null; // Skip last stage
              return stage.map((match, matchIndex) => {
                const nextMatch = stages[stageIndex + 1].find(
                  (m) => m.id === match.nextMatchId
                );

                if (!nextMatch) return null;

                const nextMatchIndex = stages[stageIndex + 1].findIndex(
                  (m) => m.id === nextMatch.id
                );

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
                  <React.Fragment key={`line-${stageIndex}-${match.id}`}>
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
                key={`match-${stageIndex}-${match.id}`}
                style={[
                  styles.matchContainer,
                  {
                    top: positions[stageIndex][matchIndex],
                    left: stageIndex * (matchWidth + horizontalSpacing),
                  },
                ]}
              >
                <View style={styles.card}>
                  <Text style={styles.status}>
                    {match.level.replace('_', ' ').toLowerCase()}
                  </Text>
                  <View style={styles.team}>
                    <Image
                      source={{ uri: match.home_team.flag }}
                      style={styles.flag}
                    />
                    <Text style={styles.teamName}>
                      {match.home_team.name}
                    </Text>
                    <Text style={styles.score}>
                      {match.home_team.score}
                    </Text>
                  </View>
                  <View style={styles.team}>
                    <Image
                      source={{ uri: match.away_team.flag }}
                      style={styles.flag}
                    />
                    <Text style={styles.teamName}>
                      {match.away_team.name}
                    </Text>
                    <Text style={styles.score}>
                      {match.away_team.score}
                    </Text>
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
    backgroundColor: '#0A0A1A',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A0A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 18,
  },
  scrollContainer: {},
  bracketContainer: {
    position: 'relative',
  },
  matchContainer: {
    position: 'absolute',
  },
  card: {
    backgroundColor: '#1A1A2E',
    padding: 8,
    borderRadius: 8,
    width: 150,
    height: 80,
    justifyContent: 'center',
    elevation: 1,
    zIndex: 1,
  },
  status: {
    color: '#FFD700',
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
    textTransform: 'capitalize',
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
    zIndex: 0,
  },
});
