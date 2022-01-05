import { TIMEOUT_SEC } from './config';

// After s seconds, timeout returns a rejected promise
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} seconds`));
    }, s * 1000);
  });
};

// Function that returns JSON from a promise, subject to timeout
const AJAX = async function (fetchPromise) {
  // res is the resolved value of the first promise to be settled
  const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);

  // Conversion of res to JSON
  const data = await res.json();

  // If res is the resolved value of a rejected promise
  if (!res.ok) throw new Error(`${data.message}`);
  // Otherwise return JSON
  return data;
};

// Function that gets JSON from a url
export const getJSON = async function (url) {
  try {
    // Promise relating to url content
    const fetchPromise = fetch(url);
    // Returns JSON or error thrown
    return AJAX(fetchPromise);
  } catch (err) {
    throw err; // error is handled elsewhere
  }
};

// Function that sends JSON to a url
export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // converts upLoadData to a JSON string
      body: JSON.stringify(uploadData),
    });
    // update url
    return AJAX(fetchPromise);
  } catch (err) {
    throw err;
  }
};
