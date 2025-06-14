// effects.js
document.addEventListener("DOMContentLoaded", () => {
    const tiles = document.querySelectorAll('.tile');

    tiles.forEach((tile, index) => {
        const direction = index % 2 === 0 ? "-100px" : "100px"; // Чередование сторон
        tile.style.transform = `translateX(${direction})`;
        tile.style.opacity = "0";
        tile.style.transition = "transform 0.6s ease, opacity 0.6s ease";

        setTimeout(() => {
            tile.style.transform = "translateX(0)";
            tile.style.opacity = "1";
        }, 200 * index); // волна
    });
});
