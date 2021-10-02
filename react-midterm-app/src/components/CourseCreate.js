import React, {useEffect, useContext, useState, Fragment} from 'react';
import { Account, AccountContext } from "./Account";
import axios from 'axios';

export default () => {
    const [courses, setCourses] = useState([]);
    const [course_name, setName] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [enjoy, setEnjoy] = useState(true);
    const [newDifficulty, setNewDifficulty] = useState(0);

    useEffect(() => {
        axios.get('https://z2rmhdl2ab.execute-api.us-west-1.amazonaws.com/latest/courses')
        .then(res => {
            console.log(res)
            setCourses(res.data)
        })
        .catch(err => {
            console.log(err)
        })
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();

        var course_difficulty = parseInt(difficulty);
        var course_enjoy = enjoy == "on";

        const course = {
            course_name,
            course_difficulty,
            course_enjoy
        };

        var jsonCourse = JSON.stringify(course);
        console.log(jsonCourse);

        axios.post('https://z2rmhdl2ab.execute-api.us-west-1.amazonaws.com/latest/courses', jsonCourse, {headers:{"Content-Type" : "application/json"}})
        .then(res => {
            console.log(res)
            console.log(res.data)
            axios.get('https://z2rmhdl2ab.execute-api.us-west-1.amazonaws.com/latest/courses').then(res => {
                console.log(res)
                setCourses(res.data)
            })
        });
    };

    const deleteCourse = (courseName) => {
        console.log("DELETING~!!!!!!" + courseName);
        var url = 'https://z2rmhdl2ab.execute-api.us-west-1.amazonaws.com/latest/courses/' + courseName;
        console.log(url);
        axios.delete(url)
        .then(res => {
            console.log(res);
            axios.get('https://z2rmhdl2ab.execute-api.us-west-1.amazonaws.com/latest/courses').then(res => {
                console.log(res);
                setCourses(res.data)
            })
        });
    }

    const updateCourse = (courseName) => {

        var course_difficulty = parseInt(newDifficulty);

        const updateDifficulty = {
            course_difficulty
        };

        var jsonDifficulty  = JSON.stringify(updateDifficulty);
        console.log(jsonDifficulty);

        console.log("UPDATING~!!!!!!" + courseName);
        var url = 'https://z2rmhdl2ab.execute-api.us-west-1.amazonaws.com/latest/courses/' + courseName;
        console.log(url);
        axios.put(url, jsonDifficulty, {headers:{"Content-Type" : "application/json"}})
        .then(res => {
            console.log(res);
            axios.get('https://z2rmhdl2ab.execute-api.us-west-1.amazonaws.com/latest/courses').then(res => {
                console.log(res);
                setCourses(res.data);
            })
        });
    }

    return (
        <Fragment>
            <h1>Add A Course</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <label>Name</label><input type="text" name="name" onChange={e => setName(e.target.value)} />
                    <label>Difficulty</label><input type="number" name="difficulty" onChange={e => setDifficulty(e.target.value)} />
                    <label>Enjoy</label><input type="checkbox" name="enjoy" onChange={e => setEnjoy(e.target.value)} />
                </label>
                <button type="submit">Submit</button>
            </form>

            <h1>Your Courses</h1>
            {courses.map(course => 
            <h3>Name: {course.course_name} Difficulty: {course.course_difficulty}Enjoy: {(course.course_enjoy).toString()}
                <form><label>New Difficulty</label><input type="number" name="newDifficulty" onChange={e => setNewDifficulty(e.target.value)} /></form>
                <button onClick={() => updateCourse(course.course_name)}>Update Difficulty</button>
                <button onClick={() => deleteCourse(course.course_name)}>Delete</button>
            </h3>)}
        </Fragment>
    );
}
