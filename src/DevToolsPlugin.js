import { stringifyChromeRecording, stringifyParsedStep } from "@wdio/chrome-recorder";

export class RecorderPlugin {
  stringify(recording) {
    return stringifyChromeRecording(JSON.stringify(recording));
  }
  async stringifyStep(step) {
    return stringifyParsedStep(step);
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
