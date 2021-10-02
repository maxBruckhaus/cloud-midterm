import './App.css';
import React, { Component, Fragment, useState } from 'react';
import Signup from "./components/SignUp";
import Login from "./components/Login";
import { Account } from "./components/Account";
import Status from "./components/Status";

import axios from 'axios'

import CourseList from './components/CourseList';
import CourseCreate from './components/CourseCreate';

function App() {
  return (
    <Account>
        <Status />
        <Signup />
        <Login />
        <CourseCreate />
    </Account>
  );
};

export default App;
