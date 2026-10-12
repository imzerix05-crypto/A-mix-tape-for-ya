/* A Mixtape for You ♡ — no build tools required. */
const app = document.getElementById("app");
const welcomeCard = document.getElementById("welcomeCard");
const startButton = document.getElementById("startButton");

const themes = [
  { id: "blush", name: "Blush Pink", color: "#f8cde5", page: "#fff0f5", accent: "#d97ba5" },
  { id: "lavender", name: "Lavender", color: "#ddd5fa", page: "#f4f0ff", accent: "#9482d9" },
  { id: "blue", name: "Baby Blue", color: "#c7e5ef", page: "#eef9fc", accent: "#719fb4" },
  { id: "cream", name: "Vanilla Cream", color: "#fff0d5", page: "#fff8eb", accent: "#c49b65" },
  { id: "mint", name: "Soft Mint", color: "#d8eadb", page: "#f0faf1", accent: "#7ca888" },
  { id: "rose", name: "Dusty Rose", color: "#e8b7b9", page: "#fff0f1", accent: "#aa626d" }
];
const stickerOptions = [
  { id: "heart", emoji: "💌", name: "Love Letter" },
  { id: "flower", emoji: "🌼", name: "Flower" },
  { id: "ribbon", emoji: "🎀", name: "Ribbon" },
  { id: "star", emoji: "⭐", name: "Star" },
  { id: "sparkles", emoji: "✨", name: "Sparkles" },
  { id: "bear", emoji: "🧸", name: "Teddy Bear" },
  { id: "butterfly", emoji: "🦋", name: "Butterfly" },
  { id: "moon", emoji: "🌙", name: "Moon" }
];
const blankState = () => ({ theme: "blush", stickers: [], songs: [], note: "", recipient: "", sender: "" });
let state = blankState();
let step = 1;
let editingShared = false;

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]);
}
function currentTheme() { return themes.find(t => t.id === state.theme) || themes[0]; }
function applyTheme() {
  const t = currentTheme();
  document.documentElement.style.setProperty("--page", t.page);
  document.documentElement.style.setProperty("--tape", t.color);
  document.documentElement.style.setProperty("--accent", t.accent);
  document.documentElement.style.setProperty("--pink", t.accent);
}
function stickerEmoji(id) { return (stickerOptions.find(s => s.id === id) || {}).emoji || ""; }
function cassettePreview() {
  const t = currentTheme();
  return `<div class="preview"><div class="preview-label" style="--tape:${t.color};background:${t.color}">
    <small>♡ A LITTLE GIFT FOR YOU ♡</small>
    <strong>${escapeHTML(state.recipient || "your mixtape")}</strong>
    <div class="preview-stickers">${state.stickers.map(stickerEmoji).join(" ")}</div>
    <small>${state.songs.length}/10 SONGS · MADE WITH LOVE</small>
  </div></div>`;
}
function progressHTML() {
  return `<div class="progress">${["Cassette","Stickers","Songs","Your note"].map((label,i) =>
    `<span class="${step === i+1 ? "active" : ""}">${i+1}. ${label}</span>`).join("")}</div>`;
}
function actions(backLabel = "Back") {
  return `<div class="actions"><button class="secondary" data-action="${step === 1 ? "home" : "back"}">${step === 1 ? "Back home" : backLabel}</button>
  <button data-action="next">Next ♡</button></div>`;
}
function render() {
  applyTheme();
  app.hidden = false;
  welcomeCard.hidden = true;
  const renderers = [themeStep, stickerStep, songsStep, noteStep];
  app.innerHTML = `${progressHTML()}<h2 class="builder-title">${[
    "Choose your cassette ♡","Decorate with love 🎀","Add your favourite songs 🎧","Write a little birthday note 💌"
  ][step-1]}</h2>${cassettePreview()}${renderers[step-1]()}`;
  bindEvents();
}
function themeStep() {
  return `<p class="builder-copy">Choose the colours that feel just right. Your cassette will change as you explore.</p>
    <div class="grid">${themes.map(t => `<button class="choice ${state.theme===t.id?"selected":""}" data-theme="${t.id}" aria-pressed="${state.theme===t.id}">
      <span class="swatch" style="background:${t.color}"></span><small>${t.name}</small></button>`).join("")}</div>
    <label class="field-label" for="recipient">Who is this mixtape for?</label>
    <input class="field" id="recipient" maxlength="50" placeholder="Someone special ♡" value="${escapeHTML(state.recipient)}">
    ${actions()}`;
}
function stickerStep() {
  return `<p class="builder-copy">Choose up to three little decorations for your cassette.</p>
    <div class="grid">${stickerOptions.map(s => `<button class="choice ${state.stickers.includes(s.id)?"selected":""}" data-sticker="${s.id}" aria-pressed="${state.stickers.includes(s.id)}">
      <span class="emoji">${s.emoji}</span><small>${s.name}</small></button>`).join("")}</div>
    <p class="builder-copy">${state.stickers.length}/3 decorations selected</p>${actions()}`;
}
function songsStep() {
  return `<p class="builder-copy">Add up to 10 YouTube videos. You can play them from your finished mixtape.</p>
    <label class="field-label" for="songTitle">Song title (optional)</label><input class="field" id="songTitle" maxlength="100" placeholder="A song that reminds me of you">
    <label class="field-label" for="songURL">YouTube video link</label><input class="field" id="songURL" type="url" placeholder="Paste a YouTube link here">
    <button class="primary-button" id="addSong" style="width:100%;margin-top:8px" ${state.songs.length>=10?"disabled":""}>+ Add song (${state.songs.length}/10)</button>
    <div id="songError" class="error" role="status"></div>
    <div class="song-list">${state.songs.length ? state.songs.map((s,i)=>`<div class="song-item"><span class="song-number">${i+1}</span><span class="song-title"><strong>${escapeHTML(s.title)}</strong><br><small>YouTube video</small></span><button data-remove-song="${i}" aria-label="Remove ${escapeHTML(s.title)}">✕</button></div>`).join("") : "<p class='builder-copy'>No songs added yet. Let's change that! ♡</p>"}</div>
    ${actions()}`;
}
function noteStep() {
  return `<p class="builder-copy">This is your chance to make their birthday a little more special.</p>
    <label class="field-label" for="sender">Your name or nickname (optional)</label>
    <input class="field" id="sender" maxlength="50" placeholder="With love, ..." value="${escapeHTML(state.sender)}">
    <label class="field-label" for="birthdayNote">Your personal message</label>
    <div class="note-paper"><textarea class="field" id="birthdayNote" maxlength="1500" placeholder="Happy birthday, you special human... ♡">${escapeHTML(state.note)}</textarea></div>
    <p id="noteCount" class="builder-copy">${state.note.length}/1500 characters</p>
    <div class="actions"><button class="secondary" data-action="back">Back</button><button data-action="finish">Finish mixtape 💌</button></div>`;
}
function validYouTubeURL(value) {
  try {
    const url = new URL(value.trim());
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    if (host === "youtu.be") return /^[a-zA-Z0-9_-]{11}$/.test(url.pathname.slice(1));
    if (["youtube.com","m.youtube.com","music.youtube.com"].includes(host)) {
      const id = url.searchParams.get("v");
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) return true;
      return /^\/(embed|shorts)\/[a-zA-Z0-9_-]{11}\/?$/.test(url.pathname);
    }
    return false;
  } catch { return false; }
}
function getYouTubeID(value) {
  const url = new URL(value);
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (host === "youtu.be") return url.pathname.slice(1);
  const id = url.searchParams.get("v");
  return id || url.pathname.split("/")[2];
}
function addSong() {
  const title = document.getElementById("songTitle").value.trim();
  const url = document.getElementById("songURL").value.trim();
  const error = document.getElementById("songError");
  if (state.songs.length >= 10) { error.textContent = "Your mixtape already has 10 songs! ♡"; return; }
  if (!validYouTubeURL(url)) { error.textContent = "Please paste a valid YouTube video link."; return; }
  const id = getYouTubeID(url);
  if (state.songs.some(s => s.id === id)) { error.textContent = "You've already added that video!"; return; }
  state.songs.push({ id, title: title || `Song ${state.songs.length+1}`, url: `https://www.youtube.com/watch?v=${id}` });
  render();
}
function bindEvents() {
  app.querySelectorAll("[data-theme]").forEach(b => b.addEventListener("click", () => { state.theme=b.dataset.theme; render(); }));
  app.querySelectorAll("[data-sticker]").forEach(b => b.addEventListener("click", () => {
    const id=b.dataset.sticker, idx=state.stickers.indexOf(id);
    if (idx >= 0) state.stickers.splice(idx,1);
    else if (state.stickers.length < 3) state.stickers.push(id);
    else { alert("You can choose up to 3 stickers! 🎀"); return; }
    render();
  }));
  app.querySelectorAll("[data-action]").forEach(b => b.addEventListener("click", () => {
    const action=b.dataset.action;
    if (action==="home") { app.hidden=true; welcomeCard.hidden=false; welcomeCard.scrollIntoView({behavior:"smooth"}); return; }
    if (action==="back") { if(step>1) step--; render(); app.scrollIntoView({behavior:"smooth",block:"start"}); return; }
    if (action==="next") {
      if(step===1) state.recipient=document.getElementById("recipient").value.trim() || "Someone Special";
      step=Math.min(4,step+1); render(); app.scrollIntoView({behavior:"smooth",block:"start"}); return;
    }
    if(action==="finish") {
      state.sender=document.getElementById("sender").value.trim();
      state.note=document.getElementById("birthdayNote").value.trim();
      renderFinal();
    }
  }));
  document.getElementById("addSong")?.addEventListener("click", addSong);
  app.querySelectorAll("[data-remove-song]").forEach(b=>b.addEventListener("click",()=>{state.songs.splice(Number(b.dataset.removeSong),1);render();}));
  const note=document.getElementById("birthdayNote");
  note?.addEventListener("input",()=>{document.getElementById("noteCount").textContent=`${note.value.length}/1500 characters`;});
}
function encodeState() {
  const json = JSON.stringify({v:1, ...state});
  const bytes = new TextEncoder().encode(json);
  let binary = ""; bytes.forEach(b=>binary+=String.fromCharCode(b));
  return btoa(binary).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function decodeState(value) {
  try {
    const base64=value.replace(/-/g,"+").replace(/_/g,"/");
    const binary=atob(base64);
    const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));
    const parsed=JSON.parse(new TextDecoder().decode(bytes));
    if(!parsed || parsed.v!==1 || !Array.isArray(parsed.songs) || !Array.isArray(parsed.stickers)) return null;
    const allowedThemes=themes.map(t=>t.id);
    return {
      theme: allowedThemes.includes(parsed.theme)?parsed.theme:"blush",
      stickers: parsed.stickers.filter(id=>stickerOptions.some(s=>s.id===id)).slice(0,3),
      songs: parsed.songs.filter(s=>s && /^[a-zA-Z0-9_-]{11}$/.test(s.id)).slice(0,10).map(s=>({id:s.id,title:String(s.title||"Song").slice(0,100),url:`https://www.youtube.com/watch?v=${s.id}`})),
      note:String(parsed.note||"").slice(0,1500), recipient:String(parsed.recipient||"Someone Special").slice(0,50), sender:String(parsed.sender||"").slice(0,50)
    };
  } catch { return null; }
}
async function shareMixtape() {
  const url = new URL(window.location.href);
  url.searchParams.set("tape", encodeState());
  const shareURL = url.toString();
  const status=document.getElementById("shareStatus");
  try {
    if(navigator.share) {
      await navigator.share({title:`A Mixtape for ${state.recipient} ♡`,text:"Someone made a little mixtape for you. Open it here ♡",url:shareURL});
      status.textContent="Your mixtape link is ready to share. ♡";
    } else if(navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(shareURL);
      status.textContent="Link copied! Paste it into your chat to share the whole mixtape. ♡";
    } else {
      status.innerHTML=`Copy this link and send it:<br><input class="field" readonly value="${escapeHTML(shareURL)}" id="shareURLField">`;
      const input=document.getElementById("shareURLField"); input.focus(); input.select();
    }
  } catch (e) {
    if(e.name!=="AbortError") status.textContent="Sharing didn't open. Try copying the link from the address bar after generating it.";
  }
}
function renderFinal() {
  applyTheme();
  const t=currentTheme();
  app.innerHTML=`<section class="final-screen">
    <div class="final-icon">💌</div>
    <h2 class="builder-title">A little piece of my heart ♡</h2>
    <p class="builder-copy">Your mixtape for <strong>${escapeHTML(state.recipient||"Someone Special")}</strong> is ready.</p>
    <div class="preview"><div class="preview-label" style="background:${t.color}">
      <small>A LITTLE GIFT FOR YOU</small><strong>${escapeHTML(state.recipient||"Someone Special")}</strong>
      <div class="preview-stickers">${state.stickers.map(stickerEmoji).join(" ")}</div>
      <small>${state.songs.length} SONGS · MADE WITH LOVE ♡</small>
    </div></div>
    <div class="cassette-wrap" style="margin-top:4px"><div class="cassette" id="playCassette">
      <div class="cassette-top"><span>♡</span><span>STEREO · 90 MIN</span><span>♡</span></div>
      <div class="cassette-label" style="background:${t.color}"><span class="label-small">a collection of feelings</span><h2>mixtape</h2><span class="label-bottom">MADE WITH LOVE ♡</span></div>
      <div class="cassette-window"><div class="reel"><div></div></div><div class="tape-line"></div><div class="reel"><div></div></div></div>
      <div class="cassette-bottom"><span>♡</span><span>PRESS PLAY BELOW</span><span>♡</span></div>
    </div></div>
    <div class="final-note">${escapeHTML(state.note || "Wishing you a birthday filled with love, music, and beautiful memories. ♡")}${state.sender?`\n\nWith love,\n${escapeHTML(state.sender)}`:""}</div>
    <h3>Your songs 🎧</h3>
    ${state.songs.length ? `<div class="song-list">${state.songs.map((s,i)=>`<div class="song-item"><span class="song-number">${i+1}</span><span class="song-title"><strong>${escapeHTML(s.title)}</strong></span><button class="small-button" data-play="${i}">Play ♫</button><a href="${s.url}" target="_blank" rel="noopener noreferrer">YouTube ↗</a></div>`).join("")}</div><div id="player" class="player" hidden></div>` : `<p class="builder-copy">Your mixtape is waiting for its soundtrack. ♡</p>`}
    <p class="builder-copy">Made with a little extra love. 🎀</p>
    <div class="final-actions"><button class="secondary" id="editMixtape">Edit mixtape</button><button id="shareMixtape">Share mixtape link ♡</button></div>
    <p class="share-status" id="shareStatus" role="status"></p>
    <p class="footer-note">Tip: share the link after publishing this folder on GitHub Pages.</p>
  </section>`;
  app.hidden=false; welcomeCard.hidden=true;
  document.getElementById("editMixtape").addEventListener("click",()=>{step=1;render();app.scrollIntoView({behavior:"smooth"});});
  document.getElementById("shareMixtape").addEventListener("click",shareMixtape);
  app.querySelectorAll("[data-play]").forEach(b=>b.addEventListener("click",()=>{
    const song=state.songs[Number(b.dataset.play)];
    const player=document.getElementById("player");
    player.hidden=false;
    player.innerHTML=`<div class="player-controls"><strong>Now playing: ${escapeHTML(song.title)}</strong><button class="small-button" id="closePlayer">Close player</button></div>
      <iframe title="YouTube player for ${escapeHTML(song.title)}" src="https://www.youtube-nocookie.com/embed/${song.id}?autoplay=1&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>`;
    document.getElementById("closePlayer").addEventListener("click",()=>{player.innerHTML="";player.hidden=true;});
    document.getElementById("playCassette")?.classList.add("is-playing");
    player.scrollIntoView({behavior:"smooth",block:"center"});
  }));
  if(new URLSearchParams(location.search).has("tape")) {
    const note = app.querySelector(".final-note");
    if(note) {
      const badge=document.createElement("p");
      badge.className="builder-copy";
      badge.textContent="A little surprise made just for you ♡";
      app.querySelector(".final-screen").insertBefore(badge,note);
    }
  }
  app.scrollIntoView({behavior:"smooth",block:"start"});
}
startButton.addEventListener("click",()=>{state=blankState();step=1;editingShared=false;render();app.scrollIntoView({behavior:"smooth",block:"start"});});

const sharedData = new URLSearchParams(window.location.search).get("tape");
if(sharedData) {
  const decoded=decodeState(sharedData);
  if(decoded) {
    state=decoded; editingShared=false; renderFinal();
    const welcomeNote=document.querySelector(".footer-note");
    if(welcomeNote) welcomeNote.textContent="A little mixtape made just for you ·˚ ༘";
  } else {
    startButton.textContent="Create your mixtape ♡";
  }
}
