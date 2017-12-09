var getSelectionText=function() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
    }   
    return text;
}

var help_me=function(){
    
    console.log('foodies help_me started');  
    console.log('foodies getSelectionText defined');  
    var iframe=document.getElementById("foodie_to_foodie_iframe")
    if(iframe==undefined){
        iframe= document.createElement ("iframe");
        iframe.setAttribute("id", "foodie_to_foodie_iframe");
        iframe.setAttribute("style", "width:20%;position: fixed;top: 0px;left: 80%;height:100%;overflow: auto; z-index: 2147483646;background-color:whitesmoke;");
        console.log('foodies selected '+getSelectionText());
        document.body.insertBefore (iframe, document.body.firstChild);  
    }
    iframe.src  = 'https://foodieforfoodie.herokuapp.com/search/'+getSelectionText();
    console.log('foodies iframe added');
    console.log('foodies help_me ended');  
}

let addButton=function(text){
    var div  = document.createElement ("div");
    div.innerHTML = '<button onclick="help_me()">'+text+'</button>';
    div.setAttribute("style", "position: fixed;top: 0px;right: 0;overflow: auto; z-index: 2147483647;background-color:whitesmoke;");
    div.setAttribute("id", "foodie_to_foodie_div");
    document.body.insertBefore (div, document.body.firstChild);
    console.log('foodies div added');    
}


let is_button=false;
foodie_config.data.forEach(function(element){
    if(element.type=="include"){
        if(window.location.href.includes(element.pattern)){
            addButton(element.text);
            is_button=true;
            console.log('foodies foodie_script button is there');
        }
    }
})

if(!is_button){
    function doSomethingWithSelectedText(e) {
        if(window.getSelection().toString()!=''){
            addButton('Check It !!!');
            console.log('foodies foodie_script button is there');    
        } 
    }
    
    window.document.onmouseup = doSomethingWithSelectedText;
    window.document.onkeyup = doSomethingWithSelectedText;
}


    


console.log('foodies foodie_script loaded');
  