const latestNews = (() => {
  if (typeof latestArticles !== "undefined" && Array.isArray(latestArticles) && latestArticles.length > 0) {
    const preferredCategories = ["Exams", "Admissions", "Colleges"];
    const selected = [];
    const usedTitles = new Set();
    const usedSources = new Set();

    const topicKey = (title = "") =>
      String(title)
        .toLowerCase()
        .replace(/\b(live|updates|update|registration|notification|released|release|date|dates|soon|official|check)\b/g, "")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .slice(0, 3)
        .join(" ");

    const usedTopicKeys = new Set();

    const addIfUnique = (article) => {
      if (!article) return false;
      const titleKey = String(article.title || "").toLowerCase().trim();
      const sourceKey = String(article.source || "").toLowerCase().trim();
      const key = topicKey(article.title);

      if (!titleKey || usedTitles.has(titleKey)) return false;
      if (sourceKey && usedSources.has(sourceKey)) return false;
      if (key && usedTopicKeys.has(key)) return false;

      selected.push(article);
      usedTitles.add(titleKey);
      if (sourceKey) usedSources.add(sourceKey);
      if (key) usedTopicKeys.add(key);
      return true;
    };

    preferredCategories.forEach((category) => {
      const candidate = latestArticles.find((article) => article.category === category && !usedTitles.has(String(article.title || "").toLowerCase().trim()));
      addIfUnique(candidate);
    });

    for (const article of latestArticles) {
      if (selected.length >= 3) break;
      addIfUnique(article);
    }

    return selected.slice(0, 3).map((article) => ({
      title: article.title,
      description: article.description,
      date: article.date,
      badge: article.badge || "UPDATE",
      badgeColor: article.badgeColor || "gray",
      link: article.link || "articles.html"
    }));
  }

  return [
    {
      title: "Education Updates Are Loading",
      description: "Latest education headlines will appear here once article data is available.",
      date: "Feb 6, 2026 - Education",
      badge: "NEW",
      badgeColor: "blue",
      link: "articles.html"
    },
    {
      title: "Admissions Alerts",
      description: "Track application windows, exam forms, and counselling updates in one place.",
      date: "Feb 6, 2026 - Admissions",
      badge: "LIVE",
      badgeColor: "red",
      link: "articles.html"
    },
    {
      title: "College News Roundup",
      description: "Stay updated with college announcements, policy changes, and exam notices.",
      date: "Feb 6, 2026 - Colleges",
      badge: "UPDATE",
      badgeColor: "gray",
      link: "articles.html"
    }
  ];
})();
