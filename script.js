document.addEventListener("DOMContentLoaded", () => {
  if (window.__safarnamaHomeInitialized) {
    return;
  }
  window.__safarnamaHomeInitialized = true;

  // Hero Global Search (initialized later after course map is ready)
  const heroSearchBtn = document.getElementById("heroSearchBtn");
  const heroSearchInput = document.getElementById("heroSearchInput");
  const heroSearchSuggestions = document.getElementById("heroSearchSuggestions");

  // Where To Study: State Suggestions + Redirect
  const locationSearchInput = document.getElementById("locationSearchInput");
  const locationSearchBtn = document.getElementById("locationSearchBtn");
  const locationSuggestions = document.getElementById("locationSuggestions");

  const searchableStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal"
  ].sort((a, b) => a.localeCompare(b));

  function openStatePageWithFilter(state) {
    const stateParam = encodeURIComponent(state);
    window.location.href = `all-india-colleges.html?state=${stateParam}`;
  }

  function getMatchingStates(query) {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return searchableStates.filter((state) => {
      const normalizedState = state.toLowerCase();
      return normalizedState.startsWith(normalizedQuery) || normalizedState.includes(normalizedQuery);
    });
  }

  function hideStateSuggestions() {
    if (!locationSuggestions) return;
    locationSuggestions.classList.remove("active");
    locationSuggestions.innerHTML = "";
  }

  function renderStateSuggestions(states) {
    if (!locationSuggestions) return;

    if (states.length === 0) {
      hideStateSuggestions();
      return;
    }

    locationSuggestions.innerHTML = states
      .map(
        (state) =>
          `<button type="button" class="location-suggestion-item" data-state="${state}">${state}</button>`
      )
      .join("");
    locationSuggestions.classList.add("active");
  }

  function handleStateSearch() {
    if (!locationSearchInput) return;

    const query = locationSearchInput.value.trim();
    const matches = getMatchingStates(query);
    if (!query) {
      hideStateSuggestions();
      return;
    }

    const exactState = matches.find((state) => state.toLowerCase() === query.toLowerCase());
    if (exactState) {
      openStatePageWithFilter(exactState);
      return;
    }

    if (matches.length === 1) {
      openStatePageWithFilter(matches[0]);
      return;
    }

    renderStateSuggestions(matches);
  }

  if (locationSearchInput && locationSearchBtn && locationSuggestions) {
    locationSearchInput.addEventListener("input", () => {
      const matches = getMatchingStates(locationSearchInput.value);
      renderStateSuggestions(matches);
    });

    locationSearchInput.addEventListener("focus", () => {
      const matches = getMatchingStates(locationSearchInput.value);
      renderStateSuggestions(matches);
    });

    locationSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleStateSearch();
      }
    });

    locationSearchBtn.addEventListener("click", () => {
      handleStateSearch();
    });

    locationSuggestions.addEventListener("click", (e) => {
      const target = e.target.closest(".location-suggestion-item");
      if (!target) return;
      const state = target.getAttribute("data-state");
      if (state) {
        openStatePageWithFilter(state);
      }
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".location-search-container")) {
        hideStateSuggestions();
      }
    });
  }

  // Where To Study city/state cards -> filtered colleges page
  const locationCards = document.querySelectorAll(".location-card");
  locationCards.forEach((card) => {
    const city = (card.getAttribute("data-city") || "").trim();
    const state = (card.getAttribute("data-state") || "").trim();
    if (!city || !state) return;

    const openCityStateResults = () => {
      const params = new URLSearchParams({ state, city });
      window.location.href = `all-india-colleges.html?${params.toString()}`;
    };

    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    card.addEventListener("click", openCityStateResults);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openCityStateResults();
      }
    });
  });

  // Button interactions (Logging for now)
  const allButtons = document.querySelectorAll("a, button");
  allButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const isLink =
        btn.getAttribute("href") && btn.getAttribute("href") !== "#";
      if (!isLink) {
        // e.preventDefault(); // Uncomment if we don't want hash jumps
        console.log("Button clicked:", btn.textContent.trim());
      }
    });
  });
  // Tab Switching Logic (Static HTML)
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".college-list-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // 1. Remove active class from all tabs
      tabs.forEach((t) => t.classList.remove("active"));
      // 2. Add active to clicked tab
      tab.classList.add("active");

      // 3. Hide all content lists
      contents.forEach((content) => {
        content.style.display = "none";
        content.classList.remove("active");
      });

      // 4. Show the target content
      const course = tab.getAttribute("data-course");
      const targetId = course + "-list";
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.style.display = "block"; // Or 'flex' if you change CSS
        targetContent.classList.add("active");
      }
    });
  });

  // Latest Education News Rendering
  function renderNews() {
    const container = document.getElementById('newsContainer');
    if (!container || typeof latestNews === 'undefined') return;

    container.innerHTML = latestNews.map(news => {
      let badgeClass = 'badge-gray';
      if (news.badgeColor === 'red') badgeClass = 'badge-red';
      if (news.badgeColor === 'blue') badgeClass = 'badge-blue';
      const targetLink = news.link || 'articles.html';

      return `
        <div class="news-card">
          <div class="news-badge ${badgeClass}">${news.badge}</div>
          <div class="news-content">
            <h3>${news.title}</h3>
            <p>${news.description}</p>
            <div class="news-meta-row">
              <div class="news-meta">${news.date}</div>
              <a href="${targetLink}" class="news-read-more" target="_blank" rel="noopener noreferrer">Read More</a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  renderNews();

  // Newsletter Validation
  const newsletterSection = document.querySelector(".newsletter-section");
  const isUserLoggedIn = (() => {
    try {
      return localStorage.getItem("safarnama_auth_state") === "logged_in";
    } catch (_) {
      return false;
    }
  })();

  if (newsletterSection && isUserLoggedIn) {
    newsletterSection.style.display = "none";
  }

  const subscribeBtn = document.getElementById("subscribeBtn");
  const emailInput = document.getElementById("emailInput");
  const feedbackMsg = document.getElementById("newsletter-feedback");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  if (subscribeBtn && emailInput && feedbackMsg) {
    subscribeBtn.addEventListener("click", () => {
      const email = emailInput.value.trim();
      
      // Reset feedback
      feedbackMsg.textContent = "";
      feedbackMsg.className = "feedback-message";

      if (!emailPattern.test(email)) {
        feedbackMsg.textContent = "Please enter a valid email address.";
        feedbackMsg.classList.add("error");
        return;
      }

      try {
        localStorage.setItem("safarnama_prefill_email", email);
      } catch (_) {}

      feedbackMsg.textContent = "Redirecting to account setup...";
      feedbackMsg.classList.add("success");

      const targetUrl = `login.html?mode=signup&email=${encodeURIComponent(email)}&source=newsletter`;
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 450);
    });
  }

  // Sticky AI Button Logic
  const aiBtn = document.querySelector(".try-ai-btn");
  if (aiBtn) {
    window.addEventListener("scroll", () => {
      // Show sticky button after scrolling down 300px
      if (window.scrollY > 300) {
        if (!aiBtn.classList.contains("sticky")) {
            aiBtn.classList.add("sticky");
        }
      } else {
        if (aiBtn.classList.contains("sticky")) {
            aiBtn.classList.remove("sticky");
        }
      }
    });
  }
  // ================= COURSES SIDEBAR LOGIC =================
  const coursesSidebar = document.getElementById("coursesSidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const openSidebarBtn = document.getElementById("all-courses-link");
  const closeSidebarBtn = document.getElementById("closeSidebarBtn");
  const courseListContainer = document.getElementById("courseList");
  const courseSearchInput = document.getElementById("courseSearchInput");

  const courses = [
    "B.Tech", "MBA", "M.Tech", "MBBS", "B.Com", "B.Sc", "B.Sc (Nursing)", "BA", "BBA", "BCA", 
    "B.Arch", "B.Ed", "B.Pharm", "B.Sc (Agriculture)", "BAMS", "LLB", "LLM", "M.Pharm", "M.Sc", 
    "MCA", "Bachelor of Physiotherapy", "B.Des", "M.Planning", "B.Planning", "Agriculture", 
    "Arts", "Commerce", "Computer Applications", "Design", "Engineering", "Law", "Management", 
    "Medical", "Paramedical", "Pharmacy", "Science", "Architecture", "Aviation", "Dental", 
    "Education", "Hotel Management", "Mass Communications", "Veterinary Sciences", "Animation"
  ];

  const coursePageMap = {
    "B.Tech": "btech.html",
    "MBA": "mba.html",
    "M.Tech": "mtech.html",
    "MBBS": "mbbs.html",
    "B.Com": "bcom.html",
    "B.Sc": "bsc.html",
    "B.Sc (Nursing)": "nursing.html",
    "BA": "ba.html",
    "BBA": "bba.html",
    "BCA": "bca.html",
    "B.Arch": "b-arch.html",
    "B.Ed": "b-ed.html",
    "B.Pharm": "b-pharma.html",
    "B.Sc (Agriculture)": "bsc-agriculture.html",
    "BAMS": "bams.html",
    "LLB": "llb.html",
    "LLM": "llm.html",
    "M.Pharm": "m-pharm.html",
    "M.Sc": "msc.html",
    "MCA": "mca.html",
    "Bachelor of Physiotherapy": "bpt.html",
    "B.Des": "b-des.html",
    "M.Planning": "m-planning.html",
    "B.Planning": "b-planning.html",
    "Agriculture": "agriculture.html",
    "Arts": "arts.html",
    "Commerce": "commerce.html",
    "Computer Applications": "computer-applications.html",
    "Design": "design.html",
    "Engineering": "engineering.html",
    "Law": "law.html",
    "Management": "management.html",
    "Medical": "medical.html",
    "Paramedical": "paramedical.html",
    "Pharmacy": "pharmacy.html",
    "Science": "science.html",
    "Architecture": "architecture.html",
    "Aviation": "aviation.html",
    "Dental": "dental.html",
    "Education": "education.html",
    "Hotel Management": "hotel-management.html",
    "Mass Communications": "mass-comm.html",
    "Veterinary Sciences": "veterinary-sc.html",
    "Animation": "animation.html"
  };

  function initializeHeroGlobalSearch(pageMap) {
    if (!heroSearchBtn || !heroSearchInput || !heroSearchSuggestions) return;

    const heroSearchContainer = document.getElementById("heroSearchContainer");
    const indexItems = [];
    const uniqueKeys = new Set();
    const activeResults = { items: [], index: -1 };

    const MAX_RESULTS = 14;

    const pageItems = [
      { label: "Home", type: "page", meta: "Page", target: "index.html" },
      { label: "All Courses", type: "page", meta: "Page", target: "courses.html" },
      { label: "All Colleges", type: "page", meta: "Page", target: "all-india-colleges.html" },
      { label: "Articles", type: "page", meta: "Page", target: "articles.html" },
      { label: "Exams", type: "page", meta: "Page", target: "exams.html" },
      { label: "Online Learning", type: "page", meta: "Page", target: "online-learning.html" },
      { label: "SafarEasy Apps", type: "page", meta: "Page", target: "safareasy-apps.html" },
      { label: "Image Compressor", type: "page", meta: "SafarEasy Tool", target: "image-compressor.html" },
      { label: "Image Enhancer", type: "page", meta: "SafarEasy Tool", target: "image-enhancer.html" },
      { label: "Image to PDF", type: "page", meta: "SafarEasy Tool", target: "image-to-pdf.html" },
      { label: "PDF Merger", type: "page", meta: "SafarEasy Tool", target: "pdf-merger.html" },
      { label: "Contact Us", type: "page", meta: "Page", target: "contact.html" }
    ];

    const additionalCourseItems = [
      { label: "App Development", target: "app-development.html" },
      { label: "Banking Exams", target: "banking-exams.html" },
      { label: "BDS", target: "bds.html" },
      { label: "BHMS", target: "bhms.html" },
      { label: "BMS", target: "bms.html" },
      { label: "CA", target: "ca.html" },
      { label: "CFA", target: "cfa.html" },
      { label: "Cyber Security", target: "cyber-security.html" },
      { label: "Defence Exams", target: "defence-exams.html" },
      { label: "Digital Marketing", target: "digital-marketing.html" },
      { label: "Entrepreneurship", target: "entrepreneurship.html" },
      { label: "Full Stack Development", target: "fullstack.html" },
      { label: "Java", target: "java.html" },
      { label: "Journalism", target: "journalism.html" },
      { label: "Machine Learning", target: "machine-learning.html" },
      { label: "NLP", target: "nlp.html" },
      { label: "Python", target: "python.html" },
      { label: "Railways", target: "railways.html" },
      { label: "SQL", target: "sql.html" },
      { label: "SSC CGL", target: "ssc-cgl.html" },
      { label: "Stock Market", target: "stock-market.html" },
      { label: "Teaching Exams", target: "teaching-exams.html" },
      { label: "UPSC CSE", target: "upsc-cse.html" }
    ];

    const normalizeText = (value) =>
      String(value || "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

    const escapeHtml = (value) =>
      String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

    const isValidCity = (value) => {
      const city = normalizeText(value);
      if (!city) return false;
      return !["na", "n/a", "null", "undefined", "-"].includes(city);
    };

    const addIndexItem = (item) => {
      const uniqueKey = item.key || `${item.type}|${normalizeText(item.label)}|${normalizeText(item.meta)}`;
      if (uniqueKeys.has(uniqueKey)) return;
      uniqueKeys.add(uniqueKey);
      indexItems.push({
        label: item.label,
        type: item.type,
        meta: item.meta,
        target: item.target,
        normalizedLabel: normalizeText(item.label),
        normalizedMeta: normalizeText(item.meta)
      });
    };

    Object.entries(pageMap).forEach(([course, page]) => {
      addIndexItem({
        key: `course|${normalizeText(course)}`,
        label: course,
        type: "course",
        meta: "Course",
        target: page
      });
    });

    additionalCourseItems.forEach((item) => {
      addIndexItem({
        key: `course|${normalizeText(item.label)}`,
        label: item.label,
        type: "course",
        meta: "Course",
        target: item.target
      });
    });

    pageItems.forEach((item) => {
      addIndexItem({
        key: `page|${normalizeText(item.label)}`,
        ...item
      });
    });

    const articleItems =
      typeof latestArticles !== "undefined" && Array.isArray(latestArticles) ? latestArticles : [];

    articleItems.forEach((article) => {
      const title = String(article.title || "").trim();
      if (!title) return;

      const category = String(article.category || "").trim();
      const source = String(article.source || "").trim();
      const articleLink = String(article.link || "").trim();

      addIndexItem({
        key: `article|${normalizeText(title)}`,
        label: title,
        type: "article",
        meta: `Article - ${category || source || "Latest"}`,
        target: articleLink || "articles.html"
      });
    });

    const collegeData =
      typeof STATEWISE_COLLEGES !== "undefined" && Array.isArray(STATEWISE_COLLEGES)
        ? STATEWISE_COLLEGES
        : [];

    if (collegeData.length > 0) {
      const stateSeen = new Set();
      const citySeen = new Set();
      const collegeSeen = new Set();

      collegeData.forEach((row) => {
        const state = String(row.state || "").trim();
        const city = String(row.city || "").trim();
        const college = String(row.college || "").trim();

        if (state) {
          const stateKey = normalizeText(state);
          if (!stateSeen.has(stateKey)) {
            stateSeen.add(stateKey);
            addIndexItem({
              key: `state|${stateKey}`,
              label: state,
              type: "state",
              meta: "State",
              target: `all-india-colleges.html?state=${encodeURIComponent(state)}`
            });
          }
        }

        if (state && isValidCity(city)) {
          const cityKey = `${normalizeText(city)}|${normalizeText(state)}`;
          if (!citySeen.has(cityKey)) {
            citySeen.add(cityKey);
            addIndexItem({
              key: `city|${cityKey}`,
              label: city,
              type: "city",
              meta: `City - ${state}`,
              target: `all-india-colleges.html?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}`
            });
          }
        }

        if (college && state && isValidCity(city)) {
          const collegeKey = `${normalizeText(college)}|${normalizeText(city)}|${normalizeText(state)}`;
          if (!collegeSeen.has(collegeKey)) {
            collegeSeen.add(collegeKey);
            addIndexItem({
              key: `college|${collegeKey}`,
              label: college,
              type: "college",
              meta: `College - ${city}, ${state}`,
              target: `all-india-colleges.html?state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}`
            });
          }
        }
      });
    }

    const getItemScore = (item, query) => {
      const label = item.normalizedLabel;
      const meta = item.normalizedMeta;
      if (!label || !query) return -1;

      if (label === query) return 0;
      if (label.startsWith(query)) return 1;
      if (label.split(" ").some((part) => part.startsWith(query))) return 2;
      if (label.includes(query)) return 3;
      if (meta.startsWith(query)) return 4;
      if (meta.includes(query)) return 5;
      return -1;
    };

    const getTypeIcon = (type) => {
      if (type === "course") return "CR";
      if (type === "college") return "CL";
      if (type === "state") return "ST";
      if (type === "city") return "CT";
      if (type === "article") return "AR";
      return "PG";
    };

    const closeHeroSuggestions = () => {
      heroSearchSuggestions.classList.remove("active");
      heroSearchSuggestions.innerHTML = "";
      activeResults.items = [];
      activeResults.index = -1;
    };

    const setActiveSuggestion = (index) => {
      const items = heroSearchSuggestions.querySelectorAll(".hero-suggestion-item");
      items.forEach((item) => item.classList.remove("active"));

      if (index < 0 || index >= items.length) {
        activeResults.index = -1;
        return;
      }

      activeResults.index = index;
      const activeEl = items[index];
      activeEl.classList.add("active");
      activeEl.scrollIntoView({ block: "nearest" });
    };

    const openSearchResult = (result) => {
      if (!result || !result.target) return;
      window.location.href = result.target;
    };

    const renderHeroSuggestions = (results, hasQuery) => {
      activeResults.items = results;
      activeResults.index = -1;

      if (!hasQuery) {
        closeHeroSuggestions();
        return;
      }

      if (results.length === 0) {
        heroSearchSuggestions.innerHTML = '<div class="hero-suggestion-empty">No matching result found.</div>';
        heroSearchSuggestions.classList.add("active");
        return;
      }

      heroSearchSuggestions.innerHTML = results
        .map((item, index) => `
          <button type="button" class="hero-suggestion-item" data-index="${index}">
            <span class="hero-suggestion-icon ${item.type}">${getTypeIcon(item.type)}</span>
            <span class="hero-suggestion-content">
              <span class="hero-suggestion-title">${escapeHtml(item.label)}</span>
              <span class="hero-suggestion-meta">${escapeHtml(item.meta)}</span>
            </span>
          </button>
        `)
        .join("");

      heroSearchSuggestions.classList.add("active");
    };

    const runHeroSearch = () => {
      const rawQuery = heroSearchInput.value.trim();
      const query = normalizeText(rawQuery);

      if (!query) {
        renderHeroSuggestions([], false);
        return;
      }

      const matches = indexItems
        .map((item) => ({ item, score: getItemScore(item, query) }))
        .filter((entry) => entry.score >= 0)
        .sort((a, b) => a.score - b.score || a.item.label.localeCompare(b.item.label))
        .slice(0, MAX_RESULTS)
        .map((entry) => entry.item);

      renderHeroSuggestions(matches, true);
    };

    const pickCurrentOrFirst = () => {
      if (activeResults.items.length === 0) {
        runHeroSearch();
      }

      const picked =
        activeResults.index >= 0
          ? activeResults.items[activeResults.index]
          : activeResults.items[0];

      if (picked) {
        openSearchResult(picked);
      }
    };

    heroSearchInput.addEventListener("input", runHeroSearch);
    heroSearchInput.addEventListener("focus", runHeroSearch);

    heroSearchInput.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        if (!activeResults.items.length) return;
        e.preventDefault();
        const next = (activeResults.index + 1) % activeResults.items.length;
        setActiveSuggestion(next);
      }

      if (e.key === "ArrowUp") {
        if (!activeResults.items.length) return;
        e.preventDefault();
        const next = activeResults.index <= 0 ? activeResults.items.length - 1 : activeResults.index - 1;
        setActiveSuggestion(next);
      }

      if (e.key === "Enter") {
        e.preventDefault();
        pickCurrentOrFirst();
      }

      if (e.key === "Escape") {
        closeHeroSuggestions();
      }
    });

    heroSearchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      pickCurrentOrFirst();
    });

    heroSearchSuggestions.addEventListener("click", (e) => {
      const target = e.target.closest(".hero-suggestion-item");
      if (!target) return;
      const index = Number(target.getAttribute("data-index"));
      const selected = activeResults.items[index];
      if (selected) {
        openSearchResult(selected);
      }
    });

    document.addEventListener("click", (e) => {
      if (!heroSearchContainer || !heroSearchContainer.contains(e.target)) {
        closeHeroSuggestions();
      }
    });
  }

  courses.sort((a, b) => a.localeCompare(b));
  initializeHeroGlobalSearch(coursePageMap);

  function renderCourses(filterText = "") {
    courseListContainer.innerHTML = "";
    
    const filteredCourses = courses.filter(course => 
      course.toLowerCase().startsWith(filterText.toLowerCase())
    );

    if (filteredCourses.length === 0) {
      courseListContainer.innerHTML = '<li class="course-item" style="justify-content:center; color:#9ca3af;">No courses found</li>';
      return;
    }

    filteredCourses.forEach(course => {
      const li = document.createElement("li");
      li.className = "course-item";
      li.innerHTML = `
        <span>${course}</span>
        <i class="fas fa-chevron-right"></i>
      `;
      li.addEventListener("click", () => {
        const targetPage = coursePageMap[course];
        if (targetPage) {
          window.location.href = targetPage;
        }
      });
      courseListContainer.appendChild(li);
    });
  }

  function openSidebar() {
    coursesSidebar.classList.add("open");
    sidebarOverlay.classList.add("active");
    renderCourses(); 
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    coursesSidebar.classList.remove("open");
    sidebarOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (openSidebarBtn) {
    openSidebarBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openSidebar();
    });
  }

  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener("click", closeSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar);
  }

  if (courseSearchInput) {
    courseSearchInput.addEventListener("input", (e) => {
      renderCourses(e.target.value);
    });
  }
});
