const POSTS_PER_PAGE = 4;

const blogPosts = [
  {
    title: "First Production Update",
    date: "March 1, 2026",
    tags: ["Update", "Scripts", "Storyboard"],
    image: "assets/newsimage1.png",
    previewText: "This is the first production update. Replace this with the opening text of your real blog post. This text can be longer than 350 characters because the script will automatically shorten it for the blog page preview. When a visitor clicks the title, they will open the full post page and read the complete version there.",
    link: "posts/post-1.html"
  },
  {
    title: "Concept Art Progress",
    date: "March 8, 2026",
    tags: ["Concept Art", "Update", "Storyboard"],
    image: "assets/newsimage2.png",
    previewText: "This post can describe visual development, early sketches, and design choices. Keep writing naturally here. The script will cut this down to the first 350 characters and add dots at the end, so readers know there is more to read when they open the full post page.",
    link: "posts/post-2.html"
  },
  {
    title: "Storyboard Review",
    date: "March 15, 2026",
    tags: ["Storyboard", "Scripts", "Update"],
    image: "assets/frontpageimage.png",
    previewText: "Use this area for the first section of your article. You can summarize the story direction, the visual beats, or how the sequence changed during planning. This preview text helps visitors decide whether they want to open the full post and continue reading the complete article.",
    link: "posts/post-3.html"
  },
  {
    title: "Project Release Notes",
    date: "March 22, 2026",
    tags: ["Project Release", "Update", "Concept Art"],
    image: "assets/frontpageimage.png",
    previewText: "This preview can introduce a major release, a completed milestone, or a public update. The full post will hold the rest of the story, including screenshots, extra paragraphs, and any links or images that belong in the complete version of the article.",
    link: "posts/post-4.html"
  },
  {
    title: "Writing the Next Script",
    date: "March 29, 2026",
    tags: ["Scripts", "Storyboard", "Project Release"],
    image: "assets/newsimage1.png",
    previewText: "This fifth sample post is here so pagination works right away. Because the blog page shows four posts at a time, adding a fifth post lets you test the next page button immediately and confirm that your blog system is working the way you want it to.",
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
