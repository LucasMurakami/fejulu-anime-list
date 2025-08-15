import { getAnimesByCategories } from "../api/jikan.js"; 
import { renderAnimes, renderEmpty } from "./utils.js";

async function loadAnimesByGenre(genreId, { limit = 25, page = 1 } = {}) {
  const controller = new AbortController();
  try {
    const animes = await getAnimesByCategories({ categoryId: genreId, limit, page, signal: controller.signal });

    if (!animes || animes.length === 0) {
      renderEmpty("Nenhum anime encontrado.", "#animes-by-category-list");
      return;
    }

    // console.log(animes[0].genres);
    const genre = animes[0].genres.find(g => String(g.mal_id) === String(genreId));
    // console.log(genre);
    const genreName = genre?.name || `ID ${genreId}`;

    document.getElementById("anime-category-name").textContent = `Animes da categoria - ${genreName}`;

    renderAnimes(animes, "#animes-by-category-list");
  } catch (err) {
    if (err.name === "AbortError") {
      console.log("Request aborted:", err);
    } else {
      renderEmpty("Erro ao carregar os animes.", "#animes-by-category-list");
      console.error(err);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const genreId = params.get("genre");

  const titleElement = document.getElementById("anime-category-name");

  console.log("Genre ID:", genreId);

  if (!genreId) {
    titleElement.textContent = "Categoria não encontrada.";
    renderEmpty("Categoria inválida.", "#anime-by-category-list");
  } else {
    loadAnimesByGenre(genreId, { limit: 25, page: 1 });
  }
});
