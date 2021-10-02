import React from 'react';
import axios from 'axios'

export default class CourseList extends React.Component {
    state = {
        courses: [],
    }

    componentDidMount() {
        axios.get('https://z2rmhdl2ab.execute-api.us-west-1.amazonaws.com/latest/courses').then(res => {
            console.log(res);
            this.setState({ courses: res.data });
        })
    }

    render() {
        return (
            <ul>
                {this.state.courses.map(course => <li>{course.course_name}{course.course_difficulty}{course.course_enjoy}</li>)}
            </ul>
        );
    }
}

