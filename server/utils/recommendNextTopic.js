function recommendNextTopic(topics, completedTopics, difficulty) {
  let nextTopic = topics.find(
    (topic) =>
      !completedTopics.includes(topic._id.toString()) &&
      topic.difficulty.toLowerCase() === difficulty.toLowerCase()
  );
  console.log(difficulty);
  if (!nextTopic && difficulty === "medium") {
    nextTopic = topics.find(
      (topic) =>
        !completedTopics.includes(topic._id.toString()) &&
        topic.difficulty.toLowerCase() === "easy"
    );
  }

  if (!nextTopic) {
    // console.log("no match found");
    nextTopic = topics.find(
      (topic) => !completedTopics.includes(topic._id.toString())
    );
  }
  console.log("nexttopic ", nextTopic);
  return nextTopic || null;
}
module.exports = recommendNextTopic;
