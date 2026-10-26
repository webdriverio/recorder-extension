import { stringifyChromeRecording, stringifyParsedStep } from "@wdio/chrome-recorder";
import { StringifyExtension } from "@wdio/chrome-recorder/dist/stringifyExtension.js";

const PIERCE_PREFIX = 'pierce/';
const ARIA_PREFIX = 'aria/';
const XPATH_PREFIX = 'xpath/';
const TEXT_PREFIX = 'text/';

const originalGetSelector = StringifyExtension.prototype.getSelector;
const originalStringifyStep = StringifyExtension.prototype.stringifyStep;

export function formatShadowSelector(segments) {
  return segments
    .map((segment) => JSON.stringify(segment.replace(/^pierce\//, '')))
    .join(').shadow$(');
}

StringifyExtension.prototype.getSelector = function (selectors, flow = {}) {
  if (Array.isArray(selectors)) {
    const shadowSelectors = selectors.filter(
      (selector) => Array.isArray(selector) && selector.length > 1
    );

    if (shadowSelectors.length > 0) {
      const cssShadowSelectors = shadowSelectors.filter((selector) =>
        selector.every(
          (segment) =>
            !segment.startsWith(PIERCE_PREFIX) &&
            !segment.startsWith(ARIA_PREFIX) &&
            !segment.startsWith(XPATH_PREFIX) &&
            !segment.startsWith(TEXT_PREFIX)
        )
      );

      const candidates =
        cssShadowSelectors.length > 0 ? cssShadowSelectors : shadowSelectors;

      if (flow && flow.selectorAttribute) {
        const preferred = candidates.find((selector) =>
          selector[selector.length - 1].includes(flow.selectorAttribute)
        );
        if (preferred) {
          return formatShadowSelector(preferred);
        }
      }

      return formatShadowSelector(candidates[0]);
    }
  }

  return originalGetSelector.call(this, selectors, flow);
};

StringifyExtension.prototype.stringifyStep = async function (out, step, flow) {
  const wrappedOut = {
    appendLine(line) {
      if (line.includes('browser.$$(') && line.includes(').shadow$(')) {
        const updatedLine = line
          .replace('browser.$$(', 'browser.$(')
          .replace(/\.shadow\$\(([^)]+)\)\)\.toBeElementsArrayOfSize/, '.shadow$$$($1)).toBeElementsArrayOfSize');
        return out.appendLine(updatedLine);
      }
      return out.appendLine(line);
    },
    startBlock() {
      return out.startBlock();
    },
    endBlock() {
      return out.endBlock();
    }
  };

  return originalStringifyStep.call(this, wrappedOut, step, flow);
};

export class RecorderPlugin {
  stringify(recording) {
    return stringifyChromeRecording(JSON.stringify(recording));
  }
  async stringifyStep(step) {
    return stringifyParsedStep(step);
  }
}

/* eslint-disable no-undef */
if (typeof chrome !== 'undefined' && chrome.devtools?.recorder) {
  chrome.devtools.recorder.registerRecorderExtensionPlugin(
    new RecorderPlugin(),
    /* name=*/
    'WebdriverIO Test',
    /* mediaType=*/
    'text/javascript'
  );
}
