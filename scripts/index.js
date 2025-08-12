import { getTopAnimes } from "../api/jikan.js";

const fetchBtn = document.getElementById("fetch-btn");
const listContainer = document.getElementById("anime-list-items");

fetchBtn.addEventListener("click", async () => {
    const animes = await getTopAnimes(10);
    listContainer.innerHTML = "";

    animes.forEach((anime) => {
        const li = document.createElement("li");
        li.innerHTML = `
                <strong>${anime.title}</strong><br>
                <img src="${anime.images.webp.large_image_url}" alt="${anime.title}" width="100"><br>
            `;
        listContainer.appendChild(li);
    });
});
