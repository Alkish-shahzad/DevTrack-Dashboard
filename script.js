
const projectGrid = document.getElementById("projectGrid");
const addProjectBtn = document.getElementById("addProjectBtn");
const totalProjects = document.getElementById("totalProjects");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");

// Update dashboard statistics
function updateStats() {
    if (projectGrid && totalProjects) {
        totalProjects.textContent = String(
            projectGrid.querySelectorAll(".project-card").length
        ).padStart(2, "0");
    }

    const tasks = document.querySelectorAll(
        '.task-list input[type="checkbox"]'
    );

    let completed = 0;

    tasks.forEach((task) => {
        if (task.checked) completed++;
    });

    if (activeTasks) {
        activeTasks.textContent = String(
            tasks.length - completed
        ).padStart(2, "0");
    }

    if (completedTasks) {
        completedTasks.textContent = String(completed).padStart(2, "0");
    }
}

// Save projects in browser storage
function saveProjects() {
    if (!projectGrid) return;

    const projects = [...projectGrid.querySelectorAll(".project-card")].map(
        (card) => ({
            name: card.querySelector("h3")?.textContent || "Untitled Project",
            description: card.querySelector("p")?.textContent || "",
            status:
                card.querySelector(".project-status")?.textContent ||
                "In progress"
        })
    );

    localStorage.setItem("devtrackProjects", JSON.stringify(projects));
}

// Create a project card
function createProject(project) {
    const card = document.createElement("article");
    card.className = "project-card";

    const top = document.createElement("div");
    top.className = "project-card-top";

    const symbol = document.createElement("span");
    symbol.className = "project-symbol symbol-blue";
    symbol.textContent = project.name.charAt(0).toUpperCase();

    const status = document.createElement("span");
    status.className = "project-status";
    status.textContent = project.status || "In progress";

    top.append(symbol, status);

    const heading = document.createElement("h3");
    heading.textContent = project.name;

    const description = document.createElement("p");
    description.textContent = project.description;

    const progressInfo = document.createElement("div");
    progressInfo.className = "progress-info";

    const progressLabel = document.createElement("span");
    progressLabel.textContent = "Progress";

    const progressValue = document.createElement("strong");
    progressValue.textContent = "0%";

    progressInfo.append(progressLabel, progressValue);

    const track = document.createElement("div");
    track.className = "progress-track";

    const fill = document.createElement("div");
    fill.className = "progress-fill";
    fill.style.width = "0%";

    track.appendChild(fill);

    const footer = document.createElement("div");
    footer.className = "project-footer";

    const footerLabel = document.createElement("span");
    footerLabel.textContent = "Personal project";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-project";
    deleteButton.textContent = "Delete";

    footer.append(footerLabel, deleteButton);
    card.append(top, heading, description, progressInfo, track, footer);

    return card;
}

// Load projects from browser storage
function loadProjects() {
    if (!projectGrid) return;

    const saved = localStorage.getItem("devtrackProjects");

    if (saved !== null) {
        try {
            const projects = JSON.parse(saved);

            if (!Array.isArray(projects)) {
                throw new Error("Saved projects data is invalid.");
            }

            projectGrid.replaceChildren();

            projects.forEach((project) => {
                projectGrid.appendChild(createProject(project));
            });
        } catch (error) {
            console.error("Could not load saved projects:", error);
        }
    } else {
        // Keep the three sample cards already in the HTML
        saveProjects();
    }

    updateStats();
}

// Add a new project
if (addProjectBtn && projectGrid) {
    addProjectBtn.addEventListener("click", () => {
        const name = prompt("Enter your project name:");

        if (name === null || name.trim() === "") return;

        const description = prompt("Enter a short project description:");

        if (description === null) return;

        const project = {
            name: name.trim(),
            description:
                description.trim() || "No description added yet.",
            status: "In progress"
        };

        projectGrid.appendChild(createProject(project));

        saveProjects();
        updateStats();
    });
}

// Delete a project
if (projectGrid) {
    projectGrid.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-project")) {
            const card = event.target.closest(".project-card");

            if (
                card &&
                confirm("Are you sure you want to delete this project?")
            ) {
                card.remove();
                saveProjects();
                updateStats();
            }
        }
    });
}

// Save task completion status
function loadTaskStates() {
    const tasks = document.querySelectorAll(
        '.task-list input[type="checkbox"]'
    );

    tasks.forEach((task, index) => {
        task.checked =
            localStorage.getItem(`devtrackTask${index}`) === "true";
    });

    updateStats();
}

document.addEventListener("change", (event) => {
    if (event.target.matches('.task-list input[type="checkbox"]')) {
        const tasks = document.querySelectorAll(
            '.task-list input[type="checkbox"]'
        );

        tasks.forEach((task, index) => {
            localStorage.setItem(
                `devtrackTask${index}`,
                String(task.checked)
            );
        });

        updateStats();
    }
});

// Mobile navigation
if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });
}

// Start the dashboard
loadProjects();
loadTaskStates();
