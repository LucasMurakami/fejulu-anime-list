import { getAnimeCategories } from "../api/jikan.js";
import { renderAnimesCategories, renderEmpty } from "./utils.js";

async function loadAnimeCategories() {
  const controller = new AbortController();
  try {
    const animes = await getAnimeCategories({signal: controller.signal });
    renderAnimesCategories(animes, "#anime-category-list");
  } catch (err) {
    if (err.name === "AbortError") {
        console.log(err);
    } else {
      renderEmpty("Failed to load anime categories.", "#anime-category-list");
      console.error(err);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadAnimeCategories();
});