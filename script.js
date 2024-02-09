// Register service worker
if ("serviceWorker" in navigator) {
  // checking if the browser supports service workers
  window.addEventListener("load", function () {
    // when app loads, fire callback
    navigator.serviceWorker.register("/sw.js").then(
      function () {
        // register sw
        console.log("ServiceWorker registration successful"); // registration was successful
      },
      function (err) {
        console.log("ServiceWorker registration failed", err); // registration failed
      }
    );
  });
}

// Get DOM elements
const form = document.querySelector("form");
const input = document.querySelector("[name='todo']");
const todoList = document.getElementById("todos");

// Side Effects / Lifecycle
const existingTodos = JSON.parse(localStorage.getItem("todos")) || [];

const todoData = [];

existingTodos.forEach((todo) => {
  addTodo(todo);
});

function addTodo(todoText) {
  todoData.push(todoText);
  const li = document.createElement("li");
  li.innerHTML = todoText;
  todoList.appendChild(li);
  localStorage.setItem("todos", JSON.stringify(todoData));
  input.value = "";
}

// Events
form.onsubmit = (event) => {
  event.preventDefault();
  const priority = document.querySelector("[name='priority']").value; // Get priority value from the dropdown
  addTodo(input.value, priority);
};

document.getElementById("deleteBtn").addEventListener("click", deleteSelectedTodos);

// Updated deleteSelectedTodos function
/*
It will delete todo
*/
function deleteSelectedTodos() {
  console.log("Delete button clicked");

  const checkboxes = document.querySelectorAll("[type='checkbox']:checked");
  console.log("Number of checkboxes checked:", checkboxes.length);

  if (checkboxes.length === 0) {
    alert("Please select at least one todo to delete.");
    return;
  }

  checkboxes.forEach((checkbox) => {
    const todoText = checkbox.parentNode.textContent.trim();
    console.log("Deleting todo:", todoText);

    const index = todoData.indexOf(todoText);

    if (index !== -1) {
      todoData.splice(index, 1);
      localStorage.setItem("todos", JSON.stringify(todoData));

      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "deleteTodo",
          todoText: todoText,
        });
      }
    }

    checkbox.parentNode.remove();
    console.log("Todo deleted:", todoText);
  });
}

// Modify addTodo function to include checkboxes
/*
This will add new todo with priority
*/
function addTodo(todoText, priority) {
  // Create an object to represent the todo task
  const todoTask = {
    text: todoText,
    priority: priority,
  };

  // Add the task to the data array
  todoData.push(todoTask);

  // Create a list item
  const li = document.createElement("li");

  // Add a checkbox for each todo
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  li.appendChild(checkbox);

  // Add the todo text
  const todoTextNode = document.createTextNode(` ${todoText} (Priority: ${priority})`);
  li.appendChild(todoTextNode);

  // Append the li to the todo list
  todoList.appendChild(li);

  // Update local storage
  localStorage.setItem("todos", JSON.stringify(todoData));

  // Clear the input field after adding a todo
  input.value = "";
}
// Got this code from fireship-io -> https://github.com/fireship-io/10-javascript-frameworks/blob/main/vanilla-app/index.html
