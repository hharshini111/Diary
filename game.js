const saveBtn = document.getElementById("saveBtn");
const entryBox = document.getElementById("entry");
const entryDate = document.getElementById("entryDate");
const entriesContainer = document.getElementById("entries");
const stickers = document.querySelectorAll(".sticker");

let selectedSticker = "";

// Handle top sticker selection
stickers.forEach(btn => {
    btn.addEventListener("click", () => {
        selectedSticker = btn.dataset.emoji;
        stickers.forEach(b => b.style.opacity = "0.5");
        btn.style.opacity = "1";
    });
});

// Load saved entries
window.onload = function () {
    const saved = JSON.parse(localStorage.getItem("diaryEntries")) || [];
    saved.forEach(data => addEntryToPage(data.text, data.sticker, data.date));
};

// Save new entry
saveBtn.onclick = function () {
    const text = entryBox.value.trim();
    const date = entryDate.value.trim();
    if (text !== "") {
        addEntryToPage(text, selectedSticker, date);
        saveToLocalStorage(text, selectedSticker, date);
        entryBox.value = "";
        entryDate.value = "";
        selectedSticker = "";
        stickers.forEach(b => b.style.opacity = "1");
    }
};

function addEntryToPage(text, sticker = "", date = "") {
    const div = document.createElement("div");
    div.className = "entry";

    div.innerHTML = `
        <button class="delete-btn">✕</button>
        <div class="date">${date || "no date"}</div>
        <div>${text}</div>
        <div class="mood-select">
            <button data-emoji="😊" class="${sticker === '😊' ? 'active' : ''}">😊</button>
            <button data-emoji="😢" class="${sticker === '😢' ? 'active' : ''}">😢</button>
            <button data-emoji="💖" class="${sticker === '💖' ? 'active' : ''}">💖</button>
            <button data-emoji="😡" class="${sticker === '😡' ? 'active' : ''}">😡</button>
        </div>
    `;

    // Delete entry
    div.querySelector(".delete-btn").onclick = () => {
        div.remove();
        deleteFromLocalStorage(text);
    };

    // Mood selector inside entry
    const moodBtns = div.querySelectorAll(".mood-select button");
    moodBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const newMood = btn.dataset.emoji;
            moodBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            updateStickerInLocalStorage(text, newMood);
        });
    });

    entriesContainer.prepend(div);
}

function saveToLocalStorage(text, sticker, date) {
    const saved = JSON.parse(localStorage.getItem("diaryEntries")) || [];
    saved.push({ text, sticker, date });
    localStorage.setItem("diaryEntries", JSON.stringify(saved));
}

function deleteFromLocalStorage(text) {
    let saved = JSON.parse(localStorage.getItem("diaryEntries")) || [];
    saved = saved.filter(entry => entry.text !== text);
    localStorage.setItem("diaryEntries", JSON.stringify(saved));
}

function updateStickerInLocalStorage(text, newSticker) {
    let saved = JSON.parse(localStorage.getItem("diaryEntries")) || [];
    saved = saved.map(entry => {
        if (entry.text === text) entry.sticker = newSticker;
        return entry;
    });
    localStorage.setItem("diaryEntries", JSON.stringify(saved));
}
