document.addEventListener('DOMContentLoaded', function(){
    loadTasks()
    updateDay()
    updateTime()
    setInterval(updateDay, 1000)
    setInterval(updateTime, 1000)

    const closeTutorialButton = document.getElementById('closeTutorial')
    console.log("close tutorial button: ", closeTutorialButton)

    closeTutorialButton.addEventListener('click', function(){
        console.log("close tutorial button clicked")
        hideTutorial()
    })
});

function showTutorial(){
    const tutorialOverlay = document.getElementById('tutorialOverlay')
    tutorialOverlay.classList.remove('tutor-hidden')
    console.log("show tutorial")
}

function hideTutorial(){
    const tutorialOverlay = document.getElementById('tutorialOverlay')
    tutorialOverlay.classList.add('tutor-hidden')
    console.log("hide tutorial")
    console.log("classes after hiding: ", tutorialOverlay.classList)
}


function updateDay(){   
    const dayNowElement = document.getElementById('dayNow')
    const now = new Date()
    const formattedDay = now.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    })
    dayNowElement.textContent = formattedDay;
}

function updateTime(){
    const timeNowElement = document.getElementById('timeNow')
    const now = new Date()
    const formattedTime = now.toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
    })
    timeNowElement.textContent = formattedTime
}

function showTaskInput(){
    const input = document.getElementById('taskInput')
    const instruction = document.getElementById('instruction')
    taskInput.style.display = 'block'
    instruction.style.display = 'none'
    taskInput.focus()
}

function addTask(event){
    if (event.key === 'Enter'){
        const taskInput = document.getElementById('taskInput')
        const instruction = document.getElementById('instruction')
        const taskList = JSON.parse(localStorage.getItem('todoList')) || []
    

        if (taskInput.value.trim()) {
            const newTask = {
                id: Date.now(),
                title: taskInput.value,
                completed: false
            }

            taskList.push(newTask)
            localStorage.setItem('todoList', JSON.stringify(taskList))
            taskInput.value = ''
            taskInput.style.display = 'none'
            instruction.style.display = 'block'
            displayTasks(taskList)
        }
    }
}

function loadTasks(){
    const taskList = JSON.parse(localStorage.getItem('todoList')) || []
    displayTasks(taskList)
}

function displayTasks(taskList){
    const taskListElement = document.getElementById('taskList')
    taskListElement.innerHTML = ''

    taskList.forEach(task => {
        const li = document.createElement('li')
        li.classList.add('draggable')
        li.setAttribute('draggable', true)
        li.dataset.id = task.id

        const taskText = document.createElement('span')
        taskText.innerText = task.title

        const icon = document.createElement('i')
        icon.classList.add('fa-solid', 'fa-equals')

        li.appendChild(icon)
        li.appendChild(taskText)

        li.addEventListener('dragstart', dragStart)
        li.addEventListener('dragover', dragOver)
        li.addEventListener('drop', drop)
        li.addEventListener('dragend', dragEnd)

        taskListElement.appendChild(li)
    })

    setupTrash()
}

function setupTrash(){
    const trash = document.querySelector('.trash')

    trash.addEventListener('dragover', (event) => {
        event.preventDefault()
    })

    trash.addEventListener('drop', (event) => {
        event.preventDefault()
        const taskId = event.dataTransfer.getData('text/plain')
        deleteTask(taskId)
    })
}
function deleteTask(taskId) {
    let taskList = JSON.parse(localStorage.getItem('todoList')) || []
    taskList = taskList.filter(task => task.id != taskId)
    localStorage.setItem('todoList', JSON.stringify(taskList))
    displayTasks(taskList)
}

function dragStart(event){
    event.dataTransfer.setData('text/plain', event.target.dataset.id)
    setTimeout(() => {
        event.target.classList.add('hidden')
    }, 0)
}

function dragOver(event) {
    event.preventDefault();
    const draggingElement = document.querySelector('.hidden')
    const currentElement = event.target

    if (currentElement !== draggingElement && currentElement.tagName === 'LI'){
        const bounding = currentElement.getBoundingClientRect()
        const offset = bounding.y + (bounding.height / 2)

        if (event.clientY - offset > 0){
            currentElement.style['border-bottom'] = 'solid 4px #BAC4CF'
            currentElement.style['border-top'] = ''
        } else {
            currentElement.style['border-top'] = 'solid 4px #BAC4CF'
            currentElement.style['border-bottom'] = ''
        }
    }
}

function drop(event){
    event.preventDefault()
    const draggingElement = document.querySelector('.hidden')
    const currentElement = event.target

    if (currentElement !== draggingElement && currentElement.tagName === 'LI'){
        currentElement.style['border-top'] = ''
        currentElement.style['border-bottom'] = ''

        const bounding = currentElement.getBoundingClientRect()
        const offset = bounding.y + (bounding.height / 2)

        const taskListElement = document.getElementById('taskList')
        if (event.clientY - offset > 0){
            taskListElement.insertBefore(draggingElement, currentElement.nextSibling)
        } else{
            taskListElement.insertBefore(draggingElement, currentElement)
        }
    }
}

function dragEnd(event){
    event.target.classList.remove('hidden')
    const taskListElement = document.getElementById('taskList')

    Array.from(taskListElement.children).forEach(item => {
        item.style['border-top'] = ''
        item.style['border-bottom'] = ''
    })

    const taskList = Array.from(taskListElement.children).map(item => ({
        id: item.dataset.id,
        title: item.innerText,
        completed: false
    }))

    localStorage.setItem('todoList', JSON.stringify(taskList))
}