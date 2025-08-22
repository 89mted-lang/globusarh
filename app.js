// Данные приложения
let employees = [
    { id: 1, name: "КРОТОВ СЕРГЕЙ" },
    { id: 2, name: "АЛЛА ЕРОФЕЕВА" },
    { id: 3, name: "МАРИНА ЖУКОВА" },
    { id: 4, name: "ЕКАТЕРИНА СОНИНА" },
    { id: 5, name: "АЛЕКСЕЙ КОРОВИН" }
];

let tasks = [
    { id: 1, employeeId: 1, title: "GLOBUS 4.0", description: "GLOBUS 4.0", startDate: "2025-03-10", endDate: "2025-12-31", type: "Задача", status: "активная" },
    { id: 2, employeeId: 2, title: "Логистический склад 2 очередь", description: "Логистический склад 2 очередь", startDate: "2025-04-07", endDate: "2026-03-09", type: "Задача", status: "активная" },
    { id: 3, employeeId: 3, title: "ТУЛА-2. ОТДЕЛКА СТЕН", description: "ТУЛА-2. ОТДЕЛКА СТЕН", startDate: "2025-08-19", endDate: "2025-08-29", type: "Задача", status: "активная" },
    { id: 4, employeeId: 4, title: "ТУЛА-2. ФИЛЕНКА", description: "ТУЛА-2. ФИЛЕНКА", startDate: "2025-08-19", endDate: "2025-08-29", type: "Задача", status: "активная" },
    { id: 5, employeeId: 1, title: "ТУЛА-2. ТЗ АР", description: "ТУЛА-2. ТЗ АР", startDate: "2025-08-25", endDate: "2025-08-29", type: "Задача", status: "не начатая" },
    { id: 6, employeeId: 3, title: "РЯЗАНЬ. АКТУАЛИЗАЦИЯ ПЛАНОВ", description: "РЯЗАНЬ. АКТУАЛИЗАЦИЯ ПЛАНОВ", startDate: "2025-09-01", endDate: "2025-09-05", type: "Задача", status: "не начатая" },
    { id: 7, employeeId: 4, title: "ТУЛА-2. ОТБОЙНИКИ", description: "ТУЛА-2. ОТБОЙНИКИ", startDate: "2025-09-01", endDate: "2025-09-05", type: "Задача", status: "не начатая" },
    { id: 8, employeeId: 3, title: "ВЛАДИМИР. АКТУАЛИЗАЦИЯ ПЛАНОВ", description: "ВЛАДИМИР. АКТУАЛИЗАЦИЯ ПЛАНОВ", startDate: "2025-09-08", endDate: "2025-09-12", type: "Задача", status: "не начатая" },
    { id: 9, employeeId: 4, title: "ОТПУСК", description: "ОТПУСК", startDate: "2025-09-08", endDate: "2025-09-21", type: "Отпуск", status: "не начатая" },
    { id: 10, employeeId: 3, title: "АКТУАЛИЗАЦИЯ ВСЕХ ГМ", description: "АКТУАЛИЗАЦИЯ ВСЕХ ГМ", startDate: "2025-09-15", endDate: "2025-10-03", type: "Задача", status: "не начатая" },
    { id: 11, employeeId: 5, title: "Отпуск", description: "Отпуск", startDate: "2025-09-22", endDate: "2025-09-28", type: "Отпуск", status: "не начатая" },
    { id: 12, employeeId: 4, title: "ТУЛА-2. ПОДГОТВКА МАТЕРИАЛОВ ДЛЯ ТЕНДЕРА", description: "ТУЛА-2. ПОДГОТВКА МАТЕРИАЛОВ ДЛЯ ТЕНДЕРА", startDate: "2025-09-22", endDate: "2025-10-03", type: "Задача", status: "не начатая" },
    { id: 13, employeeId: 3, title: "ДЕКРЕТ", description: "ДЕКРЕТ", startDate: "2025-10-06", endDate: "2025-12-31", type: "Отпуск", status: "не начатая" }
];

const taskTypes = ["Задача", "Отпуск"];
const taskStatuses = ["активная", "завершена", "отменена", "не начатая"];

// Состояние приложения
let nextEmployeeId = 6;
let nextTaskId = 14;
let currentEditingTaskId = null;
let contextMenuTaskId = null;
let currentViewDate = new Date(2025, 7, 1); // Август 2025
let currentView = 'both'; // both, chart, table

// Состояние таблицы
let currentPage = 1;
let itemsPerPage = 10;
let sortColumn = null;
let sortDirection = 'asc';
let selectedTasks = new Set();

// DOM элементы
const elements = {};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    showCurrentDate();
    setupEventListeners();
    populateFilters();
    updateCurrentMonth();
    setView('both');
    renderContent();
});

