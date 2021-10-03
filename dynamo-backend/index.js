const ApiBuilder = require('claudia-api-builder'),
    AWS = require('aws-sdk');
var api = new ApiBuilder(),
    dynamoDb = new AWS.DynamoDB.DocumentClient();

// Pre-populate courses
api.post('/courses/populate', async function (request) {
  try {

    for (var i = 30; i < 50; i++) {
      var randomName = i.toString();
      var difficulty = 100;
      var enjoy = false;
      console.log("PARAMSSSSSSS");
      console.log(randomName);
      console.log(difficulty);
      console.log(enjoy);

      var params = {  
        TableName: 'courses',  
        Item: {
          course_name: randomName,
          course_difficulty: difficulty,
          course_enjoy: enjoy
        } 
      }
      const response = await dynamoDb.put(params).promise()
      .then(response => response)
      .catch(function () {
        console.log("Promise rejected");
      });
    }
    return response;
  }
  catch(err) {
    console.log("Error: " + err);
  }
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


// Get all courses
api.get('/courses', async function (request) {
  const response = await dynamoDb.scan({ TableName: 'courses' }).promise()
  .then(response => response.Items)
  .catch(function (err) {
    console.log("Promise rejected: " + err);
  });

  return response;
});

// Get paginated courses
api.get('/courses/paginate/{page}/{limit}', async function (request) {
  const page = request.pathParams.page;
  const limit = request.pathParams.limit;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  var slicedResponse = [];

  const response = await dynamoDb.scan({ TableName: 'courses' }).promise()
  .then(response => {
    console.log("ALL ITEMS: " + response.Items);
    slicedResponse = response.Items.slice(startIndex, endIndex);
    console.log("5 ITEMS: " + slicedResponse);
  })
  .catch(function (err) {
    console.log("Promise rejected: " + err);
  });

  return slicedResponse;
});

// Delete a course
api.delete('/courses/delete/{courseName}', async function (request) {
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
  .catch(function (err) {
    console.log("Promise rejected: " + err);
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