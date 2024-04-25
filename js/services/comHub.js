async function handleWindowMsg(event) {
  const { type, payload } = await event.data;
  if (type === "display_user") {
    console.log("display_user", payload);
    sendDataToIframe("#nav_iframe", "display_user", payload);
    return;
  }
  if (type === "display_post") {
    console.log("display_post", payload, state);
    sendDataToIframe("#aside_iframe", "display_post", {
      user: state.loggedIdUser,
      post: payload,
    });
    return;
  }
  if (type === "update_post") {
    console.log("update_post", payload);
    sendDataToIframe("#feed_iframe", "update_post", payload);
    return;
  }
  if (type === "display_modal") {
    console.log("display_modal");
    openModal();
    return;
  }
  if (type === "handle_user") {
    state.loggedIdUser = payload;
    console.log("handle_user", payload);
    utilService.saveToStorage(state.USER_STORAGE_KEY, payload);
    return;
  }
  if (type === "filter_posts") {
    console.log(payload);
    sendDataToIframe("#feed_iframe", "filter_posts", payload);
  }
}

function sendDataToIframe(selector, type, payload) {
  const iframe = document.querySelector(selector);

  iframe.contentWindow.postMessage({ type, payload }, "*");
}

export const comHub = {
  handleWindowMsg,
  sendDataToIframe
};
