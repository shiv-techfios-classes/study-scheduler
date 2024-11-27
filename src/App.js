import React, { useState } from "react";
import ScheduleCards from "./ScheduleCards";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [topics, setTopics] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [dailyLimit, setDailyLimit] = useState(4);
  const [editIndex, setEditIndex] = useState(null);
  const [formValues, setFormValues] = useState({
    name: "",
    importance: "",
    estimatedTime: "",
    deadline: "",
  });

  const addOrUpdateTopic = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      const updatedTopics = [...topics];
      updatedTopics[editIndex] = { ...formValues };
      setTopics(updatedTopics);
      setEditIndex(null);
    } else {
      setTopics([...topics, formValues]);
    }

    setFormValues({ name: "", importance: "", estimatedTime: "", deadline: "" });
  };

  const handleEdit = (index) => {
    setFormValues(topics[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const generateSchedule = () => {
    const sortedTopics = [...topics].sort((a, b) => {
      if (a.deadline !== b.deadline) {
        return new Date(a.deadline) - new Date(b.deadline);
      }
      return b.importance - a.importance;
    });

    const groupedSchedule = {};
    let dailyTimeLeft = dailyLimit;
    let currentDate = new Date();

    sortedTopics.forEach((topic) => {
      while (topic.estimatedTime > 0) {
        if (dailyTimeLeft === 0) {
          currentDate.setDate(currentDate.getDate() + 1);
          dailyTimeLeft = dailyLimit;
        }

        const studyTime = Math.min(topic.estimatedTime, dailyTimeLeft);
        const dateKey = currentDate.toISOString().split("T")[0];
        if (!groupedSchedule[dateKey]) {
          groupedSchedule[dateKey] = [];
        }
        groupedSchedule[dateKey].push({
          topic: topic.name,
          hours: studyTime,
        });

        topic.estimatedTime -= studyTime;
        dailyTimeLeft -= studyTime;
      }
    });

    setSchedule(Object.entries(groupedSchedule).map(([date, topics]) => ({ date, topics })));
  };

  return (
    <div className="App container py-4">
      <header className="mb-4">
        <h1 className="text-center">Study Scheduler App</h1>
      </header>

      <section className="mb-4">
        <h2>{editIndex !== null ? "Edit Topic" : "Add a Topic"}</h2>
        <div className="border rounded p-4 bg-light mx-auto" style={{ maxWidth: "50%" }}>
          <form onSubmit={addOrUpdateTopic} className="row g-3">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">
                Topic Name:
              </label>
              <input
                type="text"
                name="name"
                className="form-control form-control-sm"
                value={formValues.name}
                onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                required
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="importance" className="form-label">
                Importance (1-10):
              </label>
              <input
                type="number"
                name="importance"
                className="form-control form-control-sm"
                value={formValues.importance}
                onChange={(e) => setFormValues({ ...formValues, importance: e.target.value })}
                min="1"
                max="10"
                required
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="estimatedTime" className="form-label">
                Estimated Time (hours):
              </label>
              <input
                type="number"
                name="estimatedTime"
                className="form-control form-control-sm"
                value={formValues.estimatedTime}
                onChange={(e) => setFormValues({ ...formValues, estimatedTime: e.target.value })}
                min="1"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="deadline" className="form-label">
                Deadline:
              </label>
              <input
                type="date"
                name="deadline"
                className="form-control form-control-sm"
                value={formValues.deadline}
                onChange={(e) => setFormValues({ ...formValues, deadline: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6 d-flex align-items-end">
              <button type="submit" className="btn btn-primary w-100">
                {editIndex !== null ? "Update Topic" : "Add Topic"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="mb-4">
        <h2>Topics</h2>
        <ul className="list-group">
          {topics.map((topic, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                {topic.name} - Importance: {topic.importance}, Estimated Time: {topic.estimatedTime}h, Deadline:{" "}
                {topic.deadline}
              </div>
              <div>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(index)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-4">
        <h2>Actions</h2>
        <button onClick={generateSchedule} className="btn btn-success me-3">
          Generate Schedule
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
