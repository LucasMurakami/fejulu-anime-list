import { getTopAnimes } from "../api/jikan.js";

const listContainer = document.getElementById("anime-list-items");
const statusRegion = document.getElementById("status");
const itemTemplate = document.getElementById("anime-item-template");

let controller = null;

function setLoading(isLoading) {
  listContainer.setAttribute("aria-busy", isLoading ? "true" : "false");
  if (isLoading) {
    statusRegion.textContent = "Loading top anime...";
  }
}

function setStatus(msg) {
  statusRegion.textContent = msg;
}

function clearList() {
  listContainer.innerHTML = "";
}

function renderEmpty(message = "No results.") {
  clearList();
  const li = document.createElement("li");
  li.textContent = message;
  listContainer.appendChild(li);
}

function renderAnimes(animes) {
  clearList();
  if (!animes.length) {
    renderEmpty();
    return;
  }
  const frag = document.createDocumentFragment();
  animes.forEach(anime => {
    const node = itemTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".anime-title").textContent = anime.title;
    const imgEl = node.querySelector(".anime-img");
    imgEl.src = anime.image;
    imgEl.alt = `Cover of ${anime.title}`;
    frag.appendChild(node);
  });
  listContainer.appendChild(frag);
}

async function loadTopAnime({ limit = 10, page = 1 } = {}) {
  if (controller) controller.abort();
  controller = new AbortController();
  setLoading(true);
  try {
    const animes = await getTopAnimes({ limit, page, signal: controller.signal });
    renderAnimes(animes);
    setStatus(`Loaded ${animes.length} anime.`);
  } catch (err) {
    if (err.name === "AbortError") {
      setStatus("Request cancelled.");
    } else {
      renderEmpty("Failed to load anime.");
      setStatus("Error loading anime list.");
      console.error(err);
    }
  } finally {
    setLoading(false);
    controller = null;
  }
}

document.addEventListener("DOMContentLoaded", () => loadTopAnime({ limit: 10, page: 1 }));
