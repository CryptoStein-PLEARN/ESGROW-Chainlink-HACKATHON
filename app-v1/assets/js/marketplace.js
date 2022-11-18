const connectWallet = async () => {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
    
        console.log("Account:", await signer.getAddress());
    } catch (err) {
        console.log(err);
    }
}

const claimNFT =  () => {
    console.log("Mint button clicked!");
    // try {

    // } catch (error) {
    //     console.log("failed to redeem NFT");
    // }
}