// Инициализация DOM элементов
function initializeElements() {
    elements.currentDate = document.getElementById('currentDate');
    elements.currentMonth = document.getElementById('currentMonth');
    elements.ganttBody = document.getElementById('ganttBody');
    elements.timelineHeader = document.getElementById('timelineHeader');
    elements.taskModal = document.getElementById('taskModal');
    elements.employeeModal = document.getElementById('employeeModal');
    elements.contextMenu = document.getElementById('contextMenu');
    elements.notification = document.getElementById('notification');
    elements.employeeFilter = document.getElementById('employeeFilter');
    elements.statusFilter = document.getElementById('statusFilter');
    elements.searchInput = document.getElementById('searchInput');
    elements.groupFilter = document.getElementById('groupFilter');
    elements.taskForm = document.getElementById('taskForm');
    elements.employeeForm = document.getElementById('employeeForm');
    elements.prevMonth = document.getElementById('prevMonth');
    elements.nextMonth = document.getElementById('nextMonth');
    elements.tasksTableBody = document.getElementById('tasksTableBody');
    elements.ganttSection = document.getElementById('ganttSection');
    elements.tableSection = document.getElementById('tableSection');
    elements.timelineNavigation = document.getElementById('timelineNavigation');
}

// Отображение текущей даты
function showCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    if (elements.currentDate) {
        elements.currentDate.textContent = now.toLocaleDateString('ru-RU', options);
    }
}

// Обновление отображения текущего месяца
function updateCurrentMonth() {
    const options = { year: 'numeric', month: 'long' };
    if (elements.currentMonth) {
        elements.currentMonth.textContent = currentViewDate.toLocaleDateString('ru-RU', options);
    }
}

// Управление видами
function setView(view) {
    currentView = view;
    
    // Управление видимостью секций
    if (elements.ganttSection) {
        elements.ganttSection.style.display = (view === 'chart' || view === 'both') ? 'block' : 'none';
    }
    if (elements.tableSection) {
        elements.tableSection.style.display = (view === 'table' || view === 'both') ? 'block' : 'none';
    }
    if (elements.timelineNavigation) {
        elements.timelineNavigation.style.display = (view === 'chart' || view === 'both') ? 'flex' : 'none';
    }
    
    // Обновление кнопок
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === view) {
            btn.classList.add('active');
        }
    });
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Переключение видов
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            setView(btn.dataset.view);
            renderContent();
        });
    });

    // Кнопки управления
    const addTaskBtn = document.getElementById('addTaskBtn');
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const saveDataBtn = document.getElementById('saveDataBtn');
    const loadDataBtn = document.getElementById('loadDataBtn');
    const fileInput = document.getElementById('fileInput');

    if (addTaskBtn) addTaskBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); openTaskModal(); });
    if (addEmployeeBtn) addEmployeeBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); openEmployeeModal(); });
    if (exportExcelBtn) exportExcelBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); exportToExcel(); });
    if (saveDataBtn) saveDataBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); saveData(); });
    if (loadDataBtn) loadDataBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); fileInput?.click(); });
    if (fileInput) fileInput.addEventListener('change', loadData);

    // Навигация по месяцам
    if (elements.prevMonth) elements.prevMonth.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); navigateMonth(-1); });
    if (elements.nextMonth) elements.nextMonth.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); navigateMonth(1); });

    // Модальные окна
    setupModalHandlers();

    // Фильтры
    if (elements.employeeFilter) elements.employeeFilter.addEventListener('change', (e) => { e.stopPropagation(); applyFilters(); });
    if (elements.statusFilter) elements.statusFilter.addEventListener('change', (e) => { e.stopPropagation(); applyFilters(); });
    if (elements.searchInput) elements.searchInput.addEventListener('input', (e) => { e.stopPropagation(); applyFilters(); });
    if (elements.groupFilter) elements.groupFilter.addEventListener('change', (e) => { e.stopPropagation(); applyFilters(); });

    // Таблица
    setupTableHandlers();

    // Контекстное меню
    setupContextMenu();

    // Общие обработчики
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.context-menu')) {
            closeContextMenu();
        }
    });
    document.addEventListener('keydown', handleKeyboard);
}

