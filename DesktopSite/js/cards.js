
/*
Notes
	BECAUSE SCOPE.DATA IS LOADED ASYNCHRONOUSLY, A CONSOLE.LOG RIGHT BELOW WILL YIELD ONLY EMPTY/UNDEFINED
	*/
	var map;
	var markersArray = [];
	var currentInfoWindow;
	var selectedMarker = null;
	var currentTab = 0;
	var setTab = 0;
	var fetched;
	var load1 = false;
	var load2 = false;
	var noEvents = false;
	var ref = firebase.database().ref('events/now');
	var likesArray = {};
var cookieArrayRedundant = []; //a redundant array to store cookies in (in case cookies are disabled)

var app = angular.module('MyApp', ["firebase"])
.controller('AppCtrl', function($scope, $firebaseArray) {
		var likesLink = firebase.database().ref('likes/');
		$scope.loadedEvents = false;
		/*
			Hardcode tabs to be the right size. Find a better way to do this later.
			*/
			/* ######################################################################*/
			document.getElementById('tab0').style.width = "40%";
			document.getElementById('tab1').style.width = "30%";
			document.getElementById('tab2').style.width = "30%";
			/* ######################################################################*/


			var ref0 = firebase.database().ref('events/now').orderByChild("sorted_time");
			var ref1 = firebase.database().ref('events/day0').orderByChild("sorted_time");
			// console.log("Ref 1");
			// console.log(ref1);
			var ref2 = firebase.database().ref('events/day1').orderByChild("sorted_time");
			var markersArray0 = [];
			var markersArray1 = [];
			var markersArray2 = [];
	//Pull from firebase ref a snapshot of the events

	markersArray = markersArray0;
	populateMapWithEvents();
	if (noEvents) {
			//console.log("Events array is 0");
			$scope.noCurrentEvents = true;
		} else {
			$scope.noCurrentEvents = false;
	}
	$scope.eventsVar0 = $firebaseArray(ref0);
	$scope.eventsVar0.$loaded().then(function() {

		$scope.eventsVar0.sort(function(a,b) {
			console.log("sorting array");
			return a.count.valueOf() < b.count.valueOf();
		});
	});
	//move this into a helper function eventually, for each event in likes, loop through childs, grab child key, add [K,V] to likes array, set eventCount equal to likes array, display list
	if(!$scope.loadedEvents) {
	firebase.database().ref('likes/').once('value', function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			console.log("looping through likes tree");
			var key = childSnapshot.key;
			console.log(key);
			likesArray[key] = childSnapshot.val().count;
		});
		$scope.eventCount = likesArray;
		$scope.loadedEvents = true;
		console.log("LoadedEvents is true");
		console.log("eventCount");
		console.log($scope.eventCount);
	});
}
		//delay loading until scope is done
		$scope.eventsVar1 = $firebaseArray(ref1)
		$scope.eventsVar1.$loaded().then(function() {
			$scope.eventsVar1.sort(function(a,b) {
				console.log("sorting array");
				return a.count.valueOf() < b.count.valueOf();
			});
		});
		$scope.eventsVar2 = $firebaseArray(ref2)
		$scope.eventsVar2.$loaded().then(function() {
			$scope.eventsVar2.sort(function(a,b) {
				console.log("sorting array");
				return a.count.valueOf() < b.count.valueOf();
			});
		});

		//delay loading until scope is done
		function show() {
			AB = document.getElementById('leftSide');
			AB.style.display = 'inline';
		}
		show();
		$scope.eventsVar1 = $firebaseArray(ref1);
		console.log($scope.eventsVar1);
		$scope.eventsVar2 = $firebaseArray(ref2);

		// console.log($scope.eventsVar);
		$scope.attendingEvent = function(eventID, index){
			var countTransaction = firebase.database().ref('/likes').child(eventID).child('count')
			if(checkCookie(eventID) || checkCookieRedundant(eventID)) {
				if(checkCookieRedundant(eventID)) {
					//does this actually check if cookies are enabled or not? if so, we will need to use it in a diff way, before they even vote to start w/
					// alert("Please enable cookies for your vote to show!");
					console.log("disabled cookies");
				}
				// alert("you already liked this event brah");
				console.log("gotta unlike");
				document.getElementById(eventID).style.fill = "#aab8c2";
				countTransaction.transaction(function(count) {
					 // this part is eventually consistent and may be called several times
					 if (count != null) {
							 console.log("Count is being read as: " + count);
							 console.log("increasing count");
							 count--;
							 console.log("New Count: " + count);
							 return count;
					 } else {
							return -1;
					}
			 }, function(error, committed, snapshot) {
					 if (error) {
							 console.log("error in transaction");
					 } else if (!committed) {
							 console.log("transaction not committed");
					 } else {
							 console.log("Transaction Committed");
					 }
			 }, true);
			 removeEventFromCookie(eventID);
			 removeEventFromCookieRedundant(eventID);
			 $scope.eventCount[eventID]--;

			}else{
				console.log("First time event click. Incrementing count");
				document.getElementById(eventID).style.fill = "#e2264d";
				//otherwise (event not liked before) we increment count by 1
				//code to increment event.count by 1
				countTransaction.transaction(function(count) {
					 // this part is eventually consistent and may be called several times
					 if (count != null) {
							 console.log("Count is being read as: " + count);
							 console.log("increasing count");
							 count++;
							 console.log("New Count: " + count);
							//
							 return count;
					 } else {
							return -1;
					}
			 }, function(error, committed, snapshot) {
					 if (error) {
							 console.log("error in transaction");
					 } else if (!committed) {
							 console.log("transaction not committed");
					 } else {
							 console.log("Transaction Committed");
					 }
			 }, true);
			 $scope.eventCount[eventID]++;
		// this part is guaranteed consistent and will match the final value set
								addEventToCookie(eventID);
								addEventToCookieRedundant(eventID);
				//now, we update the display -- time to use ng-bind baby
			}
		 //add to local javascript array for redundancy (if cookies are disabled)

	}
		$scope.cardClicked = function(latitude, longitude, $index) {
			console.log("latitude:" + latitude);
			console.log("longitude:" + longitude);
			console.log($index);
			updateMapLocation(latitude, longitude);
			//markersArray[eventId].infowindow.open(map, markersArray[eventId]);
			if (currentInfoWindow) currentInfoWindow.close();
			markersArray[$index].infowindow.open(map, markersArray[$index]);
			currentInfoWindow = markersArray[$index].infowindow;
		}
		$('.nav-tabs a').click(function (e) {
            // e.preventDefault();
            currentTab = $($(this).attr('href')).index();
            console.log(currentTab);
            if (currentTab == setTab) {
            	console.log("returning");
            	return;
            }
         //hide previous markers
         if (currentInfoWindow) {
         	currentInfoWindow.close();
         }
         hideMarkers();
         //based on new tab, either pull data if haven't pulled yet or unhide previously hidden markers.
         if (currentTab == 0) {
         	document.getElementById('tab0').style.width = "40%";
         	document.getElementById('tab1').style.width = "30%";
         	document.getElementById('tab2').style.width = "30%";
         	ref = ref0;
         	markersArray = markersArray0;
         	unhideMarkers();
         	setTab = currentTab;
         } else if (currentTab == 1) {
         	document.getElementById('tab1').style.width = "40%";
         	document.getElementById('tab0').style.width = "30%";
         	document.getElementById('tab2').style.width = "30%";
         	ref = ref1;
         	markersArray = markersArray1;
         	if (!load1) {
         		console.log("populating tab1");
         		populateMapWithEvents();
         		load1 = true;
         		setTab = currentTab;
         	} else {
         		console.log("unhiding markers");
         		unhideMarkers();
         		setTab = currentTab;
         	}
         } else if (currentTab == 2) {
         	document.getElementById('tab2').style.width = "40%";
         	document.getElementById('tab0').style.width = "30%";
         	document.getElementById('tab1').style.width = "30%";
         	ref = ref2;
         	markersArray = markersArray2;
         	if (!load2) {
         		populateMapWithEvents();
         		load2 = true;
         		setTab = currentTab;
         	} else {
         		unhideMarkers();
         		setTab = currentTab;
         	}
         } else {
         	ref = ref0;
         	markersArray = markersArray0;
         	unhideMarkers();
         }
    //       });
    //         // sortEventsByDate();
    //     });
});
	});


