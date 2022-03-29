export default class UINumber extends HTMLInputElement {
    get value() {
        return parseFloat(super.value);
    }
    set value(value) {
        value = parseFloat(value);
        if(parseFloat(super.value) === value)
            return;

        super.value = value;
        super.dispatchEvent(new Event(`change`, {bubbles: true}));
    }

    get saveValue() {
        return this.value;
    }
    set saveValue(saveValue){
        this.value = saveValue;
    }

    constructor(prop) {
        super();
        this.type = `number`;
        this.class = `ui number`;
        Object.assign(this, prop);
    }
}
customElements.define('ui-number', UINumber, { extends: 'input' });