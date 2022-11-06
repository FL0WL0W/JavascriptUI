import UIButton from "./UIButton.js"
export default class UIDialog extends HTMLSpanElement {
    get value() { return undefined }
    set value(value) { }
    get saveValue() { return undefined }
    set saveValue(saveValue){ }

    content = document.createElement(`div`)
    #button = new UIButton()
    #dialog = document.createElement(`dialog`)
    #titleBarElement = document.createElement(`div`)
    #titleElement = document.createElement(`div`)
    #closeElement = document.createElement(`div`)


    get title() {
        return this.#titleElement.textContent
    }
    set title(title) {
        this.#titleElement.textContent = title
    }

    get buttonLabel() {
        return this.#button.label
    }
    set buttonLabel(buttonLabel) {
        this.#button.label = buttonLabel
    }

    get title() {
        return this.#titleElement.innerText
    }
    set title(title) {
        this.#titleElement.innerText = title
    }

    constructor(prop) {
        super()
        this.title = `Dialog`
        this.buttonLabel - `Open`
        this.append(this.#button)
        this.#dialog.class = `ui dialog`
        this.#dialog.style.bottom = `0px`
        document.getElementsByTagName(`body`)[0].append(this.#dialog)
        this.#titleBarElement.class = `titlebar`
        this.#dialog.append(this.#titleBarElement)
        this.content.class = `content`
        this.#dialog.append(this.content)
        this.#titleElement.class = `title`
        this.#titleBarElement.append(this.#titleElement)
        this.#closeElement.class = `close`
        this.#titleBarElement.append(this.#closeElement)
        Object.assign(this, prop)
        this.#button.addEventListener(`click`, () => {
            this.#dialog.show()
            if(this.#dialog.style.right == 0) {
                this.#dialog.style.top = `0px`
                this.#dialog.style.left = `0px`
            }
        })
        this.#closeElement.addEventListener(`click`, () => {
            this.#dialog.close()
            delete this.#dialog.style.top
            delete this.#dialog.style.left
        })
        this.#titleBarElement.addEventListener(`mousedown`, event => {
            this.#dialog.style.left = this.#dialog.offsetLeft
            this.#dialog.style.right = `auto`
            this.#dialog.style.top = this.#dialog.offsetTop
            this.#dialog.style.bottom = `auto`
            let state = {
                pageX: event.pageX,
                pageY: event.pageY,
                left: parseFloat(this.#dialog.style.left),
                top: parseFloat(this.#dialog.style.top)
            }
            const mouseMove = event => {
                let xDiff = event.pageX - state.pageX
                let yDiff = event.pageY - state.pageY
                this.#dialog.style.left = state.left + xDiff
                this.#dialog.style.top = state.top + yDiff
            }
            const mouseUp = () => {
                document.removeEventListener(`mousemove`, mouseMove)
                document.removeEventListener(`mouseup`, mouseUp)
            }
            document.addEventListener(`mousemove`, mouseMove)
            document.addEventListener(`mouseup`, mouseUp)
        })
    }
}
customElements.define('ui-dialog', UIDialog, { extends: `span` })