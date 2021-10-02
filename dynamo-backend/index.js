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
api.post('/courses', async function (request) {
  try {
    var params = {  
      TableName: 'courses',  
      Item: {
        course_name: request.body.course_name,
        course_difficulty: request.body.course_difficulty,
        course_enjoy: request.body.course_enjoy
      } 
    }
    const response = await dynamoDb.put(params).promise()
    .then(response => response)
    .catch(function () {
      console.log("Promise rejected");
    });
    return response;
  }
  catch(err) {
    console.log("Error: " + err);
  }
}, { success: 201 }); // returns HTTP status 201 - Created if successful

// Get all semesters
api.get('/semesters', async function (request) {
  const response = await dynamoDb.scan({ TableName: 'semesters' }).promise()
  .then(response => response.Items)
  .catch(function () {
    console.log("Promise rejected");
  });
  return response;
});

// Get all courses
api.get('/courses', async function (request) {
  const response = await dynamoDb.scan({ TableName: 'courses' }).promise()
  .then(response => response.Items)
  .catch(function () {
    console.log("Promise rejected");
  });
  return response;
});

// Delete a course
api.delete('/courses/{courseName}', async function (request) {
  var courseName = request.pathParams.courseName;
  console.log(courseName);
  var params = {
    TableName: 'courses',
    Key: {
      "course_name": courseName
    }
  };
  const response = await dynamoDb.delete(params).promise()
  .then(response => response)
  .catch(function () {
    console.log("Promise rejected");
  });
  return response;
}, { success: 200 });


// Update a course
api.put('/courses/{courseName}', async function (request) {
  var courseName = request.pathParams.courseName;
  var courseDifficulty = parseInt(request.body.course_difficulty);
  console.log(courseName);
  console.log(courseDifficulty);

  var params = {
    TableName: 'courses',
    Key: {
      "course_name": courseName
    },
    UpdateExpression: "set course_difficulty =:newVal",
    ExpressionAttributeValues: {
      ":newVal": courseDifficulty
    },
  };
  const response = await dynamoDb.update(params).promise()
  .then(response => response)
  .catch(function () {
    console.log("Promise rejected");
  });
  return response;
}, { success: 200 });

module.exports = api;