/* ############################## ABOVE JUST CALLS addEventToCookie #########################*/
	/*  We're going to have 1 cookie that stores the array of eventID's that have been liked.
		We'll call this array likedEvents.

		likedEvents is maintained in a single cookie as a JSON string.
		*/
	//adds an eventID to the cookie
	function addEventToCookie(eventID) { //eventID is a string containing the ID
		console.log("added event to cookie");
		var expires = "";
		//days stores how long we want to store the cookie (in our case, as long as possible)
		var days = 7;
		var date = new Date();
		date.setTime(date.getTime() + (days*24*60*60*1000));
		expires = "; expires=" + date.toUTCString();

		var cookieArray = getCookieArray();
		//console.log("is array?: " + $.isArray(cookieArray));  So we getting an array

		//add the eventID to likedEvents if it isn't already there
		if(!checkCookie(eventID)) {
			cookieArray[eventID] = true;
		}

		/*-------------------------------------------------------------------------------------------------*/

		name="likedEvents";
		value=JSON.stringify(cookieArray);
		document.cookie = name + "=" + value + expires + "; path=/";
	}
	function removeEventFromCookie(eventID) { //eventID is a string containing the ID
		var expires = "";
		//days stores how long we want to store the cookie (in our case, as long as possible)
		var days = 7;
		var date = new Date();
		date.setTime(date.getTime() + (days*24*60*60*1000));
		expires = "; expires=" + date.toUTCString();
		console.log("removing event from cookie");
		//days stores how long we want to store the cookie (in our case, as long as possible)
		var cookieArray = getCookieArray();
		//console.log("is array?: " + $.isArray(cookieArray));  So we getting an array
		cookieArray[eventID] = false;
		name="likedEvents";
		value=JSON.stringify(cookieArray);
		document.cookie = name + "=" + value + expires + "; path=/";
	}

