// 🔐 Cloud Database Credentials Linked via JSONBin.io
const BIN_ID = "6a1afbfbddf5aa59f7789c7d"; 
const API_KEY = "$2a$10$FBPDkOcsz5GcC1wlDAIl6./Xlrjg8ye0T.3/ngjJ/TR04RRMwa5qG"; 
const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

let APP_DATA = { settings: { siteName: "FreePorn", whatsappContact: "+2348131466173", adSnippet: "" }, videos: [] };

if (!localStorage.getItem('isAdult') && !window.location.href.includes('age-verify.html')) {
  window.location.href = 'age-verify.html';
}

async function fetchCloudData() {
  try {
    const res = await fetch(`${BIN_URL}/latest`, {
      headers: { "X-Master-Key": API_KEY }
    });
    if (!res.ok) throw new Error("Authentication failed or Bin not found");
    const json = await res.json();
    APP_DATA = json.record;

    const adSlot = document.getElementById('globalAdSlot');
    if (adSlot && APP_DATA.settings && APP_DATA.settings.adSnippet) {
      adSlot.innerHTML = APP_DATA.settings.adSnippet;
    }

    if (document.getElementById('mainVideoGrid')) {
      renderVideoGrid(APP_DATA.videos || []);
    } else if (window.location.href.includes('watch.html')) {
      initWatchPage();
    } else if (window.location.href.includes('admin.html')) {
      initAdminDashboard();
    }
  } catch (err) {
    console.error("Database connection failed:", err);
    if (window.location.href.includes('admin.html')) {
      alert("Database Connection Error. Please verify your JSONBin API Master Key setup.");
    }
  }
}

document.addEventListener('DOMContentLoaded', fetchCloudData);

function renderVideoGrid(videosToRender) {
  const grid = document.getElementById('mainVideoGrid');
  if (!grid) return;
  if (!videosToRender || videosToRender.length === 0) {
    grid.innerHTML = `<p style="color:var(--text-muted); text-align:center; grid-column:1/-1; padding:40px 0;">No videos uploaded yet. Go to Admin panel to add content.</p>`;
    return;
  }
  
  grid.innerHTML = videosToRender.map(v => {
    // Clever Check: If there's a custom thumbnail image, use it! Otherwise, fall back to the play icon badge.
    const imageCover = v.thumbnail 
      ? `<img src="${v.thumbnail}" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none';">`
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

  video.views = (video.views || 0) + 1;
  document.getElementById('videoElement').src = video.url;
  
  // Custom fix: Adds a poster image to the actual streaming video player container as well!
  if(video.thumbnail) {
    document.getElementById('videoElement').poster = video.thumbnail;
  }

  document.getElementById('videoTitle').innerText = video.title;
  document.getElementById('videoMetaStats').innerText = `${video.views} views • Category: ${video.category}`;

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
  document.getElementById('adTextarea').value = (APP_DATA.settings && APP_DATA.settings.adSnippet) ? APP_DATA.settings.adSnippet : '';

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
  const thumbnail = document.getElementById('vidThumb').value; // Grabs value
  const category = document.getElementById('vidCategory').value;

  if (!title || !url) return alert('Please complete all video file inputs.');
  if (!APP_DATA.videos) APP_DATA.videos = [];

  APP_DATA.videos.push({ id: "vid-" + Date.now(), title, url, thumbnail, category, views: 0 });
  await saveToCloud();
}

async function saveAdSettings() {
  if (!APP_DATA.settings) APP_DATA.settings = {};
  APP_DATA.settings.adSnippet = document.getElementById('adTextarea').value;
  await saveToCloud();
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
