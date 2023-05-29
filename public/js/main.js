function onSubmit(e) {
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
    // console.log(data);

    const imageUrl = data.data;

    document.querySelector("#image").src = imageUrl;

    // Enable the "Mint" button
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

document.querySelector("#image-form").addEventListener("submit", onSubmit);

// Retrieve the generated avatar image URL
async function retrieveGeneratedAvatarUrl() {
  // Replace this with your code to retrieve the generated avatar image URL
  // You might have a function or method that generates the URL
  // Example:
  const generatedAvatarUrl = document.querySelector("#image").src;
  return generatedAvatarUrl;
}

// Mint the NFT using the generated avatar image URL
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
