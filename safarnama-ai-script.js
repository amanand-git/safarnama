// ============================================
// SAFARNAMA AI - API CONFIGURATION
// ============================================
// API requests are proxied through Cloudflare Pages Function.
const API_ENDPOINT = "/api/chat";
const MODEL_NAME = "deepseek/deepseek-r1";

// ============================================
// CHAT HISTORY MANAGEMENT
// ============================================
let savedChats = JSON.parse(localStorage.getItem("safarnama_chats") || "[]");
let currentChatId = null;
let chatHistory = [];
let isProcessing = false;

function generateChatId() {
  return `chat_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

function saveCurrentChat() {
  if (chatHistory.length === 0) return;

  const firstUserMsg = chatHistory.find((msg) => msg.role === "user");
  const title = firstUserMsg ? firstUserMsg.content.substring(0, 50) : "New Chat";

  const chatData = {
    id: currentChatId || generateChatId(),
    title,
    messages: chatHistory,
    timestamp: new Date().toISOString(),
    preview: firstUserMsg ? firstUserMsg.content.substring(0, 100) : "",
  };

  const existingIndex = savedChats.findIndex((chat) => chat.id === chatData.id);
  if (existingIndex >= 0) {
    savedChats[existingIndex] = chatData;
  } else {
    savedChats.unshift(chatData);
    currentChatId = chatData.id;
  }

  if (savedChats.length > 50) savedChats = savedChats.slice(0, 50);
  localStorage.setItem("safarnama_chats", JSON.stringify(savedChats));
}

function loadChat(chatId) {
  const chat = savedChats.find((c) => c.id === chatId);
  if (!chat) return;

  const messagesWrapper = document.querySelector(".messages-wrapper");
  if (messagesWrapper) messagesWrapper.remove();

  greetingContainer.style.display = "none";
  chatHistory = [...chat.messages];
  currentChatId = chat.id;

  chat.messages.forEach((msg) => {
    if (msg.role === "user" || msg.role === "assistant") {
      addMessage(msg.content, msg.role === "user");
    }
  });

  closeHistoryPopup();
}

function deleteChat(chatId) {
  if (!confirm("Are you sure you want to delete this chat?")) return;

  savedChats = savedChats.filter((chat) => chat.id !== chatId);
  localStorage.setItem("safarnama_chats", JSON.stringify(savedChats));

  if (currentChatId === chatId) startNewChat();
  displayChatHistory();
}

function startNewChat() {
  chatHistory = [];
  currentChatId = null;

  const messagesWrapper = document.querySelector(".messages-wrapper");
  if (messagesWrapper) messagesWrapper.remove();

  greetingContainer.style.display = "block";
  chatInput.value = "";
  chatInput.style.height = "auto";
  chatInput.focus();
}

function displayChatHistory() {
  const chatList = document.getElementById("chatList");
  if (!chatList) return;

  if (savedChats.length === 0) {
    chatList.innerHTML = `
      <div class="empty-chat-list">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <h3>No Chats Yet</h3>
        <p>Your conversation history will appear here.<br>Start chatting to save your conversations!</p>
      </div>
    `;
    return;
  }

  chatList.innerHTML = savedChats
    .map((chat) => {
      const date = new Date(chat.timestamp);
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      return `
      <div class="chat-item" data-chat-id="${chat.id}">
        <div class="chat-item-header">
          <div class="chat-item-title">
            <svg class="chat-item-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            ${chat.title}
          </div>
          <div class="chat-item-date">${dateStr}</div>
        </div>
        <div class="chat-item-preview">${chat.preview}${chat.preview.length >= 100 ? "..." : ""}</div>
        <div class="chat-item-actions">
          <button class="chat-item-btn load-chat-btn" data-load-chat="${chat.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
            Load Chat
          </button>
          <button class="chat-item-btn delete-chat-btn" data-delete-chat="${chat.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Delete
          </button>
        </div>
      </div>
    `;
    })
    .join("");
}

function openHistoryPopup() {
  displayChatHistory();
  document.getElementById("chatHistoryOverlay")?.classList.add("active");
}

function closeHistoryPopup() {
  document.getElementById("chatHistoryOverlay")?.classList.remove("active");
}

// ============================================
// BACKGROUND PARTICLE ANIMATION
// ============================================
const canvas = document.getElementById("backgroundCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
let animationActive = true;
let animationId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
    this.opacity = Math.random() * 0.5 + 0.2;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;
  }

  draw() {
    ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
  for (let i = 0; i < particleCount; i += 1) {
    particles.push(new Particle());
  }
}

function animate() {
  if (!animationActive) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  particles.forEach((p1, i) => {
    particles.slice(i + 1).forEach((p2) => {
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 120) {
        ctx.strokeStyle = `rgba(255,255,255,${0.15 * (1 - distance / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    });
  });

  animationId = requestAnimationFrame(animate);
}

