// Handle theme click and redirect to post-theme.html with theme parameter
const themeElements = document.querySelectorAll('.theme-container .theme');

themeElements.forEach(themeElement => {
    themeElement.addEventListener('click', () => {
        const theme = themeElement.getAttribute('data-theme');
        window.location.href = `post-theme.html?theme=${theme}`;
    });
});

// Handle leaderboard navigation
const leaderboardButton = document.getElementById('leaderboard');
const themesSection = document.getElementById('themesSection');
const outfitsSection = document.getElementById('outfits');
const leaderboardSection = document.getElementById('leaderboardSection');
const savedSection = document.getElementById('savedSection');
const topPostsContainer = document.getElementById('topPosts');
const savedPostsContainer = document.getElementById('savedPosts');

leaderboardButton.addEventListener('click', () => {
    themesSection.style.display = 'none';
    outfitsSection.style.display = 'none';
    savedSection.style.display = 'none';
    leaderboardSection.style.display = 'block';
});

// Handle theme selection in leaderboard
const leaderboardThemes = document.querySelectorAll('.leaderboard .theme');

leaderboardThemes.forEach(themeElement => {
    themeElement.addEventListener('click', () => {
        const theme = themeElement.getAttribute('data-theme');
        displayTopPosts(theme);
    });
});

// Load posts from localStorage
function loadPosts() {
    const outfitsContainer = document.getElementById('outfits');
    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    outfitsContainer.innerHTML = ''; // Clear existing posts
    posts.forEach(post => {
        const postElement = createPostElement(post);
        outfitsContainer.appendChild(postElement);
    });
}

// Create post element
function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.innerHTML = `
        <div class="user-profile">
            <img src="profile.jpg" alt="User Profile Picture" class="profile-picture">
            <p class="username">Username</p>
        </div>
        <p class="posted-time">${post.time}</p>
        <p class="post-theme">Theme: ${post.theme}</p>
        <img src="${post.image}" alt="Outfit Post" class="post-image">
        <div class="interaction">
            <button class="like-button">Like</button>
            <span class="like-count">${post.likes}</span>
            <button class="save-button">Save</button>
        </div>
    `;

    const likeButton = postElement.querySelector('.like-button');
    const saveButton = postElement.querySelector('.save-button');
    const likeCount = postElement.querySelector('.like-count');

    likeButton.addEventListener('click', () => {
        const likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || [];
        if (!likedPosts.includes(post.id)) {
            likedPosts.push(post.id);
            localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
            likeCount.textContent = parseInt(likeCount.textContent) + 1;
            post.likes++;
            updatePostLikes(post.id, post.likes);
        } else {
            const index = likedPosts.indexOf(post.id);
            likedPosts.splice(index, 1);
            localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
            likeCount.textContent = parseInt(likeCount.textContent) - 1;
            post.likes--;
            updatePostLikes(post.id, post.likes);
        }
    });

    saveButton.addEventListener('click', () => {
        savePost(post);
    });

    return postElement;
}

// Save post to saved section
function savePost(post) {
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts')) || [];
    // Check if the post is already saved
    const postExists = savedPosts.some(savedPost => savedPost.id === post.id);
    if (!postExists) {
        savedPosts.push(post);
        localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
        displaySavedPosts();
    }
}

// Display saved posts
function displaySavedPosts() {
    savedPostsContainer.innerHTML = ''; // Clear existing posts
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts')) || [];

    savedPosts.forEach(post => {
        const postElement = createPostElement(post);
        savedPostsContainer.appendChild(postElement);
    });
}

// Display top posts for a specific theme
function displayTopPosts(theme) {
    topPostsContainer.innerHTML = ''; // Clear existing posts
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const topPosts = posts
        .filter(post => post.theme === theme)
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5);

    topPosts.forEach(post => {
        const postElement = createPostElement(post);
        topPostsContainer.appendChild(postElement);
    });
}

// Show saved section and hide others
document.getElementById('saved').addEventListener('click', () => {
    themesSection.style.display = 'none';
    outfitsSection.style.display = 'none';
    leaderboardSection.style.display = 'none';
    savedSection.style.display = 'block';
});

// Load saved posts and posts on page load
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    displaySavedPosts();
});
