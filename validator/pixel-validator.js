const log = (message) => console.log(`[pixel-validator.js] ${message}`);

const CLOSE_WINDOW_DELAY_IN_SEC = 5;

var windowObjectReference = null; // global variable
var targetUrlOrigin = null; // global variable

/**
 * Open target url in window and update global referrences
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Window/open#best_practices
 * @param {string} url
 * @param {string} windowName
 */
function openRequestedPopup(url, windowName) {
  if (windowObjectReference == null || windowObjectReference.closed) {
    targetUrlOrigin = new URL(url).origin;

    windowObjectReference = window.open(
      url,
      windowName,
      "resizable,scrollbars,status"
    );
    log(`open target window: ${url}`);
  } else {
    windowObjectReference.focus();
  }
}

/**
 * Close windowObjectReference after X seconds delay
 */
function closeRequestedPopup() {
  if (windowObjectReference !== null && !windowObjectReference.closed) {
    log(`close target window after ${CLOSE_WINDOW_DELAY_IN_SEC} seconds`);
    setTimeout(() => {
      windowObjectReference.close();
      log("closed target window");
    }, CLOSE_WINDOW_DELAY_IN_SEC * 1000);
  }
}

/**
 * Bind click handler on button
 */
$("input[type=button]").click(() => {
  openRequestedPopup($("input[type=text]").val(), "target_window");
});
log("added listener on button");

/**
 * Listen cross-origin message
 * Close target window if received expected data from target url
 */
window.addEventListener(
  "message",
  ({ data, origin }) => {
    if (origin !== targetUrlOrigin && data !== "page_view") return;

    log(`[message from ${origin}] ${data}`);
    closeRequestedPopup();
    // ...
  },
  false
);
