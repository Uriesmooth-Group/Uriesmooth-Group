(() => {
  let token = "";
  let selectedProject = null;
  let projects = [];
  let tasks = [];
  const $ = (id) => document.getElementById(id);
  const api = async (path, options = {}) => {
    const response = await fetch(path, {
      ...options,
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) }
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`);
    return body;
  };
  const notify = (message, bad = false) => {
    $("notice").textContent = message;
    $("notice").style.color = bad ? "var(--red)" : "var(--muted)";
  };
  const health = async () => {
    try {
      const result = await fetch("/healthz").then((r) => r.json());
      $("healthDot").className = `dot ${result.status === "ok" ? "ok" : "bad"}`;
      $("healthText").textContent = result.status === "ok" ? "API and database ready" : "Service degraded";
    } catch {
      $("healthDot").className = "dot bad";
      $("healthText").textContent = "API unavailable";
    }
  };
  const renderProjects = () => {
    $("projectCount").textContent = String(projects.length);
    $("projects").replaceChildren();
    if (!projects.length) {
      $("projects").textContent = "No projects registered yet.";
      return;
    }
    for (const project of projects) {
      const card = document.createElement("button");
      card.className = `project-card ${selectedProject?.id === project.id ? "active" : ""}`;
      card.innerHTML = "";
      const name = document.createElement("strong");
      name.textContent = project.name;
      const meta = document.createElement("small");
      meta.textContent = `${project.status} · ${project.target_date || "No target date"}`;
      card.append(name, meta);
      card.addEventListener("click", () => selectProject(project));
      $("projects").append(card);
    }
  };
  const selectProject = async (project) => {
    selectedProject = project;
    $("selectedProject").textContent = `Schedule for ${project.name}`;
    renderProjects();
    try {
      const result = await api(`/api/v1/projects/${project.id}/tasks`);
      tasks = result.data;
      renderTasks();
    } catch (error) { notify(error.message, true); }
  };
  const renderTasks = () => {
    $("openCount").textContent = String(tasks.filter((t) => !["done", "verified"].includes(t.status)).length);
    $("blockedCount").textContent = String(tasks.filter((t) => t.status === "blocked").length);
    $("doneCount").textContent = String(tasks.filter((t) => ["done", "verified"].includes(t.status)).length);
    const root = $("gantt");
    root.replaceChildren();
    if (!tasks.length) { root.textContent = "No tasks in this project yet."; return; }
    const dated = tasks.filter((t) => t.start_date && (t.due_date || t.start_date));
    if (!dated.length) { root.textContent = "Tasks exist, but dates are needed before a Gantt timeline can be drawn."; return; }
    const starts = dated.map((t) => new Date(t.start_date + "T00:00:00").getTime());
    const ends = dated.map((t) => new Date((t.due_date || t.start_date) + "T00:00:00").getTime());
    const min = Math.min(...starts), max = Math.max(...ends);
    const span = Math.max(86400000, max - min);
    const axis = document.createElement("div");
    axis.className = "gantt-axis";
    axis.innerHTML = `<span>${new Date(min).toLocaleDateString()}</span><span>${new Date(max).toLocaleDateString()}</span>`;
    root.append(axis);
    for (const task of tasks) {
      const row = document.createElement("div");
      row.className = "gantt-row";
      const label = document.createElement("div");
      label.className = "gantt-name";
      const title = document.createElement("strong");
      title.textContent = task.title;
      const meta = document.createElement("small");
      meta.textContent = `${task.priority.toUpperCase()} · ${task.status.replaceAll("_", " ")} · ${task.progress}%`;
      label.append(title, meta);
      const track = document.createElement("div");
      track.className = "track";
      if (task.start_date) {
        const start = new Date(task.start_date + "T00:00:00").getTime();
        const end = new Date((task.due_date || task.start_date) + "T00:00:00").getTime();
        const bar = document.createElement("div");
        bar.className = `bar ${task.status === "blocked" ? "blocked" : ["done", "verified"].includes(task.status) ? "done" : ""} ${task.is_milestone ? "milestone" : ""}`;
        bar.style.left = `${Math.max(0, (start - min) / span * 100)}%`;
        bar.style.width = task.is_milestone ? "14px" : `${Math.max(1, (end - start) / span * 100)}%`;
        bar.title = `${task.title}: ${task.start_date} → ${task.due_date || task.start_date}`;
        track.append(bar);
      }
      row.append(label, track);
      root.append(row);
    }
  };
  const load = async () => {
    try {
      const result = await api("/api/v1/projects");
      projects = result.data;
      renderProjects();
      if (selectedProject) {
        const match = projects.find((p) => p.id === selectedProject.id);
        if (match) await selectProject(match);
      }
      notify("Connected. Company project register loaded.");
    } catch (error) { notify(error.message, true); }
  };
  $("connect").addEventListener("click", async () => {
    token = $("token").value.trim();
    if (!token) { notify("Enter the admin token to connect.", true); return; }
    await load();
  });
  $("showProjectForm").addEventListener("click", () => $("projectForm").classList.toggle("hidden"));
  $("showTaskForm").addEventListener("click", () => $("taskForm").classList.toggle("hidden"));
  $("createProject").addEventListener("click", async () => {
    try {
      await api("/api/v1/projects", { method: "POST", body: JSON.stringify({
        name: $("projectName").value, slug: $("projectSlug").value,
        startDate: $("projectStart").value || undefined, targetDate: $("projectTarget").value || undefined
      }) });
      $("projectForm").classList.add("hidden");
      await load();
    } catch (error) { notify(error.message, true); }
  });
  $("createTask").addEventListener("click", async () => {
    if (!selectedProject) { notify("Select a project first.", true); return; }
    try {
      await api(`/api/v1/projects/${selectedProject.id}/tasks`, { method: "POST", body: JSON.stringify({
        title: $("taskTitle").value, priority: $("taskPriority").value,
        startDate: $("taskStart").value || undefined, dueDate: $("taskDue").value || undefined,
        isMilestone: $("taskMilestone").checked
      }) });
      $("taskForm").classList.add("hidden");
      await selectProject(selectedProject);
    } catch (error) { notify(error.message, true); }
  });
  health();
  window.setInterval(health, 30000);
})();
