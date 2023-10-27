const listscnt = document.querySelector('[data-lists]')
const newListForm = document.querySelector('[data-new-list-form]')
const newListInput = document.querySelector('[data-new-list-input]')
const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_LIST_ID_KEY = 'task.selectedListID'
const delListBtn = document.querySelector('[data-delete-list-btn]')
const listDisplayContainer = document.querySelector('[data-list-display-cnt]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const taskscnt = document.querySelector('[data-tasks]')
const taskTemp = document.getElementById('task-temp')
const newTaskForm = document.querySelector('[data-new-task-form]')
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompleteTasksBtn = document.querySelector('[data-clear-complete-tasks-btn]')

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
let selectedListId = localStorage.getItem(LOCAL_STORAGE_LIST_ID_KEY)

listscnt.addEventListener('click', e=> {
    if(e.target.tagName.toLowerCase() === 'li'){
        selectedListId = e.target.dataset.listId
        saveandRender()
    }
})

taskscnt.addEventListener('click', e=>{
    if(e.target.tagName.toLowerCase() === 'input'){
        const selectedList = lists.find(list => list.id === selectedListId)
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id)
        selectedTask.complete = e.target.checked
        save()
        renderTaskCount(selectedList)
    }
})

clearCompleteTasksBtn.addEventListener('click', e => {
    const selectedList = lists.find(list => list.id === selectedListId) 
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete)
    saveandRender()
 })

delListBtn.addEventListener('click', e=>{
    lists = lists.filter(list=> list.id !== selectedListId)
    selectedListId = null
    saveandRender()
} )

newListForm.addEventListener('submit', e => {
    e.preventDefault()
    const listName = newListInput.value
    if(listName == null || listName === '') return
    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    saveandRender()
})

newTaskForm.addEventListener('submit', e => {
    e.preventDefault()
    const taskName = newTaskInput.value
    if(taskName == null || taskName === '') return
    const task = createTask(taskName)
    newTaskInput.value = null
    const selectedList = lists.find(list => list.id === selectedListId)
    selectedList.tasks.push(task)
    saveandRender()
})

function createTask(name){
    return {id: Date.now().toString(), name: name, complete: false}
}

function createList(name){
     return {id: Date.now().toString(), name: name, tasks:[]}
}

function saveandRender(){
    save()
    render()
}

function save() {
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_LIST_ID_KEY, selectedListId)
}
function render(){
    clearElement(listscnt)
    renderLists()

    const selectedList = lists.find(list => list.id === selectedListId)
    if(selectedListId === null){
        listDisplayContainer.style.display='none'
    } else{
        listDisplayContainer.style.display=''
        listTitleElement.innerText = selectedList.name
        renderTaskCount(selectedList)
        clearElement(taskscnt)
        renderTasks(selectedList)
    }
    
}

function renderTasks(selectedList){
    selectedList.tasks.forEach( task => {

      const taskElement = document.importNode(taskTemp.content, true)
      const checkbox = taskElement.querySelector('input')
      checkbox.id = task.id
      checkbox.checked = task.complete
      const label = taskElement.querySelector('label')
      label.htmlFor = task.id
      label.append(task.name)
      taskscnt.appendChild(taskElement)
    })
}

function renderTaskCount(selectedList){
   const incompleteTaskCount = selectedList.tasks.filter(task => 
    !task.complete).length
    const taskString= incompleteTaskCount === 1 ? "task" : "tasks"
    listCountElement.innerText = `${incompleteTaskCount} ${taskString} left`
}

function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id
        listElement.classList.add("list-name")
        listElement.innerText = list.name
        if(list.id === selectedListId){
            listElement.classList.add('atv-list')
        }
        listscnt.appendChild(listElement)
    })
}

function clearElement(element){
  while(element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

render()