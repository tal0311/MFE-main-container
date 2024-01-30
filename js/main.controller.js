import { weatherService } from "./services/weather.service.js";

window.onInit = onInit;
window.closeModal = closeModal;

function onInit() {
  openModalByParams();
  addEventListeners();
  setHeaderSrc();
  getWeatherByUserLocation();
}

function sendDataToIframe(selector, type, payload) {
  const iframe = document.querySelector(selector);
  iframe.contentWindow.postMessage({ type, payload }, "*");
}

function addEventListeners() {
  window.addEventListener(
    "message",
    (event) => {
      const { type, payload } = event.data;
      if (type === "display_user") {
        sendDataToIframe("#nav_iframe", "display_user", payload);
      }
      if (type === "display_post") {
        console.log("display_post", payload);
        sendDataToIframe("#aside_iframe", "display_post", payload);
      }
      if (type === "update_post") {
        sendDataToIframe("#feed_iframe", "update_post", payload);
      }
      if (type === "display_modal") {
        openModal();
      }
    },
    false
  );
}

function openModal() {
  const elModal = document.querySelector(".add-post-dialog");
  elModal.showModal();
  handleUrlParams("modal", true);
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
    console.log("ev", ev);
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
  if (paramValue && paramValue) {
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
    console.log(
      "🚀 ~ navigator.geolocation.getCurrentPosition ~ weather:",
      weather
    );

    sendDataToIframe("#aside_iframe", "display_weather", weather);
  });
}
