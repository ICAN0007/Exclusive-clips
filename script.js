document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('mobile-menu').classList.toggle('hidden');
});

function displayVideos(videosToShow) {
    const videosPerPage = 10;
    const totalPages = Math.ceil(videosToShow.length / videosPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let page = 1; page <= totalPages; page++) {
        const button = document.createElement('button');
        button.className = 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700';
        button.textContent = page;
        button.addEventListener('click', () => {
            const start = (page - 1) * videosPerPage;
            const videosOnPage = videosToShow.slice(start, start + videosPerPage);
            const videoList = document.getElementById('video-list');
            videoList.innerHTML = '';
            videosOnPage.forEach(video => {
                const index = videos.indexOf(video);
                const videoId = index < 10 ? index : index >= 10 ? index : -(index - 9);
                const videoElement = document.createElement('div');
                videoElement.className = 'relative bg-gray-900 rounded-lg shadow-md overflow-hidden';
                videoElement.innerHTML = `
                    <a href="video.html?id=${videoId}">
                        <img src="${video.thumbnail}" alt="${video.title}" class="w-full h-48 object-cover">
                        <div class="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">${video.views}</div>
                        <div class="p-4">
                            <h3 class="text-lg font-semibold text-white">${video.title}</h3>
                        </div>
                    </a>
                `;
                videoList.appendChild(videoElement);
            });
        });
        pagination.appendChild(button);
    }
    pagination.children[0]?.click();
}

function displayCategories(allVideos) {
    const categories = [...new Set(allVideos.flatMap(video => video.categories))];
    const categoryList = document.getElementById('category-list');
    categories.forEach(category => {
        const link = document.createElement('a');
        link.className = 'text-blue-400 hover:underline';
        link.href = `index.html?category=${category}`;
        link.textContent = category;
        link.classList.add('mr-4');
        categoryList.appendChild(link);
    });
}

function displayHashtags(allVideos) {
    const hashtags = [...new Set(allVideos.flatMap(video => video.hashtags))];
    const hashtagList = document.getElementById('hashtag-list');
    hashtags.forEach(hashtag => {
        const link = document.createElement('a');
        link.className = 'text-blue-400 hover:underline';
        link.href = `index.html?hashtag=${hashtag}`;
        link.textContent = `#${hashtag}`;
        link.classList.add('mr-4');
        hashtagList.appendChild(link);
    });
}

function initialize() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    const hashtag = params.get('hashtag');
    let videosToShow = videos;

    if (category) {
        videosToShow = videos.filter(video => video.categories.includes(category));
    } else if (hashtag) {
        videosToShow = videos.filter(video => video.hashtags.includes(hashtag));
    }

    displayVideos(videosToShow);
    displayCategories(videos);
    displayHashtags(videos);
}

initialize();