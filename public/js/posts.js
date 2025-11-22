// Select all posts
document.querySelectorAll(".post").forEach(function (post) {
  // Get comment list and input within this post
  let commentList = post.querySelector(".comments");
  let input = post.querySelector(".comment-input");
  let addButton = post.querySelector(".add-comment");
  let commentCount = post.querySelector(".comment-count");

  // Update comment count function
  function updateCommentCount() {
    const count = commentList.querySelectorAll("p").length;
    commentCount.innerText = `Comments (${count})`;
  }

  // Add event listener to Add Comment button
  addButton.addEventListener("click", function () {
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
