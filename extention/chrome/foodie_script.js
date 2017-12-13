var last_element;
var getSelectionText = function () {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}
function dompath( element )
{
    var path = '';
    for ( ; element && element.tagName.toLowerCase()!='body' && element.nodeType == 1; element = element.parentNode )
    {
        var inner = $(element).children().length == 0 ? $(element).text() : '';
        var eleSelector = element.tagName.toLowerCase();
        path = ' ' + eleSelector + path;
    }
    return path.trim();
}



var help_me = function () {
    let path=dompath(last_element.toElement);
    let sibling=document.querySelectorAll(path)
    let locations=[];
    sibling.forEach(element=>{
        locations.push(element.innerText.trim());
    });
    alert(locations.join('||'));
    console.log('foodies help_me started');
    console.log('foodies getSelectionText defined');
    var iframe = document.getElementById("foodie_to_foodie_iframe")
    if (iframe == undefined) {
        iframe = document.createElement("iframe");
        iframe.setAttribute("id", "foodie_to_foodie_iframe");
        iframe.setAttribute("style", "width:20%;position: fixed;top: 0px;left: 80%;height:100%;overflow: auto; z-index: 2147483646;background-color:whitesmoke;");
        console.log('foodies selected ' + getSelectionText());
        document.body.insertBefore(iframe, document.body.firstChild);
    }
    iframe.src = 'https://foodieforfoodie.herokuapp.com/search/' + getSelectionText();
    console.log('foodies iframe added');
    console.log('foodies help_me ended');
}


let addButton = function (text) {
    var div = document.createElement("div");
    div.innerHTML = '<button class="foodie_to_foodie_button" onclick="help_me()">' + text + '</button>';
    div.setAttribute("style", "position: fixed;top: 0px;right: 0;overflow: auto; z-index: 2147483647;background-color:whitesmoke;");
    div.setAttribute("id", "foodie_to_foodie_div");
    document.body.insertBefore(div, document.body.firstChild);
    console.log('foodies div added');
  }
  
  
  addButton('checkeat !!!');

  
/*
foodie_config.data.forEach(function (element) {
    if (element.type == "include") {
        if (window.location.href.includes(element.pattern)) {
            is_button = true;
            console.log('foodies foodie_script button is there');
        }
    }
})*/
function doSomethingWithSelectedText(e) {

    if (window.getSelection().toString() != '' & e.path[0].className!='foodie_to_foodie_button') {
        last_element = e;
        console.log('foodies foodie_script button is there');
    }
}

window.document.onmouseup = doSomethingWithSelectedText;
window.document.onkeyup = doSomethingWithSelectedText;

let markAllRestaurants=function(){
    if(window.location.href.toLocaleLowerCase().includes('london')){
        let restaurant_names=['Chicama','Royal China','Naughty Piglets','Beagle','Bistro Union','Caravan King’s Cross','Ottolenghi','Medlar','St John','Park Chinois','Dishoom','Scott’s','The Shed','Yashin','Kricket','Ember Yard','Texture','Modern Pantry','Bar Boulud','Bellanger','Casse-Croûte','Trullo','Rochelle Canteen','Gymkhana','Berners Tavern','The Providores & Tapa Room','Berber & Q','The Wolseley','Primeur','Oldroyd','Clove Club','Smokestak','Luca','Provender','Begging Bowl','Burger & Lobster Soho','Dean Street Townhouse','Jidori','Nama','J Sheekey Atlantic Bar','Pidgin','Honey & Co','Sakagura','Rök Smokehouse N1','El Pastor','Kitty Fisher’s','Copita','Frenchie','Sardine','The Good Egg','Gunpowder','Clipstone','Snaps & Rye','Harwood Arms','The Palomar','Monty’s Deli','Hakkasan','Chiltern Firehouse','108 Garage','Salut!','Ikoyi','The Ledbury','Jamavar','Llewelyn’s','Chicama','Dinings SW3','Oklava','Magpie','Artusi','Westerns Laundry','10 Greek Street','Marcella','Plot','Padella','Hutong','Hawksmoor Seven Dials','Lyle’s','Bocca di Lupo','Chick ‘n’ Sours','Legs','Tandoor Chop House','Arthur Hooper’s','Sparrow','Native','Malibu Kitchen at The Ned','Uchi','The Manor','Roka','Xu','Henrietta','Perilla','Bao','Ceviche Soho','Hoppers','Som Saa','Counter Culture','Kiln','Barrafina','Temper','Social Eating House','The Barbary']
        let path;
        let stop=false;
        restaurant_names.forEach(element=>{
            
            if(!stop){
                let the_element;
                let arr=$( ":contains('"+element+"')" );
                arr.toArray().forEach(element1=>{
                        if(element1.innerText && element1.innerText.includes(element)){
                            if(!the_element || the_element.innerText.length>element1.innerText.length){
                                if(element1.innerText.trim().length-10<element.length){
                                    the_element=element1;
                                }
                            }
                        }
                });
                if(the_element){
                    path=dompath(the_element); 
                }
            }
        })
        if(path){
            let sibling=document.querySelectorAll(path)
            let locations=[];
            sibling.forEach(element=>{
                locations.push(element.innerText.trim());
            });
            var iframe = document.getElementById("foodie_to_foodie_iframe_track")
            if (iframe == undefined) {
                iframe = document.createElement("img");
                iframe.setAttribute("id", "foodie_to_foodie_iframe_track");
                iframe.setAttribute("style", "width:100px;position: fixed;top: 0px;left: 100px;height:100%;overflow: auto; z-index: 21474836;background-color:whitesmoke;");
                document.body.insertBefore(iframe, document.body.firstChild);
            }
            iframe.src = 'http://localhost:5000/api/tracker?location=london&places='+encodeURIComponent(locations.join('||'))+"&refer="+encodeURIComponent(window.location.href);
        }
    }
} 


let isMarkAllRestaurants=false;
// A $( document ).ready() block.
$( document ).ready(function() {

    setTimeout(function(){ 
        markAllRestaurants(); 
    }, 5000);
    isMarkAllRestaurants=true;
});

setTimeout(function(){ 
    if(!isMarkAllRestaurants){
        markAllRestaurants(); 
    }
}, 15000);


console.log('foodies foodie_script loaded');
