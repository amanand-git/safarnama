import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { firebaseConfig, hasFirebaseConfig } from "./firebase-config.js";

const loginModeBtn = document.getElementById("loginModeBtn");
const signupModeBtn = document.getElementById("signupModeBtn");
const authForm = document.getElementById("authForm");
const formTitle = document.getElementById("formTitle");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const confirmPasswordInput = document.getElementById("confirmPasswordInput");
const confirmGroup = document.getElementById("confirmGroup");
const submitBtn = document.getElementById("submitBtn");
const forgotBtn = document.getElementById("forgotBtn");
const statusBox = document.getElementById("statusBox");
const userPanel = document.getElementById("userPanel");
const userEmailText = document.getElementById("userEmailText");
const logoutBtn = document.getElementById("logoutBtn");
const configPanel = document.getElementById("configPanel");

const profilePanel = document.getElementById("profilePanel");
const profileForm = document.getElementById("profileForm");
const profileNameInput = document.getElementById("profileNameInput");
const profileClassInput = document.getElementById("profileClassInput");
const profileCityInput = document.getElementById("profileCityInput");
const profileImageInput = document.getElementById("profileImageInput");
const profilePreview = document.getElementById("profilePreview");
const profileStatus = document.getElementById("profileStatus");

let mode = "login";
let auth = null;
let db = null;
let pendingProfileImage = "";

function queueGreetingNotification(email) {
  try {
    localStorage.setItem(
      "safarnama_greeting_pending",
      JSON.stringify({
        email: email || "",
        createdAt: Date.now(),
      })
    );
  } catch (_) {}
}

function getDisplayNameFromEmail(email) {
  const local = String(email || "")
    .split("@")[0]
    .replace(/[._-]+/g, " ")
    .trim();

  if (!local) return "Student";

  return local
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function syncAuthStateStorage(user) {
  try {
    if (user) {
      localStorage.setItem("safarnama_auth_state", "logged_in");
      if (user.email) localStorage.setItem("safarnama_user_email", user.email);
      return;
    }

    localStorage.removeItem("safarnama_auth_state");
    localStorage.removeItem("safarnama_user_email");
    localStorage.removeItem("safarnama_user_profile");
  } catch (_) {}
}

function getInitialMode() {
  const params = new URLSearchParams(window.location.search);
  const queryMode = (params.get("mode") || "").toLowerCase();
  return queryMode === "signup" ? "signup" : "login";
}

function getPrefillEmail() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = (params.get("email") || "").trim();
  if (fromQuery) return fromQuery;

  try {
    return (localStorage.getItem("safarnama_prefill_email") || "").trim();
  } catch (_) {
    return "";
  }
}

function setMode(nextMode) {
  mode = nextMode;

  const isSignup = mode === "signup";
  loginModeBtn.classList.toggle("active", !isSignup);
  signupModeBtn.classList.toggle("active", isSignup);
  loginModeBtn.setAttribute("aria-selected", String(!isSignup));
  signupModeBtn.setAttribute("aria-selected", String(isSignup));

  formTitle.textContent = isSignup ? "Create New Account" : "Welcome Back";
  submitBtn.textContent = isSignup ? "Create Account" : "Login";
  confirmGroup.classList.toggle("hidden", !isSignup);
  forgotBtn.classList.toggle("hidden", isSignup);
  clearStatus();
}

function showStatus(message, type = "info") {
  statusBox.textContent = message;
  statusBox.classList.remove("success", "error", "warn");
  if (type === "success" || type === "error" || type === "warn") {
    statusBox.classList.add(type);
  }
}

function clearStatus() {
  statusBox.textContent = "";
  statusBox.classList.remove("success", "error", "warn");
}

function setProfileStatus(message, type = "info") {
  if (!profileStatus) return;
  profileStatus.textContent = message;
  profileStatus.classList.remove("success", "error", "warn");
  if (type === "success" || type === "error" || type === "warn") {
    profileStatus.classList.add(type);
  }
}

function clearProfileStatus() {
  if (!profileStatus) return;
  profileStatus.textContent = "";
  profileStatus.classList.remove("success", "error", "warn");
}

function mapAuthError(errorCode) {
  const code = (errorCode || "").toLowerCase();
  if (code.includes("email-already-in-use")) return "This email is already registered. Please login.";
  if (code.includes("invalid-email")) return "Please enter a valid email address.";
  if (code.includes("weak-password")) return "Password must be at least 6 characters.";
  if (code.includes("user-not-found")) return "No account found for this email.";
  if (code.includes("wrong-password") || code.includes("invalid-credential")) {
    return "Invalid email or password.";
  }
  if (code.includes("too-many-requests")) return "Too many attempts. Please try again later.";
  if (code.includes("network-request-failed")) return "Network error. Please check your internet connection.";
  if (code.includes("permission-denied")) return "Access denied. Please contact support.";
  return "Something went wrong. Please try again.";
}

