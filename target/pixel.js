const log = (message) => console.log(`[pixel.js] ${message}`);

/* some business logic */
log('page_view');

/* cross-origin communication */
const { referrer } = document;
if (window.opener) {
  log(`window.opener is set. referrer = ${referrer}`);

  // optionally we can restrict to predefined referrers
  if (true || referrer.includes("ameyanaik.com")) {
    log(`postMessage("page_view", "${referrer}")`);
    window.opener.postMessage("page_view", referrer);
  }
} else {
  // log(`window.opener is not set.`);
}
