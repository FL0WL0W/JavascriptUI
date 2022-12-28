export default class UINumber extends HTMLInputElement {
    get value() {
        if(this._value == undefined)
            this._value = parseFloat(super.value)
        return this._value
    }
    set value(value) {
        value = parseFloat(value)
        if(parseFloat(this.value) === value)
            return

        const prevValue = this.value
        super.value = isNaN(value)? `` : value
        this._value = undefined
        if(prevValue === this.value || (isNaN(prevValue) && isNaN(this.value)))
            return

        super.dispatchEvent(new Event(`change`, {bubbles: true}))
    }

    get min() { return super.min }
    set min(min) { 
        super.min = min 
        if(min != undefined && this.value != undefined && this.value < parseFloat(min))
            this.value = min
    }

    get max() { return super.max }
    set max(max) { 
        super.max = max
        if(max != undefined && this.value != undefined && this.value > parseFloat(max))
            this.value = max
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