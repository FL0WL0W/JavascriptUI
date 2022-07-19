export default class UIGauge extends HTMLDivElement {
    #value
    get value() { return this.#value }
    set value(value) { 
        if(this.#value === value)
            return

        this.#value = value
        let steps = (this.max - this.min) / this.step;
        this.style.setProperty(`--gauge-value-deg`, `${(value - this.min) / steps * 270}deg`)
    }

    #min
    get min() { return this.#min }
    set min(min) { 
        if(this.#min === min)
            return

        this.#min = min
        this.querySelectorAll(`.text.min`)[0].innerHTML = min
        this.#updateSteps()
    }

    #max
    get max() { return this.#max }
    set max(max) { 
        if(this.#min === max)
            return

        this.#max = max
        this.querySelectorAll(`.text.max`)[0].innerHTML = max
        this.#updateSteps()
    }

    #step
    get step() { return this.#step }
    set step(step) { 
        if(this.#step === step)
            return

        this.#step = step
        this.#updateSteps()
    }

    #updateSteps() {
        let steps = (this.max - this.min) / this.step;
        if(isNaN(steps))
            return
        let stepHTML = ``
        for(let i = 1; (i+0.01) < steps; i++) {
            stepHTML += `<div class="tick" style="--gauge-tick-deg:${i * 270 / steps}deg;"></div>`
            stepHTML += `<div class="text" style="--gauge-text-deg:${i * 270 / steps}deg;">${this.step * i + this.min}</div>`
        }
        this.querySelectorAll(`.steps`)[0].innerHTML = stepHTML
    }

    #template
    get template() { this.#template }
    set template(template) {
        if(this.#template === template)
            return

        this.innerHTML = this.#template = template
    }

    constructor(prop) {
        super()
        this.class = `ui gauge`
        this.template = prop.template ??
`<div class="tick-circle"><div class="tick-circle-inner"></div></div>
<div class="tick min" style="--gauge-tick-deg:0deg;"></div><div class="text min" style="--gauge-text-deg:0deg;"></div>
<span class="steps"></span>
<div class="tick max" style="--gauge-tick-deg:270deg;"></div><div class="text max" style="--gauge-text-deg:270deg;"></div>
<div class="needle"></div>
<div class="value"></div>`
        delete prop.template
        Object.assign(this, prop)
    }
}
customElements.define(`ui-gauge`, UIGauge, { extends: `div` })