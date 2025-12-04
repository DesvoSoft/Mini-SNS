// Select all posts
document.querySelectorAll(".post").forEach(function (post) {
  // Get comment list and input within this post
  let commentList = post.querySelector(".comments");
  let input = post.querySelector(".comment-input");
  let addButton = post.querySelector(".add-comment");
  let commentCount = post.querySelector(".comment-count");

  // Update comment count function
  function updateCommentCount() {
    if (!commentCount) return;
    const count = commentList.querySelectorAll("p").length;
    commentCount.innerText = `Comments (${count})`;
  }

  updateCommentCount();

  // Like button handler
  const likeBtn = post.querySelector(".like-btn");
  if (likeBtn) {
    likeBtn.addEventListener("click", async function (e) {
      e.preventDefault();
      const uuid = this.dataset.uuid;

      try {
        const response = await fetch(`/posts/${uuid}/like`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (data.success) {
          this.querySelector(".like-count").textContent = data.likesCount;
          this.querySelector(".heart-icon").textContent = data.liked
            ? "❤️"
            : "🤍";

          // Add animation effect
          const icon = this.querySelector(".heart-icon");
          icon.style.transform = "scale(1.3)";
          setTimeout(() => (icon.style.transform = "scale(1)"), 200);
        }
      } catch (error) {
        console.error("Error liking post:", error);
      }
    });
  }

  // Add event listener to Add Comment button
  addButton?.addEventListener("click", function () {
    let commentText = input.value.trim();

    if (commentText) {
      let comment = document.createElement("p");
      comment.innerText = commentText;

      let deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Delete";
      deleteBtn.style.marginLeft = "10px";

      deleteBtn.addEventListener("click", function () {
        comment.remove();
        updateCommentCount(); // Update count when deleted
      });

      comment.appendChild(deleteBtn);

      commentList.appendChild(comment);

      // Update count when added
      updateCommentCount();

      // Clear input
      input.value = "";
    }
  });
});
