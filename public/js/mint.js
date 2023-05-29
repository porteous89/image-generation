// public/js/mint.js
async function mintAvatar(metadataURI) {
  const accounts = await web3.eth.getAccounts();
  await contract.methods
    .mintAvatar(accounts[0], metadataURI)
    .send({ from: accounts[0] });
}
