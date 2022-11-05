export default class UINumber extends HTMLInputElement {
    get value() {
        if(this._value == undefined)
            this._value = super.value
        return parseFloat(this._value)
    }
    set value(value) {
        value = parseFloat(value)
        if(parseFloat(this._value) === value)
            return

        super.value = this._value = value
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
        this.addEventListener(`change`, () => { 
            delete this._value
        });
    }
}
customElements.define(`ui-number`, UINumber, { extends: `input` })