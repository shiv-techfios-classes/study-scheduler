import React, { useState } from "react";
import ScheduleCards from "./ScheduleCards";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [topics, setTopics] = useState([]);
/**const [topics, setTopics] = useState([
    { name: "Data Structures", importance: 9, estimatedTime: 10, deadline: "2024-12-05" },
    { name: "Algorithms", importance: 10, estimatedTime: 15, deadline: "2024-12-06" },
    { name: "Operating Systems", importance: 8, estimatedTime: 8, deadline: "2024-12-04" },
    { name: "Computer Networks", importance: 7, estimatedTime: 12, deadline: "2024-12-08" },
    { name: "Databases", importance: 6, estimatedTime: 10, deadline: "2024-12-09" },
    { name: "Artificial Intelligence", importance: 9, estimatedTime: 14, deadline: "2024-12-07" },
    { name: "Machine Learning", importance: 10, estimatedTime: 18, deadline: "2024-12-10" },
    { name: "Cybersecurity", importance: 8, estimatedTime: 6, deadline: "2024-12-03" },
    { name: "Web Development", importance: 5, estimatedTime: 8, deadline: "2024-12-11" },
    { name: "Software Engineering", importance: 7, estimatedTime: 10, deadline: "2024-12-12" }
  ]);

*/
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

  return (
    <div className="App container py-4">
      <header className="mb-4">
        <h1 className="text-center">Study Scheduler App</h1>
      </header>

      <section className="mb-4">
  <h2>Add a Topic</h2>
  <div className="border rounded p-4 bg-light">
    <form onSubmit={addTopic} className="row g-3">
      <div className="col-md-6">
        <label htmlFor="name" className="form-label">Topic Name:</label>
        <input type="text" name="name" className="form-control form-control-sm" placeholder="e.g., Algorithms" required />
      </div>
      <div className="col-md-3">
        <label htmlFor="importance" className="form-label">Importance (1-10):</label>
        <input type="number" name="importance" className="form-control form-control-sm" min="1" max="10" required />
      </div>
      <div className="col-md-3">
        <label htmlFor="estimatedTime" className="form-label">Estimated Time (hours):</label>
        <input type="number" name="estimatedTime" className="form-control form-control-sm" min="1" required />
      </div>
      <div className="col-md-6">
        <label htmlFor="deadline" className="form-label">Deadline:</label>
        <input type="date" name="deadline" className="form-control form-control-sm" required />
      </div>
      <div className="col-md-6 d-flex align-items-end">
        <button type="submit" className="btn btn-primary w-100">Add Topic</button>
      </div>
    </form>
  </div>
</section>

      <section className="mb-4">
        <h2>Topics</h2>
        <ul className="list-group">
          {topics.map((topic, index) => (
            <li key={index} className="list-group-item">
              {topic.name} - Importance: {topic.importance}, Estimated Time:{" "}
              {topic.estimatedTime}h, Deadline: {topic.deadline}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-4">
        <h2>Daily Study Limit</h2>
        <input
          type="number"
          value={dailyLimit}
          onChange={(e) => setDailyLimit(parseInt(e.target.value, 10))}
          className="form-control"
          min="1"
        />{" "}
        hours
      </section>

      <section className="mb-4">
        <h2>Actions</h2>
        <button onClick={generateSchedule} className="btn btn-success me-3">Generate Schedule</button>
        <button
          onClick={() => {
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
          }}
          disabled={schedule.length === 0}
          className="btn btn-secondary"
        >
          Export Schedule
        </button>
      </section>

      <section>
        <h2>Generated Schedule</h2>
        <ScheduleCards schedule={schedule} />
      </section>
    </div>
  );
};

export default App;
