function createTask(task) {
    let tasksElement = document.createElement('div');
    tasksElement.classList.add('card');

    if(task.is_done) {
        tasksElement.classList.add('done')
        tasksElement.style.display = 'none';
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
    actionContentElem.textContent = `${taskValidDateInterval(task.cre, task.exp_date)}`;

    let removeIcon = header.querySelector('.remove-icon');
    removeIcon.addEventListener('click', removeTask);
    
    let editIcon = header.querySelector('.edit');
    editIcon.addEventListener('click', () => createModalForTask(task));

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
function removeTask() {
    this.closest('div.card').remove();
}
function showTasks() {
    if(this.checked) tasksContainer.classList.add('show-done')
    else tasksContainer.classList.remove('show-done')
    
}
function createModalForTask(task) {

    taskEditTitle.val(task.title);  //title
    taskEditDesc.val(task.desc); //desc

    let formatExpDate = task.exp_date.format('YYYY-MM-DD'); //format exp date

    taskEditExpDate.val(formatExpDate) //exp_date
    taskEditExpDate.datepicker('update', formatExpDate); //update picker

    taskEditIsDone.bootstrapToggle(task.is_done ? 'on' : 'off');//isdone button

    taskEditModal.modal('show'); // show the curr edit modal

    taskEditSaveButton.click(() => saveChanges(task));

}
function saveChanges(task) {

    taskEditSaveButton.off('click') //remove event
    
    task.title = taskEditTitle.val();
    task.desc = taskEditDesc.val();
    task.exp_date = moment(taskEditExpDate.val());
    task.is_done = taskEditIsDone.prop('checked');
    
    $(`#task${task.id}`).replaceWith($(createTask(task)))

    taskEditModal.modal('hide');

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

//tasks container
let tasksContainer = document.querySelector('.task__section__content__tasks');

//add checkbox listener
let checkboxAllTask = document.querySelector('.checkbox__All__Task') 
checkboxAllTask.addEventListener('change', showTasks)

//Valiablet to task edit modal
let taskEditModal = $('.modal');
let taskEditTitle = $('.edit-title');
let taskEditDesc = $('.edit-desc');
let taskEditExpDate = $('.edit-exp-date');
let taskEditIsDone = $('.edit-is-done');
let taskEditSaveButton = $('.task-save-button');
 
//draw tasks
tasks.forEach(task => {

    let taskElem = createTask(task);
    tasksContainer.append(taskElem);

});






