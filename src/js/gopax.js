"use strinct";

/**
 * Secret Key를 생성.
 *
 * @param {Number}  nonce       헤더의 NONCE 값으로 중복되지 않고 계속 증가하는 값 (통상적으로 timestamp)
 * @param {String}  method      HTTP Method(대문자로): 'GET', 'POST', 'DELETE' 등
 * @param {String}  endPoint    API 엔드포인트 경로 (예: '/orders', '/trading-pairs/ETH-KRW/book')
 * @param {JSON}    [body=null] JSON 형식의 요청 변수 본문 (없을 경우 아무 문자열도 연결하지 마십시오)
 *
 * @return {String} 메시지 서명 값(Signature)
 */
export const genSignature = (nonce, method, endPoint, body = null) => {
    return `${nonce}${method}${endPoint}${!!body ? body : ''}`;
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const digitUnit = ['', '만', '억'];
export const genAssetTemplate = (stat) => {
    let tradingVolume = stat.tradingVolume;
    let digitCount = 0;
    while (tradingVolume > 10000) {
        tradingVolume = (tradingVolume / 10000).toFixed(0);
        digitCount += 1;
    }
    const ratioDirection = stat.ratio < 0 ? 'down' : stat.ratio > 0 ? 'up' : '';

    return `<tr id="${stat.toCoin}-${stat.name}">
        <td class="align-center">
            <div class="Star">⭑</div>
        </td>
        <td class="coinName">
            <div class="mainText">${stat.label}</div>
            <div class="subText">${stat.fromCoin}/${stat.toCoin}</div>
        </td>
        <td class="lastPrice align-right">
            <div class="mainText">${numberWithCommas(stat.close)}</div>
        </td>
        <td class="contrast align-right">
            <span class="mainText">
                <span class="ratio ${ratioDirection}">${stat.ratio}%</span>
            </span>
        </td>
        <td class="highPrice align-right">
            <div class="mainText">${numberWithCommas(stat.high)}</div>
        </td>
        <td class="lowPrice align-right">
            <div class="mainText">${numberWithCommas(stat.low)}</div>
        </td>
        <td class="tradingVolume align-right">
            <div class="mainText">${numberWithCommas(tradingVolume)}${digitUnit[digitCount]} ${stat.toCoin}</div>
        </td>
    </tr>`;
};


export class GoPaxApiHandler {
    static get corsProxyUrl() {
        return 'https://cors-anywhere.herokuapp.com/';
    }

    static get defaultApiUrl() {
        return 'https://api.gopax.co.kr';
    }

    constructor(enableCorsProxy=false) {
        this.apiUrl =
            (enableCorsProxy ? GoPaxApiHandler.corsProxyUrl : '') +
            GoPaxApiHandler.defaultApiUrl;
        // console.debug('this.apiUrl:', this.apiUrl);
    }

    doAuthentication() {
        // import sha512 from "./sha512hmac";
        // const apiKey = ''; // 발급받은 API 키
        // const secretKey = '';
        // const nonce = Date.now() * 1000;
        // const signature = generateSignature(nonce, method, endPoint, body);
        // console.debug('[*] Signature:', signature);
        // const decodedSecretKey = atob(secretKey); // Decode in base64
        // console.debug('[*] decodedSecretKey:', decodedSecretKey);
        // const hmacAuth = sha512.hmac(decodedSecretKey, 'Message to hash');
        // console.debug('[*] hmacAuth:', hmacAuth);
        // const hmacAuthBase64 = btoa(hmacAuth);
        // console.debug('[*] hmacAuthBase64:', hmacAuthBase64);
    }

    async fetch(method='GET', endPoint='', headers=null, isJson=true) {
        headers = headers || new Headers({
            'Content-Type': isJson ? 'application/json' : 'text/plain',
        });
        // console.debug('headers:', headers);
        const request = new Request(this.apiUrl + endPoint, {
            method: method,
            headers: headers
            // mode: 'no-cors',
            // json: true,
        });

        const resp = await fetch(request);
        // console.debug('[+] response:', resp);
        return !isJson ? resp : await resp.json();
    }
}