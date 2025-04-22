export class DOMUtils {
    static addClass(el, className) {
        el.classList.add(className);
    }

    static removeClass(el, className) {
        el.classList.remove(className);
    }

    static createElement(tag, className) {
        const el = document.createElement(tag);
        if (className) el.className = className;
        return el;
    }
    static setTextContent(el, text) {
        el.textContent = text;
    }
    // static setAcitveMode(el, mode) {
    //     if (mode === 'active') {
    //         el.classList.add('active');
    //     } else {
    //         el.classList.remove('active');
    //     }
    // }
}
