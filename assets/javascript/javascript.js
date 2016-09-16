// this is the firebase configuration
var config = {
    apiKey: "AIzaSyAYM7q8J4WUIpUUpDJryVRnwadk1KrSf5o",
    authDomain: "project-20539.firebaseapp.com",
    databaseURL: "https://project-20539.firebaseio.com",
    storageBucket: "",
};
// this is the firebase initialiser
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();
var contentEditable = true;


// this function will store the data in the firebase database on click of a submit button
function storingInDatabase() {

    // get the value from the input fields to set them in the database
    var trainName = $('#trainNameInput').val().trim();
    var destination = $('#destinationInput').val().trim();
    var firstTrainTime = moment($('#firstTrainTimeInput').val(), 'HH:mm').format('x');
    var frequency = $('#trainFrequencyInput').val().trim();

    // referencing firebase to set the values from the input fields into firebase.
    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency

    });

// setting emply values in the inout fields
    $('#trainNameInput').val('');
    $('#destinationInput').val('');
    $('#firstTrainTimeInput').val('');
    $('#trainFrequencyInput').val('');

    return false;
}

// this function is calculation the next train and also minutes remaining for the train to arrive
function getMinutesTillNextTrain(firstTrainTime, frequency) {
    var timeRemaining;
	
    firstTrainTime = moment(parseInt(firstTrainTime));
    console.log(firstTrainTime);

    // current time
    var currentTime = moment();
    console.log('current Time' + moment(currentTime).format('HH:mm'));
    // time difference between current time and fir time train arrives
    var timeDiff = currentTime - firstTrainTime
    console.log('time diff btw current and first train time ' + timeDiff);

    // changing time difference format in minutes
    timeDiff = Math.floor( timeDiff / ( 60*1000 ) );

    // if first train is later than current time.
    if( timeDiff < 0 ) {
        timeDiff = Math.abs(timeDiff);
        timeRemaining = timeDiff;
    } else {
        // finding modulus of time diff and frequency to check the time remaining for next
        timeRemaining = frequency - (timeDiff % frequency);
        // console.log('time remaining ' + timeRemaining);
    }

    return timeRemaining;


}

//Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
database.ref().on('child_added', function(childSnapshot) {

    // defining variables
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTrainTime;
     //converting first train format in hours and mins 
    var firstTrain = moment(parseInt(firstTrainTime)).format('HH:mm');
    	// console.log('first train' + firstTrain);

    var frequency = childSnapshot.val().frequency;
    	// console.log('train frequency ' + moment(frequency).format('MM'));
    
    var minutesTillNextTrain = getMinutesTillNextTrain(firstTrainTime, frequency);

    var nextTrain = moment().add(minutesTillNextTrain, 'minutes').format('hh:mm A');
    	// console.log('Next Train:',nextTrain);

    $('#trainTable > tbody').append(
        '<tr data-first-train="' + firstTrain +'"><td class="name">' + trainName + '</td>' +
        '<td class="trainDestination">' + destination + '</td>' +
        '<td class="trainFrequency">' + frequency + '</td>' +
        '<td class="nextArrival">' + nextTrain + '</td>' +
        '<td class="nextTrainTime">' + minutesTillNextTrain + '</td>' +
        // this is a glyphicon to remove table data
        '<td class="remove table-remove glyphicon glyphicon-remove"></td>' +
        // this is an update button to update the content
    	'<td><button class="editButton">edit</button></td></tr>');
      
// an error object function which will consolelog any error
}, function(errorObject) {
    	console.log("The code failed: " + errorObject.code);

});

/* this function is used if you want to remove some train from the page with a remove button.
once the data is deleted by the user it will be removed from the database as well*/
$(document).on('click', '.remove', function(){
	$(this).parent('tr').remove();
    var trainName = $(this).parent('tr').find('.name').text();
	database.ref().remove(trainName);
	
});



$(document).on('click','.editButton', function(){

		var name = $('.name').html();
		var destination = $('.trainDestination').html();
		var frequency = $('.trainFrequency').html();
		var nextTrain = $('.nextArrival').html();
		var firstTrainTime = $(this).closest('tr').data('first-train');
		// console.log('test' + firstTrainTime);
		var minutesTillNextTrain = $('.nextTrainTime').html();
		
		$('#trainNameInput').val(name);
		$('#destinationInput').val(destination);
   		$('#firstTrainTimeInput').val(firstTrainTime);
   		$('#trainFrequencyInput').val(frequency);

})

$('#updateButton').on('click', function(){
    var test = $('#trainNameInput').val().trim();

    database.ref().update({
        trainName: trainName,
      });      
    // console.log($('tr').data('first-train'));
    // console.log('testing:' + test);
    // var destination = $('#destinationInput').val().trim();
    // var firstTrainTime = moment($('#firstTrainTimeInput').val(), 'HH:mm').format('x');
    // var frequency = $('#trainFrequencyInput').val().trim();

              


})



$('#submitButton').on('click', storingInDatabase);
// $('#submitButton').on('click', pageRefresh);