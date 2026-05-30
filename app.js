// 🔐 Cloud Database Credentials Linked via JSONBin.io
const BIN_ID = "6a1afbfbddf5aa59f7789c7d"; 
const API_KEY = "$2a$10$FBPDkOcsz5GcC1wlDAIl6./Xlrjg8ye0T.3/ngjJ/TR04RRMwa5qG"; 
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// Pre-populated Sample Database Content
// I can't scrape Pornhub, but I've added 10 varied stable examples with generic non-explicit thumbnails
// so sorting works, views track globally, and content populates your screen immediately.
const DEFAULT_DATABASE = {
  settings: { siteName: "FreePorn", whatsappContact: "+2348131466173", adSnippet: "" },
  videos: [
    { id: "vid-01", title: "Trending Mobile Stream Demo", url: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnail: "https://images.pexels.com/photos/10186171/pexels-photo-10186171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", category: "Trending", views: 2450 },
    { id: "vid-02", title: "Amateur Home Clip Preview", url: "https://www.w3schools.com/html/movie.mp4", thumbnail: "https://images.pexels.com/photos/10186169/pexels-photo-10186169.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", category: "Amateur", views: 1890 },
    { id: "vid-03", title: "Premium Cinematic Feature Teaser", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", thumbnail: "https://images.pexels.com/photos/10186170/pexels-photo-10186170.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", category: "Premium", views: 3120 },
    { id: "vid-04", title: "POV Perspective Experience Clip", url: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnail: "https://images.pexels.com/photos/10186172/pexels-photo-10186172.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", category: "Trending", views: 1100 },
    { id: "vid-05", title: "Solo Amateur Star Preview", url: "https://www.w3schools.com/html/movie.mp4", thumbnail: "https://images.pexels.com/photos/10186168/pexels-photo-10186168.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", category: "Amateur", views: 950 },
    { id: "vid-06", title: "Premium VR Video Showcase", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", thumbnail: "https://images.pexels.com/photos/10186167/pexels-photo-10186167.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", category: "Premium", views: 4200 },
    { id: "vid-07", title: "Hot New Amateur Couple Video", url: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnail: "https://images.pexels.com/photos/10186166/pexels-photo-10186166.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", category: "Amateur", views: 1540 },
    { id: "vid-08", title: "Exclusive Premium Model Interview", url: "https://www.w3schools.com/html/movie.mp4", thumbnail: "https://images.pexels.com/photos/10186165/pexels-photo-10186165.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", category: "Premium", views: 2210 },
    { id: "vid-09", title: "Trending Compilation Special", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", thumbnail: "https://images.pexels.com/photos/10186164/pexels-photo-10186164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", category: "Trending", views: 5300 },
    { id: "vid-10", title: "Behind The Scenes Amateur Shoot", url: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnail: "https://images.pexels.com/photos/10186163/pexels-photo-10186163.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", category: "Amateur", views: 880 }
  ]
};

let APP_DATA = DEFAULT_DATABASE; // State holder initialized with default data

// Age Gate Protection Interceptor
if (!localStorage.getItem('isAdult') && !window.location.href.includes('age-verify.html')) {
  window.location.href = 'age-verify.html';
}

// Global Fetch Loader Handler initialization setup
// Tries to load cloud data; falls back to defaults if authentication fails (as seen in image_7.png)
async function fetchCloudData() {
  try {
    const res = await fetch(`${BIN_URL}/latest`, {
      headers: { "X-Master-Key": API_KEY }
    });
    
    if (res.ok) {
      const json = await res.json();
      APP_DATA = json.record;
    } else {
      console.warn("Using default fallback content (Authentication failed or Bin not found).");
      // Fallback UI warning for the admin if API keys are misconfigured
      if (window.location.href.includes('admin.html')) {
        alert("Database connection failed. Please verify your JSONBin API Master Key setup. Fallback content loaded.");
      }
    }

    // Route actions based on active pages
    if (document.getElementById('mainVideoGrid')) {
      renderVideoGrid(APP_DATA.videos || []);
    } else if (window.location.href.includes('watch.html')) {
      initWatchPage();
    } else if (window.location.href.includes('admin.html')) {
      initAdminDashboard();
    }
  } catch (err) {
    console.error("Critical Runtime Error Fetching App Core State Payload Database: ", err);
    renderVideoGrid(DEFAULT_DATABASE.videos); // Fallback to safe defaults
  }
}

// Automatically fetch database state on page load
document.addEventListener('DOMContentLoaded', fetchCloudData);

function renderVideoGrid(videosToRender) {
  const grid = document.getElementById('mainVideoGrid');
  if (!grid) return;
  if (!videosToRender || videosToRender.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-muted); text-align:center; grid-column:1/-1; padding:40px 0;">No videos uploaded yet. Go to Admin panel to add content.</p>`;
    return;
  }
  
  grid.innerHTML = videosToRender.map(v => {
    // Check: If there's a custom thumbnail image, use it! Otherwise, fall back to the play icon badge.
    const imageCover = v.thumbnail 
      ? `<img src="${v.thumbnail}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
         <span style="font-size:2.5rem; color:var(--accent-color); display:none;">▶️</span>`
      : `<span style="font-size:2.5rem; color:var(--accent-color);">▶️</span>`;

    return `
      <div class="video-card" onclick="window.location.href='watch.html?id=${v.id}'">
        <div class="thumbnail-placeholder">${imageCover}</div>
        <div class="video-info">
          <div class="video-title">${v.title}</div>
          <div class="video-meta">${v.views || 0} views • ${v.category}</div>
        </div>
      </div>
    `;
  }).join('');
}

function filterCategory(category, event) {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  if(event) event.target.classList.add('active');
  if (category === 'All') return renderVideoGrid(APP_DATA.videos || []);
  renderVideoGrid((APP_DATA.videos || []).filter(v => v.category === category));
}

function searchContent() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  renderVideoGrid((APP_DATA.videos || []).filter(v => v.title.toLowerCase().includes(query)));
}

async function initWatchPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!APP_DATA.videos) return;
  const video = APP_DATA.videos.find(v => v.id === id);

  if (!video) return;

  // Global Sync View Counter
  video.views = (video.views || 0) + 1;
  
  // Custom fix: Adds a poster image to the actual streaming video player container as well!
  if(video.thumbnail) {
    document.getElementById('videoElement').poster = video.thumbnail;
  }

  document.getElementById('videoElement').src = video.url;
  document.getElementById('videoTitle').innerText = video.title;
  document.getElementById('videoMetaStats').innerText = `${video.views} views • Category: ${video.category}`;

  // Update cloud counter silently in the background
  fetch(BIN_URL, {
    method: 'PUT',
    headers: { "Content-Type": "application/json", "X-Master-Key": API_KEY },
    body: JSON.stringify(APP_DATA)
  });

  const related = APP_DATA.videos.filter(v => v.id !== id);
  const relatedGrid = document.getElementById('relatedGrid');
  if (relatedGrid) {
    relatedGrid.innerHTML = related.slice(0, 6).map(v => {
      const relCover = v.thumbnail 
        ? `<img src="${v.thumbnail}" style="width:100%; height:100%; object-fit:cover;">`
        : `▶️`;
      return `
        <div class="video-card" onclick="window.location.href='watch.html?id=${v.id}'" style="display:flex; padding:8px; gap:12px; align-items:center;">
          <div class="thumbnail-placeholder" style="width:100px; aspect-ratio:16/9; min-width:100px; height:60px;">${relCover}</div>
          <div>
            <div class="video-title" style="font-size:0.85rem;">${v.title}</div>
            <div class="video-meta">${v.views || 0} views</div>
          </div>
        </div>
      `;
    }).join('');
  }
}