function readLocalProfile() {
  try {
    const raw = localStorage.getItem("safarnama_user_profile");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch (_) {
    return null;
  }
}

function writeLocalProfile(profile) {
  try {
    localStorage.setItem("safarnama_user_profile", JSON.stringify(profile));
  } catch (_) {}
}

function buildInitials(name, email) {
  const source = (name || email || "U").trim();
  if (!source) return "U";
  const words = source.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

function isProfileComplete(profile) {
  return Boolean(profile?.name && profile?.className && profile?.city);
}

function setProfilePreview(dataUrl) {
  if (!profilePreview) return;
  if (dataUrl) {
    profilePreview.src = dataUrl;
    profilePreview.classList.remove("hidden");
    return;
  }
  profilePreview.removeAttribute("src");
  profilePreview.classList.add("hidden");
}

function fillProfileForm(profile) {
  if (!profileForm) return;
  profileNameInput.value = profile?.name || "";
  profileClassInput.value = profile?.className || "";
  profileCityInput.value = profile?.city || "";
  setProfilePreview(profile?.photoDataUrl || "");
  pendingProfileImage = "";
  if (profileImageInput) profileImageInput.value = "";
}

function showProfilePanel(show) {
  if (!profilePanel) return;
  profilePanel.classList.toggle("hidden", !show);
}

function mergeProfile(user, remoteProfile, localProfile) {
  return {
    uid: user.uid,
    email: user.email || "",
    name: (remoteProfile?.name || localProfile?.name || "").trim(),
    className: (remoteProfile?.className || localProfile?.className || "").trim(),
    city: (remoteProfile?.city || localProfile?.city || "").trim(),
    photoDataUrl: remoteProfile?.photoDataUrl || localProfile?.photoDataUrl || "",
    initials:
      remoteProfile?.initials ||
      localProfile?.initials ||
      buildInitials(remoteProfile?.name || localProfile?.name, user.email || ""),
    updatedAtIso: new Date().toISOString(),
  };
}

async function readRemoteProfile(user) {
  if (!db || !user) return {};
  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) return {};
    const data = snap.data() || {};
    return {
      name: typeof data.name === "string" ? data.name : "",
      className: typeof data.className === "string" ? data.className : "",
      city: typeof data.city === "string" ? data.city : "",
      photoDataUrl: typeof data.photoDataUrl === "string" ? data.photoDataUrl : "",
      initials: typeof data.initials === "string" ? data.initials : "",
    };
  } catch (_) {
    return {};
  }
}

async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Image read fail"));
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
}

async function compressImageDataUrl(dataUrl, size = 170, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas unavailable"));
        return;
      }

      const scale = Math.max(size / img.width, size / img.height);
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;
      const x = (size - drawWidth) / 2;
      const y = (size - drawHeight) / 2;

      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, x, y, drawWidth, drawHeight);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => reject(new Error("Image load fail"));
    img.src = dataUrl;
  });
}

async function writeUserRecord(user, isNewUser = false) {
  if (!db || !user) return;

  const userRef = doc(db, "users", user.uid);
  const payload = {
    uid: user.uid,
    email: user.email || "",
    providerIds: (user.providerData || []).map((p) => p.providerId),
    lastLoginAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (isNewUser) {
    payload.createdAt = serverTimestamp();
  }

  await setDoc(userRef, payload, { merge: true });
}

function updateUserPanel(user) {
  if (!user) {
    userPanel.classList.add("hidden");
    userEmailText.textContent = "-";
    return;
  }

  userEmailText.textContent = user.email || "(No email)";
  userPanel.classList.remove("hidden");
}

async function handleSignup(email, password, confirmPassword) {
  if (password.length < 6) {
    showStatus("Password must be at least 6 characters.", "warn");
    return;
  }

  if (password !== confirmPassword) {
    showStatus("Password and confirm password do not match.", "warn");
    return;
  }

  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await writeUserRecord(credential.user, true);
  try {
    localStorage.removeItem("safarnama_prefill_email");
  } catch (_) {}
  const userEmail = credential.user?.email || email;
  const name = getDisplayNameFromEmail(userEmail);
  queueGreetingNotification(userEmail);
  showStatus(`Namaste ${name}, Safarnama family mein aapka swagat hai! ❤️`, "success");
}

async function handleLogin(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await writeUserRecord(credential.user, false);
  try {
    localStorage.removeItem("safarnama_prefill_email");
  } catch (_) {}
  const userEmail = credential.user?.email || email;
  const name = getDisplayNameFromEmail(userEmail);
  queueGreetingNotification(userEmail);
  showStatus(`Namaste ${name}, Safarnama family mein aapka swagat hai! ❤️`, "success");
}

async function init() {
  setMode(getInitialMode());

  const prefillEmail = getPrefillEmail();
  if (prefillEmail) {
    emailInput.value = prefillEmail;
  }

  if (!hasFirebaseConfig()) {
    if (configPanel) configPanel.classList.remove("hidden");
    showStatus("Login service is temporarily unavailable. Please try again later.", "warn");
    return;
  }

  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    showStatus(`Unable to initialize login service: ${String(error.message || error)}`, "error");
    return;
  }

  onAuthStateChanged(auth, async (user) => {
    syncAuthStateStorage(user);
    updateUserPanel(user);
    clearProfileStatus();

    if (!user) {
      showProfilePanel(false);
      return;
    }

    const remoteProfile = await readRemoteProfile(user);
    const localProfileRaw = readLocalProfile();
    const localProfile = localProfileRaw && localProfileRaw.uid === user.uid ? localProfileRaw : null;
    const merged = mergeProfile(user, remoteProfile, localProfile);
    fillProfileForm(merged);
    writeLocalProfile(merged);

    try {
      await writeUserRecord(user, false);
    } catch (error) {
      showStatus(mapAuthError(error.code), "warn");
    }

    if (isProfileComplete(merged)) {
      showProfilePanel(false);
    } else {
      showProfilePanel(true);
      showStatus("Login successful. Please complete your profile.", "warn");
    }
  });
}

