// Default initial content structure fallback
const DEFAULT_DATABASE = {
  settings: {
    siteName: "FreePorn",
    whatsappContact: "+2348131466173",
    adSnippet: `<div style="text-align:center; color:#ff3e6c; font-weight:bold; padding:10px; background:#1f1f2e; border-radius:8px;">🔥 PREMIUM MOBILE STREAMING LIVE NOW 🔥</div>`
  },
  videos: [
    {
      id: "vid-001",
      title: "Welcome to Premium Mobile Video Streaming Demo",
      url: "https://www.w3schools.com/html/mov_bbb.mp4", 
      category: "Trending",
      views: 1420
    }
  ]
};

// Initialize or pull data state seamlessly
if (!localStorage.getItem('freeporn_cloud_db')) {
  localStorage.setItem('freeporn_cloud_db', JSON.stringify(DEFAULT_DATABASE));
}
let APP_DATA = JSON.parse(localStorage.getItem('freeporn_cloud_db'));

// Age Gate Interceptor Protection
if (!localStorage.getItem('isAdult') && !window.location.href.includes('age-verify.html')) {
  window.location.href = 'age-verify.html';
}

// Lifecycle Initialization Routing 
document.addEventListener('DOMContentLoaded', () => {
  const adSlot = document.getElementById('globalAdSlot');
  if (adSlot && APP_DATA.settings.adSnippet) {
    adSlot.innerHTML = APP_DATA.settings.adSnippet;
  }

  if (document.getElementById('mainVideoGrid')) {
    renderVideoGrid(APP_DATA.videos);
  } else if (window.location.href.includes('watch.html')) {
    initWatchPage();
  } else if (window.location.href.includes('admin.html')) {
    initAdminDashboard();
  }
});

function renderVideoGrid(videosToRender) {
  const grid = document.getElementById('mainVideoGrid');
  if (!grid) return;

  grid.innerHTML = videosToRender.map(v => `
    <div class="video-card" onclick="window.location.href='watch.html?id=${v.id}'">
      <div class="thumbnail-placeholder">
        <span style="font-size:2.5rem; color:var(--accent-color);">▶️</span>
      </div>
      <div class="video-info">
        <div class="video-title">${v.title}</div>
        <div class="video-meta">${v.views || 0} views • ${v.category}</div>
      </div>
    </div>
  `).join('');
}

function filterCategory(category, event) {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  if(event) event.target.classList.add('active');
  if (category === 'All') return renderVideoGrid(APP_DATA.videos);
  renderVideoGrid(APP_DATA.videos.filter(v => v.category === category));
}

function searchContent() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  renderVideoGrid(APP_DATA.videos.filter(v => v.title.toLowerCase().includes(query)));
}

function initWatchPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const video = APP_DATA.videos.find(v => v.id === id);

  if (!video) return;

  // Increment live views locally
  video.views = (video.views || 0) + 1;
  localStorage.setItem('freeporn_cloud_db', JSON.stringify(APP_DATA));

  document.getElementById('videoElement').src = video.url;
  document.getElementById('videoTitle').innerText = video.title;
  document.getElementById('videoMetaStats').innerText = `${video.views} views • Category: ${video.category}`;

  const related = APP_DATA.videos.filter(v => v.id !== id);
  const relatedGrid = document.getElementById('relatedGrid');
  if (relatedGrid) {
    relatedGrid.innerHTML = related.map(v => `
      <div class="video-card" onclick="window.location.href='watch.html?id=${v.id}'" style="display:flex; padding:8px; gap:12px; align-items:center;">
        <div class="thumbnail-placeholder" style="width:100px; aspect-ratio:16/9; min-width:100px; height:60px;">▶️</div>
        <div>
          <div class="video-title" style="font-size:0.85rem;">${v.title}</div>
          <div class="video-meta">${v.views || 0} views</div>
        </div>
      </div>
    `).join('');
  }
}

function shareToWhatsApp() {
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent('🔥 Watch: ' + window.location.href)}`);
}

/* ==========================================================================
   ADMIN PANEL FUNCTIONALITY
   ========================================================================== */
function initAdminDashboard() {
  if (sessionStorage.getItem('adminAuth') === 'true') {
    showDashboard();
  }
}

function handleLogin() {
  const u = document.getElementById('usernameField').value;
  const p = document.getElementById('passwordField').value;
  
  // Set your desired panel login details here
  if (u === 'admin' && p === 'admin123') {
    sessionStorage.setItem('adminAuth', 'true');
    showDashboard();
  } else {
    alert('Invalid credentials!');
  }
}

function showDashboard() {
  document.getElementById('loginGate').style.display = 'none';
  document.getElementById('dashboardView').style.display = 'block';

  // Calculate stats values
  const totalViews = APP_DATA.videos.reduce((sum, v) => sum + (v.views || 0), 0);
  document.getElementById('metricViews').innerText = totalViews;
  document.getElementById('metricVideos').innerText = APP_DATA.videos.length;
  document.getElementById('adTextarea').value = APP_DATA.settings.adSnippet || '';

  const list = document.getElementById('adminVideoList');
  list.innerHTML = APP_DATA.videos.map(v => `
    <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--bg-accent);">
      <span>${v.title} (${v.category})</span>
      <button class="btn" style="background:red; padding:4px 10px; font-size:0.8rem;" onclick="deleteVideoAsset('${v.id}')">Delete</button>
    </div>
  `).join('');
}

function addNewVideoAsset() {
  const title = document.getElementById('vidTitle').value;
  const url = document.getElementById('vidUrl').value;
  const category = document.getElementById('vidCategory').value;

  if (!title || !url) return alert('Please enter all content data info fields.');

  const newVideo = { id: "vid-" + Date.now(), title, url, category, views: 0 };
  APP_DATA.videos.push(newVideo);
  
  saveToDatabase();
}

function saveAdSettings() {
  APP_DATA.settings.adSnippet = document.getElementById('adTextarea').value;
  saveToDatabase();
}

function deleteVideoAsset(id) {
  if (!confirm("Remove this item?")) return;
  APP_DATA.videos = APP_DATA.videos.filter(v => v.id !== id);
  saveToDatabase();
}

function saveToDatabase() {
  localStorage.setItem('freeporn_cloud_db', JSON.stringify(APP_DATA));
  alert('Content updated successfully on this site instance!');
  showDashboard();
}
