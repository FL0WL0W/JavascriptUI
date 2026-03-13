import { objectTester } from "./UIUtils"

function setElementOption(element, option) {
    element.removeAttribute("class")
    if(option.group) {
        let selectGroupElement = document.createElement(`div`)
        element.replaceChildren(selectGroupElement)
        selectGroupElement.classList.add(`selectgroup`)
        selectGroupElement.textContent = option.group
        option.options.forEach(option => {
            let optionElement = element.appendChild(document.createElement(`div`))
            setElementOption(optionElement, option)
        })
    } else {
        element.classList.add(`selectoption`)
        if(option.disabled)
            element.classList.add(`selectdisabled`)
        element._optionData = option
        element.textContent = option.name + (option.info? ` ${option.info}` : ``)
    }
}

export default class UIContextMenu extends HTMLDivElement {
    #visible = false
    #collapsingClick = false

    get visible() {
        return this.#visible
    }

    collapse = 20

    #options = []
    get options() {
        return this.#options
    }
    set options(options) {
        if(options == undefined)
            options = []
        if(objectTester(this.#options, options))
            return
        this.#options = options

        const newLen = options.length
        while(newLen < this.children.length)
            this.removeChild(this.children[newLen])
        options.forEach((option, index) => {
            let optionElement = this.children[index]
            if(optionElement == undefined)
                optionElement = this.appendChild(document.createElement(`div`))
            setElementOption(optionElement, option)
        })
    }

    markSelected(predicate) {
        ;[...this.children].forEach(element => {
            let groupSelected = false
            ;[...element.children].forEach(child => {
                if(!child._optionData) return
                if(predicate(child._optionData)) { child.classList.add(`selected`); groupSelected = true; }
                else child.classList.remove(`selected`)
            })
            if(element._optionData) {
                if(predicate(element._optionData)) element.classList.add(`selected`)
                else element.classList.remove(`selected`)
            } else {
                if(groupSelected) element.classList.add(`selected`)
                else element.classList.remove(`selected`)
            }
        })
    }

    show() {
        if(this.#visible)
            return

        const collapseUnSelected = this.querySelectorAll(`.selectoption, .selectgroup`).length >= this.collapse && this.collapse > 0
        if(collapseUnSelected) {
            this.classList.add(`collapsible`)
            this.querySelectorAll(`.selectgroup`).forEach(group => {
                if(group.parentElement.querySelectorAll(`.selected`).length < 1)
                    group.parentElement.classList.add(`collapsed`)
            })
        } else { 
            this.classList.remove(`collapsible`)
            this.querySelectorAll(`.collapsed`).forEach(x => x.classList.remove(`collapsed`))
        }

        const clickHandler = () => {
            if(this.#collapsingClick)
                return (this.#collapsingClick = false)
            if(!this.#visible)
                return
            this.style.display = `none`
            document.removeEventListener(`click`, clickHandler)
            this.#visible = false
        }
        document.addEventListener(`click`, clickHandler)
        window.setTimeout(() => { this.style.display = ``; this.#visible = true; }, 1)
    }

    hide() {
        if(!this.#visible)
            return
        this.style.display = `none`
        this.#visible = false
    }

    constructor(prop) {
        super()
        this.class = `ui context-menu`
        this.style.display = `none`

        this.addEventListener(`click`, event => {
            if(event.target.classList.contains(`selectdisabled`))
                return
            if(event.target.classList.contains(`selectgroup`) && this.classList.contains(`collapsible`)) {
                if(event.target.parentElement.classList.contains(`collapsed`)) event.target.parentElement.classList.remove(`collapsed`)
                else event.target.parentElement.classList.add(`collapsed`)
                this.#collapsingClick = true
                return
            }
            if(!event.target.classList.contains(`selectoption`))
                return

            this.dispatchEvent(new CustomEvent(`optionselect`, { bubbles: true, detail: event.target._optionData }))
        })

        Object.assign(this, prop)
    }
}
customElements.define(`ui-context-menu`, UIContextMenu, { extends: `div` })
