"use strinct";

import {GoPaxApiHandler, genAssetTemplate} from './gopax';
import "../style/index.scss";
import "../style/table.scss";


let filterAsset = "KRW";
let filterKeyword = '';
let assetNameMap = {};
let assetList = [];
let sortField = 'tradingVolume';

const fetchAssetList = async () => {
    const apiHandler = new GoPaxApiHandler(true);

    try {
        const assetTableBody = document.querySelector("#asset-list > tbody");;
        const stats = await apiHandler.fetch('GET', '/trading-pairs/stats');
        // console.debug('[+] stats:', stats);
        assetList = stats
            .map((stat) => {
                const coins = stat.name.split('-');
                return {
                    ...stat,
                    label: assetNameMap[coins[0]],
                    fromCoin: coins[0],
                    toCoin: coins[1],
                    ratio: ((stat.open - stat.close) / stat.open * 100).toFixed(2),
                    tradingVolume: (stat.close * stat.volume).toFixed(0),
                };
            });
    } catch (err) {
        console.debug('[-] error:', err);
    }

    refreshTable();
    resetRefreshTimer();
};

const refreshTable = async () => {
    const filteredAssets = assetList.filter(stat => (stat.label.includes(filterKeyword) || stat.name.includes(filterKeyword)) && stat.toCoin === filterAsset)
        .sort((st1, st2) => st2[sortField] - st1[sortField]);
    // console.debug('[+] filteredAssets:', filteredAssets);
    const assetTemplates = filteredAssets
        .map((stat) => genAssetTemplate(stat))
        .join('');
    
    const assetTableBody = document.querySelector("#asset-list > tbody");
    assetTableBody.innerHTML = "";
    assetTableBody.insertAdjacentHTML('beforeend', assetTemplates);
};

const fetchAssetMap = async () => {
    const apiHandler = new GoPaxApiHandler(true);

    try {
        const assetList = await apiHandler.fetch('GET', '/assets');
        assetNameMap = assetList.reduce((nameMap, asset) => 
            (nameMap[asset.id] = asset.name, nameMap)
        , {});
        return assetNameMap;
    } catch (err) {
        console.debug('[-] error:', err);
    }
};

const registEventListeners = () => {
    const filter = document.querySelector('#asset-filter-box > .filter');
    filter.addEventListener("click", (evt) => {
        if ("filter-item" !== evt.target.className) {
            return ;
        }
        filterAsset = evt.target.textContent;
        refreshTable();
    });

    const filterInput = document.querySelector('#asset-filter-box > .keyword-filter > input');
    filterInput.addEventListener("keypress", (evt) => {
        if ("Enter" !== evt.key) {
            return ;
        }
        filterKeyword = evt.target.value;
        refreshTable();
    });

    const tableHead = document.querySelector('#asset-list > thead > tr');
    tableHead.addEventListener("click", (evt) => {
        const sortFieldName = evt.target.getAttribute('data-sort-field');
        if (!sortFieldName) {
            return ;
        }
        sortField = sortFieldName;
        refreshTable();
    });
};

let refreshTimer = null;
const resetRefreshTimer = () => {
    if (!!refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
    }

    refreshTimer = setInterval(() => {
        fetchAssetList();
    }, 5 * 60 * 1000);  // 5분 주기로 리프레쉬
};

const main = async () => {
    const body = null;
    
    registEventListeners();
    fetchAssetMap();
    fetchAssetList();
}

main();
