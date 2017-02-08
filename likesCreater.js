
/*
Notes
	BECAUSE SCOPE.DATA IS LOADED ASYNCHRONOUSLY, A CONSOLE.LOG RIGHT BELOW WILL YIELD ONLY EMPTY/UNDEFINED
	*/

var ref0 = firebase.database().ref('events/now').orderByChild("sorted_time");
var ref1 = firebase.database().ref('events/day0').orderByChild("sorted_time");
var ref2 = firebase.database().ref('events/day1').orderByChild("sorted_time");

function eventsLikesID() {
		ref0.once('value', function(snapshot) {
				snapshot.forEach(function(childSnapshot) {
						var childData = childSnapshot.val();
						var eventID = childData.id;
						console.log(eventID);
						firebase.database().ref('likes/').child(eventID).update({count: 0});
				});
		});
		ref1.once('value', function(snapshot) {
				snapshot.forEach(function(childSnapshot) {
						var childData = childSnapshot.val();
						var eventID = childData.id;
						console.log(eventID);
						firebase.database().ref('likes/').child(eventID).update({count: 0});
				});
		});
		ref2.once('value', function(snapshot) {
				snapshot.forEach(function(childSnapshot) {
						var childData = childSnapshot.val();
						var eventID = childData.id;
						console.log(eventID);
						firebase.database().ref('likes/').child(eventID).update({count: 0});
				});
		});
}
	//adds an eventID to the cookie
