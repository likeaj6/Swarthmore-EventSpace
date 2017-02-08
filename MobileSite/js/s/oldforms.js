
//Get modal
var modal = document.getElementById('myModal');

//grabs form
var form = document.getElementById('form')


var newref = firebase.database().ref('forms/');

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the button that submits form
var sbmt = document.getElementById("sbmt");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
// When user submits form, adds it to firebase
sbmt.onclick = function(e){
 e.preventDefault();
 if(document.getElementById('allday').checked){
   var item = {
     name: form.name.value,
     loc: form.loc.value,
     date: form.date.value,
     desc: form.desc.value,
     start_time: "All Day",
     end_time: "All Day",
   };
 }else{
   var item = {
     name: form.name.value,
     loc: form.loc.value,
     date: form.date.value,
     desc: form.desc.value,
     start_time: form.start_time.value,
     end_time: form.end_time.value,
 };
}
 newref.push(item);
 modal.style.display = "none";
 form.reset()
}
