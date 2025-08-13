import { getTopAnimes, getNewestAnimes } from "../api/jikan.js";
import { renderAnimes, renderEmpty } from "./utils.js";


async function loadTopAnime({ limit = 10, page = 1 } = {}) {
  const controller = new AbortController();
  try {
    const animes = await getTopAnimes({ limit, page, signal: controller.signal });
    console.log(animes);
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

async function loadNewestAnimes({ limit = 10, page = 1} = {}) {
  const controller = new AbortController();
  try {
    const animes = await getNewestAnimes({ limit, page, signal: controller.signal });
    renderAnimes(animes, "#newest-anime-list");
  } catch (err) {
    if (err.name === "AbortError") {
        console.log(err);
    } else {
      renderEmpty("Failed to load anime.", "#newest-anime-list");
      console.error(err);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadTopAnime({ limit: 10, page: 1 });
  loadNewestAnimes({ limit: 10, page: 1 });
});