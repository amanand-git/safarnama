(function () {
  const STYLE_ID = "safarnama-auth-avatar-style";
  const NOTIFICATION_KEY = "safarnama_user_notifications";
  const GREETING_PENDING_KEY = "safarnama_greeting_pending";

  function getStorageItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  }

  function setStorageItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (_) {}
  }

  function removeStorageItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (_) {}
  }

  function parseJson(value) {
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (_) {
      return null;
    }
  }

  function parseProfile() {
    const parsed = parseJson(getStorageItem("safarnama_user_profile"));
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  }

  function buildInitials(name, email) {
    const source = (name || email || "U").trim();
    if (!source) return "U";
    const words = source.split(/\s+/).filter(Boolean);
    if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
    return source.slice(0, 2).toUpperCase();
  }

  function formatName(value) {
    const text = String(value || "").trim();
    if (!text) return "";
    return text
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(" ");
  }

  function getDisplayName(profile, email) {
    const fromProfile = formatName(profile?.name || "");
    if (fromProfile) return fromProfile;

    const local = String(email || "")
      .split("@")[0]
      .replace(/[._-]+/g, " ")
      .trim();
    const fromEmail = formatName(local);
    return fromEmail || "Student";
  }

  function readNotifications() {
    const parsed = parseJson(getStorageItem(NOTIFICATION_KEY));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item === "object" && item.id && item.message)
      .map((item) => ({
        id: String(item.id),
        title: String(item.title || "Safarnama"),
        message: String(item.message || ""),
        createdAt: String(item.createdAt || new Date().toISOString()),
        read: Boolean(item.read),
      }));
  }

  function writeNotifications(list) {
    setStorageItem(NOTIFICATION_KEY, JSON.stringify(list.slice(0, 30)));
  }

  function countUnread(list) {
    return list.reduce((count, item) => count + (item.read ? 0 : 1), 0);
  }

  function markAllRead(list) {
    return list.map((item) => ({ ...item, read: true }));
  }

  function createNotification(title, message) {
    return {
      id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      title,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    };
  }

  function formatNotificationTime(isoString) {
    try {
      return new Date(isoString).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (_) {
      return "Just now";
    }
  }

  function escapeHtml(text) {
    return String(text || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function consumePendingGreeting() {
    const parsed = parseJson(getStorageItem(GREETING_PENDING_KEY));
    removeStorageItem(GREETING_PENDING_KEY);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  }

  function showToast(message) {
    if (!message) return;

    const toast = document.createElement("div");
    toast.className = "auth-greeting-toast";
    toast.innerHTML = `
      <span class="auth-greeting-toast-dot" aria-hidden="true"></span>
      <span>${escapeHtml(message)}</span>
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    window.setTimeout(() => {
      toast.classList.remove("show");
      window.setTimeout(() => toast.remove(), 260);
    }, 4200);
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .auth-avatar-link {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 42px;
        height: 42px;
        border-radius: 999px;
        text-decoration: none;
        background: linear-gradient(135deg, #0f172a, #1e293b);
        border: 1px solid rgba(110, 231, 183, 0.55);
        box-shadow:
          0 10px 24px rgba(2, 6, 23, 0.35),
          0 0 16px rgba(16, 185, 129, 0.24),
          inset 0 1px 0 rgba(255, 255, 255, 0.25);
        overflow: hidden;
      }

      .auth-avatar-link:hover {
        transform: translateY(-1px) scale(1.03);
      }

      .auth-avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .auth-avatar-initials {
        font-weight: 700;
        font-size: 0.92rem;
        color: #e2e8f0;
        letter-spacing: 0.02em;
      }

      .auth-avatar-dot {
        position: absolute;
        right: -1px;
        bottom: -1px;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        border: 2px solid #ffffff;
        background: #10b981;
        box-shadow: 0 0 12px rgba(16, 185, 129, 0.62);
      }

      .auth-avatar-nav-btn {
        padding: 0 !important;
        background: transparent !important;
        border: none !important;
      }

      .auth-notify-wrap {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .auth-notify-btn {
        width: 38px;
        height: 38px;
        border-radius: 999px;
        border: 1px solid rgba(16, 185, 129, 0.45);
        background: linear-gradient(145deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.86));
        color: #d1fae5;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 8px 20px rgba(2, 6, 23, 0.3);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .auth-notify-btn:hover {
        transform: translateY(-1px);
        box-shadow:
          0 10px 24px rgba(2, 6, 23, 0.34),
          0 0 14px rgba(16, 185, 129, 0.3);
      }

      .auth-notify-badge {
        position: absolute;
        top: -5px;
        right: -4px;
        min-width: 18px;
        height: 18px;
        padding: 0 5px;
        border-radius: 999px;
        border: 1px solid #ffffff;
        background: #ef4444;
        color: #ffffff;
        font-size: 11px;
        font-weight: 700;
        display: none;
        align-items: center;
        justify-content: center;
        line-height: 1;
      }

      .auth-notify-panel {
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        width: 300px;
        max-height: 360px;
        overflow: auto;
        display: none;
        border-radius: 14px;
        border: 1px solid rgba(148, 163, 184, 0.35);
        background: linear-gradient(180deg, #f8fafc, #eff6ff);
        box-shadow: 0 20px 45px rgba(2, 6, 23, 0.24);
        z-index: 1200;
      }

      .auth-notify-panel.show {
        display: block;
      }

      .auth-notify-head {
        position: sticky;
        top: 0;
        padding: 10px 12px;
        font-size: 13px;
        font-weight: 700;
        color: #0f172a;
        background: rgba(241, 245, 249, 0.95);
        border-bottom: 1px solid rgba(148, 163, 184, 0.35);
        backdrop-filter: blur(8px);
      }

      .auth-notify-list {
        display: grid;
      }

      .auth-notify-item {
        padding: 10px 12px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.2);
      }

      .auth-notify-item:last-child {
        border-bottom: none;
      }

      .auth-notify-title {
        font-size: 13px;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 3px;
      }

      .auth-notify-text {
        font-size: 12px;
        color: #1e293b;
        line-height: 1.45;
      }

      .auth-notify-time {
        margin-top: 4px;
        font-size: 11px;
        color: #64748b;
      }

      .auth-notify-empty {
        padding: 14px 12px;
        font-size: 12px;
        color: #64748b;
      }

      .auth-greeting-toast {
        position: fixed;
        top: 78px;
        right: 18px;
        z-index: 3000;
        display: inline-flex;
        align-items: center;
        gap: 9px;
        padding: 11px 14px;
        border-radius: 12px;
        border: 1px solid rgba(52, 211, 153, 0.45);
        background: linear-gradient(135deg, rgba(2, 132, 199, 0.95), rgba(5, 150, 105, 0.94));
        color: #ecfeff;
        font-size: 13px;
        font-weight: 600;
        box-shadow:
          0 16px 35px rgba(2, 6, 23, 0.3),
          0 0 20px rgba(16, 185, 129, 0.25);
        opacity: 0;
        transform: translateY(-8px);
        transition: opacity 0.25s ease, transform 0.25s ease;
        pointer-events: none;
      }

      .auth-greeting-toast.show {
        opacity: 1;
        transform: translateY(0);
      }

      .auth-greeting-toast-dot {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: #86efac;
        box-shadow: 0 0 14px rgba(134, 239, 172, 0.8);
      }

      @media (max-width: 768px) {
        .auth-notify-wrap.in-blue-bar-mobile {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10002;
        }

        .auth-notify-wrap.in-blue-bar-mobile .auth-notify-btn {
          width: 34px;
          height: 34px;
          color: #dbeafe;
          border: 1px solid rgba(191, 219, 254, 0.82);
          background: linear-gradient(
            140deg,
            rgba(30, 64, 175, 0.42),
            rgba(37, 99, 235, 0.35),
            rgba(59, 130, 246, 0.28)
          );
          box-shadow:
            0 10px 20px rgba(29, 78, 216, 0.34),
            0 0 18px rgba(59, 130, 246, 0.38),
            inset 0 1px 0 rgba(255, 255, 255, 0.38);
          backdrop-filter: blur(12px) saturate(150%);
          -webkit-backdrop-filter: blur(12px) saturate(150%);
        }

        .auth-notify-wrap.in-blue-bar-mobile .auth-notify-btn:hover {
          transform: translateY(-1px) scale(1.03);
          box-shadow:
            0 12px 24px rgba(29, 78, 216, 0.42),
            0 0 24px rgba(96, 165, 250, 0.42),
            inset 0 1px 0 rgba(255, 255, 255, 0.45);
        }

        .auth-notify-wrap.in-blue-bar-mobile .auth-notify-panel {
          width: min(260px, calc(100vw - 20px));
          right: 0;
          top: calc(100% + 8px);
        }

        .auth-notify-panel {
          width: 260px;
          right: -6px;
        }

        .auth-greeting-toast {
          top: 68px;
          right: 10px;
          left: 10px;
          justify-content: center;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function isLoginNode(node) {
    const text = (node.textContent || "").trim().toLowerCase();
    const href = (node.getAttribute("href") || "").toLowerCase();
    return text === "login" || href.includes("login.html");
  }

  function replaceLoginNode(node, profile, email) {
    const link = document.createElement("a");
    link.href = "login.html";
    link.className = "auth-avatar-link auth-avatar-nav-btn";
    link.setAttribute("aria-label", "Account");
    link.title = profile?.name || email || "Account";

    if (profile?.photoDataUrl) {
      const img = document.createElement("img");
      img.src = profile.photoDataUrl;
      img.alt = "User Avatar";
      img.className = "auth-avatar-img";
      link.appendChild(img);
    } else {
      const initials = document.createElement("span");
      initials.className = "auth-avatar-initials";
      initials.textContent = buildInitials(profile?.name || "", email || "");
      link.appendChild(initials);
    }

    const dot = document.createElement("span");
    dot.className = "auth-avatar-dot";
    dot.setAttribute("aria-hidden", "true");
    link.appendChild(dot);

    node.replaceWith(link);
    return link;
  }

  function createNotificationUI(anchorNode, notificationsState) {
    if (!anchorNode || !anchorNode.parentElement) return null;
    const parent = anchorNode.parentElement;
    const existing = parent.querySelector(".auth-notify-wrap");
    if (existing) return existing;

    const wrap = document.createElement("div");
    wrap.className = "auth-notify-wrap";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "auth-notify-btn";
    button.setAttribute("aria-label", "Notifications");
    button.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V10a6 6 0 1 0-12 0v4.2a2 2 0 0 1-.6 1.4L4 17h5"></path>
        <path d="M10 20a2 2 0 0 0 4 0"></path>
      </svg>
    `;

    const badge = document.createElement("span");
    badge.className = "auth-notify-badge";

    const panel = document.createElement("div");
    panel.className = "auth-notify-panel";

    const head = document.createElement("div");
    head.className = "auth-notify-head";
    head.textContent = "Notifications";

    const listWrap = document.createElement("div");
    listWrap.className = "auth-notify-list";

    panel.appendChild(head);
    panel.appendChild(listWrap);
    wrap.appendChild(button);
    wrap.appendChild(badge);
    wrap.appendChild(panel);
    parent.insertBefore(wrap, anchorNode);

    function renderPanel() {
      const notifications = notificationsState.get();
      const unread = countUnread(notifications);
      badge.style.display = unread > 0 ? "inline-flex" : "none";
      badge.textContent = unread > 9 ? "9+" : String(unread);

      if (!notifications.length) {
        listWrap.innerHTML = `<div class="auth-notify-empty">No notifications yet.</div>`;
        return;
      }

      listWrap.innerHTML = notifications
        .slice(0, 8)
        .map(
          (item) => `
            <article class="auth-notify-item">
              <h4 class="auth-notify-title">${escapeHtml(item.title)}</h4>
              <p class="auth-notify-text">${escapeHtml(item.message)}</p>
              <div class="auth-notify-time">${escapeHtml(formatNotificationTime(item.createdAt))}</div>
            </article>
          `
        )
        .join("");
    }

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const opening = !panel.classList.contains("show");
      panel.classList.toggle("show", opening);
      if (opening) {
        const notifications = notificationsState.get();
        if (countUnread(notifications) > 0) {
          notificationsState.set(markAllRead(notifications));
        }
        renderPanel();
      }
    });

    document.addEventListener("click", (event) => {
      if (!wrap.contains(event.target)) {
        panel.classList.remove("show");
      }
    });

    renderPanel();
    return wrap;
  }

  function placeNotificationByViewport(wrap, avatarNode) {
    if (!wrap || !avatarNode) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const blueBar = document.querySelector(".blue-nav-bar");

    if (isMobile && blueBar) {
      if (wrap.parentElement !== blueBar) {
        blueBar.appendChild(wrap);
      }
      wrap.classList.add("in-blue-bar-mobile");
      return;
    }

    const avatarParent = avatarNode.parentElement;
    if (!avatarParent) return;
    if (wrap.parentElement !== avatarParent || wrap.nextSibling !== avatarNode) {
      avatarParent.insertBefore(wrap, avatarNode);
    }
    wrap.classList.remove("in-blue-bar-mobile");
  }

  function bindNotificationPlacement(wrap, avatarNode) {
    if (!wrap || !avatarNode) return;

    placeNotificationByViewport(wrap, avatarNode);

    let resizeRaf = null;
    const onResize = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => placeNotificationByViewport(wrap, avatarNode));
    };

    window.addEventListener("resize", onResize, { passive: true });
  }

  function run() {
    const isLoggedIn = getStorageItem("safarnama_auth_state") === "logged_in";
    if (!isLoggedIn) return;

    const profile = parseProfile();
    const email = getStorageItem("safarnama_user_email") || profile?.email || "";
    ensureStyles();

    let notifications = readNotifications();
    const pendingGreeting = consumePendingGreeting();
    if (pendingGreeting) {
      const displayName = getDisplayName(profile, pendingGreeting.email || email);
      const greeting = `Namaste ${displayName}, Safarnama family mein aapka swagat hai! ❤️`;
      notifications = [createNotification("Safarnama Ji", greeting), ...notifications].slice(0, 30);
      writeNotifications(notifications);
      showToast(greeting);
    }

    const notificationState = {
      get: () => notifications,
      set: (next) => {
        notifications = Array.isArray(next) ? next : [];
        writeNotifications(notifications);
      },
    };

    const candidates = Array.from(
      new Set([
        ...document.querySelectorAll("a.nav-btn.blue"),
        ...document.querySelectorAll("a.login-btn"),
      ])
    );

    let firstAvatar = null;
    candidates.forEach((node) => {
      if (!isLoginNode(node)) return;
      const avatarNode = replaceLoginNode(node, profile, email);
      if (!firstAvatar) firstAvatar = avatarNode;
    });

    if (firstAvatar) {
      const notifyWrap = createNotificationUI(firstAvatar, notificationState);
      bindNotificationPlacement(notifyWrap, firstAvatar);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();
