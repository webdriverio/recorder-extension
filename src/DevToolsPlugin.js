import { stringifyChromeRecording } from "@wdio/chrome-recorder";

export class RecorderPlugin {
  async stringify(recording) {
    return await stringifyChromeRecording(JSON.stringify(recording));
  }
  async stringifyStep(step) {
    return JSON.stringify(step);
  }
}

/* eslint-disable no-undef */
chrome.devtools.recorder.registerRecorderExtensionPlugin(
  new RecorderPlugin(),
  /* name=*/
  'WebdriverIO Test',
  /* mediaType=*/
  'text/javascript'
);
