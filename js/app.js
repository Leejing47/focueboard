const taskForm = document.querySelector('#taskForm')
const searchInput = document.querySelector('#searchInput')
const priorityFilter = document.querySelector('#priorityFilter')

const lists = {
  todo: document.querySelector('#todoList'),
  doing: document.querySelector('#doingList'),
  done: document.querySelector('#doneList')
}

const counts = {
  todo: document.querySelector('#todoCount'),
  doing: document.querySelector('#doingCount'),
  done: document.querySelector('#doneCount')
}

let tasks = loadTasks()
let searchText = ''
let selectedPriority = 'all'

taskForm.addEventListener('submit', event => {
  event.preventDefault()

  const titleInput = document.querySelector('#taskTitle')
  const descInput = document.querySelector('#taskDesc')
  const priorityInput = document.querySelector('#taskPriority')
  const dueDateInput = document.querySelector('#taskDueDate')
  const tagInput = document.querySelector('#taskTag')

  const title = titleInput.value.trim()

  if (!title) {
    titleInput.focus()
    return
  }

  const task = {
    id: Date.now().toString(),
    title,
    description: descInput.value.trim(),
    priority: priorityInput.value,
    dueDate: dueDateInput.value,
    tag: tagInput.value.trim(),
    status: 'todo',
    createdAt: new Date().toISOString()
  }

  tasks.unshift(task)
  taskForm.reset()
  syncAndRender()
})

searchInput.addEventListener('input', () => {
  searchText = searchInput.value.trim().toLowerCase()
  renderTasks()
})

priorityFilter.addEventListener('change', () => {
  selectedPriority = priorityFilter.value
  renderTasks()
})

Object.values(lists).forEach(list => {
  list.addEventListener('click', event => {
    const button = event.target.closest('button')

    if (!button) {
      return
    }

    const taskId = button.dataset.id
    const action = button.dataset.action

    if (action === 'move') {
      updateTaskStatus(taskId, button.dataset.status)
    }

    if (action === 'delete') {
      deleteTask(taskId)
    }
  })
})

function updateTaskStatus(taskId, newStatus) {
  tasks = tasks.map(task => {
    if (task.id === taskId) {
      return {
        ...task,
        status: newStatus
      }
    }
    return task
  })

  syncAndRender()
}

function deleteTask(taskId) {
  const confirmed = confirm('确定要删除这个任务吗？')

  if (!confirmed) {
    return
  }

  tasks = tasks.filter(task => {
    return task.id !== taskId
  })

  syncAndRender()
}

function syncAndRender() {
  saveTasks(tasks)
  renderTasks()
}

function renderTasks() {
  Object.keys(lists).forEach(status => {
    lists[status].innerHTML = ''
  })

  const visibleTasks = getVisibleTasks()
  const visibleCounts = {
    todo: 0,
    doing: 0,
    done: 0
  }

  visibleTasks.forEach(task => {
    const card = createTaskCard(task)
    lists[task.status].appendChild(card)
    visibleCounts[task.status]++
  })

  Object.keys(lists).forEach(status => {
    counts[status].textContent = visibleCounts[status]

    if (visibleCounts[status] === 0) {
      renderEmptyState(lists[status], status)
    }
  })
}

function getVisibleTasks() {
  return tasks.filter(task => {
    const title = task.title || ''
    const description = task.description || ''
    const tag = task.tag || ''

    const keywordMatched = title.toLowerCase().includes(searchText) || description.toLowerCase().includes(searchText) || tag.toLowerCase().includes(searchText)

    const priorityMatched = selectedPriority === 'all' || task.priority === selectedPriority

    return keywordMatched && priorityMatched
  })
}

renderTasks()