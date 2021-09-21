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
// Переменная-счетчик необходима для установки позиции по осbb
let zIndex = 1;


/**
 * @param {MouseEvent} event
 */
function createWindow(event) {
    let rootWindow = document.createElement("div"),
        head = document.createElement("div"),
        body = document.createElement("div"),
        headerText = document.createElement("div"),
        close = document.createElement("div");

    rootWindow.append(head, body);
    head.append(headerText, close);
    head.onmousedown = onMouseDown;
    head.onmousemove = onMouseMove;
    head.onmouseup = onMouseUp;

    headerText.textContent = "Это окно";

    rootWindow.className = "window";
    head.className = "head";
    body.className = "body";
    close.className = "close";

    close.onclick = closeWindow;

    document.body.append(rootWindow);
}

/**
 * @param {MouseEvent} event
 */
function closeWindow(event) {
    let thisWindow = this.closest(".window");
    if (thisWindow) {
        thisWindow.remove();
    }
}

/**
 * @param {MouseEvent} event
 */
function onMouseDown(event) {
    this.dataset.isMove = "true";
    this.dataset.x = event.clientX;
    this.dataset.y = event.clientY;
    this.parentElement.style.zIndex = "" + (zIndex++);
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