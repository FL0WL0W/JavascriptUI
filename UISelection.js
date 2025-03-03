import { objectTester } from "./UIUtils"

export default class UISelection extends HTMLDivElement {
    static ParseValue(type, value) {
        switch(type) {
            case `number`:
                return parseFloat(value)
            case `boolean`:
                if(typeof value === `number`)
                    return value !== 0
                if(typeof value === `boolean`)
                    return value
                if(typeof value === `string`)
                    return value === `true` || value === `True` || value === `1`
                if(typeof value === `object`) {
                    if(value)
                        return true
                    return false
                }
            case `string`:
                if(typeof value === `number` || typeof value === `boolean`)
                    return `${value}`
                if(typeof value === `string`)
                    return value
                if(typeof value === `object`)
                    return JSON.stringify(value)
            case `object`:
                if(typeof value === `number` || typeof value === `boolean` || typeof value === `object`)
                    return value
                if(typeof value === `string`)
                    return JSON.parse(value)
                break
        }
    }

    #selectDisabled = false
    get selectDisabled() {
        return this.#selectDisabled
    }
    set selectDisabled(selectDisabled) {
        this.#selectDisabled = selectDisabled
        if(!this.selectHidden){
            setElementOption(this.#selectElement, { name: this.selectName, disabled: this.selectDisabled, value: this.selectValue })
        }
    }

    #selectName = `select`
    get selectName() {
        return this.#selectName
    }
    set selectName(selectName) {
        if(this.#selectName === selectName)
            return

        this.#selectName = selectName
        if(this.selectedOption == undefined)
            this.selectedElement.textContent = this.selectName
        if(!this.selectHidden){
            setElementOption(this.#selectElement, { name: this.selectName, disabled: this.selectDisabled, value: this.selectValue })
        }
    }

    #selectValue = undefined
    get selectValue() {
        return this.#selectValue
    }
    set selectValue(selectValue) {
        if(this.#selectValue === selectValue)
            return
            
        this.#selectValue = selectValue
        if(this.selectedOption == undefined) {
            this.selectedElement.value = UISelection.ParseValue(`string`, selectValue)
            this.selectedElement.style.setProperty('--value', this.selectedElement.value);
            this.selectedElement.type = typeof selectValue
        }
        if(!this.selectHidden){
            setElementOption(this.#selectElement, { name: this.selectName, disabled: this.selectDisabled, value: this.selectValue })
        }
    }

    #selectElement
    #selectHidden = false
    get selectHidden() {
        return this.#selectHidden
    }
    set selectHidden(selectHidden) {
        if(this.#selectHidden === selectHidden)
            return

        this.#selectHidden = selectHidden
        if(!this.selectHidden){
            setElementOption(this.#selectElement, { name: this.selectName, disabled: this.selectDisabled, value: this.selectValue })
        } else if(this.contextMenuElement.children[0] != undefined) {
            this.contextMenuElement.removeChild(this.contextMenuElement.children[0])
        }
    }

    collapse = 20
    #updateSelectElement() {
        const selectedElement = this.selectedElement
        const collapseUnSelected = this.contextMenuElement.querySelectorAll(`.selectoption, .selectgroup`).length >= this.collapse && this.collapse > 0
        if(collapseUnSelected) this.contextMenuElement.classList.add(`collapsible`)
        else this.contextMenuElement.classList.remove(`collapsible`)
        let selected = false;
        [...this.contextMenuElement.children].forEach(element => { 
            let selectedInThisGroup = false;
            [...element.children].forEach(element => { 
                if(selectedElement.value == undefined || element.value !== selectedElement.value) element.classList.remove(`selected`)
                else { element.classList.add(`selected`); selected = true; selectedInThisGroup = true }
            })
            if(!selectedInThisGroup) element.classList.add(`collapsed`)
            else element.classList.remove(`collapsed`)
            if(element.value !== selectedElement.value) element.classList.remove(`selected`)
            else { element.classList.add(`selected`); selected = true }
        })
        const selectedText = this.selectedOption?.selectedName ?? this.selectedOption?.name ?? this.selectName
        if(this.selectedElement.textContent !== selectedText)
            this.selectedElement.textContent = selectedText
        if(!selected)
            this.#selectElement.classList.add(`selected`)
        if(this.options.map(option => option.options?.length ?? 1).reduce((partionSum, a) => partionSum + a, 0)  < (this.selectHidden? 2 : 1))
            selectedElement.classList.add(`single`)
        else
            selectedElement.classList.remove(`single`)
    }

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

        const newLen = options.length + (this.selectHidden? 0 : 1)
        while(newLen < this.contextMenuElement.children.length)
            this.contextMenuElement.removeChild(this.contextMenuElement.children[newLen])
        if(!this.selectHidden){
            this.#selectElement = this.contextMenuElement.children[0]
            if(this.#selectElement == undefined)
                this.#selectElement = this.contextMenuElement.appendChild(document.createElement(`div`))
            setElementOption(this.#selectElement, { name: this.selectName, disabled: this.selectDisabled, value: this.selectValue })
        }
        options.forEach((option, index) => {
            let optionElement = this.contextMenuElement.children[index + (this.selectHidden? 0 : 1)]
            if(optionElement == undefined)
                optionElement = this.contextMenuElement.appendChild(document.createElement(`div`))
            setElementOption(optionElement, option)
        })
        this.#updateSelectElement()
    }

    get selectedOption() {
        const stringValue = this.selectedElement.value
        let selectedOption = this.options.find(x => UISelection.ParseValue(`string`, x.value) === stringValue || x.options?.findIndex(x => UISelection.ParseValue(`string`, x.value) === stringValue) > -1)
        if(selectedOption?.group) 
            selectedOption = selectedOption.options.find(x => UISelection.ParseValue(`string`, x.value) === stringValue)
        return selectedOption
    }
    set selectedOption(selectedOption) {
        this.value = selectedOption.value
    }

    get value() {
        return UISelection.ParseValue(this.selectedElement.type, this.selectedElement.value)
    }
    set value(value) {
        if(this.selectHidden && this.value == undefined && this.options.length === 1)
            value = this.options[0].value
        if(objectTester(this.value, value))
            return
            
        const selectedElement = this.selectedElement
        selectedElement.type = typeof value
        selectedElement.value = UISelection.ParseValue(`string`, value)
        selectedElement.style.setProperty('--value', selectedElement.value);
        this.#updateSelectElement()
        this.dispatchEvent(new Event(`change`, {bubbles: true}))
    }

    get saveValue() {
        return this.value
    }
    set saveValue(saveValue){
        this.value = saveValue
    }

    constructor(prop) {
        super()
        this.class = `ui select`
        this.selectedElement = this.appendChild(document.createElement(`div`))
        this.selectedElement.class = `ui selected`
        this.contextMenuElement = document.createElement(`div`)
        this.contextMenuElement.class = `ui context-menu`
        this.#selectElement = document.createElement(`div`)
        this.contextMenuElement.prepend(this.#selectElement)
        setElementOption(this.#selectElement, { name: this.selectName, disabled: this.selectDisabled, value: this.selectValue })
        Object.assign(this, prop)

        let visible = false
        let collapsingClick = false
        this.selectedElement.addEventListener(`click`, () => {
            this.#updateSelectElement()
            if(visible) 
                return
            if(this.selectHidden && this.options.length < 2)
                return
            if(this.selectedElement.classList.contains(`single`))
                return

            const clickHandler = () => {
                if(collapsingClick)
                    return collapsingClick = false
                if(!visible) 
                    return
                this.removeChild(this.contextMenuElement)
                document.removeEventListener(`click`, clickHandler)
                visible = false
            }
            document.addEventListener(`click`, clickHandler)
            window.setTimeout(() => { this.append(this.contextMenuElement); visible = true }, 1)
        })
        this.contextMenuElement.addEventListener(`click`, event => {
            if(event.target.classList.contains(`selectdisabled`))
                return
            if(event.target.classList.contains(`selectgroup`) && this.contextMenuElement.classList.contains(`collapsible`)) {
                if(event.target.parentElement.classList.contains(`collapsed`)) event.target.parentElement.classList.remove(`collapsed`) 
                else event.target.parentElement.classList.add(`collapsed`)
                collapsingClick = true
                return
            }
            if(!event.target.classList.contains(`selectoption`))
                return
            
            this.value = UISelection.ParseValue(event.target.type, event.target.value)
        })
        this.#updateSelectElement()
    }
}

function setElementOption(element, option) {
    element.removeAttribute("class")
    if(option.group) {
        delete element.type
        delete element.value
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
        element.type = typeof option.value
        element.value =  UISelection.ParseValue(`string`, option.value)
        element.style.setProperty('--value', element.value);
        element.textContent = option.name + (option.info? ` ${option.info}` : ``)
    }
}
customElements.define(`ui-selection`, UISelection, { extends: `div` })