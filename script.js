/**
 * Получить ссылку на элемент кнопки по его ID
 * @type {HTMLButtonElement}
 */
let buttonCreateWindow = document.querySelector("#ButtonCreateWindow");
// Проверить, что кнопку удалось получить (не null)
if (buttonCreateWindow) {
    // Для этой кнопки установить событие на клик мыши
    buttonCreateWindow.onclick = createWindow;
}
// Переменная-счетчик необходима для установки позиции по оси Z активного окна
// чтобы активное окно было всегда поверх всех остальных
let zIndex = 1;
let windowCounter = 1;

/**
 * Создание нового окна
 * @param {MouseEvent} event
 */
function createWindow(event) {
    /**
     * Создание структуры HTML
     * <div class="window">
     *     <div class="head">
     *         <div>Текст заголовка окна</div>
     *         <div class="close"></div>
     *     </div>
     *     <div class="body"></div>
     * </div>
     */

    let rootWindow = Div({className: "window"}),
        head = Div({className: "head"}),
        body = Div({className: "body"}),
        headerText = Div({textContent: "Это окно #" + windowCounter++}),
        hide = Div({className: "hide"}),
        close = Div({className: "close"});

    rootWindow.append(head, body);
    head.append(headerText, hide, close);

    // События на заголовок для перемещения окна
    head.onmousedown = onMouseDown;
    head.onmousemove = onMouseMove;
    head.onmouseup = onMouseUp;

    // Событие на кнопку "Закрыть"
    close.onclick = closeWindow;
    hide.onclick = hideWindow;
    rootWindow.onmousedown = topMost;

    // Добавить созданное окно в конец тела страницы
    document.body.append(rootWindow);
}

/**
 * Клик по окну делает его поверх всех остальных окон
 */
function topMost() {
    if (this.classList.contains("hidden")) return;
    // Установить на текущее окно позицию по оси Z выше, чем у кого-либо
    this.style.zIndex = "" + (zIndex++);
    // Найти все окна, у которых прописан класс top и удалить его
    let windows = document.querySelectorAll(".window.top");
    for (let i = 0; i < windows.length; i++) {
        windows[i].classList.remove("top");
    }
    // На текущее окно добавить класс top
    this.classList.add("top");
}

/**
 * @param {MouseEvent} event
 */
function closeWindow(event) {
    // Для закрытия окна получаем родительский элемент текущего
    // элемента (т.е. кнопки закрыть) с классом .window
    let thisWindow = this.closest(".window");
    if (thisWindow) {
        // И если его нашли - удаляем
        thisWindow.remove();
    }
}

/**
 * @param {MouseEvent} event
 */
function hideWindow(event) {
    let thisWindow = this.closest(".window");
    if (!thisWindow) return;

    if (thisWindow.classList.contains("hidden")) {
        thisWindow.classList.add("top");
        thisWindow.classList.remove("hidden");
        if (typeof thisWindow.onmousedown === "function") {
            thisWindow.onmousedown.call(thisWindow);
        }
        document.body.append(thisWindow);
        return;
    }

    let hiddenContainer = document.querySelector("#HiddenContainer");
    if (!hiddenContainer) {
        hiddenContainer = Div({className: "hidden-container", id: "HiddenContainer", parent: document.body});
    }

    thisWindow.classList.remove("top");
    thisWindow.classList.add("hidden");
    hiddenContainer.append(thisWindow);
}

/**
 * @param {MouseEvent} event
 */
function onMouseDown(event) {
    if (this.closest(".window.hidden")) return;
    // Установить флажок на текущее окно, говоря, что его можно перемещать
    // Событие onmousemove будет работать для этого элемента, если значение "true
    this.dataset.isMove = "true";
    // Сохранить текущую позицию мыши, чтобы потом найти разницу между предыдущей
    // и текущей позицией мыши
    this.dataset.x = "" + event.clientX;
    this.dataset.y = "" + event.clientY;
}

/**
 * @param {MouseEvent} event
 */
function onMouseUp(event) {
    this.dataset.isMove = "false";
}

/**
 * @param {MouseEvent} event
 */
function onMouseMove(event) {
    if (this.dataset.isMove !== "true") return;

    // Разница позиции курсора текущего кадра с предыдущим
    let x = event.clientX - +this.dataset.x;
    let y = event.clientY - +this.dataset.y;

    let bound = this.parentElement.getBoundingClientRect();

    this.parentElement.style.left = `${bound.left + x}px`;
    this.parentElement.style.top = `${bound.top + y}px`;

    this.dataset.x = "" + event.clientX;
    this.dataset.y = "" + event.clientY;
}