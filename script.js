document.addEventListener('DOMContentLoaded', () => {
    const videoGrid = document.getElementById('video-grid');
    const videoPage = document.getElementById('video-page');
    const videoPlayer = document.getElementById('video-player');
    const relatedVideos = document.getElementById('related-videos');
    const categoryLinks = document.getElementById('category-links');
    const hashtagLinks = document.getElementById('hashtag-links');
    const pagination = document.getElementById('pagination');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    let videos = [];
    const videosPerPage = 10;

    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Fetch videos.json
    fetch('videos.json')
        .then(response => response.json())
        .then(data => {
            videos = data.videos.sort((a, b) => b.id - a.id); // Sort newest first
            console.log('Videos loaded:', videos.length);
            renderPage();
        })
        .catch(error => console.error('Error loading videos:', error));

    function renderPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const page = parseInt(urlParams.get('page')) || 1;
        const videoId = urlParams.get('video');
        const category = urlParams.get('category');
        const hashtag = urlParams.get('hashtag');

        console.log('URL:', window.location.href);
        console.log('Page:', page);
        console.log('Video ID:', videoId);
        console.log('Category:', category);
        console.log('Hashtag:', hashtag);

        if (videoId) {
            renderVideoPage(videoId);
        } else {
            renderVideoGrid(page, category, hashtag);
            renderCategories();
            renderHashtags();
            renderPagination(page, category, hashtag);
        }
    }

    function renderVideoGrid(page, category, hashtag) {
        videoGrid.classList.remove('hidden');
        videoPage.classList.add('hidden');
        let filteredVideos = videos;
        if (category) {
            filteredVideos = videos.filter(v => v.category === category);
        } else if (hashtag) {
            filteredVideos = videos.filter(v => v.hashtags.includes(hashtag));
        }
        const start = (page - 1) * videosPerPage;
        const end = start + videosPerPage;
        const paginatedVideos = filteredVideos.slice(start, end);
        videoGrid.innerHTML = '';
        paginatedVideos.forEach(video => {
            const videoItem = document.createElement('div');
            videoItem.className = 'video-item rounded-lg shadow-md overflow-hidden';
            videoItem.innerHTML = `
                <a href="?video=${video.id}">
                    <img src="${video.thumbnail}" alt="${video.title}" class="w-full h-48 object-cover">
                    <div class="p-4">
                        <h3 class="text-lg font-semibold text-white">${video.title}</h3>
                        <p class="text-gray-400">${video.views} views</p>
                    </div>
                </a>
            `;
            videoGrid.appendChild(videoItem);
        });
        console.log('Videos displayed:', paginatedVideos.length);
    }

    function renderVideoPage(videoId) {
        videoGrid.classList.add('hidden');
        videoPage.classList.remove('hidden');
        const video = videos.find(v => v.id === parseInt(videoId));
        if (!video) {
            videoPlayer.innerHTML = '<p class="text-white">Video not found</p>';
            return;
        }
        videoPlayer.innerHTML = `
            <h2 class="text-2xl font-bold mb-4 text-white">${video.title}</h2>
            <video controls class="w-full rounded-lg">
                <source src="${video.video_url}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <p class="mt-2 text-gray-400">${video.views} views</p>
            <p class="mt-2"><a href="https://t.me/exclusiveclips4" target="_blank" class="text-blue-400 hover:underline"><i class="fab fa-telegram mr-1"></i>Share on Telegram</a></p>
        `;
        const related = videos
            .filter(v => v.category === video.category && v.id !== video.id)
            .slice(0, 4);
        relatedVideos.innerHTML = '';
        related.forEach(relVideo => {
            const relatedItem = document.createElement('div');
            relatedItem.className = 'related-video rounded-lg shadow-md overflow-hidden';
            relatedItem.innerHTML = `
                <a href="?video=${relVideo.id}">
                    <img src="${relVideo.thumbnail}" alt="${relVideo.title}" class="w-full h-32 object-cover">
                    <div class="p-4">
                        <h3 class="text-md font-semibold text-white">${relVideo.title}</h3>
                        <p class="text-gray-400">${relVideo.views} views</p>
                    </div>
                </a>
            `;
            relatedVideos.appendChild(relatedItem);
        });
    }

    function renderCategories() {
        const categories = [...new Set(videos.map(v => v.category))];
        categoryLinks.innerHTML = '';
        categories.forEach(category => {
            const link = document.createElement('a');
            link.href = `?category=${category}`;
            link.className = 'bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700';
            link.textContent = category;
            categoryLinks.appendChild(link);
        });
    }

    function renderHashtags() {
        const hashtags = [...new Set(videos.flatMap(v => v.hashtags))];
        hashtagLinks.innerHTML = '';
        hashtags.forEach(hashtag => {
            const link = document.createElement('a');
            link.href = `?hashtag=${hashtag}`;
            link.className = 'bg-gray-600 text-white px-3 py-1 rounded-full hover:bg-gray-700';
            link.textContent = hashtag;
            hashtagLinks.appendChild(link);
        });
    }

    function renderPagination(page, category, hashtag) {
        let filteredVideos = videos;
        if (category) {
            filteredVideos = videos.filter(v => v.category === category);
        } else if (hashtag) {
            filteredVideos = videos.filter(v => v.hashtags.includes(hashtag));
        }
        const totalPages = Math.min(3, Math.ceil(filteredVideos.length / videosPerPage)); // Cap at 3 pages
        pagination.innerHTML = '';
        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Previous';
        prevBtn.className = 'bg-gray-900 text-white px-4 py-2 rounded disabled:opacity-50';
        prevBtn.disabled = page === 1;
        prevBtn.addEventListener('click', () => {
            if (page > 1) {
                const newPage = page - 1;
                window.location.search = `?page=${newPage}${category ? `&category=${category}` : ''}${hashtag ? `&hashtag=${hashtag}` : ''}`;
            }
        });
        pagination.appendChild(prevBtn);

        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next';
        nextBtn.className = 'bg-gray-900 text-white px-4 py-2 rounded disabled:opacity-50';
        nextBtn.disabled = page === totalPages;
        nextBtn.addEventListener('click', () => {
            if (page < totalPages) {
                const newPage = page + 1;
                window.location.search = `?page=${newPage}${category ? `&category=${category}` : ''}${hashtag ? `&hashtag=${hashtag}` : ''}`;
            }
        });
        pagination.appendChild(nextBtn);
    }

    // Handle browser back/forward navigation
    window.addEventListener('popstate', renderPage);
});