
window.onInit= onInit 


function onInit(){
  addEventListeners()
}

function sendMsgToIframe(payload){
  const iframe = document.querySelector('#nav_iframe')
  iframe.contentWindow.postMessage({type:'display_user', payload:payload}, '*')
}



function addEventListeners(){
  window.addEventListener('message', function(event) {
    console.log('event', event.data);
    const {type, payload} =event.data
    if(type ==='display_user'){
      sendMsgToIframe(payload)
    }
    
  } , false);
}