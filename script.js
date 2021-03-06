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
const DEFAULT_WINDOW_WIDTH = 400;
const DEFAULT_WINDOW_HEIGHT = 300;

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

    let rootWindow = Div({
            className: "window",
            style: `width:${DEFAULT_WINDOW_WIDTH}px;height:${DEFAULT_WINDOW_HEIGHT}px;`
        }),
        head = Div({className: "head"}),
        body = Div({className: "body"}),
        headerText = Div({textContent: "Это окно #" + windowCounter++}),
        buttons = Div({className: "buttons"}),
        hide = Div({className: "hide"}),
        maximize = Div({className: "maximize"}),
        close = Div({className: "close"});

    rootWindow.append(head, body);
    buttons.append(hide, maximize, close)
    head.append(headerText, buttons);

    // События на заголовок для перемещения окна
    head.onmousedown = onMouseDown;
    head.onmousemove = onMouseMove;
    head.onmouseup = onMouseUp;

    // Событие на кнопку "Закрыть"
    close.onclick = closeWindow;
    hide.onclick = hideWindow;
    maximize.onclick = maximizeWindow;
    head.ondblclick = maximizeWindow;
    rootWindow.onmousedown = topMost;

    // Добавить созданное окно в конец тела страницы
    document.body.append(rootWindow);
}

/**
 * @param {MouseEvent} event
 */
function maximizeWindow(event) {
    // Получить родительский элемент "окно"
    let thisWindow = this.closest(".window");

    let isHidden = false;
    if (thisWindow.classList.contains("hidden")) {
        isHidden = true;
        hideWindow.call(thisWindow.querySelector(".maximize"));
    }

    if (thisWindow) {
        // Если maximize = 1, значит оно уже во весь экран, нужно уменьшить
        if (thisWindow.dataset.maximize === "1") {
            // Установить флажок 0, говоря, что при следующем нажатии его
            // нужно развернуть во весь экран
            thisWindow.dataset.maximize = "0";
            // Восстановить сохраненные данные размера и позиции окна,
            // которые были до разворачивания во весь экран.
            thisWindow.style.width = thisWindow.dataset.width + "px";
            thisWindow.style.height = thisWindow.dataset.height + "px";
            thisWindow.style.top = thisWindow.dataset.top + "px";
            thisWindow.style.left = thisWindow.dataset.left + "px";
            // Эти свойства больше не нужны
            thisWindow.style.right = null;
            thisWindow.style.bottom = null;
        } else {
            // Получить информацию о размерах и позиции окна
            let bound = thisWindow.getBoundingClientRect();
            // Сохранить их в dataset текущего окна
            thisWindow.dataset.width = "" + bound.width;
            if (isHidden) {
                thisWindow.dataset.height = "" + thisWindow.dataset.height;
            } else {
                thisWindow.dataset.height = "" + bound.height;
            }
            thisWindow.dataset.left = "" + bound.left;
            thisWindow.dataset.top = "" + bound.top;
            // Установить позицию со всех сторон по 0, чтобы окно занимало
            // все пространство экрана (окна браузера)
            thisWindow.style.left = "0px";
            thisWindow.style.top = "0px";
            thisWindow.style.right = "0px";
            thisWindow.style.bottom = "0px";
            // Установленные размеры не должны препятствовать свойствам
            // right и bottom, поэтому задать им размеры auto
            thisWindow.style.width = "auto";
            thisWindow.style.height = "auto";
            // Установить флажок, чтобы при следующем нажатии окно уменьшить
            thisWindow.dataset.maximize = "1";
        }
    }
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
        thisWindow.style.height = thisWindow.dataset.height + "px";
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
    thisWindow.dataset.height = "" + thisWindow.getBoundingClientRect().height;
    thisWindow.style.height = "auto";
    hiddenContainer.append(thisWindow);
}

/**
 * @param {MouseEvent} event
 */
function onMouseDown(event) {
    let thisWindow = this.closest(".window");
    if (!thisWindow ||
        thisWindow.classList.contains("hidden") ||
        thisWindow.dataset.maximize === "1"
    ) return;

    // Установить флажок на текущее окно, говоря, что его можно перемещать
    // Событие onmousemove будет работать для этого элемента, если значение "true
    this.dataset.isMove = "true";

    let bound = this.parentElement.getBoundingClientRect();

    // Сохранить текущую позицию мыши, чтобы потом найти разницу между предыдущей
    // и текущей позицией мыши
    this.dataset.x = "" + (event.clientX - bound.left);
    this.dataset.y = "" + (event.clientY - bound.top);
}

/**
 * @param {MouseEvent} event
 */
function onMouseUp(event) {
    this.dataset.isMove = "false";
}

const STEP = 20;

/**
 * @param {MouseEvent} event
 */
function onMouseMove(event) {
    if (this.dataset.isMove !== "true") return;

    let x = event.x - +this.dataset.x;
    let y = event.y - +this.dataset.y;

    let computedX = Math.round((x) / STEP) * STEP;
    let computedY = Math.round((y) / STEP) * STEP;

    this.parentElement.style.left = `${computedX}px`;
    this.parentElement.style.top = `${computedY}px`;
}

// https://github.com/Ryuzaki13/window_move