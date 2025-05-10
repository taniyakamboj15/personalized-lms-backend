function getNextDifficulty(performance) {
  performance.easy = performance.easy || { attempted: 0, correct: 0 };
  performance.medium = performance.medium || { attempted: 0, correct: 0 };
  performance.hard = performance.hard || { attempted: 0, correct: 0 };

  const ratio = ({ attempted, correct }) => {
    return attempted > 0 ? correct / attempted : 0;
  };

  const easy = performance.easy;
  const medium = performance.medium;
  const hard = performance.hard;

  const easyRatio = ratio(easy);
  const mediumRatio = ratio(medium);
  const hardRatio = ratio(hard);

  const isStrugglingOnMedium = medium.attempted >= 3 && mediumRatio < 0.6;
  const isExcellingOnEasy = easy.attempted >= 3 && easyRatio > 0.9;
  const isExcellingOnMedium = medium.attempted >= 3 && mediumRatio > 0.9;
  const isStrugglingOnHard = hard.attempted >= 3 && hardRatio < 0.6;

  if (isExcellingOnEasy && !isStrugglingOnMedium) return "medium";
  if (isExcellingOnMedium && !isStrugglingOnHard) return "hard";

  if (isStrugglingOnMedium) return "easy";
  if (isStrugglingOnHard) return "medium";

  if (medium.attempted >= 3) return "medium";
  return "easy";
}

module.exports = getNextDifficulty;
