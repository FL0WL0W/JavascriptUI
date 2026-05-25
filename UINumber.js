export default class UINumber extends HTMLInputElement {
    #value
    #hex = false

    get hex() { return this.#hex }
    set hex(hex) {
        this.#hex = hex
        if(hex) {
            this.type = `text`
        } else {
            this.type = `number`
        }
        super.value = isNaN(this.#value)? `` : hex ? `0x${this.#value.toString(16).toUpperCase()}` : this.#value
    }

    get value() {
        return this.#value
    }
    set value(value) {
        value = this.#hex ? parseInt(value) : parseFloat(value)
        if(this.value === value)
            return

        const prevValue = this.value
        super.value = isNaN(value)? `` : this.#hex ? `0x${value.toString(16).toUpperCase()}` : value
        this.#value = value
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
            this.#value = this.#hex ? parseInt(super.value) : parseFloat(super.value)
            const min = parseFloat(super.min)
            const max = parseFloat(super.max)
            if(!isNaN(this.#value) && !isNaN(min) && this.#value < min)
                this.#value = min
            if(!isNaN(this.#value) && !isNaN(max) && this.#value > max)
                this.#value = max
        })
    }
}
customElements.define(`ui-number`, UINumber, { extends: `input` })