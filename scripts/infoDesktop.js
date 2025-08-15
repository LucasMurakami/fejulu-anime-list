import { getAnimeById } from "../api/jikan.js";

export function renderEmpty(message = "Nenhum resultado encontrado.", containerSelector) {
  const container = document.querySelector(containerSelector);
  if (container) {
    container.innerHTML = `<p>${message}</p>`;
  }
}

export function renderAnime(animes, containerSelector = "main.anime-detalhes") {
  const container = document.querySelector(containerSelector);
  if (!container || !animes || animes.length === 0) {
    renderEmpty("Nenhum anime encontrado.", containerSelector);
    return;
  }

  const anime = animes[0]; // Pegando o primeiro anime da lista

  // Preenchendo os elementos com os nomes corretos
  document.getElementById("anime-image").src = anime.image || "";
  document.getElementById("anime-title").textContent = anime.title || "Sem título";
  document.getElementById("anime-japanese-title").textContent = anime.title_japanese || "";
  document.getElementById("anime-genres").textContent = anime.genres?.map(g => g.name).join(", ") || "Gêneros não disponíveis";
  document.getElementById("anime-description").textContent = anime.synopsis || "Sem descrição disponível.";
}

export async function loadAnimeById(id) {
  const controller = new AbortController();
  try {
    const animes = await getAnimeById({ id, signal: controller.signal });
    renderAnime(animes, "main.anime-detalhes");
  } catch (err) {
    if (err.name === "AbortError") {
      console.log(err);
    } else {
      renderEmpty("Falha ao carregar anime.", "main.anime-detalhes");
      console.error(err);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const animeId = params.get("id");
  loadAnimeById(animeId);
});
