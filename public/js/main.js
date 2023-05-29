document.querySelector("#image-form").addEventListener("submit", onSubmit);

async function onSubmit(e) {
  e.preventDefault();

  document.querySelector(".msg").textContent = "";
  document.querySelector("#image").src = "";

  const prompt = document.querySelector("#prompt").value;
  const size = document.querySelector("#size").value;

  if (prompt === "") {
    alert("Please add some text");
    return;
  }

  generateImageRequest(prompt, size);
}

async function generateImageRequest(prompt, size) {
  try {
    showSpinner();

    const response = await fetch("/openai/generateimage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        size,
      }),
    });

    if (!response.ok) {
      removeSpinner();
      throw new Error("That image could not be generated");
    }

    const data = await response.json();
    const imageUrl = data.data;

    const ipfsHash = await uploadImageToIpfs(imageUrl);

    document.querySelector("#image").src = `https://ipfs.io/ipfs/${ipfsHash}`;

    document.querySelector("#mint-button").disabled = false;

    removeSpinner();
  } catch (error) {
    document.querySelector(".msg").textContent = error;
  }
}

function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

function removeSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

async function uploadImageToIpfs(imageUrl) {
  const response = await fetch("/ipfs/upload-to-ipfs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ imageUrl }),
  });

  if (!response.ok) {
    throw new Error("Error uploading file to IPFS");
  }

  const data = await response.json();
  return data.ipfsHash;
}

document.addEventListener("DOMContentLoaded", function () {
  const mintButton = document.getElementById("mint-button");

  mintButton.addEventListener("click", async function () {
    try {
      const generatedAvatarUrl = await retrieveGeneratedAvatarUrl();

      if (generatedAvatarUrl) {
        mintAvatar(generatedAvatarUrl);
      } else {
        console.log("Invalid avatar image URL.");
      }
    } catch (error) {
      console.error("Error retrieving avatar image URL:", error);
    }
  });

  async function mintAvatar(avatarUrl) {
    try {
      const accounts = await web3.eth.getAccounts();
      const result = await contract.methods
        .mintAvatar(accounts[0], avatarUrl)
        .send({
          from: accounts[0],
        });
      console.log(
        "NFT minted successfully. Transaction hash:",
        result.transactionHash
      );
    } catch (error) {
      console.error("Error minting NFT:", error);
    }
  }
});

async function retrieveGeneratedAvatarUrl() {
  const generatedAvatarUrl = document.querySelector("#image").src;
  return generatedAvatarUrl;
}
