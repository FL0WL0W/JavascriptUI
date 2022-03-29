export default class UICheckBox extends HTMLInputElement {
    get value() {
        return this.checked;
    }
    set value(value) {
        if(this.checked === value)
            return;

        this.checked = value;
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
        this.type = `checkbox`;
        this.class = `ui checkbox`;
        Object.assign(this, prop);
    }
}
customElements.define('ui-checkbox', UICheckBox, { extends: 'input' });