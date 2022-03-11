Moralis.initialize("8v67Sz37W2ZVoPELR67C7MzYHr2ikSspczkXP53j");
Moralis.serverURL = "https://c3nh4msvpwde.usemoralis.com:2053/server";
const CONTRACT_ADDRESS = "0x41fbba06e26ede6c6c6275fe004fcb83e7156cd7";

const serverUrl = "https://c3nh4msvpwde.usemoralis.com:2053/server";
const appId = "8v67Sz37W2ZVoPELR67C7MzYHr2ikSspczkXP53j";

Moralis.start({ serverUrl, appId });

async function init() {
    let currentUser = Moralis.User.current();
    if (!currentUser) {
        window.location.pathname = "/index.html";
    }

    await Moralis.enableWeb3();
    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId");

    document.getElementById("token_id_input").value = nftId;
}

async function transfer() {
    let token_id = parseInt(document.getElementById("token_id_input").value);
    let address = document.getElementById("address_input").value;
    let amount = parseInt(document.getElementById("amount_input").value);
    let accounts = await ethereum.request({ method: 'eth_accounts' });

    const options = {
        type: "erc1155",
        receiver: address,
        contractAddress: CONTRACT_ADDRESS,
        tokenId: token_id.toString(),
        amount: amount
    };

    const transaction = await Moralis.transfer(options);
    const result = await transaction.wait();
}

document.getElementById("submit_transfer").onclick = transfer;

init();