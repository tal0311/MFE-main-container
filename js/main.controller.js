window.onInit = onInit;

function onInit() {
  addEventListeners();
  setHeaderSrc();
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
        console.log("display_user", payload);
        sendDataToIframe("#nav_iframe", "display_user", payload);
      }
      if (type === "display_post") {
        console.log("display_post", payload);
        sendDataToIframe("#aside_iframe", "display_post", payload);
      }
      if (type === "update-post") {
        sendDataToIframe("#feed_iframe", "update_post", payload);
      }
    },
    false
  );
}

function setHeaderSrc() {
  const elIframe = document.querySelector("#header_iframe");
  const src =
    window.location.hostname === "localhost" ||
    window.location.hostname.startsWith("127.0.0.1")
      ? "http://127.0.0.1:8080"
      : "https://tal0311.github.io/MFE-header/";

  console.log("src", src);

  elIframe.src = src;
}
