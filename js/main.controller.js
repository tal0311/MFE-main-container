import { weatherService } from "./services/weather.service.js";
import { utilService } from "./services/util.service.js";

const state = {
  loggedIdUser: utilService.loadFromStorage("loggedinUser") || null,
  USER_STORAGE_KEY: "loggedinUser",
};
window.state = state
window.onInit = onInit;
window.closeModal = closeModal;

function onInit() {
  openModalByParams();
  addEventListeners();
  setHeaderSrc();
  getWeatherByUserLocation();
  handleWindowMsg()
}

function sendDataToIframe(selector, type, payload) {
  const iframe = document.querySelector(selector);

  
  iframe.contentWindow.postMessage({ type, payload }, "*");
}

async function handleWindowMsg(){
  //TODO: refactor msg function
}

 function addEventListeners() {
  window.addEventListener(
    "message",
     async (event) => {
      const { type, payload } =await event.data;
      if (type === "display_user") {
        console.log("display_user", payload);
        sendDataToIframe("#nav_iframe", "display_user", payload);
        return
      }
      if (type === "display_post") {
        console.log("display_post", payload, state);
        sendDataToIframe("#aside_iframe", "display_post", {user: state.loggedIdUser, post:payload});
        return
      }
      if (type === "update_post") {
        console.log("update_post", payload);
        sendDataToIframe("#feed_iframe", "update_post", payload);
        return
      }
      if (type === "display_modal") {
        console.log("display_modal");
        openModal();
        return
      }
      if (type === "handle_user") {
      
        state.loggedIdUser = payload;
        
        console.log("handle_user", payload);
        
        utilService.saveToStorage(state.USER_STORAGE_KEY, payload);
        return
      }
      if(type === 'filter_posts'){
        console.log(payload);
        sendDataToIframe('#feed_iframe', 'filter_posts',payload)

      }
    },
    false
  );
}

function openModal() {
  const elModal = document.querySelector(".add-post-dialog");
  elModal.showModal();
  handleUrlParams("modal", true);
  setUserInModal();
}

function setUserInModal(){
  const user = utilService.loadFromStorage(state.USER_STORAGE_KEY);
  document.querySelector('.user-preview').innerHTML =`
  <img src="${user.imgUrl}" alt="User Image" class="modal-user-image">
  <h2 class="modal-username">${user.username}</h2>
  `
}

function openModalByParams() {
  const url = new URL(window.location.href);
  const modal = url.searchParams.get("modal");
  if (modal) {
      openModal();
      }
}

function closeModal(ev) {
  if (ev) {
    ev.preventDefault();
    const formData = Object.fromEntries(new FormData(ev.target));
    sendDataToIframe("#feed_iframe", "add_post", formData);
    ev.target.reset();
  }
  const elModal = document.querySelector(".add-post-dialog");
  elModal.close();
  handleUrlParams("modal", false);
}

function handleUrlParams(paramsName, paramValue) {
  const url = new URL(window.location.href);
  if (paramsName && paramValue) {
    url.searchParams.set(paramsName, paramValue);
  } else {
    url.searchParams.delete(paramsName);
  }
  window.history.pushState({}, "", url);
}

function setHeaderSrc() {
  const elIframe = document.querySelector("#header_iframe");
  const src =
    window.location.hostname === "localhost" ||
    window.location.hostname.startsWith("127.0.0.1")
      ? "http://127.0.0.1:8080"
      : "https://tal0311.github.io/MFE-header/";

  elIframe.src = src;
}

async function getWeatherByUserLocation() {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    const weather = await weatherService.getWeatherByLocation({
      lat: latitude,
      lng: longitude,
    });
    sendDataToIframe("#aside_iframe", "display_weather", weather);
  });
}
