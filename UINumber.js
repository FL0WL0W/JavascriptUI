export default class UINumber extends HTMLInputElement {
    #value
    get value() {
        return parseFloat(this.#value)
    }
    set value(value) {
        value = parseFloat(value)
        if(parseFloat(this.#value) === value)
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
        this.type = `number`
        this.class = `ui number`
        Object.assign(this, prop)
    }
}
customElements.define(`ui-number`, UINumber, { extends: `input` })