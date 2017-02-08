<<<<<<< HEAD
angular.module('MyApp',['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
  .controller('DemoCtrl', function($scope) {
    $scope.user = {
      title: 'Developer',
      email: 'ipsum@lorem.com',
      firstName: '',
      lastName: '',
      company: 'Google',
      address: '1600 Amphitheatre Pkwy',
      city: 'Mountain View',
      state: 'CA',
      biography: 'Loves kittens, snowboarding, and can type at 130 WPM.\n\nAnd rumor has it she bouldered up Castle Craig!',
      postalCode: '94043'
    };

    $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
    'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
    'WY').split(' ').map(function(state) {
        return {abbrev: state};
      });
=======

//Get modal
var modal = document.getElementById('myModal');

//grabs form
var form = document.getElementById('form');

// Get the button that opens the modal
var btn = document.getElementById("addBtn");

// Get the button that submits form
var sbmt = document.getElementById("sbmt");

// Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//     modal.style.display = "none";
// }

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

angular.module('MyForm', ['ngMaterial', 'ngMessages']).controller('FormCtrl', function($scope) {
    $scope.event = {
      name: 'Enter Event Name',
      location: '',
      description: 'Enter Event Description',
      startTime: 'Google',
      endTime: '1600 Amphitheatre Pkwy',
    };
    console.log("loaded Form");

>>>>>>> c212e733afbf1ef83b48de25b103618cf4ea9baf
  })
  .config(function($mdThemingProvider) {

    // Configure a dark theme with primary foreground yellow

    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();

  });
<<<<<<< HEAD


/**
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that can be foundin the LICENSE file at http://material.angularjs.org/HEAD/license.
**/
=======
>>>>>>> c212e733afbf1ef83b48de25b103618cf4ea9baf
