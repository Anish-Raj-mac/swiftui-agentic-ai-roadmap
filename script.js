const $ = (id) => document.getElementById(id);

function list(items = []) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function tags(items = []) {
  return items.map((item) => `<span class="tag ${item.type || ""}">${item.label}</span>`).join("");
}

async function loadCourse() {
  try {
    const response = await fetch("./data/crash-course.json");
    if (!response.ok) throw new Error("Could not load crash-course.json");

    const course = await response.json();

    $("course-title").textContent = course.title;
    $("course-subtitle").textContent = course.subtitle;
    $("hero-tags").innerHTML = tags(course.tags);

    $("strategy-content").innerHTML = `
      <p>${course.strategy.summary}</p>
      <ul>${course.strategy.points.map((point) => `<li>${point}</li>`).join("")}</ul>
    `;

    $("tracks-grid").innerHTML = course.tracks.map((track) => `
      <article class="track-card ${track.type}">
        <h3>${track.title}</h3>
        <p>${track.summary}</p>
        ${tags(track.tags)}
        ${list(track.points)}
      </article>
    `).join("");

    $("project-content").innerHTML = `
      <h3>${course.project.name}</h3>
      <p>${course.project.summary}</p>
      <h4>Core Capabilities</h4>
      ${list(course.project.capabilities)}
      <h4>Stretch Goals</h4>
      ${list(course.project.stretchGoals)}
      <h4>Resume Value</h4>
      <p><strong>${course.project.resumeLine}</strong></p>
    `;

    const roadmap = $("roadmap-list");
    roadmap.innerHTML = course.days.map((day) => `
      <article class="day-card">
        <div class="day-header" role="button" tabindex="0">
          <div class="day-title">
            <div class="day-no">${day.day}</div>
            <div>
              <h3>Day ${day.day}: ${day.title}</h3>
              <div>${tags(day.tags)}</div>
            </div>
          </div>
          <strong>+</strong>
        </div>
        <div class="day-body">
          <div class="day-cols">
            <div class="day-col"><h4>iOS / SwiftUI</h4>${list(day.ios)}</div>
            <div class="day-col"><h4>AI / LLM / RAG</h4>${list(day.ai)}</div>
            <div class="day-col"><h4>DSA</h4>${list(day.dsa)}</div>
            <div class="day-col"><h4>Exercises</h4>${list(day.exercises)}</div>
          </div>
          <div class="deliverable"><strong>Deliverable:</strong> ${day.deliverable}</div>
        </div>
      </article>
    `).join("");

    document.querySelectorAll(".day-header").forEach((header) => {
      header.addEventListener("click", () => header.parentElement.classList.toggle("open"));
      header.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") header.parentElement.classList.toggle("open");
      });
    });

    $("expand-all").addEventListener("click", () => {
      const cards = [...document.querySelectorAll(".day-card")];
      const shouldOpen = cards.some((card) => !card.classList.contains("open"));
      cards.forEach((card) => card.classList.toggle("open", shouldOpen));
      $("expand-all").textContent = shouldOpen ? "Collapse All" : "Expand All";
    });

    $("questions-content").innerHTML = course.questions.map((group) => `
      <article class="question-card">
        <h3>${group.title}</h3>
        ${list(group.items)}
      </article>
    `).join("");

    $("resources-content").innerHTML = `
      <p>${course.resources.summary}</p>
      ${list(course.resources.items)}
      <p><strong>Update rule:</strong> ${course.resources.updateRule}</p>
    `;
  } catch (error) {
    console.error(error);
    $("course-subtitle").textContent = "Could not load roadmap data.";
    $("roadmap-list").innerHTML = "<p>Could not load roadmap. Check that data/crash-course.json exists.</p>";
  }
}

loadCourse();
