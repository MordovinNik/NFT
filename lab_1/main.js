Moralis.initialize("8v67Sz37W2ZVoPELR67C7MzYHr2ikSspczkXP53j");
Moralis.serverURL = "https://c3nh4msvpwde.usemoralis.com:2053/server";
const CONTRACT_ADDRESS = "0x41fbba06e26ede6c6c6275fe004fcb83e7156cd7";

const serverUrl = "https://c3nh4msvpwde.usemoralis.com:2053/server";
const appId = "8v67Sz37W2ZVoPELR67C7MzYHr2ikSspczkXP53j";

Moralis.start({serverUrl, appId});
let currentUser;

function fetchNFTMetada(NFTs) {
    let promises = [];
    for (let i = 0; i < NFTs.length; i++) {
        let nft = NFTs[i];
        let id = nft.token_id;

        promises.push(fetch("https://c3nh4msvpwde.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=8v67Sz37W2ZVoPELR67C7MzYHr2ikSspczkXP53j&nftId=" + id)
        .then(res => res.json())
        .then(res => JSON.parse(res.result))
        .then(res => {nft.metadata = res})
        .then(res => {
                const options = { address: CONTRACT_ADDRESS, token_id: id, chain: "rinkeby" };
                return Moralis.Web3API.token.getTokenIdOwners(options);
            })
        .then((res) => {
                nft.owners = [];
                res.result.forEach(element => {
                    nft.owners.push(element.owner_of);
                });
                return nft;
            }));
    }

    return Promise.all(promises);
}

function renderInventory(NFTs, ownerData) {
    const parent = document.getElementById("app");
    for (let i = 0; i < NFTs.length; i++) {
        const nft = NFTs[i];

        let htmlString =
            `
            <div class="card">
               <img class="card-img-top" src="${nft.metadata.image}" alt="Card image cap">
               <div class="card-body">
                 <h5 class="card-title">${nft.metadata.name}</h5>
                 <p class="card-text">${nft.metadata.description}</p>
                 <p class="card-text">Amount: ${nft.amount}</p>
                 <p class="card-text">Number of owners: ${nft.owners.length}</p>
                 <p class="card-text">Your's balance: ${ownerData[nft.token_id]}</p>
                 <a href="/mint.html?nftId=${nft.token_id}" class="btn btn-primary">Mint</a>
                 <a href="/transfer.html?nftId=${nft.token_id}" class="btn btn-primary">Transfer</a>
               </div>
             </div>
            `

        let col = document.createElement("div");
        col.className = "col col-md-3";
        col.innerHTML = htmlString;
        parent.appendChild(col);
    }
}

async function getOwnerData() {
    let accounts = currentUser.get("accounts");
    const options = { address: accounts[0], token_address: CONTRACT_ADDRESS, chain: "rinkeby"};
    return Moralis.Web3API.account.getNFTsForContract(options).then(
        (data) => {
            let result = data.result.reduce((object, element) => {
                object[element.token_id] = element.amount;
                return object;
            }, {});
            return result;
        }
    )
}

async function initializeApp() {
    currentUser = Moralis.User.current();
    
    if (!currentUser) {
        currentUser = await Moralis.Web3.authenticate();
    }

    const options = { address: CONTRACT_ADDRESS, chain: "rinkeby"};
    let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    let NFTWithMetadata = await fetchNFTMetada(NFTs.result);
    let ownerData = await getOwnerData();

    renderInventory(NFTWithMetadata, ownerData);
}

initializeApp();