function stopBackgroundAnimation() {
  if (!animationActive) return;
  animationActive = false;
  if (animationId) cancelAnimationFrame(animationId);
  canvas.style.transition = "opacity 1s ease";
  canvas.style.opacity = "0";
  setTimeout(() => {
    canvas.style.display = "none";
  }, 1000);
}

// ============================================
// TIME AND GREETING
// ============================================
function updateTimeAndGreeting() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");

  const timeDisplay = document.getElementById("timeDisplay");
  if (timeDisplay) timeDisplay.textContent = `${displayHours}:${displayMinutes} ${ampm}`;

  const greetingElement = document.getElementById("timeGreeting");
  if (!greetingElement) return;

  if (hours >= 5 && hours < 12) {
    greetingElement.textContent = "What's Up Early Bird";
  } else if (hours >= 12 && hours < 17) {
    greetingElement.textContent = "What's Up Daytime Performer";
  } else if (hours >= 17 && hours < 21) {
    greetingElement.textContent = "What's Up Evening Performer";
  } else {
    greetingElement.textContent = "What's Up Night Owl";
  }
}

// ============================================
// CHAT FUNCTIONALITY
// ============================================
const chatInput = document.getElementById("chatInput");
const submitBtn = document.querySelector(".submit-btn");
const newChatBtn = document.querySelector(".new-chat-btn");
const chatContainer = document.querySelector(".chat-container");
const greetingContainer = document.querySelector(".greeting-container");
const micBtn = document.querySelector(".mic-btn");
const attachBtn = document.querySelector(".attach-btn");

function autoResizeTextarea() {
  chatInput.style.height = "auto";
  chatInput.style.height = `${chatInput.scrollHeight}px`;
}

async function getAIResponse(userMessage) {
  try {
    const messages = [
      {
        role: "system",
        content:
          "You are Safarnama AI, a friendly and helpful study assistant. Help students with Math, Science, History, English, and study tips. Be clear, encouraging, and educational. Provide detailed explanations when needed.",
      },
      ...chatHistory.filter((msg) => msg.role !== "system"),
      {
        role: "user",
        content: userMessage,
      },
    ];

    const requestBody = {
      model: MODEL_NAME,
      messages,
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 0.9,
    };

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (_) {
        errorData.message = errorText;
      }
      const serverMessage = errorData?.error?.message || errorData?.message || "";
      const normalizedMessage = String(serverMessage).toLowerCase();

      if (response.status === 401) {
        return serverMessage
          ? `Authentication error (401): ${serverMessage}`
          : "Authentication error (401). Check OpenRouter API key in Cloudflare env vars.";
      }
      if (response.status === 402) {
        return serverMessage
          ? `Payment required (402): ${serverMessage}`
          : "Payment required (402). Please check OpenRouter credits.";
      }
      if (response.status === 429) {
        return serverMessage
          ? `Rate limit exceeded (429): ${serverMessage}`
          : "Rate limit exceeded. Please wait and try again.";
      }
      if (response.status === 404 || response.status === 405) {
        return "API route error: /api/chat is not configured for POST. Deploy the Cloudflare Pages function and try again.";
      }
      if (response.status === 500) {
        if (normalizedMessage.includes("missing openrouter api key")) {
          return "Server is missing OpenRouter API key. In Cloudflare Pages set OPENROUTER_API_KEY, then redeploy.";
        }
        return serverMessage
          ? `Server error (500): ${serverMessage}`
          : "Server error. AI service is temporarily unavailable.";
      }
      return `Error (${response.status}): ${serverMessage || "Something went wrong."}`;
    }

    const data = await response.json();
    if (data?.choices?.[0]?.message?.content) {
      return data.choices[0].message.content;
    }
    if (data?.error?.message) return `Error: ${data.error.message}`;
    return "Unexpected response. Please try again.";
  } catch (error) {
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return "Network error: Cannot connect to server. Check internet and refresh.";
    }
    return `Network error: ${error.message}`;
  }
}

