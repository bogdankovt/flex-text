function createTaskNode(task) {
    let tasksElement = document.createElement('div');
    tasksElement.classList.add('card');

    if (task.is_done) {
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

    if (task.is_done) {
        header.classList.add('bg-success');
    }
    else if (!task.exp_date.isSameOrAfter(moment(), 'date')) {
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
function removeTaskDOM(id) {
    $(`#task${id}`).remove()
}
function removeTask(task) {

    taskService.remove(task.id)
        .then(r => xremoveTaskDOM(task.id), handleApiError)

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

    taskEditSaveButton.get(0).onclick = () => updateTask(task);

}
function updateTask(task) {
    let taskObj = {
        taskId: task.id,
        title: taskEditTitle.val(),
        desc: taskEditDesc.val(),
        isDone: taskEditIsDone.prop('checked'),
        dueDate: taskEditExpDate.val()
    }

    console.log('update', taskObj)
    
    taskService.update(taskObj)
    .then(res => {
        console.log(res)
        $(`#task${task.id}`).replaceWith($(createTaskNode(mapToTask(res))))
        taskEditModal.modal('hide');
    }, handleApiError)



}
function addformReset() {
    setTimeout(() => {
        taskAddForm.get(0).reset();
        $(".edit-exp-date").datepicker("setDate", 'now')
    }, 1000)
}
function addNewTask() {

    const addformData = new FormData(taskAddForm.get(0))
    const addFormContext = Object.fromEntries(addformData.entries())

    let taskObj = {
        title: addFormContext.taskTitle,
        desc: addFormContext.taskDesc,
        dueDate: addFormContext.taskExpDate
    }

    const AddTaskDOMAndResetForm = (res) => {
            createAndAppendTaskNode(mapToTask(res));
            $('#collapseNewTask').collapse('hide');
            addformReset()
    }
    taskService.createNew(taskObj)
        .then(res => AddTaskDOMAndResetForm(res), handleApiError)

}
function loadAddForm(taskEditForm) {

    taskEditForm.get(0).reset()

    let addTaskForm = taskEditForm.clone();

    addTaskForm.attr('name', 'addTaskForm');
    addTaskForm.find('.task-save-button').addClass('w-100').text('Create').click(addNewTask);
    addTaskForm.find('.edit-is-done').remove()

    addTaskForm.appendTo($('.collapse > .card'));
    return addTaskForm;

}
function mapToTask(task) {
    return new Task(task.taskId, task.title, task.desc, task.isDone, moment(task.dueDate));
}
function getAndRenderTasks() {
    taskService.getAll()
        .then(
            tasks => tasks.map(mapToTask).forEach(createAndAppendTaskNode),
            handleApiError
        );
}

//global 
const createAndAppendTaskNode = task => tasksContainer.append(createTaskNode(task));
const handleApiError = errMsg => {console.log(errMsg); alert(errMsg)};
//

 
let taskService = {
    getAll() {
        return fetch(`${tasksEndpoint}?listId=18&all=true`)
            .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    },
    createNew(taskObj) {
        return fetch(`${tasksEndpoint}?listId=18`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskObj)
        })
        .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
    },
    update(taskObj) {
        return fetch(`${tasksEndpoint}/${taskObj.taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskObj)
        })
        .then(res => res.ok ? res.json() : Promise.reject(res.statusText))    
    },
    remove(id) {
        return fetch(`${tasksEndpoint}/${id}`, {
            method: 'DELETE',
        })
        .then(res => res.ok ? res.json() : Promise.reject(res.statusText))    
    }

    
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
let tasksEndpoint = 'http://localhost:5000/tasks'

getAndRenderTasks()