function setupModalHandlers() {
    const closeTaskModal = document.getElementById('closeTaskModal');
    const closeEmployeeModal = document.getElementById('closeEmployeeModal');
    const cancelTaskBtn = document.getElementById('cancelTaskBtn');
    const cancelEmployeeBtn = document.getElementById('cancelEmployeeBtn');

    if (closeTaskModal) closeTaskModal.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); closeTaskModalHandler(); });
    if (closeEmployeeModal) closeEmployeeModal.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); closeEmployeeModalHandler(); });
    if (cancelTaskBtn) cancelTaskBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); closeTaskModalHandler(); });
    if (cancelEmployeeBtn) cancelEmployeeBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); closeEmployeeModalHandler(); });

    if (elements.taskForm) elements.taskForm.addEventListener('submit', handleTaskSubmit);
    if (elements.employeeForm) elements.employeeForm.addEventListener('submit', handleEmployeeSubmit);

    // Закрытие по клику на фон
    if (elements.taskModal) {
        elements.taskModal.addEventListener('click', (e) => {
            if (e.target === elements.taskModal || e.target.classList.contains('modal-backdrop')) {
                closeTaskModalHandler();
            }
        });
    }
    
    if (elements.employeeModal) {
        elements.employeeModal.addEventListener('click', (e) => {
            if (e.target === elements.employeeModal || e.target.classList.contains('modal-backdrop')) {
                closeEmployeeModalHandler();
            }
        });
    }

    // Предотвращение закрытия при клике на контент
    const taskModalContent = elements.taskModal?.querySelector('.modal-content');
    const employeeModalContent = elements.employeeModal?.querySelector('.modal-content');
    
    if (taskModalContent) taskModalContent.addEventListener('click', (e) => e.stopPropagation());
    if (employeeModalContent) employeeModalContent.addEventListener('click', (e) => e.stopPropagation());
}

function setupTableHandlers() {
    // Сортировка - используем делегирование событий
    document.addEventListener('click', (e) => {
        if (e.target.closest('.sortable')) {
            e.preventDefault();
            e.stopPropagation();
            
            const th = e.target.closest('.sortable');
            const column = th.dataset.column;
            
            if (sortColumn === column) {
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                sortColumn = column;
                sortDirection = 'asc';
            }
            renderTable();
        }
    });

    // Выбор всех
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', (e) => {
            e.stopPropagation();
            const isChecked = e.target.checked;
            const filteredTasks = getFilteredTasks();
            const paginatedTasks = getPaginatedTasks(filteredTasks);
            
            if (isChecked) {
                paginatedTasks.forEach(task => selectedTasks.add(task.id));
            } else {
                paginatedTasks.forEach(task => selectedTasks.delete(task.id));
            }
            renderTable();
        });
    }

    // Кнопки управления таблицей
    const selectAllBtn = document.getElementById('selectAllBtn');
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    const exportTableBtn = document.getElementById('exportTableBtn');

    if (selectAllBtn) {
        selectAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const filteredTasks = getFilteredTasks();
            if (selectedTasks.size === filteredTasks.length) {
                selectedTasks.clear();
            } else {
                filteredTasks.forEach(task => selectedTasks.add(task.id));
            }
            renderTable();
        });
    }

    if (deleteSelectedBtn) {
        deleteSelectedBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (selectedTasks.size > 0 && confirm(`Вы уверены, что хотите удалить ${selectedTasks.size} задач(и)?`)) {
                const selectedCount = selectedTasks.size;
                tasks = tasks.filter(task => !selectedTasks.has(task.id));
                selectedTasks.clear();
                renderContent();
                showNotification(`Удалено задач: ${selectedCount}`);
            }
        });
    }

    if (exportTableBtn) exportTableBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); exportTableToExcel(); });

    // Пагинация
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');

    if (prevPageBtn) prevPageBtn.addEventListener('click', (e) => { 
        e.preventDefault(); 
        e.stopPropagation(); 
        if (currentPage > 1) { 
            currentPage--; 
            renderTable(); 
        } 
    });
    if (nextPageBtn) nextPageBtn.addEventListener('click', (e) => { 
        e.preventDefault(); 
        e.stopPropagation(); 
        const filteredTasks = getFilteredTasks();
        const maxPage = Math.ceil(filteredTasks.length / itemsPerPage);
        if (currentPage < maxPage) { 
            currentPage++; 
            renderTable(); 
        }
    });

    // Делегирование событий для таблицы
    if (elements.tasksTableBody) {
        elements.tasksTableBody.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Чекбоксы
            if (e.target.type === 'checkbox' && e.target.dataset.taskId) {
                const taskId = parseInt(e.target.dataset.taskId);
                const row = e.target.closest('tr');
                if (e.target.checked) {
                    selectedTasks.add(taskId);
                    row.classList.add('selected');
                } else {
                    selectedTasks.delete(taskId);
                    row.classList.remove('selected');
                }
                updateSelectAllCheckbox();
                return;
            }
            
            // Кнопки действий
            if (e.target.closest('.action-btn')) {
                const btn = e.target.closest('.action-btn');
                const taskId = parseInt(btn.dataset.taskId);
                
                if (btn.classList.contains('edit')) {
                    openTaskModal(taskId);
                } else if (btn.classList.contains('delete')) {
                    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
                        tasks = tasks.filter(t => t.id !== taskId);
                        selectedTasks.delete(taskId);
                        renderContent();
                        showNotification('Задача успешно удалена!');
                    }
                } else if (btn.classList.contains('toggle')) {
                    toggleTaskStatus(taskId);
                }
            }
        });

        // Контекстное меню для строк таблицы
        elements.tasksTableBody.addEventListener('contextmenu', (e) => {
            const row = e.target.closest('tr');
            if (row) {
                e.preventDefault();
                const checkbox = row.querySelector('input[type="checkbox"]');
                if (checkbox && checkbox.dataset.taskId) {
                    const taskId = parseInt(checkbox.dataset.taskId);
                    showContextMenu(e, taskId);
                }
            }
        });
    }
}

