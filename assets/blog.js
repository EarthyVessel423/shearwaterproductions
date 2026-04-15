const POSTS_PER_PAGE = 4;

const blogPosts = [
  {
    title: "Example Post 1",
    date: "April 9, 2026",
    tags: ["Update", "Scripts", "Storyboard"],
    image: "assets/newsimage1.png",
    previewText: "This is the preview text of a post that goes on a half-post.",
    link: "posts/post-1.html"
  },
  {
    title: "Example Post 2",
    date: "April 10, 2026",
    tags: ["Update", "Scripts", "Storyboard"],
    image: "assets/newsimage1.png",
    previewText: "This is the preview text of a post that goes on a half-post.",
    link: "posts/post-2.html"
  },
  {
     title: "Example Post 3",
    date: "April 11, 2026",
    tags: ["Update", "Scripts", "Storyboard"],
    image: "assets/newsimage1.png",
    previewText: "This is the preview text of a post that goes on a half-post.",
    link: "posts/post-3.html"
  },
  {
    title: "Example Post 4",
    date: "April 12, 2026",
    tags: ["Update", "Scripts", "Storyboard"],
    image: "assets/newsimage1.png",
    previewText: "This is the preview text of a post that goes on a half-post.",
    link: "posts/post-4.html"
  },
  {
     title: "Example Post 5",
    date: "April 13, 2026",
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

function getFilteredPosts() {
  return blogPosts.filter(post => {
    const matchesTag =
      selectedTag === "All" || post.tags.includes(selectedTag);

    const combinedText = (
      post.title + " " +
      post.previewText + " " +
      post.tags.join(" ")
    ).toLowerCase();

    const matchesSearch = combinedText.includes(searchTerm.toLowerCase());

    return matchesTag && matchesSearch;
  });
}

function renderPosts() {
  const postsContainer = document.getElementById("postsContainer");
  const pageIndicator = document.getElementById("pageIndicator");
  const prevPageBtn = document.getElementById("prevPageBtn");
  const nextPageBtn = document.getElementById("nextPageBtn");

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

          <div class="blog-preview-date">${post.date}</div>
        </div>
      `;

      postsContainer.appendChild(postCard);
    });
  }

  pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
}

function setupBlogControls() {
  const searchInput = document.getElementById("searchInput");
  const tagButtons = document.querySelectorAll(".tag-filter");
  const prevPageBtn = document.getElementById("prevPageBtn");
  const nextPageBtn = document.getElementById("nextPageBtn");

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
});
