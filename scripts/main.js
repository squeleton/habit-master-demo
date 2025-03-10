document.addEventListener("DOMContentLoaded", () => {
    checkNewDay();
    loadHabits("good");
    updateRank();
});

let habits = JSON.parse(localStorage.getItem("habits")) || [];
let userPoints = parseInt(localStorage.getItem("userPoints")) || 0;
let completedHabits = JSON.parse(localStorage.getItem("completedHabits")) || {};
let currentFilter = "good";



const rankLevels = [
    { name: "Unranked", points: 0, image: "media/logo_demo.png", description: "¡Comienza tu viaje y mejora tus hábitos!" },
    { name: "MADERA", points: 1, image: "media/rankes/wood.png", description: "Un primer paso sólido. ¡Sigue así! 200 Es tu siguiente meta" },
    { name: "ESTAÑO", points: 200, image: "media/rankes/estaño.png", description: "¡Empiezas a destacarte! ¡No te detengas!" },
    { name: "COBRE", points: 400, image: "media/rankes/cobre_2.png", description: "Tu consistencia brilla como el cobre." },
    { name: "BRONCE", points: 700, image: "media/rankes/bronce.png", description: "Un logro de bronce. ¡Vas por más!" },
    { name: "HIERRO", points: 1100, image: "media/rankes/hierro.png", description: "Resistente como el hierro. ¡Gran avance!" },
    { name: "ACERO", points: 1600, image: "media/rankes/acero.png", description: "Fuerza y determinación. ¡Como el acero!" },
    { name: "PLATA", points: 2200, image: "media/rankes/plata2.png", description: "Brillas como la plata. ¡Impresionante!" },
    { name: "MERCURIO II", points: 2900, image: "media/rankes/mercurio2.png", description: "Tu progreso es fluido y constante." },
    { name: "MERCURIO I", points: 3500, image: "media/rankes/mercurio.png", description: "Velocidad y excelencia. ¡A seguir!" },
    { name: "TITANIO", points: 3800, image: "media/rankes/titanio.png", description: "Firme e inquebrantable como el titanio." },
    { name: "ORO", points: 5000, image: "media/rankes/oro.png", description: "Eres oro puro. ¡Una inspiración!" },
    { name: "PLATINO", points: 6500, image: "media/rankes/platino1.png", description: "Elite absoluta. ¡Lo has logrado!" }
];
function checkNewDay() {
    const today = new Date().toLocaleDateString();
    const lastDate = localStorage.getItem("lastDate");
    
    if (lastDate !== today) {
        localStorage.setItem("lastDate", today);
        localStorage.setItem("completedHabits", JSON.stringify({}));
        completedHabits = {};
    }
}

function loadHabits(filter) {
    currentFilter = filter;
    const habitList = document.getElementById("habitList");
    habitList.innerHTML = "";
    const filteredHabits = habits.filter(habit => habit.type === filter && !completedHabits[habit.name]);
    
    if (filteredHabits.length === 0) {
        habitList.innerHTML = "<li class='list-group-item text-center text-muted'>No habits found</li>";
        return;
    }
    
    filteredHabits.forEach(habit => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center fade-in";
        li.innerHTML = `
            ${habit.name} (${habit.importance} pts)
            <div>
                <button class="btn btn-success btn-sm me-2" onclick="completeHabit('${habit.name}')">✓</button>
                <button class="btn btn-danger btn-sm" onclick="removeHabit('${habit.name}')">X</button>
            </div>
        `;
        habitList.appendChild(li);
    });
}

function addHabit() {
    const habitInput = document.getElementById("habitInput");
    const importanceInput = document.getElementById("habitImportance");
    const typeInput = document.getElementById("habitType");
    const habitName = habitInput.value.trim();
    const importance = parseInt(importanceInput.value);
    const type = typeInput.checked ? "bad" : "good";
    
    if (habitName !== "") {
        habits.push({ name: habitName, importance: importance, type: type });
        localStorage.setItem("habits", JSON.stringify(habits));
        habitInput.value = "";
        document.getElementById("habitModal").querySelector(".btn-close").click();
        loadHabits(currentFilter);
    }
}

function removeHabit(habitName) {
    habits = habits.filter(h => h.name !== habitName);
    localStorage.setItem("habits", JSON.stringify(habits));
    loadHabits(currentFilter);
}

function completeHabit(habitName) {
    const habit = habits.find(h => h.name === habitName);
    if (!habit) return;

    let previousRank = getUserRank(userPoints); // Obtener el rango antes de sumar puntos
    userPoints += (habit.type === "good" ? habit.importance : -habit.importance);
    localStorage.setItem("userPoints", userPoints);
    
    let newRank = getUserRank(userPoints); // Obtener el nuevo rango después de sumar puntos

    if (newRank.name !== previousRank.name) {
        showLevelUpModal(newRank);
    }

    updateRank();
    completedHabits[habitName] = true;
    localStorage.setItem("completedHabits", JSON.stringify(completedHabits));
    loadHabits(currentFilter);
    
    // Animación de puntos
    const userPointsDisplay = document.getElementById("userPoints");
    userPointsDisplay.classList.add("points-update");
    setTimeout(() => userPointsDisplay.classList.remove("points-update"), 500);
}

function getUserRank(points) {
    let currentRank = rankLevels[0];
    for (let rank of rankLevels) {
        if (points >= rank.points) {
            currentRank = rank;
        }
    }
    return currentRank;
}

function showLevelUpModal(rank) {
    document.getElementById("levelUpTitle").textContent = `¡Nuevo Nivel: ${rank.name}!`;
    document.getElementById("levelUpImage").src = rank.image;
    document.getElementById("levelUpDescription").textContent = rank.description; // Nueva línea para la descripción
    document.getElementById("levelUpModal").classList.add("show");
    document.getElementById("levelUpModal").style.display = "block";
    
    startConfetti(); // Activar confeti
}

function closeModal() {
    document.getElementById("levelUpModal").classList.remove("show");
    document.getElementById("levelUpModal").style.display = "none";
    
    stopConfetti(); // Detener confeti al cerrar el modal
}

function updateRank() {
    const rankTitle = document.getElementById("rankTitle");
    const rankImage = document.getElementById("rankImage");
    const userPointsDisplay = document.getElementById("userPoints");
    
    userPointsDisplay.textContent = `${userPoints} Pts`;
    
    let currentRank = rankLevels[0];
    for (let rank of rankLevels) {
        if (userPoints >= rank.points) {
            currentRank = rank;
        }
    }
    
    rankTitle.textContent = currentRank.name;
    rankImage.src = currentRank.image;
}

// Agregar botones de filtro
document.getElementById("showGoodHabits").addEventListener("click", () => loadHabits("good"));
document.getElementById("showBadHabits").addEventListener("click", () => loadHabits("bad"));


document.getElementById("resetDay").addEventListener("click", () => {
    localStorage.setItem("lastDate", "2000-01-01"); // Fecha pasada para forzar reinicio
    checkNewDay();
    loadHabits(currentFilter);
});


function startConfetti() {
    let duration = 3 * 1000; // 3 segundos
    let end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            spread: 160,
            origin: { y: 0.6 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

function stopConfetti() {
    confetti.reset();
}


