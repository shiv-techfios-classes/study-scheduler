// File: src/App.js
import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [topics, setTopics] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [dailyLimit, setDailyLimit] = useState(4);

  const addTopic = (e) => {
    e.preventDefault();

    const form = e.target;
    const newTopic = {
      name: form.name.value,
      importance: parseInt(form.importance.value, 10),
      estimatedTime: parseInt(form.estimatedTime.value, 10),
      deadline: form.deadline.value,
    };

    setTopics([...topics, newTopic]);
    form.reset();
  };

  const generateSchedule = () => {
    const sortedTopics = [...topics].sort((a, b) => {
      if (a.deadline !== b.deadline) {
        return new Date(a.deadline) - new Date(b.deadline);
      }
      return b.importance - a.importance;
    });

    const generatedSchedule = [];
    let dailyTimeLeft = dailyLimit;
    let currentDate = new Date();

    sortedTopics.forEach((topic) => {
      while (topic.estimatedTime > 0) {
        if (dailyTimeLeft === 0) {
          currentDate.setDate(currentDate.getDate() + 1);
          dailyTimeLeft = dailyLimit;
        }

        const studyTime = Math.min(topic.estimatedTime, dailyTimeLeft);
        generatedSchedule.push({
          date: currentDate.toISOString().split("T")[0],
          topic: topic.name,
          hours: studyTime,
        });

        topic.estimatedTime -= studyTime;
        dailyTimeLeft -= studyTime;
      }
    });

    setSchedule(generatedSchedule);
  };

  const exportSchedule = () => {
    const fileContent = schedule
      .map(
        (entry) =>
          `${entry.date}: Study ${entry.topic} for ${entry.hours} hours`
      )
      .join("\n");
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "study_schedule.txt";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <header>
        <h1>Study Scheduler App</h1>
      </header>

      <section>
        <h2>Add a Topic</h2>
        <form onSubmit={addTopic}>
          <div>
            <label>Topic Name:</label>
            <input type="text" name="name" required />
          </div>
          <div>
            <label>Importance (1-10):</label>
            <input type="number" name="importance" min="1" max="10" required />
          </div>
          <div>
            <label>Estimated Time (hours):</label>
            <input type="number" name="estimatedTime" min="1" required />
          </div>
          <div>
            <label>Deadline:</label>
            <input type="date" name="deadline" required />
          </div>
          <button type="submit">Add Topic</button>
        </form>
      </section>

      <section>
        <h2>Topics</h2>
        <ul>
          {topics.map((topic, index) => (
            <li key={index}>
              {topic.name} - Importance: {topic.importance}, Estimated Time:{" "}
              {topic.estimatedTime}h, Deadline: {topic.deadline}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Daily Study Limit</h2>
        <input
          type="number"
          value={dailyLimit}
          onChange={(e) => setDailyLimit(parseInt(e.target.value, 10))}
          min="1"
        />{" "}
        hours
      </section>

      <section>
        <h2>Actions</h2>
        <button onClick={generateSchedule}>Generate Schedule</button>
        <button onClick={exportSchedule} disabled={schedule.length === 0}>
          Export Schedule
        </button>
      </section>

      <section>
        <h2>Generated Schedule</h2>
        <ul>
          {schedule.map((entry, index) => (
            <li key={index}>
              {entry.date}: Study {entry.topic} for {entry.hours} hours
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default App;