function setupContextMenu() {
    const editTaskItem = document.getElementById('editTask');
    const deleteTaskItem = document.getElementById('deleteTask');
    const toggleStatusItem = document.getElementById('toggleStatus');
    
    if (editTaskItem) editTaskItem.addEventListener('click', (e) => { e.stopPropagation(); editContextTask(); });
    if (deleteTaskItem) deleteTaskItem.addEventListener('click', (e) => { e.stopPropagation(); deleteContextTask(); });
    if (toggleStatusItem) toggleStatusItem.addEventListener('click', (e) => { e.stopPropagation(); toggleContextTaskStatus(); });
}

function closeContextMenu() {
    if (elements.contextMenu) elements.contextMenu.classList.add('hidden');
}

function handleKeyboard(e) {
    if (e.key === 'Escape') {
        closeTaskModalHandler();
        closeEmployeeModalHandler();
        closeContextMenu();
    }
}

// Навигация по месяцам
function navigateMonth(direction) {
    currentViewDate.setMonth(currentViewDate.getMonth() + direction);
    updateCurrentMonth();
    renderContent();
}

// Рендеринг контента в зависимости от вида
function renderContent() {
    if (currentView === 'chart' || currentView === 'both') {
        renderGanttChart();
    }
    if (currentView === 'table' || currentView === 'both') {
        renderTable();
    }
}

// Генерация дней месяца
function generateDaysOfMonth() {
    const days = [];
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isToday = day === today.getDate() && 
                       month === today.getMonth() && 
                       year === today.getFullYear();
        
        days.push({
            day,
            isWeekend,
            isToday,
            date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        });
    }
    
    return days;
}

// Отрисовка заголовка временной шкалы
function renderTimelineHeader() {
    const days = generateDaysOfMonth();
    if (!elements.timelineHeader) return;
    
    elements.timelineHeader.innerHTML = '';
    
    days.forEach(({ day, isWeekend, isToday }) => {
        const dayEl = document.createElement('div');
        dayEl.className = 'timeline-day';
        if (isWeekend) dayEl.classList.add('weekend');
        if (isToday) dayEl.classList.add('today');
        dayEl.textContent = day;
        elements.timelineHeader.appendChild(dayEl);
    });
}

// Отрисовка диаграммы Ганта
function renderGanttChart() {
    renderTimelineHeader();
    
    const filteredEmployees = getFilteredEmployees();
    const filteredTasks = getFilteredTasks();
    
    if (!elements.ganttBody) return;
    elements.ganttBody.innerHTML = '';
    
    filteredEmployees.forEach(employee => {
        const employeeTasks = filteredTasks.filter(task => task.employeeId === employee.id);
        
        const rowEl = document.createElement('div');
        rowEl.className = 'employee-row';
        
        // Колонка с именем сотрудника
        const nameEl = document.createElement('div');
        nameEl.className = 'employee-name';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'employee-delete';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteEmployee(employee.id);
        });
        
        const actionsEl = document.createElement('div');
        actionsEl.className = 'employee-actions';
        actionsEl.appendChild(deleteBtn);
        
        nameEl.textContent = employee.name;
        nameEl.appendChild(actionsEl);
        
        // Временная шкала
        const timelineEl = document.createElement('div');
        timelineEl.className = 'timeline-row';
        
        const days = generateDaysOfMonth();
        days.forEach(({ day, isWeekend }) => {
            const cellEl = document.createElement('div');
            cellEl.className = 'timeline-cell';
            if (isWeekend) cellEl.classList.add('weekend');
            timelineEl.appendChild(cellEl);
        });
        
        // Добавление задач
        employeeTasks.forEach(task => {
            const taskEl = createTaskElement(task, days);
            if (taskEl) timelineEl.appendChild(taskEl);
        });
        
        rowEl.appendChild(nameEl);
        rowEl.appendChild(timelineEl);
        elements.ganttBody.appendChild(rowEl);
    });
}

