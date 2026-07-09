const modal=document.getElementById("videoModal");

const btn=document.getElementById("watchTrailer");

const close=document.querySelector(".close");

btn.onclick=function(){

modal.style.display="block";

}

close.onclick=function(){

modal.style.display="none";

document.getElementById("trailerVideo").src=
document.getElementById("trailerVideo").src;

}

window.onclick=function(event){

if(event.target==modal){

modal.style.display="none";

document.getElementById("trailerVideo").src=
document.getElementById("trailerVideo").src;

}

}
