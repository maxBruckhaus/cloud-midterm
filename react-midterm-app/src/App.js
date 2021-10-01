import './App.css';
import React, { useState, useEffect } from 'react'
import axios from 'axios'

import CourseList from './components/CourseList';
import CourseCreate from './components/CourseCreate';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          This is my midterm project!!!!!
        </p>
      </header>
      <p>
        Your Courses
      </p>
      <CourseCreate />
      <CourseList />
    </div>
  );
}

export default App;
