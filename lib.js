/**
 * Библиотека функций работы с DOM
 */

/**
 * @param {string} textContent внутреннее текстовое содержание элемента
 * @param {string} className атрибут class
 * @param {string} id идентификатор элемента
 * @param {string} style атрибут style
 * @param {HTMLElement[]} children коллекция дочерних элементов (будут добавлены как дети создаваемого элемента)
 * @param {HTMLElement} parent родитель для создаваемого элемента
 */

/**
 * Создать новый HTMLDivElement
 * @param {{textContent?: string, className?: string, id?: string, style?: string, children?: HTMLElement[], parent?: HTMLElement}?} params
 * @return {HTMLDivElement}
 * @constructor
 */
function Div(params) {
    let div = document.createElement("div");

    params = params || {};

    if (params.textContent) {
        div.textContent = params.textContent;
    }
    if (params.className) {
        div.className = params.className;
    }
    if (params.style) {
        div.style.cssText = params.style;
    }
    if (params.id) {
        div.id = params.id;
    }
    if (params.children && "length" in params.children) {
        div.append(...params.children);
    }
    if (params.parent && params.parent instanceof HTMLElement) {
        params.parent.append(div);
    }

    return div;
}