const priorityText = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级'
}

const statusEmptyText = {
  todo: '还没有待开始任务',
  doing: '还没有进行中的任务',
  done: '还没有完成的任务'
}

function createTaskCard(task) {
  const card = document.createElement('article')
  card.className = 'task-card'
  card.dataset.status = task.status

  const title = document.createElement('h3')
  title.textContent = task.title

  const description = document.createElement('p')
  description.textContent = task.description || '暂无描述'

  const meta = document.createElement('div')
  meta.className = 'task-meta'

  const priority = document.createElement('span')
  priority.className = `badge priority-${task.priority}`
  priority.textContent = priorityText[task.priority]
  meta.appendChild(priority)

  if (task.tag) {
    const tag = document.createElement('span')
    tag.className = 'badge'
    tag.textContent = task.tag
    meta.appendChild(tag)
  }

  const dueDate = document.createElement('span')
  dueDate.className = 'badge'
  dueDate.textContent = task.dueDate ? `截止：${task.dueDate}` : '无截止日期'

  if (isOverdue(task)) {
    dueDate.classList.add('overdue')
    dueDate.textContent = `已逾期：${task.dueDate}`
  }

  meta.appendChild(dueDate)

  const actions = document.createElement('div')
  actions.className = 'task-actions'
  actions.append(...createActionButtons(task))

  card.append(title, description, meta, actions)
  return card
}

function createActionButtons(task) {
  const buttons = []

  if (task.status !== 'todo') {
    buttons.push(createButton('移到待开始', 'todo', task.id))
  }

  if (task.status !== 'doing') {
    buttons.push(createButton('开始', 'doing', task.id))
  }

  if (task.status !== 'done') {
    buttons.push(createButton('完成', 'done', task.id))
  }

  const deleteButton = document.createElement('button')
  deleteButton.type = 'button'
  deleteButton.className = 'danger-btn'
  deleteButton.textContent = '删除'
  deleteButton.dataset.action = 'delete'
  deleteButton.dataset.id = task.id
  buttons.push(deleteButton)

  return buttons
}

function createButton(text, status, taskId) {
  const button = document.createElement('button')
  button.type = 'button'
  button.textContent = text
  button.dataset.action = 'move'
  button.dataset.status = status
  button.dataset.id = taskId
  return button
}

function renderEmptyState(listElement, status) {
  const empty = document.createElement('div')
  empty.className = 'empty-state'
  empty.textContent = statusEmptyText[status]
  listElement.appendChild(empty)
}

function isOverdue(task) {
  if (!task.dueDate || task.status === 'done') {
    return false
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dueDate = new Date(`${task.dueDate}T00:00:00`)
  return dueDate < today
}