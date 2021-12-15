import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} seconds`));
    }, s * 1000);
  });
};

const AJAX = async function (fetchPromise) {
  const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);

  const data = await res.json();

  if (!res.ok) throw new Error(`${data.message}`);
  return data;
};

export const getJSON = async function (url) {
  try {
    const fetchPromise = fetch(url);
    return AJAX(fetchPromise);
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(uploadData),
    });

    return AJAX(fetchPromise);
  } catch (err) {
    throw err;
  }
};
