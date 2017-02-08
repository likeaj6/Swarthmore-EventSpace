
/*
Notes
	BECAUSE SCOPE.DATA IS LOADED ASYNCHRONOUSLY, A CONSOLE.LOG RIGHT BELOW WILL YIELD ONLY EMPTY/UNDEFINED

	need to fix lat/long
	add google analytics
	add bunn's event form
	google maps selected info window
	attend button
	show markers for all events on the map
	*/
	var map;
	var markersArray = [];
	var currentInfoWindow;
	var selectedMarker = null;
	var currentTab = 1;
	var fetched;
	var load1 = false;
	var load2 = false;
	var ref = firebase.database().ref('events/now');

	var app = angular.module('MyApp', ["firebase"])
		.controller('AppCtrl', function($scope, $firebaseArray) {
		var ref0 = firebase.database().ref('events/now').orderByChild("sorted_time");
		var ref1 = firebase.database().ref('events/day0').orderByChild("sorted_time");
		console.log("Ref 1");
		console.log(ref1);
		var ref2 = firebase.database().ref('events/day1').orderByChild("sorted_time");
			$scope.eventsVar0 = $firebaseArray(ref0);
			if ($scope.eventsVar0.length == 0) {
				console.log("Events array is 0");
				$scope.noCurrentEvents = true;
				$scope.eventsVar0.push({'name': ""});
			}
			console.log("Printing ref0");
			console.log($scope.eventsVar0);

			//delay loading until scope is done
			function show() {
				AB = document.getElementById('bottom');
				// AB.style.display = 'inline';
			}
			setTimeout(show(), 10);
			$scope.eventsVar1 = $firebaseArray(ref1);
			console.log($scope.eventsVar1);
			$scope.eventsVar2 = $firebaseArray(ref2);
			var markersArray0 = [];
			var markersArray1 = [];
			var markersArray2 = [];
			//Pull from firebase ref a snapshot of the events
			markersArray = markersArray0;
			populateMapWithEvents();
			// console.log($scope.eventsVar);
			$scope.attendingEvent = function(){
				alert("You are attending the event!");
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
	     e.preventDefault();
			 currentTab = $($(this).attr('href')).index();
			 //hide previous markers
			 hideMarkers();
			 //based on new tab, either pull data if haven't pulled yet or unhide previously hidden markers.
			 if (currentTab == 0) {
				 document.getElementById('tab0').style.width = "40%";
				 document.getElementById('tab1').style.width = "30%";
				 document.getElementById('tab2').style.width = "30%";
				 ref = ref0;
				 markersArray = markersArray0;
				 unhideMarkers();
			 } else if (currentTab == 1) {
				 document.getElementById('tab1').style.width = "40%";
				 var now = document.getElementById('tab0').style.width = "30%";
				 document.getElementById('tab2').style.width = "30%";
				 ref = ref1;
				 markersArray = markersArray1;
				 if (!load1) {
					 populateMapWithEvents();
					 load1 = true;
				 } else {
					 	unhideMarkers();
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
				 } else {
					 	unhideMarkers();
				}
			 } else {
				 ref = ref0;
				 markersArray = markersArray0;
				unhideMarkers();
			 }
	 	// 	  });
	 	// 		// sortEventsByDate();
	 	// 	});
		 	});
		});
			// console.log($scope.eventsVar);
			// console.log("populating map");
			// $scope.$watch('$viewContentLoaded', function() {
			// 	console.log("waiting for view to load");
			// 	console.log(eventsArray);
	  	// 	$scope.$evalAsync(function() {populateMapWithEvents(eventsArray); });
			// });
		// function sortEventsByDate() {
		// 	$scope.eventsArray.sort(function(a,b) {
		// 		return a.date.valueOf() > b.date.valueOf();
		// 	});
		// 	// eventsArray. = childData.date.split('/');
		// 	// //var format = /(\d{2})\.(\d{2})\.(\d{4})/;
		// 	// //create a marker for each event
		// 	// var date = new Date(dateString[2],dateString[0]-1,dateString[1]);
		// 	// console.log(date);
		// 	// var current = new Date();
		// }

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
					 map: map
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
			map.panTo(location);
			map.setZoom(18);
		}
