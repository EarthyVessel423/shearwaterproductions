const POSTS_PER_PAGE = 4;

const blogPosts = [
  {
    title: "Example Post 1",
    date: "2026-03-11",
    tags: ["Update", "Scripts", "Storyboard"],
    image: "assets/newsimage1.png",
    previewText: "This is the preview text of a post that goes on a half-post.",
    link: "posts/post-1.html"
  },
  {
    title: "Example Post 2",
    date: "2026-03-10",
    tags: ["Update", "Scripts", "Storyboard"],
    image: "assets/newsimage1.png",
    previewText: "This is the preview text of a post that goes on a half-post.",
    link: "posts/post-2.html"
  },
  {
    title: "Example Post 3",
    date: "2025-03-10",
    tags: ["Update", "Scripts", "Storyboard"],
    image: "assets/newsimage1.png",
    previewText: "This is the preview text of a post that goes on a half-post.",
    link: "posts/post-3.html"
  },
  {
    title: "Example Post 4",
    date: "2026-01-01",
    tags: ["Update", "Scripts", "Storyboard"],
    image: "assets/newsimage1.png",
    previewText: "This is the preview text of a post that goes on a half-post.",
    link: "posts/post-4.html"
  },
  {
    title: "Example Post 5",
    date: "2027-03-14",
    tags: ["Update", "Scripts", "Storyboard"],
    image: "assets/newsimage1.png",
    previewText: "This is the preview text of a post that goes on a half-post.",
    link: "posts/post-5.html"
  }
];

let currentPage = 1;
let selectedTag = "All";
let searchTerm = "";

function createExcerpt(text, limit = 350) {
  if (text.length <= limit) {
    return text;
  }
  return text.slice(0, limit).trim() + "...";
}

function formatDisplayDate(dateString) {
  return new Date(dateString + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function getFilteredPosts() {
  return blogPosts
    .filter(post => {
      const matchesTag =
        selectedTag === "All" || post.tags.includes(selectedTag);

      const combinedText = (
        post.title + " " +
        post.previewText + " " +
        post.tags.join(" ")
      ).toLowerCase();

      const matchesSearch = combinedText.includes(searchTerm.toLowerCase());

      return matchesTag && matchesSearch;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderPosts() {
  const postsContainer = document.getElementById("postsContainer");
  const pageIndicator = document.getElementById("pageIndicator");
  const prevPageBtn = document.getElementById("prevPageBtn");
  const nextPageBtn = document.getElementById("nextPageBtn");

  if (!postsContainer || !pageIndicator || !prevPageBtn || !nextPageBtn) {
    return;
  }

  const filteredPosts = getFilteredPosts();
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const pagePosts = filteredPosts.slice(startIndex, endIndex);

  postsContainer.innerHTML = "";

  if (pagePosts.length === 0) {
    postsContainer.innerHTML = `
      <div class="no-posts-message">
        <h3>No posts found</h3>
        <p>Try a different search or tag.</p>
      </div>
    `;
  } else {
    pagePosts.forEach(post => {
      const postCard = document.createElement("article");
      postCard.className = "blog-preview-card";

      postCard.innerHTML = `
        <div class="blog-preview-image">
          <img src="${post.image}" alt="${post.title}">
        </div>

        <div class="blog-preview-text">
          <h2><a href="${post.link}">${post.title}</a></h2>

          <div class="blog-preview-tags">
            ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join("")}
          </div>

          <p>${createExcerpt(post.previewText)}</p>

          <div class="blog-preview-date">${formatDisplayDate(post.date)}</div>
        </div>
      `;

      postsContainer.appendChild(postCard);
    });
  }

  pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
}

function renderHomeBlogPreview() {
  const latestPostFeature = document.getElementById("latestPostFeature");
  const latestPostGrid = document.getElementById("latestPostGrid");

  if (!latestPostFeature || !latestPostGrid) {
    return;
  }

  const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (sortedPosts.length === 0) {
    latestPostFeature.innerHTML = `<p>No blog posts yet.</p>`;
    latestPostGrid.innerHTML = "";
    return;
  }

  const newestPost = sortedPosts[0];
  const nextThreePosts = sortedPosts.slice(1, 4);

  latestPostFeature.innerHTML = `
    <article class="latest-feature-post">
      <div class="latest-feature-image">
        <a href="${newestPost.link}">
          <img src="${newestPost.image}" alt="${newestPost.title}">
        </a>
      </div>

      <div class="latest-feature-text">
        <div class="latest-feature-date">Latest Post • ${formatDisplayDate(newestPost.date)}</div>
        <h3><a href="${newestPost.link}">${newestPost.title}</a></h3>
        <p>${createExcerpt(newestPost.previewText, 220)}</p>
      </div>
    </article>
  `;

  latestPostGrid.innerHTML = nextThreePosts.map(post => `
    <article class="latest-grid-item">
      <a href="${post.link}">
        <img src="${post.image}" alt="${post.title}">
        <h4>${post.title}</h4>
      </a>
    </article>
  `).join("");
}

function setupBlogControls() {
  const searchInput = document.getElementById("searchInput");
  const tagButtons = document.querySelectorAll(".tag-filter");
  const prevPageBtn = document.getElementById("prevPageBtn");
  const nextPageBtn = document.getElementById("nextPageBtn");

  if (!searchInput || !prevPageBtn || !nextPageBtn) {
    return;
  }

  searchInput.addEventListener("input", (event) => {
    searchTerm = event.target.value;
    currentPage = 1;
    renderPosts();
  });

  tagButtons.forEach(button => {
    button.addEventListener("click", () => {
      tagButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      selectedTag = button.dataset.tag;
      currentPage = 1;
      renderPosts();
    });
  });

  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPosts();
    }
  });

  nextPageBtn.addEventListener("click", () => {
    const totalPages = Math.max(1, Math.ceil(getFilteredPosts().length / POSTS_PER_PAGE));
    if (currentPage < totalPages) {
      currentPage++;
      renderPosts();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupBlogControls();
  renderPosts();
  renderHomeBlogPreview();
});
