const STORAGE_KEY = 'focusboard_tasks'

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function loadTasks() {
  const data = localStorage.getItem(STORAGE_KEY)

  if (!data) {
    return []
  }

  try {
    return JSON.parse(data)
  } catch (error) {
    console.error('任务数据解析失败: ', error)
    return []
  }
}