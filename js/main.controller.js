import { weatherService } from "./services/weather.service.js";
import { utilService } from "./services/util.service.js";
import {comHub} from "./services/comHub.js";

const state = {
  loggedIdUser: utilService.loadFromStorage("loggedinUser") || null,
  USER_STORAGE_KEY: "loggedinUser",
};


window.state = state;
window.onInit = onInit;
window.closeModal = closeModal;

function onInit() {
  openModalByParams();
  addEventListeners();
  setHeaderSrc();
  getWeatherByUserLocation();
  handleWindowMsg();
}

function addEventListeners() {
  window.addEventListener("message", comHub.handleWindowMsg);
}

function openModal() {
  const elModal = document.querySelector(".add-post-dialog");
  elModal.showModal();
  handleUrlParams("modal", true);
  setUserInModal();
}

function setUserInModal() {
  const user = utilService.loadFromStorage(state.USER_STORAGE_KEY);
  document.querySelector(".user-preview").innerHTML = `
  <img src="${user.imgUrl}" alt="User Image" class="modal-user-image">
  <h2 class="modal-username">${user.username}</h2>
  `;
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
    comHub.sendDataToIframe("#feed_iframe", "add_post", formData);
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
    comHub.sendDataToIframe("#aside_iframe", "display_weather", weather);
  });
}
