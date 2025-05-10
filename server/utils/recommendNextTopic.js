function recommendNextTopic(topics, completedTopics, difficulty) {
  const difficulties = ["easy", "medium", "hard"];

  let nextTopic = topics.find(
    (topic) =>
      !completedTopics.includes(topic._id.toString()) &&
      topic.difficulty.toLowerCase() === difficulty.toLowerCase()
  );

  if (!nextTopic) {
    const fallbackOrder = {
      easy: ["medium", "hard"],
      medium: ["easy", "hard"],
      hard: ["medium", "easy"],
    };

    for (let fallbackDiff of fallbackOrder[difficulty.toLowerCase()]) {
      nextTopic = topics.find(
        (topic) =>
          !completedTopics.includes(topic._id.toString()) &&
          topic.difficulty.toLowerCase() === fallbackDiff
      );
      if (nextTopic) break;
    }
  }

  if (!nextTopic) {
    nextTopic = topics.find(
      (topic) => !completedTopics.includes(topic._id.toString())
    );
  }

  return nextTopic || null;
}

module.exports = recommendNextTopic;
