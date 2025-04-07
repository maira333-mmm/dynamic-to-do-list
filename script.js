const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
  const task = inputBox.value.trim();
  const dueDate = document.getElementById("due-date").value;
  const priority = document.getElementById("priority").value;

  if (task === "") {
    alert("You must write something!");
    return;
  }

  let li = document.createElement("li");
  li.innerHTML = `<strong>${task}</strong> <small>(Due: ${dueDate || 'N/A'}, Priority: ${priority})</small>`;
  listContainer.appendChild(li);

  let span = document.createElement("span");
  span.innerHTML = "\u00d7";
  li.appendChild(span);

  inputBox.value = "";
  document.getElementById("due-date").value = "";
  document.getElementById("priority").value = "Medium";

  saveData();
}

listContainer.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    saveData();
  } else if (e.target.tagName === "SPAN") {
    e.target.parentElement.remove();
    saveData();
  }
});

listContainer.addEventListener("dblclick", function (e) {
  if (e.target.tagName === "LI" && !e.target.classList.contains("checked")) {
    let currentText = e.target.firstChild.textContent.trim();
    let newText = prompt("Edit your task:", currentText);
    if (newText !== null && newText.trim() !== "") {
      e.target.childNodes[0].textContent = newText;
      saveData();
    }
  }
});

function filterTasks(type) {
  const items = listContainer.getElementsByTagName("li");
  for (let item of items) {
    switch (type) {
      case "all":
        item.style.display = "flex";
        break;
      case "active":
        item.style.display = item.classList.contains("checked") ? "none" : "flex";
        break;
      case "completed":
        item.style.display = item.classList.contains("checked") ? "flex" : "none";
        break;
    }
  }
}

// Drag-and-drop support
let dragSrcEl = null;

listContainer.addEventListener("dragstart", function (e) {
  if (e.target.tagName === "LI") {
    dragSrcEl = e.target;
    e.dataTransfer.effectAllowed = "move";
  }
});

listContainer.addEventListener("dragover", function (e) {
  e.preventDefault();
});

listContainer.addEventListener("drop", function (e) {
  e.preventDefault();
  if (e.target.tagName === "LI" && dragSrcEl !== e.target) {
    listContainer.insertBefore(dragSrcEl, e.target.nextSibling);
    saveData();
  }
});

function makeTasksDraggable() {
  const tasks = listContainer.querySelectorAll("li");
  tasks.forEach(task => task.setAttribute("draggable", "true"));
}

function saveData() {
  localStorage.setItem("tasks", listContainer.innerHTML);
  makeTasksDraggable();
}

function showTasks() {
  listContainer.innerHTML = localStorage.getItem("tasks") || "";
  makeTasksDraggable();
}

showTasks();
