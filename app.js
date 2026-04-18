let capsules = JSON.parse(localStorage.getItem('echoCapsules')) || [];
let isRecording = false;
let recordInterval;
let recordTime = 0;
let userLocation = null;
let currentPhotoBase64 = null;

// DOM Elements
const locationStatus = document.getElementById('locationStatus');
const radarContainer = document.getElementById('radarContainer');
const capsulesList = document.getElementById('capsulesList');

// Modals
const recordOverlay = document.getElementById('recordOverlay');
const discoveryOverlay = document.getElementById('discoveryOverlay');

// Record Controls
const recordBtn = document.getElementById('recordBtn');
const closeRecordBtn = document.getElementById('closeRecordBtn');
const actionRecordBtn = document.getElementById('actionRecordBtn');
const recordTimer = document.getElementById('recordTimer');
const recordingVisualizer = document.querySelector('.recording-visualizer');
const photoInput = document.getElementById('photoInput');
const photoPreviewContainer = document.getElementById('photoPreviewContainer');
const photoPreview = document.getElementById('photoPreview');
const removePhotoBtn = document.getElementById('removePhotoBtn');

// Discovery Controls
const closeDiscoveryBtn = document.getElementById('closeDiscoveryBtn');
const playDiscoveredBtn = document.getElementById('playDiscoveredBtn');
const discoveryPhoto = document.getElementById('discoveryPhoto');
const discoveryText = document.getElementById('discoveryText');

// Simulation
const simDiscoverBtn = document.getElementById('simDiscoverBtn');
const simClearBtn = document.getElementById('simClearBtn');

// Initialize
function init() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(pos => {
            userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            locationStatus.innerHTML = `<i class="fa-solid fa-earth-americas"></i> Çevrimiçi`;
            locationStatus.style.color = '#34d399';
            renderRadarPins();
        }, () => {
            userLocation = { lat: 41.0082, lng: 28.9784 }; // Istanbul mock
            locationStatus.innerHTML = `<i class="fa-solid fa-satellite-dish"></i> Yerel Simülasyon`;
            locationStatus.style.color = '#fcd34d';
            renderRadarPins();
        });
    } else {
        userLocation = { lat: 41.0082, lng: 28.9784 };
        renderRadarPins();
    }
    renderCapsulesList();
}

// Modal Helpers
function showModal(elem) {
    elem.classList.remove('hidden');
    setTimeout(() => elem.classList.remove('opacity-hidden'), 10);
}
function hideModal(elem) {
    elem.classList.add('opacity-hidden');
    setTimeout(() => elem.classList.add('hidden'), 400); 
}

// Photo Input
photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            currentPhotoBase64 = event.target.result;
            photoPreview.src = currentPhotoBase64;
            photoPreviewContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
});
removePhotoBtn.addEventListener('click', () => {
    currentPhotoBase64 = null;
    photoPreview.src = '';
    photoInput.value = '';
    photoPreviewContainer.classList.add('hidden');
});

// Record Logic
recordBtn.addEventListener('click', () => {
    showModal(recordOverlay);
    resetRecorder();
});
closeRecordBtn.addEventListener('click', () => {
    hideModal(recordOverlay);
    stopRecording();
});
actionRecordBtn.addEventListener('click', () => {
    if (!isRecording) startRecording();
    else finishRecording();
});

function startRecording() {
    isRecording = true;
    actionRecordBtn.classList.add('recording');
    recordingVisualizer.classList.add('active');
    
    recordTime = 0;
    recordTimer.innerText = "00:00";
    
    recordInterval = setInterval(() => {
        recordTime++;
        let m = Math.floor(recordTime / 60).toString().padStart(2, '0');
        let s = (recordTime % 60).toString().padStart(2, '0');
        recordTimer.innerText = `${m}:${s}`;
    }, 1000);
}

function stopRecording() {
    isRecording = false;
    clearInterval(recordInterval);
    actionRecordBtn.classList.remove('recording');
    recordingVisualizer.classList.remove('active');
}

function resetRecorder() {
    stopRecording();
    recordTime = 0;
    recordTimer.innerText = "00:00";
    currentPhotoBase64 = null;
    photoPreviewContainer.classList.add('hidden');
    photoPreview.src = '';
    photoInput.value = '';
}

