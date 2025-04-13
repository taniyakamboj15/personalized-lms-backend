function getNextDifficulty(performance) {
  // Ensure performance data exists for all levels
  performance.easy = performance.easy || { attempted: 0, correct: 0 };
  performance.medium = performance.medium || { attempted: 0, correct: 0 };
  performance.hard = performance.hard || { attempted: 0, correct: 0 };

  const ratio = (level) => {
    const { attempted, correct } = performance[level];
    return attempted > 0 ? correct / attempted : 0;
  };

  const easyRatio = ratio("easy");
  const mediumRatio = ratio("medium");

  // If easy level is above 90% success rate with at least 2 attempts, move to medium
  if (performance.easy.attempted >= 3 && easyRatio > 0.9) return "medium";

  // If medium level is above 90% success rate with at least 2 attempts, move to hard
  if (performance.medium.attempted >= 3 && mediumRatio > 0.9) return "hard";

  // If medium is less than 60% success rate, move to easy
  if (performance.medium.attempted >= 3 && mediumRatio < 0.6) return "easy";

  // Default to current difficulty or medium if not enough data
  return performance.easy.attempted >= 3 ? "medium" : "easy";
}
module.exports = getNextDifficulty;