// Создание элемента задачи
function createTaskElement(task, days) {
    const startDate = new Date(task.startDate);
    const endDate = new Date(task.endDate);
    const viewYear = currentViewDate.getFullYear();
    const viewMonth = currentViewDate.getMonth();
    
    // Проверяем пересечение задачи с текущим месяцем
    const monthStart = new Date(viewYear, viewMonth, 1);
    const monthEnd = new Date(viewYear, viewMonth + 1, 0);
    
    if (endDate < monthStart || startDate > monthEnd) {
        return null; // Задача не пересекается с текущим месяцем
    }
    
    // Вычисляем видимые границы задачи в текущем месяце
    const visibleStart = startDate > monthStart ? startDate : monthStart;
    const visibleEnd = endDate < monthEnd ? endDate : monthEnd;
    
    const startDay = visibleStart.getDate();
    const endDay = visibleEnd.getDate();
    
    const taskEl = document.createElement('div');
    taskEl.className = 'task-bar';
    
    // Добавляем классы для типа и статуса
    taskEl.classList.add(`task-type-${task.type === 'Задача' ? 'task' : 'vacation'}`);
    
    const statusClass = task.status === 'завершена' ? 'completed' : 
                       task.status === 'отменена' ? 'cancelled' : 
                       task.status === 'не начатая' ? 'not-started' : 'active';
    taskEl.classList.add(`status-${statusClass}`);
    
    const cellWidth = 100 / days.length;
    const left = (startDay - 1) * cellWidth;
    const width = (endDay - startDay + 1) * cellWidth;
    
    taskEl.style.left = `${left}%`;
    taskEl.style.width = `${width}%`;
    taskEl.textContent = task.title;
    
    // Создаем детальную подсказку
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU');
    };
    
    const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const tooltip = `${task.title}\n${task.description}\nПериод: ${formatDate(task.startDate)} - ${formatDate(task.endDate)}\nДлительность: ${duration} дн.\nТип: ${task.type}\nСтатус: ${task.status}`;
    taskEl.title = tooltip;
    
    // Обработчики событий
    taskEl.addEventListener('click', (e) => {
        e.stopPropagation();
        openTaskModal(task.id);
    });
    
    taskEl.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showContextMenu(e, task.id);
    });
    
    return taskEl;
}

// Отрисовка таблицы
function renderTable() {
    const filteredTasks = getFilteredTasks();
    const sortedTasks = getSortedTasks(filteredTasks);
    const paginatedTasks = getPaginatedTasks(sortedTasks);
    
    renderTableBody(paginatedTasks);
    renderPagination(filteredTasks.length);
    updateSortIndicators();
    updateSelectAllCheckbox(paginatedTasks);
}

function renderTableBody(tasks) {
    if (!elements.tasksTableBody) return;
    
    elements.tasksTableBody.innerHTML = '';
    
    tasks.forEach(task => {
        const employee = employees.find(emp => emp.id === task.employeeId);
        const row = document.createElement('tr');
        if (selectedTasks.has(task.id)) {
            row.classList.add('selected');
        }
        
        row.innerHTML = `
            <td class="checkbox-column">
                <input type="checkbox" ${selectedTasks.has(task.id) ? 'checked' : ''} 
                       data-task-id="${task.id}">
            </td>
            <td>${employee ? employee.name : 'Неизвестный'}</td>
            <td>
                <span class="type-badge task-type-${task.type === 'Задача' ? 'task' : 'vacation'}">
                    ${task.type}
                </span>
            </td>
            <td class="text-truncate" title="${task.description}">${task.title}</td>
            <td>${formatDate(task.startDate)}</td>
            <td>${formatDate(task.endDate)}</td>
            <td>
                <span class="status-badge status-${getStatusClass(task.status)}">
                    ${task.status}
                </span>
            </td>
            <td class="actions-column">
                <div class="table-actions">
                    <button class="action-btn edit" title="Редактировать" data-task-id="${task.id}">
                        ✎
                    </button>
                    <button class="action-btn delete" title="Удалить" data-task-id="${task.id}">
                        ✕
                    </button>
                    <button class="action-btn toggle" title="Изменить статус" data-task-id="${task.id}">
                        ⟳
                    </button>
                </div>
            </td>
        `;
        
        elements.tasksTableBody.appendChild(row);
    });
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    // Обновление информации о пагинации
    const paginationStart = document.getElementById('paginationStart');
    const paginationEnd = document.getElementById('paginationEnd');
    const paginationTotal = document.getElementById('paginationTotal');
    
    if (paginationStart) paginationStart.textContent = totalItems > 0 ? startItem : 0;
    if (paginationEnd) paginationEnd.textContent = endItem;
    if (paginationTotal) paginationTotal.textContent = totalItems;
    
    // Кнопки навигации
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    
    if (prevPageBtn) prevPageBtn.disabled = currentPage <= 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage >= totalPages;
    
    // Страницы
    const paginationPages = document.getElementById('paginationPages');
    if (paginationPages) {
        paginationPages.innerHTML = '';
        
        for (let i = 1; i <= totalPages; i++) {
            if (i <= 5 || i > totalPages - 5 || Math.abs(i - currentPage) <= 2) {
                const pageBtn = document.createElement('button');
                pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
                pageBtn.textContent = i;
                pageBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    currentPage = i;
                    renderTable();
                });
                paginationPages.appendChild(pageBtn);
            } else if (i === 6 && currentPage > 8) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'pagination-ellipsis';
                paginationPages.appendChild(ellipsis);
            } else if (i === totalPages - 5 && currentPage < totalPages - 7) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.className = 'pagination-ellipsis';
                paginationPages.appendChild(ellipsis);
            }
        }
    }
}

