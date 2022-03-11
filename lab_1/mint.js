Moralis.initialize("8v67Sz37W2ZVoPELR67C7MzYHr2ikSspczkXP53j");
Moralis.serverURL = "https://c3nh4msvpwde.usemoralis.com:2053/server";

const serverUrl = "https://c3nh4msvpwde.usemoralis.com:2053/server";
const appId = "8v67Sz37W2ZVoPELR67C7MzYHr2ikSspczkXP53j";
const CONTRACT_ADDRESS = "0x41fbba06e26ede6c6c6275fe004fcb83e7156cd7";

Moralis.start({ serverUrl, appId });
let web3;

async function init() {
    let currentUser = Moralis.User.current();
    if (!currentUser) {
        window.location.pathname = "/index.html";
    }

    const web3Provider = await Moralis.enableWeb3();
    web3 = new Web3(Moralis.provider);
    let accounts = await web3.eth.getAccounts();

    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId");

    document.getElementById("token_id_input").value = nftId;
    document.getElementById("address_input").value = accounts[0];
}

async function mint() {
    let tokenId = parseInt(document.getElementById("token_id_input").value);
    let address = document.getElementById("address_input").value
    let amount = parseInt(document.getElementById("amount_input").value)
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(contractABI, CONTRACT_ADDRESS);

    contract.methods.mint(address, tokenId, amount).send({ from: accounts[0], value: 0 })
        .on("receipt", function (receipt) {
            alert("Mint done");
        })
}

document.getElementById("submit_mint").onclick = mint;

init();