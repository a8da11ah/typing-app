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



const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Get first touch or mouse pointer
const getPointer = (e) => {
    const touch = e.touches?.[0];
    return {
        x: touch ? touch.clientX : e.clientX,
        y: touch ? touch.clientY : e.clientY,
    };
};

// Check if a percentage is within any [start, end] range
const inRange = (val, [start, end]) => val >= start && val <= end;

const moveBox = (e) => {
    if (!isDragging) return;

    const { x, y } = getPointer(e);
    let targetX = x - offsetX;
    let targetY = y - offsetY;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const minPanelWidth = screenWidth * 0.2;

    const percentX = (targetX / window.innerWidth) * 100;
    const stickyRanges = [[25, 30], [70, 75]];
    const isSticky = stickyRanges.some(r => inRange(percentX, r));

    // Toggle visual classes
    box.classList.toggle('sticky-zone', isSticky);
    box.classList.toggle('glow', isSticky);

    // Apply damping when active and in sticky zone
    if (active && isSticky) {
        targetX = box.offsetLeft + (targetX - box.offsetLeft) * 0.3;
    }

    // Clamp to viewport
    const maxY = screenHeight - box.offsetHeight;
    if (active) {
        const minLeft = minPanelWidth - box.offsetWidth / 2;
        const maxLeft = screenWidth - minPanelWidth - box.offsetWidth / 2;
        targetX = clamp(targetX, minLeft, maxLeft);
    } else {
        const maxX = screenWidth - box.offsetWidth;
        targetX = clamp(targetX, 0, maxX);
    }

    targetY = clamp(targetY, 0, maxY);


    box.style.left = `${targetX}px`;
    box.style.top = `${targetY}px`;

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


        const minPanelWidth = screenWidth * 0.2;
        const minLeft = minPanelWidth - boxWidth / 2;
        const maxLeft = screenWidth - minPanelWidth - boxWidth / 2;
        const boxLeft = parseFloat(box.style.left) || 0;
        if (boxLeft < minLeft) {
            box.style.left = `${minLeft}px`;
        } else if (boxLeft > maxLeft) {
            box.style.left = `${maxLeft}px`;
        }

        panel.classList.remove('hidden');
        if (leftPercent <= 30) {
            panel.style.left = '0';
            panel.style.right = 'auto';
            const width = Math.max( currentCenter, minPanelWidth);
            panel.style.width = `${width}px`;
            // panel.style.width = `${currentCenter}px`;
            panelContent.className = 'p-4 text-left';

        } else if (leftPercent >= 70) {
            panel.style.left = 'auto';
            panel.style.right = '0';
            const width = Math.max(screenWidth - currentCenter, minPanelWidth);
            panel.style.width = `${width}px`;
            // panel.style.width = `${screenWidth - currentCenter}px`;
            panelContent.className = 'p-4 text-right';

        } else {
            panel.classList.add('hidden');
        }
    } else {
        panel.classList.add('hidden');
    }
}