loginModeBtn.addEventListener("click", () => setMode("login"));
signupModeBtn.addEventListener("click", () => setMode("signup"));

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearStatus();

  if (!auth) {
    showStatus("Login service is not ready. Please refresh and try again.", "error");
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (!email || !password) {
    showStatus("Email and password are required.", "warn");
    return;
  }

  submitBtn.disabled = true;

  try {
    if (mode === "signup") {
      await handleSignup(email, password, confirmPassword);
    } else {
      await handleLogin(email, password);
    }
  } catch (error) {
    showStatus(mapAuthError(error.code), "error");
  } finally {
    submitBtn.disabled = false;
  }
});

forgotBtn.addEventListener("click", async () => {
  clearStatus();
  const email = emailInput.value.trim();

  if (!email) {
    showStatus("Please enter your email to reset password.", "warn");
    return;
  }

  if (!auth) {
    showStatus("Login service is not ready. Please refresh and try again.", "error");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    showStatus("Password reset email sent.", "success");
  } catch (error) {
    showStatus(mapAuthError(error.code), "error");
  }
});

logoutBtn.addEventListener("click", async () => {
  clearStatus();
  if (!auth) return;
  try {
    await signOut(auth);
    showStatus("Logout successful.", "success");
  } catch (error) {
    showStatus(mapAuthError(error.code), "error");
  }
});

profileImageInput?.addEventListener("change", async (event) => {
  clearProfileStatus();
  const file = event.target.files?.[0];
  if (!file) {
    pendingProfileImage = "";
    return;
  }

  if (!file.type.startsWith("image/")) {
    setProfileStatus("Please choose a valid image file.", "warn");
    profileImageInput.value = "";
    return;
  }

  try {
    const dataUrl = await fileToDataUrl(file);
    pendingProfileImage = await compressImageDataUrl(dataUrl, 170, 0.82);
    setProfilePreview(pendingProfileImage);
    setProfileStatus("Image ready.", "success");
  } catch (_) {
    setProfileStatus("Unable to process image. Please try another file.", "error");
  }
});

profileForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearProfileStatus();

  const user = auth?.currentUser;
  if (!user) {
    setProfileStatus("Please login first.", "error");
    return;
  }

  const name = profileNameInput.value.trim();
  const className = profileClassInput.value.trim();
  const city = profileCityInput.value.trim();
  const existing = readLocalProfile() || {};
  const photoDataUrl = pendingProfileImage || existing.photoDataUrl || "";
  const initials = buildInitials(name, user.email || existing.email || "");

  if (!name || !className || !city) {
    setProfileStatus("Name, class/course, and city are required.", "warn");
    return;
  }

  const profilePayload = {
    uid: user.uid,
    email: user.email || "",
    name,
    className,
    city,
    photoDataUrl,
    initials,
    updatedAtIso: new Date().toISOString(),
  };

  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        name,
        className,
        city,
        photoDataUrl,
        initials,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    writeLocalProfile(profilePayload);
    setProfileStatus("Profile saved successfully.", "success");
    showProfilePanel(false);
    showStatus("Profile completed successfully.", "success");
  } catch (error) {
    setProfileStatus(mapAuthError(error.code), "error");
  }
});

init();
