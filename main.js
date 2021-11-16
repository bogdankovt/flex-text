function createTask(task) {
    let tasksElement = document.createElement('div');
    tasksElement.classList.add('card');

    if(task.is_done) {
        tasksElement.classList.add('done')
        tasksElement.style.display = 'none';
    }

    tasksElement.id = task.id;

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
    actionContentElem.textContent = `${taskValidDateInterval(task.cre, task.exp_date)}`;

    let removeIcon = header.querySelector('.remove-icon');
    removeIcon.addEventListener('click', deleteElem);
    
    let editIcon = header.querySelector('.edit');
    editIcon.addEventListener('click', function(){ createModalForTask(task)})

    if(task.is_done) {
        header.classList.add('bg-success');
        let title = header.querySelector('h5');
        title.style.textDecoration = 'line-through';

        let checkIcon = title.querySelector('i');
        checkIcon.style.display = 'inline';
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
function deleteElem() {
    this.closest('div.card').remove();
}
function showTasks() {
    if(this.checked) tasksContainer.classList.add('show-done')
    else tasksContainer.classList.remove('show-done')
    
}
function createModalForTask(task) {

    taskEditModal.querySelector('.new-title').value = task.title;
    taskEditModal.querySelector('.new-desc').value = task.desc;
    taskEditModal.querySelector('.new-exp-date').value = task.exp_date.format('YYYY-MM-DD');
    

    // taskEditModal.querySelector('.modal-footer').innerHTML += `<input class="new-is-done" type="checkbox" data-toggle="toggle" data-width="100" data-size="xs" data-on="Ready" data-off="Not Ready" data-onstyle="success" data-offstyle="danger">`



    let t = $('.new-is-done')
    if(task.is_done) {
        t.bootstrapToggle('on')
    }else{
        t.bootstrapToggle('off')
    }

    $('#taskEditModal').modal('show')

    // let saveButton = taskEditModal.querySelector('.save__button__edit__task');
    // saveButton.addEventListener('click', () => saveChanges(task))


}

function saveChanges(task) {

    
    console.log(this)
    
    task.title = taskElement.querySelector('.new-title').value;
    task.desc = taskElement.querySelector('.new-desc').value;
    // task.exp_date = moment(taskElement.querySelector('.new-exp-date').value)
    // task.is_done = taskElement.querySelector('.new-is-done').checked ? true : false;
    

    tasksContainer.replaceChild(createTask(task), repElement)

    // let element = taskElement.querySelector(`#task${taskElement.id}`)
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

let tasks = new Array();

tasks.push(new Task(tasks.length + 1, 'Learn Js', 'Simple learn js', false, moment("2021-11-15")))
tasks.push(new Task(tasks.length + 1, 'Learn Html', 'Simple learn html', true, moment("2021-12-31")))
tasks.push(new Task(tasks.length + 1, 'Learn Css', 'Simple learn Css', false, moment("2021-11-20")))
tasks.push(new Task(tasks.length + 1, 'Learn Java', 'Java', false, moment("2021-12-31")))
tasks.push(new Task(tasks.length + 1, 'Some ASP.NET', 'ASP.NET', true, moment("2021-12-5")))
tasks.push(new Task(tasks.length + 1, 'Some Learn', 'Learn', true, moment("2021-11-30")))

tasks.sort((a,b) => {
    if (a.is_done < b.is_done) {
        return 1;
      }
      if (a.is_done > b.is_done) {
        return -1;
      }
      return 0;
})

let tasksContainer = document.querySelector('.task__section__content__tasks');

//add checkbox listener
let checkboxAllTask = document.querySelector('.checkbox__All__Task') 
checkboxAllTask.addEventListener('change', showTasks)

let taskEditModal = document.querySelector('#taskEditModal');

tasks.forEach(task => {

    let taskElem = createTask(task);
    tasksContainer.append(taskElem);

});






