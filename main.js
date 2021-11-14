class Task {
    constructor(id, title, desc, is_done, exp_date) {
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.is_done = is_done;
        this.createdDate = new Date();
        this.exp_date = exp_date;
    }
}

let tasks = new Array();

tasks.push(new Task(tasks.length + 1, 'Some task', 'Some desc', false, new Date(2021,11,13)))
tasks.push(new Task(tasks.length + 1, 'Some tasks', 'Some descs', true, new Date(2021,12,12)))
tasks.push(new Task(tasks.length + 1, 'Some tasks', 'Some descs', false, new Date(2021,12,31)))
tasks.push(new Task(tasks.length + 1, 'Some tasks', 'Some descs', false, new Date(2021,12,31)))
tasks.push(new Task(tasks.length + 1, 'Some tasks', 'Some descs', true, new Date(2021,12,31)))

tasks.push(new Task(tasks.length + 1, 'Some tasks', 'Some descs', true, new Date(2021,12,31)))



tasks.sort((a,b) => {
    if (a.is_done < b.is_done) {
        return 1;
      }
      if (a.is_done > b.is_done) {
        return -1;
      }
      return 0;
})
let tasksElement = document.getElementsByClassName('task__section__content__tasks')[0];

tasks.forEach(task => {

    let elem = document.createElement('div');
    elem.classList.add('card');

    elem.id = task.id;
    let header = document.createElement('div')
    header.classList.add('card-header', 'text-white')

    header.innerHTML = `
                        <h5 class="card-title">${task.title}</h5>
                        <div class="card-actions">
                            <span></span>
                            <a id="${task.id}" onclick="deleteElem(this)" class="bi bi-trash"></a>
                            <i class="bi bi-pencil-square"></i>
                        </div>`;
    
    let span = header.querySelector('.card-actions > span');
    span.textContent = `${moment(task.createdDate).format('MMMM D')} - ${moment(task.exp_date).format('MMMM D')}`;
    
    if(task.is_done) {
        header.classList.add('bg-success');
    }
    else if(task.exp_date.getDate() < new Date().getDate()) {
        header.classList.add('bg-danger');

        var timeDiff = Math.abs(new Date().getTime() - task.exp_date.getTime());
        span.textContent = `${Math.ceil(timeDiff / (1000 * 3600 * 24))} day ago`;
    }
    else {
        header.classList.remove('text-white');
    }

    let body = document.createElement('div')
    body.classList.add('card-body');

    body.innerHTML = `${task.desc}`;

    elem.append(header, body);
    tasksElement.append(elem);
});



function deleteElem(el) {
    let delitem = document.getElementById(el.id);

    delitem.remove();
}