//add cookie to the js cookie array
function removeEventFromCookieRedundant(eventID) { //eventID is a string containing the ID
	cookieArrayRedundant[eventID] = false;
	console.log("removed cookies from redundant");
}

//add cookie to the js cookie array
	function addEventToCookieRedundant(eventID) { //eventID is a string containing the ID
		if(!checkCookieRedundant(eventID)) {
			cookieArrayRedundant[eventID] = true;
		}
		console.log("adding cookies to redundant");
	}

	//returns whether the eventId is in the cookie array
	function checkCookie(eventID) {
		cookieArray = getCookieArray();

		// var cookieExists = false;
		// for(i=0; i<cookieArray.length; i++) {
		// 	if(cookieArray[i] == eventID) {
		// 		cookieExists = true;
		// 		console.log("cookie exists");
		// 	}
		// }
		return cookieArray[eventID];
	}

	function checkCookieRedundant(eventID) {
		return cookieArrayRedundant[eventID];
	}
	//returns the cookie in array format
	function getCookieArray() { //this function is not working correctly. should be returning cookiearray but is return empty
		if(!document.cookie.length>0) {
			console.log("no cookie");
		}
		if (document.cookie.length > 0) {
			c_start = document.cookie.indexOf("likedEvents" + "=");
			if (c_start != -1) {
				c_start = c_start + "likedEvents".length + 1;
				c_end = document.cookie.indexOf(";", c_start); //does JSON string have ;?  No.
				if (c_end == -1) {
					c_end = document.cookie.length;
				}
				var jsonStringArray = unescape(document.cookie.substring(c_start, c_end));
				var cookieArray = JSON.parse(jsonStringArray);
				//console.log("what getCookieArray is returning immediately below");
				//console.log(cookieArray);
				return cookieArray;

				//var arr = [];
				//return arr;
			}
		} //else
		var arr = {};
		return arr; //should we return -1 here?  maybe split it into: var arr=[], return arr
	}

	//returns the cookie in array format


	function sortByTime(){

	}
	function initMap() {
		var uluru = {lat: 39.905217, lng: -75.354186};
		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 17,
			center: uluru,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
			}
		});
	}
	function hideMarkers() {
		for (var i = 0; i < markersArray.length; i++ ) {
			markersArray[i].setVisible(false);
		}
	}
	function unhideMarkers() {
		for (var i = 0; i < markersArray.length; i++ ) {
			markersArray[i].setVisible(true);
		}
	}
	function populateMapWithEvents() {
		ref.once('value', function(snapshot) {
			if(snapshot.hasChildren()){
				console.log("snapshot has children")
				noEvents = false;
			}
			// console.log("fetching snapshot");
			// var tempArray = snapshot;
			// console.log("attempting to sort snapshot");
			// console.log(tempArray);
			// tempArray.sort(function(a,b) { return a.val().sortedTime > b.val().sortedTime;});
			// console.log(tempArray);
			snapshot.forEach(function(childSnapshot) {

				var childData = childSnapshot.val();
				console.log(childData);
 //###add childData to array, end for each loop, sort array, iterate through new sorted array and add markers###
			 //populateMapWithEvents(childData.lat, )
			 var marker = new google.maps.Marker({
			 	title: childData.name,
			 	position: new google.maps.LatLng(childData.lat, childData.lng),
			 	map: map,
			 	//icon: 'images/dot.png'
			 	icon: {
			 		path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
			 		scale: 6,
			 		strokeColor: '#831f33',
			 		fillOpacity: 0,
			 		strokeWeight: 4
			 	}
			 });
			 // id = marker.__gm_id;
			 markersArray.push(marker);
			 //markersArray[childData.eventId] = marker;
			 var contentString = '<div id="content">'+
			 '<div id="siteNotice">'+
			 '</div>'+
			 '<h1 id="firstHeading" class="firstHeading">' + childData.name + '</h1>'+
			 '<div id="bodyContent">'+
			 '<p>' + childData.location + '</p>'+
			 '<p>' + "Description: " + childData.description + '</p>'+
			 '</div>'+
			 '</div>';
			 marker.infowindow = new google.maps.InfoWindow({
			 	content: contentString
						 //  content: "Title: " + childData.name + "\ " + "Description: " + childData.eventDescription

						});
			 google.maps.event.addListener(marker, 'click', function() {
			 	if (currentInfoWindow) currentInfoWindow.close();
			 	marker.infowindow.open(map, marker);
			 	currentInfoWindow = marker.infowindow;
			 });
			});
		});
	}
	function updateMapLocation(latitude, longitude) {
		var location = new google.maps.LatLng(latitude, longitude);
		map.setZoom(18);
		map.panTo(location);
		map.panBy(-30, 0);
	}
