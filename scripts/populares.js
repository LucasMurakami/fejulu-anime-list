import { getTopAnimes } from "../api/jikan.js";
import { renderAnimes, renderEmpty } from "./utils.js";


async function loadTopAnime({ limit = 25, page = 1 } = {}) {
  const controller = new AbortController();
  try {
    const animes = await getTopAnimes({ limit, page, signal: controller.signal });
    // console.log(animes);
    renderAnimes(animes, "#popular-anime-list");
  } catch (err) {
    if (err.name === "AbortError") {
        console.log(err);
    } else {
      renderEmpty("Failed to load anime.", "#popular-anime-list");
      console.error(err);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadTopAnime({ limit: 25, page: 1 });
});


document.addEventListener("DOMContentLoaded", () => {
  loadTopAnime({ limit: 25, page: 1 });
  
});