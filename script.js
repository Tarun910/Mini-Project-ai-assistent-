let prompt = document.querySelector("#prompt");
let btn = document.querySelector("#btn");
let chatContainer = document.querySelector(".chat-container");
let container = doucment.querySelector(".container");

let userMessage = null;

// Updated API URL for free-tier model
let Api_Url =
  "https://generativelanguage.googleapis.com/v1beta/models/text-bison-001:generateText?key=YOUR_API_KEY";

function createChatBox(html, className) {
  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(className);
  return div;
}

async function getApiResponse(aiChatBox) {
  let textElement = aiChatBox.querySelector(".para");
  try {
    let response = await fetch(Api_Url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: {
          text: userMessage, // Send user input as 'text'
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let data = await response.json();
    console.log("API Response:", data); // Log API response for debugging

    // Extract the API response text, check if it's valid
    let apiResponse =
      data?.candidates?.[0]?.output?.text || "No valid response from API";
    textElement.innerText = apiResponse;
  } catch (error) {
    console.error("Error fetching response:", error);
    textElement.innerText = "Error fetching response";
  } finally {
    // Hide the loader after fetching the API response
    aiChatBox.querySelector(".loader").style.display = "none";
  }
}

function showLoading() {
  let html = `
    <div class="img">
      <img src="chatbot.png" alt="bot-icon" width="30" />
    </div>
    <p class="para"></p>
    <div class="loading-animation">
      <div class="loader" width="50">
        <div class="circle">
          <div class="dot"></div>
          <div class="outline"></div>
        </div>
        <div class="circle">
          <div class="dot"></div>
          <div class="outline"></div>
        </div>
        <div class="circle">
          <div class="dot"></div>
          <div class="outline"></div>
        </div>
        <div class="circle">
          <div class="dot"></div>
          <div class="outline"></div>
        </div>
      </div>
    </div>
  `;

  let aiChatBox = createChatBox(html, "ai-chat-box");
  chatContainer.appendChild(aiChatBox);
  getApiResponse(aiChatBox); // Fetch the AI response from API
}

btn.addEventListener("click", () => {
  userMessage = prompt.value;
  if (userMessage == "") {
    container.style.display = "flex";
  }
  {
    container.style.display = "none";
  }
  if (!userMessage) return;

  let html = `
    <div class="img">
      <img src="avatar.png" alt="user-icon" width="30" />
    </div>
    <p class="para"></p>
  `;

  let userChatBox = createChatBox(html, "user-chat-box");
  userChatBox.querySelector(".para").innerText = userMessage;
  chatContainer.appendChild(userChatBox);

  // Clear the input after sending the message
  prompt.value = "";

  // Simulate loading and show AI response after a short delay
  setTimeout(showLoading, 500);
});
