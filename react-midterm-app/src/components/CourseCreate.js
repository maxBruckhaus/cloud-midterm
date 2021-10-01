import React from 'react';
import axios from 'axios';

export default class CourseCreate extends React.Component {
    state = {
        id: 5,
        name: '',
        difficulty: 0,
        enjoy: false
    };

    handleChange = event => {
        this.setState({ 
            [event.target.name] : event.target.value
        });
    };

    handleSubmit = event => {
        event.preventDefault();

        var idInt = parseInt(this.state.id);
        var difficultyInt = parseInt(this.state.difficulty);
        var enjoyBool = this.state.enjoy == "on";

        const course = {
            course_id: idInt,
            course_name: this.state.name,
            course_difficulty: difficultyInt,
            course_enjoy: enjoyBool
        };

        var jsonCourse  = JSON.stringify(course);
        console.log(jsonCourse);

        axios.post('https://pz5io3cov8.execute-api.us-west-1.amazonaws.com/latest/courses', jsonCourse, {headers:{"Content-Type" : "application/json"}})
        .then(res => {
            console.log(res);
            console.log(res.data);
        });
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>Add Course:
                    <label>ID</label><input type="number" name="id" onChange={this.handleChange} />
                    <label>Name</label><input type="text" name="name" onChange={this.handleChange} />
                    <label>Difficulty</label><input type="number" name="difficulty" onChange={this.handleChange} />
                    <label>Enjoy</label><input type="checkbox" name="enjoy" onChange={this.handleChange} />
                </label>
                <button type="submit">Submit</button>
            </form>
        );
    }
}