function updateSortIndicators() {
    document.querySelectorAll('.sort-indicator').forEach(indicator => {
        indicator.className = 'sort-indicator';
    });
    
    if (sortColumn) {
        const columnHeader = document.querySelector(`[data-column="${sortColumn}"] .sort-indicator`);
        if (columnHeader) {
            columnHeader.classList.add(sortDirection);
        }
    }
}

function updateSelectAllCheckbox(paginatedTasks = null) {
    const selectAllCheckbox = document.getElementById('selectAllCheckbox');
    if (!selectAllCheckbox) return;
    
    if (!paginatedTasks) {
        const filteredTasks = getFilteredTasks();
        paginatedTasks = getPaginatedTasks(filteredTasks);
    }
    
    const selectedOnPage = paginatedTasks.filter(task => selectedTasks.has(task.id)).length;
    
    if (selectedOnPage === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    } else if (selectedOnPage === paginatedTasks.length) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
    } else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
    }
}

// Фильтрация данных
function getFilteredEmployees() {
    const employeeFilterValue = elements.employeeFilter?.value;
    
    if (!employeeFilterValue) return employees;
    
    return employees.filter(employee => 
        employee.id.toString() === employeeFilterValue
    );
}

function getFilteredTasks() {
    const employeeFilterValue = elements.employeeFilter?.value;
    const statusFilterValue = elements.statusFilter?.value;
    const searchValue = elements.searchInput?.value.toLowerCase() || '';
    const groupValue = elements.groupFilter?.value;
    
    let filtered = tasks.filter(task => {
        const employeeMatch = !employeeFilterValue || task.employeeId.toString() === employeeFilterValue;
        const statusMatch = !statusFilterValue || task.status === statusFilterValue;
        const searchMatch = !searchValue || 
            task.title.toLowerCase().includes(searchValue) ||
            task.description.toLowerCase().includes(searchValue);
        
        return employeeMatch && statusMatch && searchMatch;
    });
    
    // Группировка
    if (groupValue === 'employee') {
        filtered.sort((a, b) => a.employeeId - b.employeeId);
    } else if (groupValue === 'status') {
        filtered.sort((a, b) => a.status.localeCompare(b.status));
    }
    
    return filtered;
}

function getSortedTasks(tasks) {
    if (!sortColumn) return tasks;
    
    return [...tasks].sort((a, b) => {
        let aVal, bVal;
        
        switch (sortColumn) {
            case 'employee':
                const aEmployee = employees.find(emp => emp.id === a.employeeId);
                const bEmployee = employees.find(emp => emp.id === b.employeeId);
                aVal = aEmployee ? aEmployee.name : '';
                bVal = bEmployee ? bEmployee.name : '';
                break;
            case 'title':
                aVal = a.title;
                bVal = b.title;
                break;
            case 'type':
                aVal = a.type;
                bVal = b.type;
                break;
            case 'status':
                aVal = a.status;
                bVal = b.status;
                break;
            case 'startDate':
                aVal = new Date(a.startDate);
                bVal = new Date(b.startDate);
                break;
            case 'endDate':
                aVal = new Date(a.endDate);
                bVal = new Date(b.endDate);
                break;
            default:
                return 0;
        }
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
}

function getPaginatedTasks(tasks) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return tasks.slice(startIndex, startIndex + itemsPerPage);
}

// Применение фильтров
function applyFilters() {
    currentPage = 1; // Сброс на первую страницу при изменении фильтров
    selectedTasks.clear(); // Очистка выделения
    renderContent();
}

// Утилиты
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU');
}

function getStatusClass(status) {
    switch (status) {
        case 'активная': return 'active';
        case 'завершена': return 'completed';
        case 'отменена': return 'cancelled';
        case 'не начатая': return 'not-started';
        default: return 'active';
    }
}

// Заполнение фильтров
function populateFilters() {
    // Фильтр сотрудников
    if (elements.employeeFilter) {
        elements.employeeFilter.innerHTML = '<option value="">Все сотрудники</option>';
        employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.id;
            option.textContent = employee.name;
            elements.employeeFilter.appendChild(option);
        });
    }
    
    // Заполнение выпадающих списков в модальных окнах
    populateEmployeeSelects();
}

function populateEmployeeSelects() {
    const taskEmployeeSelect = document.getElementById('taskEmployee');
    if (taskEmployeeSelect) {
        taskEmployeeSelect.innerHTML = '<option value="">Выберите сотрудника</option>';
        
        employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.id;
            option.textContent = employee.name;
            taskEmployeeSelect.appendChild(option);
        });
    }
}

// Модальные окна
function openTaskModal(taskId = null) {
    currentEditingTaskId = taskId;
    const modal = elements.taskModal;
    const title = document.getElementById('taskModalTitle');
    
    if (taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            if (title) title.textContent = 'Редактировать задачу';
            fillTaskForm(task);
        }
    } else {
        if (title) title.textContent = 'Добавить задачу';
        if (elements.taskForm) elements.taskForm.reset();
    }
    
    if (modal) modal.classList.remove('hidden');
}

