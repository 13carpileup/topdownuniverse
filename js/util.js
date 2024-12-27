export const createControlsPopup = () => {
    const popup = document.createElement('div');
    popup.className = 'controls-popup';
    popup.innerHTML = `
        <button class="close-button">×</button>
        <h2>Controls Guide</h2>
        <p><strong>Pan View:</strong> Click and drag on empty space</p>
        <p><strong>Create Object:</strong> Use sliders to set mass and radius, then click "Create". The newly created object will follow your mouse until you click.</p>
        <p><strong>Manipulate Objects:</strong> Click and drag objects to move them</p>
        <p><strong>Fling Objects:</strong> Drag quickly and release to give objects velocity</p>
        <p><strong>Grid Toggle:</strong> Click "Grid" to toggle gravitational field visualization</p>
        <p><strong>Speed Control:</strong> Adjust simulation speed using the speed slider</p>
        <p><strong>Tips:</strong></p>
        <ul>
            <li>Larger masses create stronger gravitational pulls</li>
            <li>Objects merge when they collide, combining their masses</li>
            <li>Try creating orbital systems by giving objects tangential velocity</li>
        </ul>
    `;
    return popup;
};

export const showControlsPopup = () => {
    const existingPopup = document.querySelector('.controls-popup');
    if (existingPopup) return;

    const popup = createControlsPopup();
    document.body.appendChild(popup);

    const closeButton = popup.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        popup.remove();
    });

    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            popup.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
};

export function handleResize(app, sliders, buttons) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    const bottomMargin = height * 0.1;
    const sliderWidth = Math.min(150, width * 0.15);
    const spacing = Math.min(50, width * 0.03);
    
    sliders[0].updatePosition(spacing, height - bottomMargin, sliderWidth);
    sliders[1].updatePosition(spacing * 2 + sliderWidth, height - bottomMargin, sliderWidth);
    sliders[2].updatePosition(spacing * 3 + sliderWidth * 2, height - bottomMargin, sliderWidth);
    
    buttons[0].updatePosition(spacing * 4 + sliderWidth * 3, height - bottomMargin);
    buttons[1].updatePosition(spacing * 5 + sliderWidth * 3 + 150, height - bottomMargin);
    buttons[2].updatePosition(spacing * 6 + sliderWidth * 3 + 300, height - bottomMargin);
}