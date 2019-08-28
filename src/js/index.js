"use strinct";

import sha512 from "./sha512hmac";
import { generateSignature } from "./gopax";


const apiKey = '';  // 발급받은 API 키
const secretKey = '';
const nonce = Date.now() * 1000; // 중복되지 않고 계속 증가하는 값 (통상적으로 timestamp)
const method = 'GET';
const endPointPath = '/assets';
const payload = null;

const signature = generateSignature(nonce, method, endPointPath, payload);
console.debug('[*] Signature:', signature);
const decodedSecretKey = atob(secretKey); // Decode in base64
console.debug('[*] decodedSecretKey:', decodedSecretKey);
const hmacAuth = sha512.hmac(decodedSecretKey, 'Message to hash');
console.debug('[*] hmacAuth:', hmacAuth);
const hmacAuthBase64 = btoa(hmacAuth);
console.debug('[*] hmacAuthBase64:', hmacAuthBase64);

const apiUrl = 'https://api.gopax.co.kr';
const headers = {
  'API-KEY': apiKey,
  'SIGNATURE': signature,
  'NONCE': nonce,
};
const reqOpt = {
  method: method,
  headers: headers,
  json: true,
  mode: 'no-cors',
  // cache: 'default'
};

fetch(apiUrl, reqOpt)
  .then(resp => {
    console.log('[+] response:', resp);
  })
  .catch(err => {
    console.log('[-] error:', err);
  });
