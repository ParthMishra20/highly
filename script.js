const contractAddress = "0xfF47EdaBa4FcABC4B756Eeb902ae6ab9b9CA7ea5"; // Replace with your deployed contract address
const abi = [
	{
		"inputs": [],
		"name": "becomeManager",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "enter",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getPlayers",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastWinner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "manager",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "pickWinner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "players",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
];

let web3;
let contract;

async function connect() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        contract = new web3.eth.Contract(abi, contractAddress);
        loadContractInfo();
    } else {
        alert("Please install MetaMask to use this DApp!");
    }
}

async function loadContractInfo() {
    const manager = await contract.methods.manager().call();
    document.getElementById("manager").innerText = manager || "Not Set";

    const lastWinner = await contract.methods.lastWinner().call();
    document.getElementById("last-winner").innerText = lastWinner || "None";

    const players = await contract.methods.getPlayers().call();
    const playersList = document.getElementById("players-list");
    playersList.innerHTML = "";
    players.forEach(player => {
        const li = document.createElement("li");
        li.innerText = player;
        playersList.appendChild(li);
    });
}

document.getElementById("become-manager").addEventListener("click", async () => {
    const accounts = await web3.eth.getAccounts();
    try {
        await contract.methods.becomeManager().send({ from: accounts[0] });
        document.getElementById("status").innerText = "You are now the manager!";
        loadContractInfo();
    } catch (error) {
        console.error(error);
    }
});

document.getElementById("enter-lottery").addEventListener("click", async () => {
    const accounts = await web3.eth.getAccounts();
    try {
        await contract.methods.enter().send({ from: accounts[0], value: web3.utils.toWei("1", "ether") });
        document.getElementById("status").innerText = "You entered the lottery!";
        loadContractInfo();
    } catch (error) {
        console.error(error);
    }
});

document.getElementById("pick-winner").addEventListener("click", async () => {
    const accounts = await web3.eth.getAccounts();
    try {
        await contract.methods.pickWinner().send({ from: accounts[0] });
        document.getElementById("status").innerText = "Winner picked!";
        loadContractInfo();
    } catch (error) {
        console.error(error);
    }
});

connect();