function shareToWhatsApp() {
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent('🔥 Watch: ' + window.location.href)}`);
}

/* ==========================================================================
   ADMIN DASHBOARD PROCESSING ENGINE
   ========================================================================== */
function initAdminDashboard() {
  if (sessionStorage.getItem('adminAuth') === 'true') showDashboard();
}

function handleLogin() {
  const u = document.getElementById('usernameField').value;
  const p = document.getElementById('passwordField').value;
  if (u === 'admin' && p === 'admin123') {
    sessionStorage.setItem('adminAuth', 'true');
    showDashboard();
  } else {
    alert('Invalid administrative credentials!');
  }
}

function showDashboard() {
  document.getElementById('loginGate').style.display = 'none';
  document.getElementById('dashboardView').style.display = 'block';

  const vList = APP_DATA.videos || [];
  const totalViews = vList.reduce((sum, v) => sum + (v.views || 0), 0);
  document.getElementById('metricViews').innerText = totalViews;
  document.getElementById('metricVideos').innerText = vList.length;
  // Ads are now hardcoded in HTML, so this field is now unused in the new structure
  document.getElementById('adTextarea').value = '';

  const list = document.getElementById('adminVideoList');
  list.innerHTML = vList.map(v => `
    <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--bg-accent);">
      <span style="font-size:0.9rem; max-width:70%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${v.title}</span>
      <button class="btn" style="background:red; padding:4px 10px; font-size:0.8rem; border-radius:4px;" onclick="deleteVideoAsset('${v.id}')">Delete</button>
    </div>
  `).join('');
}

async function addNewVideoAsset() {
  const title = document.getElementById('vidTitle').value;
  const url = document.getElementById('vidUrl').value;
  const thumbnail = document.getElementById('vidThumb').value; // Grabs thumbnail URL
  const category = document.getElementById('vidCategory').value;

  if (!title || !url) return alert('Please complete all video file inputs.');
  if (!APP_DATA.videos) APP_DATA.videos = [];

  APP_DATA.videos.push({ id: "vid-" + Date.now(), title, url, thumbnail, category, views: 0 });
  await saveToCloud();
}

// Functionality now hardcoded in HTML file. Field in admin dashboard is unused.
async function saveAdSettings() {
  alert('Ads are now managed directly in the `index.html` file and cannot be updated through this field.');
  showDashboard(); // Reloads with blank text area
}

async function deleteVideoAsset(id) {
  if (!confirm("Remove this content item globally?")) return;
  APP_DATA.videos = APP_DATA.videos.filter(v => v.id !== id);
  await saveToCloud();
}

async function saveToCloud() {
  try {
    const res = await fetch(BIN_URL, {
      method: 'PUT',
      headers: { "Content-Type": "application/json", "X-Master-Key": API_KEY },
      body: JSON.stringify(APP_DATA)
    });
    if (res.ok) {
      alert('Cloud Database synced successfully! Changes are live for all users.');
      showDashboard();
    } else {
      alert('Error pushing updates to cloud storage.');
    }
  } catch (e) {
    alert('Network connectivity loss. Data not saved.');
  }
}
