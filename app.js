let colors = [];
let colorScheme = 'analogous';
let deferredPrompt;
const addBtn = document.createElement('button');
addBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstall');
    e.preventDefault();
    deferredPrompt = e;
    addBtn.style.display = 'block';

    addBtn.addEventListener('click', () => {
        addBtn.style.display = 'none';
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
    });
});

function showInstallPromotion() {
    addBtn.textContent = 'Add Color Generator to Home Screen';
    addBtn.classList.add('install-button');
    document.querySelector('.container').appendChild(addBtn);
}

const colorPalette = document.querySelector('.color-palette');
const dropdownButton = document.getElementById('dropdownButton');
const dropdownContent = document.getElementById('dropdownContent');
const generateButton = document.getElementById('generateButton');

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function generateColors() {
    const baseHue = Math.floor(Math.random() * 360);
    let newColors;

    switch (colorScheme) {
        case 'analogous':
            newColors = [0, 30, 60, 90, 120].map(offset => 
                hslToHex((baseHue + offset) % 360, 70, 60)
            );
            break;
        case 'complementary':
            newColors = [0, 0, 0, 180, 180].map((offset, index) => 
                hslToHex((baseHue + offset) % 360, 70, 60 + (index % 3) * 10)
            );
            break;
        case 'monochromatic':
            newColors = [30, 45, 60, 75, 90].map(lightness => 
                hslToHex(baseHue, 70, lightness)
            );
            break;
        default:
            newColors = Array.from({ length: 5 }, () => 
                '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
            );
    }
    colors = newColors;
    renderColors();
}

function renderColors() {
    colorPalette.innerHTML = '';
    colors.forEach((color, index) => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color;
        swatch.innerHTML = `
            <span class="color-value" style="color: ${index > 2 ? 'white' : 'black'}">${color.toUpperCase()}</span>
            <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: ${index > 2 ? 'white' : 'black'}">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <div class="copied-tooltip">Copied!</div>
        `;
        swatch.addEventListener('click', () => copyToClipboard(color, swatch));
        colorPalette.appendChild(swatch);
    });
}

function copyToClipboard(color, swatch) {
    navigator.clipboard.writeText(color).then(() => {
        swatch.classList.add('copied');
        setTimeout(() => swatch.classList.remove('copied'), 1500);
    });
}

function toggleDropdown() {
    const isOpen = dropdownContent.style.display === 'block';
    dropdownContent.style.display = isOpen ? 'none' : 'block';
    dropdownButton.parentElement.classList.toggle('open', !isOpen);
}

function updateDropdownButtonText(text) {
    const span = dropdownButton.querySelector('span');
    if (span) {
        span.textContent = text;
    } else {
        console.error('Span element not found in dropdown button');
    }
}

dropdownButton.addEventListener('click', toggleDropdown);

dropdownContent.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        colorScheme = event.target.dataset.scheme;
        updateDropdownButtonText(event.target.textContent);
        toggleDropdown();
        generateColors();
    }
});

generateButton.addEventListener('click', generateColors);

document.addEventListener('click', (event) => {
    if (!dropdownButton.contains(event.target) && !dropdownContent.contains(event.target)) {
        dropdownContent.style.display = 'none';
        dropdownButton.parentElement.classList.remove('open');
    }
});

document.addEventListener('DOMContentLoaded', generateColors);