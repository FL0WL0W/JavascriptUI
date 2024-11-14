import "./UIUtils.js";

export default class UICheckBox extends HTMLInputElement {
    #value = false
    get value() {
        return this.#value
    }
    set value(value) {
        if(this.#value === value)
            return

        this.checked = this.#value = value
        super.dispatchEvent(new Event(`change`, {bubbles: true}))
    }

    get saveValue() {
        return this.value
    }
    set saveValue(saveValue){
        this.value = saveValue
    }

    constructor(prop) {
        super()
        this.type = `checkbox`
        this.class = `ui checkbox`
        Object.assign(this, prop)
    }
}
customElements.define(`ui-checkbox`, UICheckBox, { extends: `input` })