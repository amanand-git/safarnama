const articles =
  (typeof latestArticles !== 'undefined' && Array.isArray(latestArticles))
    ? latestArticles
    : (Array.isArray(window.latestArticles) ? window.latestArticles : []);

const totalEl = document.getElementById('totalArticles');
const filteredEl = document.getElementById('filteredArticles');
const refreshEl = document.getElementById('lastRefresh');
const searchInput = document.getElementById('articleSearch');
const chipsWrap = document.getElementById('categoryChips');
const grid = document.getElementById('articlesGrid');
const emptyState = document.getElementById('emptyState');
const loadMoreBtn = document.getElementById('loadMoreBtn');

const PAGE_SIZE = 12;
let visibleCount = PAGE_SIZE;
let activeCategory = 'all';
let activeQuery = '';

function getCategories() {
  return [...new Set(articles.map((item) => item.category).filter(Boolean))];
}

function cleanText(value) {
  return String(value || '').toLowerCase().trim();
}

function articleMatches(article, query, category) {
  const categoryMatch = category === 'all' || article.category === category;
  if (!categoryMatch) return false;

  if (!query) return true;

  const haystack = [article.title, article.description, article.source, article.category]
    .map(cleanText)
    .join(' ');

  return haystack.includes(query);
}

function getFilteredArticles() {
  const query = cleanText(activeQuery);
  return articles.filter((article) => articleMatches(article, query, activeCategory));
}

function renderChips() {
  const categories = getCategories();
  const buttons = ['<button class="chip active" data-category="all">All</button>'];

  categories.forEach((category) => {
    const count = articles.filter((item) => item.category === category).length;
    buttons.push(`<button class="chip" data-category="${category}">${category} (${count})</button>`);
  });

  chipsWrap.innerHTML = buttons.join('');

  chipsWrap.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      chipsWrap.querySelectorAll('.chip').forEach((btn) => btn.classList.remove('active'));
      chip.classList.add('active');
      activeCategory = chip.getAttribute('data-category') || 'all';
      visibleCount = PAGE_SIZE;
      renderArticles();
    });
  });
}

function renderArticles() {
  const filtered = getFilteredArticles();
  const visibleItems = filtered.slice(0, visibleCount);

  totalEl.textContent = String(articles.length);
  filteredEl.textContent = String(filtered.length);

  if (articles.length > 0) {
    const topDate = (articles[0].date || '').split(' - ')[0] || '--';
    refreshEl.textContent = topDate;
  }

  grid.innerHTML = visibleItems
    .map((item, index) => {
      const safeTitle = item.title || 'Education Update';
      const safeDesc = item.description || 'Read full article for details.';
      const safeDate = item.date || '';
      const safeSource = item.source || 'News Source';
      const safeLink = item.link || '#';
      const safeBadge = item.badge || 'UPDATE';
      const safeBadgeColor = item.badgeColor || 'gray';
      const safeCategory = item.category || 'Education';

      return `
        <article class="article-card" data-category="${safeCategory}" style="--stagger:${index}">
          <div class="article-head">
            <span class="badge ${safeBadgeColor}">${safeBadge}</span>
            <span class="source">${safeSource}</span>
          </div>
          <h3 class="article-title">${safeTitle}</h3>
          <p class="article-desc">${safeDesc}</p>
          <div class="article-meta">
            <span class="meta-date">${safeDate}</span>
            <a class="read-link" href="${safeLink}" target="_blank" rel="noopener noreferrer">Read Full Story</a>
          </div>
        </article>
      `;
    })
    .join('');

  const noResults = filtered.length === 0;
  emptyState.classList.toggle('hidden', !noResults);
  loadMoreBtn.style.display = filtered.length > visibleCount ? 'inline-flex' : 'none';
}

searchInput.addEventListener('input', (event) => {
  activeQuery = event.target.value || '';
  visibleCount = PAGE_SIZE;
  renderArticles();
});

loadMoreBtn.addEventListener('click', () => {
  visibleCount += PAGE_SIZE;
  renderArticles();
});

renderChips();
renderArticles();