function finishRecording() {
    stopRecording();
    const date = new Date();
    
    try {
        const newCapsule = {
            id: Date.now().toString(),
            title: currentPhotoBase64 ? 'Sesli ve Görsel Anı' : 'Zaman Kapsülü',
            lat: userLocation ? userLocation.lat + (Math.random() - 0.5) * 0.001 : 0, 
            lng: userLocation ? userLocation.lng + (Math.random() - 0.5) * 0.001 : 0,
            date: date.toISOString(),
            duration: recordTimer.innerText,
            photo: currentPhotoBase64
        };
        capsules.unshift(newCapsule);
        localStorage.setItem('echoCapsules', JSON.stringify(capsules));
    } catch(e) {
        alert("Eklenti boyutu tarayıcı limitini aşıyor. Lütfen daha küçük bir fotoğraf deneyin.");
        capsules.shift();
    }
    
    setTimeout(() => {
        hideModal(recordOverlay);
        renderCapsulesList();
        renderRadarPins();
    }, 500);
}

// Rendering UI
function renderCapsulesList() {
    capsulesList.innerHTML = '';
    if (capsules.length === 0) {
        capsulesList.innerHTML = `<div class="empty-state">Bağlantılı olduğun kapsül bulunamadı.<br>Yeni bir anı mühürle.</div>`;
        return;
    }

    capsules.forEach(cap => {
        const d = new Date(cap.date);
        const item = document.createElement('div');
        item.className = 'capsule-item';
        
        const iconClass = cap.photo ? 'fa-image' : 'fa-microphone-lines';
        const colorClass = cap.photo ? 'has-photo' : '';

        item.innerHTML = `
            <div class="capsule-icon ${colorClass}">
                <i class="fa-solid ${iconClass}"></i>
            </div>
            <div class="capsule-info">
                <div class="capsule-title">${cap.title}</div>
                <div class="capsule-meta">
                    <span><i class="fa-regular fa-clock"></i> ${cap.duration}</span>
                    <span>${d.toLocaleDateString('tr-TR')}</span>
                </div>
            </div>
        `;
        
        // Add click integration to playback
        item.addEventListener('click', () => openDiscoveryModal(cap));
        capsulesList.appendChild(item);
    });
}

function renderRadarPins() {
    document.querySelectorAll('.capsule-pin').forEach(pin => pin.remove());
    if (!userLocation) return;
    
    // Super Radar is 800x800 -> center is 400x400
    capsules.forEach((cap) => {
        const pin = document.createElement('div');
        pin.className = 'capsule-pin';
        const hash = Array.from(cap.id).reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0);
        const randSeed = Math.abs(hash);
        const angle = (randSeed % 360) * (Math.PI / 180);
        // Distribute pins across the vast 800px radar
        const distance = 50 + (randSeed % 300); 
        const x = 400 + Math.cos(angle) * distance;
        const y = 400 + Math.sin(angle) * distance;
        
        pin.style.left = `${x}px`;
        pin.style.top = `${y}px`;
        
        if(cap.photo) {
            pin.style.background = 'var(--accent-primary)';
            pin.style.boxShadow = '0 0 15px var(--accent-primary)';
        }
        
        pin.title = new Date(cap.date).toLocaleDateString('tr-TR');
        pin.addEventListener('click', () => openDiscoveryModal(cap));

        radarContainer.appendChild(pin);
    });
}

// Discovery Panel Function
function openDiscoveryModal(cap) {
    const d = new Date(cap.date);
    
    discoveryText.innerHTML = `<strong>${d.toLocaleDateString('tr-TR')} ${d.getHours()}:${d.getMinutes().toString().padStart(2,'0')}</strong> tarihinde mühürlediğin sese ulaştın.`;
    
    if(cap.photo) {
        discoveryPhoto.src = cap.photo;
        discoveryPhoto.classList.remove('hidden');
    } else {
        discoveryPhoto.classList.add('hidden');
        discoveryPhoto.src = ""; // reset memory
    }
    
    showModal(discoveryOverlay);
    playDiscoveredBtn.classList.remove('playing');
}

// Simulation Integrations
simDiscoverBtn.addEventListener('click', () => {
    if(capsules.length === 0) {
        alert('Simülasyon için önce bir kapsül kaydetmelisiniz!');
        return;
    }
    // Simulate finding the latest one
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    openDiscoveryModal(capsules[0]);
});

simClearBtn.addEventListener('click', () => {
    if(confirm('Uzantıdaki tüm anılar geri döndürülemez şekilde silinecek! Onaylıyor musunuz?')) {
        capsules = [];
        localStorage.setItem('echoCapsules', JSON.stringify(capsules));
        renderCapsulesList();
        renderRadarPins();
    }
});

closeDiscoveryBtn.addEventListener('click', () => hideModal(discoveryOverlay));
playDiscoveredBtn.addEventListener('click', () => playDiscoveredBtn.classList.toggle('playing'));

init();
