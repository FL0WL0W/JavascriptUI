export default class UIButton extends HTMLDivElement {
    get value() { return undefined; }
    set value(value) { }
    get saveValue() { return undefined; }
    set saveValue(saveValue){ }

    get label() { this.textContent; }
    set label(label) { this.textContent = label; }

    constructor(prop) {
        super();
        this.class = `ui button`;
    }
}
customElements.define('ui-button', UIButton, { extends: 'div' });