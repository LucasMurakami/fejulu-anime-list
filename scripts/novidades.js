import { getNewestAnimes } from "../api/jikan.js";
import { renderAnimes, renderEmpty } from "./utils.js";


async function loadNewestAnimes({ limit = 25, page = 1} = {}) {
  const controller = new AbortController();
  try {
    const animes = await getNewestAnimes({ limit, page, signal: controller.signal });
    // console.log(animes);
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
  loadNewestAnimes({ limit: 25, page: 1 });
});