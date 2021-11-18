function createTask(task) {
    let tasksElement = document.createElement('div');
    tasksElement.classList.add('card');

    if(task.is_done) {
        tasksElement.classList.add('done')

    }

    tasksElement.id = `task${task.id}`;

    let taskHeader = createTaskHeader(task);
    let taskBody = createTaskBody(task);

    tasksElement.append(taskHeader, taskBody);
    return tasksElement;
}
function createTaskHeader(task) {
    let header = document.createElement('div')
    header.classList.add('card-header', 'text-white')

    header.innerHTML = `
                        <h5 class="card-title">${task.title} <i class="bi bi-check-all"></i></h5>
                        <div class="card-actions">
                            <span class="action-content"></span>
                            <i class="bi bi-pencil-square edit"></i>
                            <i class="bi bi-trash remove-icon"></i>
                        </div>`;
    
    let actionContentElem = header.querySelector('.action-content');
    actionContentElem.textContent = `${taskValidDateInterval(task.createdDate, task.exp_date)}`;

    let removeIcon = header.querySelector('.remove-icon');
    removeIcon.addEventListener('click', () => removeTask(task));
    
    let editIcon = header.querySelector('.edit');
    editIcon.addEventListener('click', () => createModalForTask(task));

    if(task.is_done) {
        header.classList.add('bg-success');
    }
    else if(!task.exp_date.isSameOrAfter(moment(), 'date')) {
        header.classList.add('bg-danger');

        let duration = moment.duration(moment().diff(moment(task.exp_date)));
        actionContentElem.textContent = `${Math.floor(duration.asDays())} day ago`;
    }
    else {
        header.classList.add('bg-primary');
    }
    return header;
}
function createTaskBody(task) {
    let body = document.createElement('div')
    body.classList.add('card-body');

    body.innerHTML = `${task.desc}<hr/>`;
    return body;
}
function taskValidDateInterval(a, b) {
    return `${moment(a).format('MMMM D')} - ${moment(b).format('MMMM D')}`
}
function removeTask(task) {

    fetch(`${taskEndpoint}/${task.id}`, {
        method: 'DELETE', 
    })
    .then(response => response.json())
    .then(r => $(`#task${task.id}`).remove())

}
function showTasks() {
    tasksContainer.classList.toggle('show-done')  
}
function createModalForTask(task) {

    taskEditTitle.val(task.title);  //title
    taskEditDesc.val(task.desc); //desc

    let formatExpDate = task.exp_date.format('YYYY-MM-DD'); //format exp date

    taskEditExpDate.val(formatExpDate) //exp_date
    taskEditExpDate.datepicker('update', formatExpDate); //update picker

    taskEditIsDone.bootstrapToggle(task.is_done ? 'on' : 'off');//isdone button

    taskEditModal.modal('show'); // show the curr edit modal

    taskEditSaveButton.get(0).onclick = () => saveChanges(task);

}
function saveChanges(task) {
    
    fetch(`${taskEndpoint}/${task.id}/edit`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "taskId":task.id,
            "title": taskEditTitle.val(),
            "desc":  taskEditDesc.val(),
            "isDone": taskEditIsDone.prop('checked'),
            "dueDate": moment(taskEditExpDate.val())
        })})
        .then(r => r.json())
        .then(r => { 
            let newTask = new Task(r.taskId, r.title, r.desc, r.isDone, moment(r.dueDate))
            $(`#task${task.id}`).replaceWith($(createTask(newTask)))
            taskEditModal.modal('hide');
        })





    task.title = taskEditTitle.val();
    task.desc = taskEditDesc.val();
    task.exp_date = moment(taskEditExpDate.val());
    task.is_done = taskEditIsDone.prop('checked');
    
    $(`#task${task.id}`).replaceWith($(createTask(task)))

    taskEditModal.modal('hide');

}
function addformReset() {
    setTimeout(() => {
        taskAddForm.get(0).reset();
        $(".edit-exp-date").datepicker("setDate",'now')
    }, 1000)
}
function addNewTask() {

    const addformData = new FormData(taskAddForm.get(0))
    const addFormContext = Object.fromEntries(addformData.entries())

    fetch(tasksEndpoint, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "title": addFormContext.taskTitle,
            "desc":  addFormContext.taskDesc,
            "dueDate": addFormContext.taskExpDate})})
        .then(r => r.json())
        .then(r => { 
            let newTask = new Task(r.taskId, r.title, r.desc, r.isDone, moment(r.dueDate))
            tasksContainer.append(createTask(newTask));
            $('#collapseNewTask').collapse('hide');  //hide form 
            addformReset()
        })

}
function loadAddForm(taskEditForm) {

    taskEditForm.get(0).reset()

    let addTaskForm  = taskEditForm.clone();

    addTaskForm.attr('name', 'addTaskForm');
    addTaskForm.find('.task-save-button').addClass('w-100').text('Create').click(addNewTask);
    addTaskForm.find('.edit-is-done').remove()

    addTaskForm.appendTo($('.collapse > .card'));
    return addTaskForm;
    
}
function getAndDrawTasks() {
    fetch(`${tasksEndpoint}?all=true`)
    .then(r => r.json())
    .then(r => 
        r.forEach(t => {
            let task =  new Task(t.taskId, t.title, t.desc, t.isDone, moment(t.dueDate))
            tasksContainer.append(createTask(task)) 
        })
    )
}


class Task {
    constructor(id, title, desc, is_done, exp_date) {
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.is_done = is_done;
        this.createdDate = moment()
        this.exp_date = exp_date;
    }
}


//tasks container
let tasksContainer = document.querySelector('.task__section__content__tasks');

//add checkbox listener
let checkboxAllTask = document.querySelector('.checkbox__All__Task')
checkboxAllTask.checked = false;
checkboxAllTask.addEventListener('change', showTasks)


//Valiables to task edit modal
let taskEditModal = $('.modal');
let taskEditTitle = $('.edit-title');
let taskEditDesc = $('.edit-desc');
let taskEditExpDate = $('.edit-exp-date');
let taskEditIsDone = $('.edit-is-done');
let taskEditSaveButton = $('.task-save-button');

//forms
let taskEditForm = $('form[name="taskEditForm"');
let taskAddForm = loadAddForm(taskEditForm)

//draw tasks

let tasksEndpoint = 'http://localhost:5000/lists/18/tasks'
let taskEndpoint = 'http://localhost:5000/tasks'

getAndDrawTasks()




