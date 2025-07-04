/**
 * API wrapper for backend_api served endpoints.
 */
const BACKEND_BASE =
  process.env.REACT_APP_BACKEND_URL ||
  "http://localhost:8000"; // Change for deployed environment

function getJSON(path, opts = {}) {
  return fetch(BACKEND_BASE + path, opts)
    .then((r) => (r.ok ? r.json() : Promise.reject(r)));
}

// PUBLIC_INTERFACE
export async function fetchDashboardData() {
  try {
    // API: /drawings returns {featured, grid}
    return await getJSON("/drawings");
  } catch (e) {
    return { featured: null, grid: [] };
  }
}

// PUBLIC_INTERFACE
export async function submitGuess(drawingId, guess) {
  try {
    // API: POST /guesses
    const res = await getJSON(`/guesses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drawing_id: drawingId, guess }),
    });
    return res;
  } catch (e) {
    return { correct: false };
  }
}

// PUBLIC_INTERFACE
export async function getAnimalPrompt() {
  try {
    // API: /prompts/animal/random
    return await getJSON("/prompts/animal/random");
  } catch (e) {
    return { prompt: "Fox" };
  }
}

// PUBLIC_INTERFACE
export async function submitDrawing({ prompt, image }) {
  // POST /drawings {prompt, image}
  try {
    await getJSON("/drawings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, image }),
    });
    return true;
  } catch (e) {
    return false;
  }
}
