import React, {Fragment} from 'react';
import axios from 'axios';

export default class CourseCreate extends React.Component {
    state = {
        courses: [],
        name: '',
        difficulty: 0,
        enjoy: false
    };

    componentDidMount() {
        axios.get('https://z2rmhdl2ab.execute-api.us-west-1.amazonaws.com/latest/courses').then(res => {
            console.log(res);
            this.setState({ courses: res.data });
        })
    }

    handleChange = event => {
        this.setState({ 
            [event.target.name] : event.target.value
        });
    };

    handleSubmit = event => {
        event.preventDefault();

        var difficultyInt = parseInt(this.state.difficulty);
        var enjoyBool = this.state.enjoy == "on";

        const course = {
            course_name: this.state.name,
            course_difficulty: difficultyInt,
            course_enjoy: enjoyBool
        };

        var jsonCourse  = JSON.stringify(course);
        console.log(jsonCourse);

        axios.post('https://z2rmhdl2ab.execute-api.us-west-1.amazonaws.com/latest/courses', jsonCourse, {headers:{"Content-Type" : "application/json"}})
        .then(res => {
            console.log(res);
            console.log(res.data);
            axios.get('https://z2rmhdl2ab.execute-api.us-west-1.amazonaws.com/latest/courses').then(res => {
                console.log(res);
                this.setState({ courses: res.data });
                window.location.reload();
            })
        });
    };

    deleteCourse(courseName) {
        console.log("DELETING~!!!!!!" + courseName);
        var url = 'https://z2rmhdl2ab.execute-api.us-west-1.amazonaws.com/latest/courses/' + courseName;
        console.log("URLEEEE1#$!#$!$");
        console.log(url);
        axios.delete(url)
        .then(res => {
            console.log(res);
            axios.get('https://z2rmhdl2ab.execute-api.us-west-1.amazonaws.com/latest/courses').then(res => {
                console.log(res);
                this.setState({ courses: res.data });
                window.location.reload();
            })
        });
    }

    render() {
        return (
            <Fragment>
                <h1>Add A Course</h1>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <label>Name</label><input type="text" name="name" onChange={this.handleChange} />
                        <label>Difficulty</label><input type="number" name="difficulty" onChange={this.handleChange} />
                        <label>Enjoy</label><input type="checkbox" name="enjoy" onChange={this.handleChange} />
                    </label>
                    <button type="submit">Submit</button>
                </form>

                <h1>Your Courses</h1>
                {this.state.courses.map(course => 
                <h3>Name: {course.course_name} Difficulty: {course.course_difficulty}Enjoy: {(course.course_enjoy).toString()}
                    <button onClick={() => this.deleteCourse(course.course_name)}>Delete</button>
                </h3>)}

            </Fragment>
        );
    }
}
