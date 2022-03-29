export default class UIText extends HTMLInputElement {
    get value() {
        return super.value;
    }
    set value(value) {
        if(super.value === value)
            return;

        super.value = value;
        this.dispatchEvent(new Event(`change`, {bubbles: true}));
    }

    get saveValue() {
        return this.value;
    }
    set saveValue(saveValue){
        this.value = saveValue;
    }

    constructor(prop) {
        super();
        this.class = `ui text`;
        Object.assign(this, prop);
    }
}
customElements.define('ui-text', UIText, { extends: 'input' });