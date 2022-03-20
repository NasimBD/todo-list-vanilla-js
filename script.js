const taskInput = document.querySelector('.task-input input');
const filters = document.querySelectorAll(".filters span");
const clearAll = document.querySelector(".clear-btn");
const taskBox = document.querySelector(".task-box");

let editId;
let isEditedTask = false;
let filter = "all";
let todos = JSON.parse(localStorage.getItem('js-todo-list'));  // we have to parse localStorage data to js object


filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        filter = btn.id;
        showTodo(filter);
    })
});


function showTodo(filter){
    let li = '';
    if(todos){
        todos.forEach((todo, indx) => {
            let isCompleted = todo.status == "completed" ? "checked" : "";
            if(filter == todo.status || filter == "all"){
                li += `
                    <li class="task">
                            <label for="t${indx}">   <!-- me. we can omit for, because label encompasses and encloses all of them -->
                                <input type="checkbox" id="t${indx}" onclick="updateStatus(this)" ${isCompleted}>
                                <p class="${isCompleted}">${todo.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li onclick="editTask(${indx}, '${todo.name}')"><i class="uil uil-pen">Edit</i></li>
                                    <li onclick="deleteTask(${indx})"><i class="uil uil-trash">Delete</i></li>
                                </ul>
                            </div>
                        </li>
                    `;
            }
        });
    }
    taskBox.innerHTML = li || `<span>You don't  have any tasks here</span>`;
}
showTodo(filter);


function showMenu(selectedTask){
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != selectedTask){
            taskMenu.classList.remove("show");
            }
    });
}


function deleteTask(deleteIndex){
    todos.splice(deleteIndex, 1); 
    localStorage.setItem("js-todo-list", JSON.stringify(todos));
    showTodo(filter);
}


clearAll.addEventListener("click", () => {
    todos.splice(0, todos.length);  
    localStorage.setItem("js-todo-list", JSON.stringify(todos));
    showTodo(filter);   // ***
})


function editTask(taskIndex, taskName){
    editId = taskIndex;
    isEditedTask = true;
    taskInput.value = taskName;
}


function updateStatus(selectedTask){
    let taskName = selectedTask.parentElement.lastElementChild;
    let index = parseInt(selectedTask.id.slice(1)); 
    console.log(index)
    if(selectedTask.checked){
        taskName.classList.add("checked");
        todos[index].status = "completed";
    }else{
        taskName.classList.remove('checked');
        todos[index].status = "pending";
    }
    localStorage.setItem("js-todo-list", JSON.stringify(todos));
    showTodo(filter);
}


taskInput.addEventListener('keyup', (e) => {
    let userTask = taskInput.value.trim();
    if(e.key == 'Enter' && userTask){
        if(!isEditedTask){
            if(!todos){
                todos = [];
            }
        let taskInfo = {name: userTask, status: "pending"};
        todos.push(taskInfo);
        }else{
            isEditedTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("js-todo-list", JSON.stringify(todos));
        showTodo(filter);
    }
})