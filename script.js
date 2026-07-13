// home menu dropdown
function toggleMenu(menuId) {
const menu= document.getElementById(menuId);
if ( menu.classList.contains('show')){
    menu.classList.remove('show');
}
else {
    menu.classList.add('show');
}
}


document.addEventListener('click', function(event){
    const dropdownmenu= document.getElementById('homemenu');
    const creditmenu= document.getElementById('credit-menu');
    const aboutmenu= document.getElementById('about-menu');
    if(!event.target.closest('.dropdown')){
        dropdownmenu.classList.remove('show');
    }
    if (!event.target.closest('#credit-menu')&& ! 
    event.target.closest('[onclick="showcreditmenu()"]')){
        creditmenu.style.display='none';
    }
    if (!event.target.closest('#about-menu') && !
    event.target.closest('[onclick="showaboutmenu()"]')){
        aboutmenu.style.display ='none';
    }
});
// toggle the credit menu 
function showcreditmenu(){
    const creditmenu = document.getElementById('credit-menu');
    if (creditmenu.style.display==='block'){
        creditmenu.style.display='none';
    } else {
        creditmenu.style.display = 'block';
    }
}
// about menu 
function showaboutmenu(){
    const aboutmenu= document.getElementById("about-menu");
    if(aboutmenu.style.display==='block'){
        aboutmenu.style.display= 'none';
    } else {
        aboutmenu.style.display='block';
    }
}
//credit menu



// bunny float
const button= document.getElementById('bunnyfloat');
const bunnycontainer = document.getElementById('bunnycontainer');

button.addEventListener('click', ()=> {
    for(let i=0;i<20;i++){
        const bunny=document.createElement('div');
        bunny.className = 'bunny';
        bunny.textContent = '🍥';
        bunny.style.left = Math.random()* 100 + '%';
        bunny.style.top = Math.random()* 90+ '%';
        bunny.style.fontSize= Math.random() * 20 +20+'px';
        bunnycontainer.appendChild(bunny);
        setTimeout(()=> {
            bunny.remove();
        }, 4000);
    }
});


