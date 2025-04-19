document.addEventListener('DOMContentLoaded', () => {
    console.log("Theme script loaded");

    const themeToggleButton = document.getElementById('theme-toggle');
    console.log("Theme toggle button:", themeToggleButton);
    if (!themeToggleButton) {
        console.error("Theme toggle button not found");
        return;
    }
    const themeIcon = themeToggleButton.querySelector('i');
    const currentTheme = localStorage.getItem('theme') || 'dark'; // Default to dark theme

    console.log("Current theme:", currentTheme);
    // Set initial theme and icon
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggleButton.addEventListener('click', () => {
        console.log("Theme toggle button clicked");
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }
});
