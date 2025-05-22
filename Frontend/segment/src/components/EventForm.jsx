import React, { useState } from 'react';
import './form.css';

export default function EventForm() {
  const [form, setForm] = useState({
    title: '', organizer: '', date: '', time: '', location: '', link: '', description: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to submit event');
      alert('🎉 Event Submitted!');
      setForm({ title: '', organizer: '', date: '', time: '', location: '', link: '', description: '' });
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="main">
      <div id="particles-js"></div>
      <div className="form-container">
        <div className="form-header">
          <h1><span id="h1-span">Submit Your Event</span> 🎉</h1>
          <p>Promote your event to the college community!</p>
        </div>
        <form onSubmit={handleSubmit}>
          {['title', 'organizer', 'date', 'time', 'location', 'link', 'description'].map((field, idx) => (
            <div className="form-group" key={idx}>
              <label htmlFor={field}>{field.replace(/^[a-z]/, c => c.toUpperCase())}</label>
              {field !== 'description' ? (
                <input
                  type={field === 'date' ? 'date' : field === 'time' ? 'time' : field === 'link' ? 'url' : 'text'}
                  id={field}
                  value={form[field]}
                  onChange={handleChange}
                  placeholder={field === 'link' ? 'https://event-link.com' : ''}
                  required={field !== 'link'}
                />
              ) : (
                <textarea
                  id={field}
                  rows="5"
                  value={form[field]}
                  onChange={handleChange}
                  placeholder="Describe what your event is about..."
                  required
                />
              )}
            </div>
          ))}
          <button type="submit">Submit Event 🚀</button>
        </form>
      </div>

      <div className="preview-container">
        <h2>🔍 Live Event Preview</h2>
        <div id="preview">
          <h3>{form.title || 'Event Title'}</h3>
          <p><strong>By:</strong> {form.organizer || 'Organizer'}</p>
          <p><strong>Date:</strong> {form.date || 'YYYY-MM-DD'}</p>
          <p><strong>Time:</strong> {form.time || '--:--'}</p>
          <p><strong>Location:</strong> {form.location || 'Location'}</p>
          <p><strong>Link:</strong> {form.link || '-'}</p>
          <p><strong>Description:</strong><br />{form.description || 'Event description will appear here.'}</p>
        </div>
      </div>
    </div>
  );
}