import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import API from '../api/api';

const CalendarPage = () => {
  const [value, setValue] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [eventsRes, assignmentsRes] = await Promise.all([
          API.get('/events'),
          API.get('/assignment'),
        ]);
        setEvents(eventsRes.data);
        setAssignments(assignmentsRes.data);
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, []);

  // Combine events and assignments by date
  const getTileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const dayEvents = events.filter(e => new Date(e.date).toDateString() === date.toDateString());
    const dayAssignments = assignments.filter(a => new Date(a.deadline).toDateString() === date.toDateString());
    if (dayEvents.length === 0 && dayAssignments.length === 0) return null;
    return (
      <div className="mt-1 flex flex-col gap-0.5">
        {dayEvents.map((e, i) => <span key={i} className="block w-2 h-2 rounded-full bg-pink-500 mx-auto" title={e.title}></span>)}
        {dayAssignments.map((a, i) => <span key={i} className="block w-2 h-2 rounded-full bg-blue-500 mx-auto" title={a.title}></span>)}
      </div>
    );
  };

  const handleDateClick = (date) => {
    const dayEvents = events.filter(e => new Date(e.date).toDateString() === date.toDateString());
    const dayAssignments = assignments.filter(a => new Date(a.deadline).toDateString() === date.toDateString());
    setSelected({ date, dayEvents, dayAssignments });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-2 sm:px-4 md:px-8 lg:px-16 py-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">Calendar</h1>
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]"><span className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" aria-label="Loading" /></div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">
          <Calendar
            onChange={setValue}
            value={value}
            tileContent={getTileContent}
            onClickDay={handleDateClick}
            className="rounded-xl shadow border bg-white p-4"
          />
          <div className="flex-1">
            {selected ? (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-lg font-bold mb-2">{selected.date.toDateString()}</h2>
                {selected.dayEvents.length === 0 && selected.dayAssignments.length === 0 ? (
                  <div className="text-gray-500">No events or assignments.</div>
                ) : (
                  <>
                    {selected.dayEvents.length > 0 && <>
                      <div className="font-semibold text-pink-600 mb-1">Events:</div>
                      <ul className="mb-2">
                        {selected.dayEvents.map((e, i) => <li key={i} className="text-gray-700">{e.title}</li>)}
                      </ul>
                    </>}
                    {selected.dayAssignments.length > 0 && <>
                      <div className="font-semibold text-blue-600 mb-1">Assignments:</div>
                      <ul>
                        {selected.dayAssignments.map((a, i) => <li key={i} className="text-gray-700">{a.title || a.subject}</li>)}
                      </ul>
                    </>}
                  </>
                )}
              </div>
            ) : <div className="text-gray-500">Click a date to see details.</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage; 