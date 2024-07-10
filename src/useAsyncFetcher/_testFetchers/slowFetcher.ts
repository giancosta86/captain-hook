import { delay } from "@giancosta86/time-utils";
import { value } from "./core.js";

export const fetchDelay = 500;

export const delayTestInterval = fetchDelay - fetchDelay / 6;

export const run = async (requestedDelay?: number) => {
  await delay(requestedDelay ?? fetchDelay);
  return value;
};
