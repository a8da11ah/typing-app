const box = document.getElementById('draggable');
const header = document.getElementById('header');
const panel = document.getElementById('side-panel');
const panelContent = document.getElementById('panel-content');
const icon = header.querySelector('.fa-cog');

let isDragging = false;
let offsetX = 0;
let offsetY = 0;
let startX = 0;
let startY = 0;

let active = false;

// Event listeners for mouse and touch events to ensure mobile support

const startDrag = (e) => {
    isDragging = true;
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    offsetX = clientX - box.offsetLeft;
    offsetY = clientY - box.offsetTop;
    startX = clientX;
    startY = clientY;
};



const moveBox = (e) => {
    if (!isDragging) return;

    // Get real pointer, avoiding falsey-0 fallback
    const { clientX, clientY } = e.touches?.[0] ?? e;

    let targetX = clientX - offsetX;
    let targetY = clientY - offsetY;

    const dragPercent = (targetX / window.innerWidth) * 100;
    // console.log(`Drag Percent: ${dragPercent.toFixed(1)}%`);

    if (active) {
        const isSticky = (dragPercent >= 25 && dragPercent <= 30) ||
            (dragPercent >= 70 && dragPercent <= 75);

        // class toggles
        box.classList.toggle('sticky-zone', isSticky);
        box.classList.toggle('glow',         isSticky);

        // wiggle (CSS‑class approach recommended!)
        box.style.transform = isSticky
            ? `translate(${Math.sin(Date.now()/50)*2}px, 0)`
            : '';

        // damping
        if (isSticky) {
            targetX = box.offsetLeft + (targetX - box.offsetLeft) * 0.3;
        }
    }

    // clamp into viewport
    const maxX = window.innerWidth  - box.offsetWidth;
    const maxY = window.innerHeight - box.offsetHeight;
    targetX = Math.min(Math.max(targetX, 0), maxX);
    targetY = Math.min(Math.max(targetY, 0), maxY);

    box.style.left = `${targetX}px`;
    box.style.top  = `${targetY}px`;

    updatePanelVisibility();
};




const stopDrag = (e) => {
    if (!isDragging) return;
    isDragging = false;

    const clientX = e.clientX || e.changedTouches[0].clientX;
    const clientY = e.clientY || e.changedTouches[0].clientY;
    const dx = Math.abs(clientX - startX);
    const dy = Math.abs(clientY - startY);

    if (dx < 10 && dy < 10) { // Click detected
        console.log('Click detected');
        active = !active;
        updatePanelVisibility();
        icon.classList.toggle("active");
    }
};



// Mouse and touch events for drag behavior
header.addEventListener('mousedown', startDrag);
header.addEventListener('touchstart', startDrag);

document.addEventListener('mousemove', moveBox);
document.addEventListener('touchmove', moveBox);

document.addEventListener('mouseup', stopDrag);
document.addEventListener('touchend', stopDrag);

document.addEventListener('touchcancel', stopDrag);

// Click event for toggling settings panel
header.addEventListener('click', (e) => {
    e.stopPropagation();
    if (icon) {
        icon.classList.add('spin');
        setTimeout(() => icon.classList.remove('spin'), 400); // spin once
    }
});

window.addEventListener('resize', () => {
    updatePanelVisibility();
});

function updatePanelVisibility() {
    if (!box || !panel) return;

    const screenWidth = window.innerWidth;
    const boxWidth = box.offsetWidth;
    const currentLeft = parseFloat(box.style.left) || 0;
    const currentCenter = currentLeft + (boxWidth / 2);
    const centerPercent = (currentCenter / screenWidth) * 100;
    const leftPercent = (currentLeft / screenWidth) * 100;
    if (active) {
        panel.classList.remove('hidden');
        if (leftPercent <= 30) {
            panel.style.left = '0';
            panel.style.right = 'auto';
            panel.style.width = `${currentCenter}px`;
            panelContent.className = 'p-4 text-left';
            // panelContent.innerHTML = `
            //     <h2 class="font-bold text-lg mb-2">Settings (English)</h2>
            //     <p class="mb-2">Hello from the left side panel!</p>
            //     <button class="px-4 py-2 bg-blue-500 text-white rounded">Click me</button>
            // `;
        } else if (leftPercent >= 70) {
            panel.style.left = 'auto';
            panel.style.right = '0';
            panel.style.width = `${screenWidth - currentCenter}px`;
            panelContent.className = 'p-4 text-right';
            // panelContent.innerHTML = `
            //     <h2 class="font-bold text-lg mb-2" dir="rtl">الإعدادات</h2>
            //     <p class="mb-2" dir="rtl">مرحبًا من الجهة اليمنى!</p>
            //     <button class="px-4 py-2 bg-green-500 text-white rounded">نفّذ شيئًا</button>
            // `;
        } else {
            panel.classList.add('hidden');
        }
    } else {
        panel.classList.add('hidden');
    }
}
