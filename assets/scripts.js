console.log('foodies script start loading');

var host="";//"https://foodieforfoodie.herokuapp.com/";
var search=function(test) {
    var url=host+"search?name="+text;//window.parent.getSelectionText();
    document.getElementById("placeholder").innerHTML ="Loading...";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("placeholder").innerHTML = this.responseText;
        }
    }; 
    xhttp.open("GET", url, true);
    xhttp.send();
}

function reviews(url) {
    url=host+url;
    document.getElementById("reviews_placeholder").innerHTML ="Loading...";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("restaurant_placeholder").style.visibility = "hidden";
            document.getElementById("reviews_placeholder").innerHTML =this.responseText;
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}
function back(section) {
    if(section="reviews"){
        document.getElementById("restaurant_placeholder").style.visibility = "visible";
        document.getElementById("reviews_placeholder").innerHTML ="";
    }
}

console.log('foodies script end loading');



