import { getTopAnimes, getNewestAnimes } from "../api/jikan.js";
import { renderAnimes, renderEmpty, renderBanner } from "./utils.js";


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

async function loadNewestAnimes({ limit = 25, page = 1} = {}) {
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


async function loadBanner() {
  try {
    const response = await fetch("../res/banner.json");
    const Banners = await response.json();
    // console.log(Banners);

    renderBanner(Banners, "#anime-carousel");
  } catch (err) {
    console.error("Failed to load banners:", err);
    renderEmpty("Failed to load banners.", "#anime-carousel");
  }
}




document.addEventListener("DOMContentLoaded", () => {
  loadTopAnime({ limit: 12, page: 1 });
  loadNewestAnimes({ limit: 12, page: 1 });
  loadBanner();
});


document.addEventListener("DOMContentLoaded", () => {
    const trigger = document.getElementById("mutiga-trigger");
    const modal = document.getElementById("easteregg-modal");
    const fechar = document.querySelector(".fechar");
    const conteudo = document.querySelector(".modal-content");

    trigger.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    fechar.addEventListener("click", () => {
        modal.style.display = "none";
    });

    document.addEventListener("click", (event) => {
        if (modal.style.display === "flex" && !conteudo.contains(event.target) && event.target !== trigger) {
            modal.style.display = "none";
        }
    });
});