function closeTaskModalHandler() {
    const modal = elements.taskModal;
    if (modal) modal.classList.add('hidden');
    currentEditingTaskId = null;
}

function fillTaskForm(task) {
    const taskEmployee = document.getElementById('taskEmployee');
    const taskTitle = document.getElementById('taskTitle');
    const taskDescription = document.getElementById('taskDescription');
    const taskStartDate = document.getElementById('taskStartDate');
    const taskEndDate = document.getElementById('taskEndDate');
    const taskType = document.getElementById('taskType');
    const taskStatus = document.getElementById('taskStatus');

    if (taskEmployee) taskEmployee.value = task.employeeId;
    if (taskTitle) taskTitle.value = task.title;
    if (taskDescription) taskDescription.value = task.description;
    if (taskStartDate) taskStartDate.value = task.startDate;
    if (taskEndDate) taskEndDate.value = task.endDate;
    if (taskType) taskType.value = task.type;
    if (taskStatus) taskStatus.value = task.status;
}

function handleTaskSubmit(e) {
    e.preventDefault();
    
    const taskEmployee = document.getElementById('taskEmployee');
    const taskTitle = document.getElementById('taskTitle');
    const taskDescription = document.getElementById('taskDescription');
    const taskStartDate = document.getElementById('taskStartDate');
    const taskEndDate = document.getElementById('taskEndDate');
    const taskType = document.getElementById('taskType');
    const taskStatus = document.getElementById('taskStatus');
    
    const formData = {
        employeeId: parseInt(taskEmployee?.value),
        title: taskTitle?.value || '',
        description: taskDescription?.value || '',
        startDate: taskStartDate?.value || '',
        endDate: taskEndDate?.value || '',
        type: taskType?.value || '',
        status: taskStatus?.value || ''
    };
    
    // Валидация
    if (!formData.employeeId || !formData.title || !formData.startDate || !formData.endDate || !formData.type || !formData.status) {
        showNotification('Пожалуйста, заполните все обязательные поля!', 'error');
        return;
    }
    
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
        showNotification('Дата начала не может быть больше даты окончания!', 'error');
        return;
    }
    
    if (currentEditingTaskId) {
        // Редактирование
        const taskIndex = tasks.findIndex(t => t.id === currentEditingTaskId);
        if (taskIndex !== -1) {
            tasks[taskIndex] = { ...tasks[taskIndex], ...formData };
            showNotification('Задача успешно обновлена!');
        }
    } else {
        // Добавление
        const newTask = { id: nextTaskId++, ...formData };
        tasks.push(newTask);
        showNotification('Задача успешно добавлена!');
    }
    
    closeTaskModalHandler();
    renderContent();
}

function openEmployeeModal() {
    const modal = elements.employeeModal;
    if (modal) modal.classList.remove('hidden');
    if (elements.employeeForm) elements.employeeForm.reset();
}

function closeEmployeeModalHandler() {
    const modal = elements.employeeModal;
    if (modal) modal.classList.add('hidden');
}

function handleEmployeeSubmit(e) {
    e.preventDefault();
    
    const employeeNameInput = document.getElementById('employeeName');
    const name = employeeNameInput?.value.trim() || '';
    
    if (!name) {
        showNotification('Введите имя сотрудника!', 'error');
        return;
    }
    
    if (employees.some(emp => emp.name.toLowerCase() === name.toLowerCase())) {
        showNotification('Сотрудник с таким именем уже существует!', 'error');
        return;
    }
    
    const newEmployee = { id: nextEmployeeId++, name };
    employees.push(newEmployee);
    
    closeEmployeeModalHandler();
    renderContent();
    populateFilters();
    showNotification('Сотрудник успешно добавлен!');
}

// Удаление сотрудника
function deleteEmployee(employeeId) {
    if (confirm('Вы уверены, что хотите удалить этого сотрудника? Все его задачи также будут удалены.')) {
        employees = employees.filter(emp => emp.id !== employeeId);
        tasks = tasks.filter(task => task.employeeId !== employeeId);
        
        renderContent();
        populateFilters();
        showNotification('Сотрудник успешно удален!');
    }
}

// Контекстное меню
function showContextMenu(e, taskId) {
    contextMenuTaskId = taskId;
    const menu = elements.contextMenu;
    
    if (menu) {
        menu.style.left = `${e.clientX}px`;
        menu.style.top = `${e.clientY}px`;
        menu.classList.remove('hidden');
    }
}

function editContextTask() {
    if (contextMenuTaskId) {
        openTaskModal(contextMenuTaskId);
        closeContextMenu();
    }
}

