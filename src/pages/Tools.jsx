import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../components/Navbar';
import { NotificationContext } from '../App';

const Tools = ({ isLoggedIn, setIsLoggedIn }) => {
  const [task, setTask] = useState('');
  const [desc, setDesc] = useState('');
  const [tasks, setTasks] = useState([]);
  const { showNotification } = useContext(NotificationContext);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('todoTasks');
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    setTasks([
      { task, desc, done: false, date: new Date().toLocaleString() },
      ...tasks,
    ]);
    setTask('');
    setDesc('');
    showNotification('Task added!');
  };

  const toggleDone = (idx) => {
    setTasks(tasks.map((t, i) => i === idx ? { ...t, done: !t.done } : t));
  };

  const removeTask = (idx) => {
    setTasks(tasks.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 px-2 sm:px-0">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="container max-w-md mx-auto px-2 sm:px-4 py-8 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg w-full p-4 sm:p-8 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-2">Student Tools - To-Do List</h2>
          <form className="space-y-3" onSubmit={handleAdd}>
            <input
              type="text"
              placeholder="Task Title"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
              value={task}
              onChange={e => setTask(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
            <button
              type="submit"
              className="w-full py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition text-base sm:text-lg"
            >
              Add Task
            </button>
          </form>
          <div className="mt-6 text-left">
            <h3 className="text-base sm:text-lg font-semibold text-blue-700 mb-2">Your Tasks</h3>
            {tasks.length === 0 ? (
              <div className="text-gray-500">No tasks yet.</div>
            ) : (
              <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {tasks.map((item, idx) => (
                  <li key={idx} className={`bg-blue-50 rounded-lg p-3 shadow flex flex-col ${item.done ? 'opacity-60 line-through' : ''}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-800 text-sm sm:text-base">{item.task}</span>
                      <div className="flex gap-2">
                        <button onClick={() => toggleDone(idx)} className={`px-2 py-1 rounded ${item.done ? 'bg-green-400 text-white' : 'bg-gray-200 text-gray-700'} text-xs font-semibold`}>{item.done ? 'Undone' : 'Done'}</button>
                        <button onClick={() => removeTask(idx)} className="px-2 py-1 rounded bg-red-400 text-white text-xs font-semibold">Remove</button>
                      </div>
                    </div>
                    {item.desc && <span className="text-gray-700 text-xs sm:text-sm mb-1">{item.desc}</span>}
                    <span className="text-xs text-gray-400 self-end">{item.date}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools; 