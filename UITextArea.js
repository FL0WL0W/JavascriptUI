import "./UIUtils.js";

export default class UITextArea extends HTMLTextAreaElement {
    #value = ``
    get value() {
        return this.#value
    }
    set value(value) {
        if(this.#value === value)
            return

        super.value = this.#value = value
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
        this.class = `ui text`
        this.addEventListener(`change`, () => {
            this.#value = super.value
        })
        Object.assign(this, prop)
    }
}
customElements.define(`ui-textarea`, UITextArea, { extends: `textarea` })