function deleteContextTask() {
    if (contextMenuTaskId && confirm('Вы уверены, что хотите удалить эту задачу?')) {
        tasks = tasks.filter(task => task.id !== contextMenuTaskId);
        selectedTasks.delete(contextMenuTaskId);
        renderContent();
        showNotification('Задача успешно удалена!');
        closeContextMenu();
    }
}

function toggleContextTaskStatus() {
    if (contextMenuTaskId) {
        toggleTaskStatus(contextMenuTaskId);
        closeContextMenu();
    }
}

function toggleTaskStatus(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        const statusCycle = ['не начатая', 'активная', 'завершена'];
        const currentIndex = statusCycle.indexOf(task.status);
        task.status = statusCycle[(currentIndex + 1) % statusCycle.length];
        renderContent();
        showNotification(`Статус задачи изменен на: ${task.status}`);
    }
}

// Уведомления
function showNotification(message, type = 'success') {
    const notification = elements.notification;
    const text = document.getElementById('notificationText');
    
    if (!notification || !text) return;
    
    text.textContent = message;
    
    // Сбрасываем классы
    notification.className = 'notification';
    if (type === 'error') {
        notification.classList.add('error');
    }
    
    // Показываем уведомление
    notification.classList.remove('hidden');
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Скрываем через 3 секунды
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 300);
    }, 3000);
}

// Экспорт в Excel
function exportToExcel() {
    try {
        if (typeof XLSX === 'undefined') {
            showNotification('Библиотека XLSX не загружена!', 'error');
            return;
        }

        const workbook = XLSX.utils.book_new();
        
        // Лист с задачами
        const tasksData = tasks.map(task => {
            const employee = employees.find(emp => emp.id === task.employeeId);
            return {
                'ID': task.id,
                'Сотрудник': employee ? employee.name : 'Неизвестный',
                'Название задачи': task.title,
                'Описание': task.description,
                'Дата начала': task.startDate,
                'Дата окончания': task.endDate,
                'Тип': task.type,
                'Статус': task.status
            };
        });
        
        const tasksSheet = XLSX.utils.json_to_sheet(tasksData);
        XLSX.utils.book_append_sheet(workbook, tasksSheet, 'Задачи');
        
        // Лист с сотрудниками
        const employeesData = employees.map(emp => ({
            'ID': emp.id,
            'Имя': emp.name,
            'Количество задач': tasks.filter(task => task.employeeId === emp.id).length
        }));
        
        const employeesSheet = XLSX.utils.json_to_sheet(employeesData);
        XLSX.utils.book_append_sheet(workbook, employeesSheet, 'Сотрудники');
        
        // Сохранение файла
        const fileName = `график_занятости_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(workbook, fileName);
        
        showNotification('Данные успешно выгружены в Excel!');
    } catch (error) {
        console.error('Ошибка экспорта:', error);
        showNotification('Ошибка при экспорте в Excel!', 'error');
    }
}

// Экспорт только таблицы
function exportTableToExcel() {
    try {
        if (typeof XLSX === 'undefined') {
            showNotification('Библиотека XLSX не загружена!', 'error');
            return;
        }

        const filteredTasks = getFilteredTasks();
        const tasksData = filteredTasks.map(task => {
            const employee = employees.find(emp => emp.id === task.employeeId);
            return {
                'Сотрудник': employee ? employee.name : 'Неизвестный',
                'Тип': task.type,
                'Описание': task.title,
                'Дата начала': task.startDate,
                'Дата окончания': task.endDate,
                'Статус': task.status
            };
        });
        
        const worksheet = XLSX.utils.json_to_sheet(tasksData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Отфильтрованные задачи');
        
        const fileName = `таблица_задач_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(workbook, fileName);
        
        showNotification('Таблица успешно экспортирована!');
    } catch (error) {
        console.error('Ошибка экспорта:', error);
        showNotification('Ошибка при экспорте таблицы!', 'error');
    }
}

// Сохранение данных
function saveData() {
    try {
        const data = {
            employees,
            tasks,
            taskTypes,
            taskStatuses,
            nextEmployeeId,
            nextTaskId,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `график_занятости_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        showNotification('Данные успешно сохранены!');
    } catch (error) {
        console.error('Ошибка сохранения:', error);
        showNotification('Ошибка при сохранении данных!', 'error');
    }
}

// Загрузка данных
function loadData(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.employees && data.tasks) {
                employees = data.employees;
                tasks = data.tasks;
                nextEmployeeId = data.nextEmployeeId || Math.max(...employees.map(emp => emp.id), 0) + 1;
                nextTaskId = data.nextTaskId || Math.max(...tasks.map(task => task.id), 0) + 1;
                
                selectedTasks.clear();
                currentPage = 1;
                
                renderContent();
                populateFilters();
                showNotification('Данные успешно загружены!');
            } else {
                showNotification('Неверный формат файла!', 'error');
            }
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            showNotification('Ошибка при загрузке файла!', 'error');
        }
    };
    
    reader.readAsText(file);
    e.target.value = '';
}