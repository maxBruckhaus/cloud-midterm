import React, {useEffect, useContext, useState, Fragment} from 'react';
import { Account, AccountContext } from "./Account";
import axios from 'axios';

export default () => {
    const { getSession } = useContext(AccountContext);
    const [loggedIn, setLoggedIn] = useState(false);

    const [allCourses, setAllCourses] = useState([]);

    const [courses, setCourses] = useState([]);
    const [course_name, setName] = useState("");

    const [difficulty, setDifficulty] = useState("");
    const [enjoy, setEnjoy] = useState(true);
    const [newDifficulty, setNewDifficulty] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const [coursesPerPage, setCoursesPerPage] = useState(5);

    useEffect(() => {
        getSession().then(() => {
            setLoggedIn(true);
        });
    }, []);

    useEffect( async => {
        const fetchAllCourses = async () => {
            var url = 'https://z2rmhdl2ab.execute-api.us-west-1.amazonaws.com/latest/courses';
            const res = await axios.get(url)
            .then(res => {
                console.log(res);
                setAllCourses(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        }
        fetchAllCourses();
    }, []);

    useEffect( async => {
        const fetchFirstCourses = async () => {
            var url = 'https://z2rmhdl2ab.execute-api.us-west-1.amazonaws.com/latest/courses/paginate/';
            const res = await axios.get(url + currentPage + "/" + coursesPerPage)
            .then(res => {
                console.log(res);
                setCourses(res.data);
            })
            .catch(err => {
                console.log(err);
            })
        }
        fetchFirstCourses();
    }, []);

    const fetchCourses = async (page, limit) => {
        var url = 'https://z2rmhdl2ab.execute-api.us-west-1.amazonaws.com/latest/courses/paginate/';
        const res = await axios.get(url + page + "/" + limit)
        .then(res => {
            console.log(res);
            setCourses(res.data);
        })
        .catch(err => {
            console.log(err);
        })
    }

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
            fetchCourses(currentPage, coursesPerPage);
        });
    };

    const deleteCourse = (courseName) => {
        console.log("DELETING~!!!!!!" + courseName);
        var url = 'https://z2rmhdl2ab.execute-api.us-west-1.amazonaws.com/latest/courses/delete/' + courseName;
        console.log(url);
        axios.delete(url)
        .then(res => {
            console.log(res);
            fetchCourses(currentPage, coursesPerPage);
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
            fetchCourses(currentPage, coursesPerPage);
        });
    }

    // Previous page
    const paginatePrevious = () => {
        const courseCount = allCourses.length;
        console.log("total course count " + courseCount);

        console.log("PAGE NUMBER: " + currentPage);
        const proposedPage = currentPage - 1;
        console.log("PROPOSED PAGE: " + proposedPage);

        if (proposedPage >= 1) {
            console.log("WENT BACK A PAGEEEEEEEEE: " + currentPage);
            fetchCourses(currentPage - 1, coursesPerPage);
            setCurrentPage(proposedPage);
        }
        console.log("NEW PAGE NUMBER: " + currentPage);
    }

    // Next page
    const paginateNext = () => {
        const courseCount = allCourses.length;
        console.log("total course count " + courseCount);

        const maxPages = Math.ceil(courseCount / coursesPerPage);
        console.log("MAX PAGES: " + maxPages);

        console.log("PAGE NUMBER: " + currentPage);
        const proposedPage = currentPage + 1;
        console.log("PROPOSED PAGE: " + proposedPage);

        if (proposedPage <= maxPages) {
            console.log("ADDED A PAGEEEEEEEEE: " + currentPage);
            fetchCourses(currentPage + 1, coursesPerPage);
            setCurrentPage(proposedPage);
        }
        console.log("NEW PAGE NUMBER: " + currentPage);
    }

    return (loggedIn && 
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

            <button onClick={() => paginatePrevious()}>Previous Page</button>
            <button onClick={() => paginateNext()}>Next Page</button>

        </Fragment>
    );
}