function addMessage(message, isUser = false) {
  let messagesWrapper = document.querySelector(".messages-wrapper");
  if (!messagesWrapper) {
    messagesWrapper = document.createElement("div");
    messagesWrapper.className = "messages-wrapper";
    const inputContainer = document.querySelector(".input-container");
    chatContainer.insertBefore(messagesWrapper, inputContainer);
  }

  if (chatHistory.length === 0) greetingContainer.style.display = "none";

  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${isUser ? "user-message" : "ai-message"}`;

  const messageContent = document.createElement("div");
  messageContent.className = "message-content";

  const formattedMessage = message
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br>");

  messageContent.innerHTML = formattedMessage;
  messageDiv.appendChild(messageContent);
  messagesWrapper.appendChild(messageDiv);

  setTimeout(() => {
    messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
  }, 100);
}

function showTypingIndicator() {
  let messagesWrapper = document.querySelector(".messages-wrapper");
  if (!messagesWrapper) {
    messagesWrapper = document.createElement("div");
    messagesWrapper.className = "messages-wrapper";
    const inputContainer = document.querySelector(".input-container");
    chatContainer.insertBefore(messagesWrapper, inputContainer);
  }

  const typingDiv = document.createElement("div");
  typingDiv.className = "message ai-message typing-indicator";
  typingDiv.id = "typingIndicator";

  const logoLoader = document.createElement("div");
  logoLoader.className = "typing-logo-loader";
  logoLoader.innerHTML =
    '<img src="images/ailogo.png" alt="Safarnama AI loading" class="typing-logo-img" />';

  const logoImg = logoLoader.querySelector(".typing-logo-img");
  if (logoImg) {
    logoImg.addEventListener("error", () => {
      logoLoader.innerHTML = '<span class="typing-fallback">AI</span>';
    });
  }

  typingDiv.appendChild(logoLoader);
  messagesWrapper.appendChild(typingDiv);

  setTimeout(() => {
    messagesWrapper.scrollTop = messagesWrapper.scrollHeight;
  }, 100);
}

function removeTypingIndicator() {
  document.getElementById("typingIndicator")?.remove();
}

// ============================================
// SIDEBAR TOGGLE
// ============================================
const sidebarToggleBtn = document.getElementById("sidebarToggleBtn");
const sidebar = document.getElementById("sidebar");
const superman = document.getElementById("superman");
const supermanSound = document.getElementById("supermanSound");
let isAnimating = false;

sidebarToggleBtn?.addEventListener("click", () => {
  if (isAnimating) return;
  isAnimating = true;

  if (sidebar.classList.contains("collapsed")) {
    superman.classList.remove("flying-back");
    superman.classList.add("flying-to-sidebar");
    supermanSound.currentTime = 0;
    supermanSound.volume = 0.7;
    supermanSound.play().catch(() => {});
    setTimeout(() => {
      sidebar.classList.remove("collapsed");
      sidebarToggleBtn.classList.add("rotated");
      isAnimating = false;
    }, 1500);
  } else {
    sidebar.classList.add("collapsed");
    sidebarToggleBtn.classList.remove("rotated");
    superman.classList.remove("flying-to-sidebar");
    superman.classList.add("flying-back");
    setTimeout(() => {
      isAnimating = false;
    }, 1500);
  }
});

// ============================================
// VOICE INPUT
// ============================================
let isRecording = false;
let recognition = null;
let accumulatedTranscript = "";

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-IN";

  recognition.onresult = (event) => {
    let interimTranscript = "";
    stopBackgroundAnimation();

    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        accumulatedTranscript += `${transcript} `;
      } else {
        interimTranscript += transcript;
      }
    }

    chatInput.value = interimTranscript
      ? `${accumulatedTranscript}${interimTranscript} [listening...]`
      : accumulatedTranscript.trim();
    autoResizeTextarea();
  };

  recognition.onstart = () => {
    isRecording = true;
    micBtn.classList.add("recording");
    stopBackgroundAnimation();
  };

  recognition.onend = () => {
    chatInput.value = accumulatedTranscript.trim();
    if (isRecording) {
      try {
        recognition.start();
      } catch (_) {
        isRecording = false;
        micBtn.classList.remove("recording");
      }
    } else {
      micBtn.classList.remove("recording");
    }
  };

  recognition.onerror = (event) => {
    if (event.error !== "no-speech" && event.error !== "aborted") {
      isRecording = false;
      micBtn.classList.remove("recording");
    }
  };
}

micBtn?.addEventListener("click", () => {
  if (!recognition) {
    alert("Speech recognition is not supported in this browser.");
    return;
  }

  if (isRecording) {
    try {
      recognition.stop();
    } catch (_) {}
    isRecording = false;
    micBtn.classList.remove("recording");
    chatInput.value = accumulatedTranscript.trim();
    accumulatedTranscript = "";
    return;
  }

  const existingText = chatInput.value.trim();
  accumulatedTranscript = existingText ? `${existingText} ` : "";
  try {
    recognition.start();
  } catch (_) {
    isRecording = false;
    micBtn.classList.remove("recording");
    accumulatedTranscript = "";
  }
});

// ============================================
// IMAGE ATTACHMENT
// ============================================
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "image/*";
fileInput.multiple = true;
fileInput.style.display = "none";
document.body.appendChild(fileInput);

attachBtn?.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    stopBackgroundAnimation();
    const fileNames = [];
    for (let i = 0; i < files.length; i += 1) fileNames.push(files[i].name);
    alert(
      `Image(s) selected:\n\n${fileNames.join("\n")}\n\nNote: Image analysis requires vision-capable models.`
    );
    chatInput.value = chatInput.value
      ? `${chatInput.value} [${files.length} image(s)]`
      : `[${files.length} image(s)]`;
    autoResizeTextarea();
  }
  fileInput.value = "";
});

// ============================================
// EVENTS
// ============================================
chatInput?.addEventListener("input", () => {
  autoResizeTextarea();
  stopBackgroundAnimation();
});

chatInput?.addEventListener("paste", () => {
  setTimeout(() => {
    autoResizeTextarea();
    stopBackgroundAnimation();
  }, 0);
});

submitBtn?.addEventListener("click", async () => {
  if (isProcessing) return;
  const message = chatInput.value.trim();
  if (!message) return;

  addMessage(message, true);
  chatHistory.push({ role: "user", content: message });
  chatInput.value = "";
  chatInput.style.height = "auto";
  stopBackgroundAnimation();

  isProcessing = true;
  showTypingIndicator();

  const aiResponse = await getAIResponse(message);

  removeTypingIndicator();
  addMessage(aiResponse, false);
  chatHistory.push({ role: "assistant", content: aiResponse });
  saveCurrentChat();
  isProcessing = false;
});

chatInput?.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    submitBtn.click();
  }
});

newChatBtn?.addEventListener("click", () => {
  startNewChat();
});

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "0") {
    e.preventDefault();
    startNewChat();
  }
  if (e.key === "Escape") closeHistoryPopup();
});

document.getElementById("yourChatsBtn")?.addEventListener("click", openHistoryPopup);
document.getElementById("closePopupBtn")?.addEventListener("click", closeHistoryPopup);

document.getElementById("chatHistoryOverlay")?.addEventListener("click", (e) => {
  if (e.target.id === "chatHistoryOverlay") closeHistoryPopup();
});

document.getElementById("chatList")?.addEventListener("click", (e) => {
  const loadBtn = e.target.closest("[data-load-chat]");
  if (loadBtn) {
    loadChat(loadBtn.getAttribute("data-load-chat"));
    return;
  }
  const deleteBtn = e.target.closest("[data-delete-chat]");
  if (deleteBtn) deleteChat(deleteBtn.getAttribute("data-delete-chat"));
});

document.getElementById("loginMenuItem")?.addEventListener("click", () => {
  window.location.href = "login.html";
});

document.getElementById("loginMenuItem")?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") window.location.href = "login.html";
});

document.getElementById("loginMenuItem")?.setAttribute("tabindex", "0");

// ============================================
// INITIALIZATION
// ============================================
const welcomeSound = document.getElementById("welcomeSound");
if (welcomeSound) welcomeSound.volume = 0.2;

window.addEventListener("load", () => {
  resizeCanvas();
  initParticles();
  animate();
  updateTimeAndGreeting();
  setInterval(updateTimeAndGreeting, 1000);
  chatInput?.focus();

  setTimeout(() => {
    const playPromise = welcomeSound?.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {
        const playOnInteraction = () => welcomeSound?.play().catch(() => {});
        document.addEventListener("click", playOnInteraction, { once: true });
        document.addEventListener("keydown", playOnInteraction, { once: true });
      });
    }
  }, 300);
});

window.addEventListener("resize", resizeCanvas);

console.log("Safarnama AI initialized.");
console.log("API Endpoint:", API_ENDPOINT);
console.log("Model:", MODEL_NAME);

