const ApiBuilder = require('claudia-api-builder'),
    AWS = require('aws-sdk');
var api = new ApiBuilder(),
    dynamoDb = new AWS.DynamoDB.DocumentClient();

// Create new semester
api.post('/semesters', function (request) {
  var params = {  
    TableName: 'semesters',  
    Item: {
        semester_id: request.body.semester_id,
        semester_name: request.body.semester_name
    } 
  }
  return dynamoDb.put(params).promise(); // returns dynamo result 
}, { success: 201 }); // returns HTTP status 201 - Created if successful

// Create new course
api.post('/courses', function (request) {
  var params = {  
    TableName: 'courses',  
    Item: {
      course_id: request.body.course_id,
      course_name: request.body.course_name,
      course_difficulty: request.body.course_difficulty,
      course_enjoy: request.body.course_enjoy
    } 
  }
  return dynamoDb.put(params).promise(); // returns dynamo result 
}, { success: 201 }); // returns HTTP status 201 - Created if successful

// Get all semesters
api.get('/semesters', function (request) {
  return dynamoDb.scan({ TableName: 'semesters' }).promise()
    .then(response => response.Items)
});

// Get all courses
api.get('/courses', function (request) {
  return dynamoDb.scan({ TableName: 'courses' }).promise()
    .then(response => response.Items)
});

// Delete a course
api.delete('/courses/{courseId}', function (request) {
  var courseId = parseInt(request.pathParams.courseId);
  console.log(courseId);
  var params = {
    TableName: 'courses',
    Key: {
      "course_id": courseId
    }
  };
  return dynamoDb.delete(params).promise();
}, { success: 200 });

module.exports = api;