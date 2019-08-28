"use strinct";

/**
 * Secret Key를 생성.
 *
 * @param {Number}  nonce            헤더의 NONCE 값
 * @param {String}  method           HTTP Method(대문자로): 'GET', 'POST', 'DELETE' 등
 * @param {String}  endPointPath     API 엔드포인트 경로 (예: '/orders', '/trading-pairs/ETH-KRW/book')
 * @param {JSON}    [payloadInJSON=None]  JSON 형식의 요청 변수 본문 (없을 경우 아무 문자열도 연결하지 마십시오)
 *
 * @return {String} 메시지 서명 값(Signature)
 */
export const generateSignature = (nonce, method, endPointPath, payloadInJSON=null) => {
    return `${nonce}${method}${endPointPath}${!!payloadInJSON ? payloadInJSON : ''}`;
};