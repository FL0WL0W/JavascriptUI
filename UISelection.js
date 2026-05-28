import { objectTester } from "./UIUtils"
import UIContextMenu from "./UIContextMenu"

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

    #updateContextMenuOptions() {
        const headerOption = this.selectHidden
            ? null
            : { name: this.selectName, disabled: this.selectDisabled, value: this.selectValue }
        this.contextMenu.options = headerOption ? [headerOption, ...this.#options] : this.#options
    }

    #selectDisabled = false
    get selectDisabled() {
        return this.#selectDisabled
    }
    set selectDisabled(selectDisabled) {
        this.#selectDisabled = selectDisabled
        this.#updateContextMenuOptions()
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
            this.selectedElementSpan.textContent = this.selectName
        this.#updateContextMenuOptions()
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
            this.selectedElement.style.setProperty('--value', this.selectedElement.value)
            this.selectedElement.type = typeof selectValue
        }
        this.#updateContextMenuOptions()
    }

    #selectHidden = false
    get selectHidden() {
        return this.#selectHidden
    }
    set selectHidden(selectHidden) {
        if(this.#selectHidden === selectHidden)
            return

        this.#selectHidden = selectHidden
        this.#updateContextMenuOptions()
    }

    get collapse() {
        return this.contextMenu.collapse
    }
    set collapse(collapse) {
        this.contextMenu.collapse = collapse
    }

    #updateSelectElement() {
        const selectedElement = this.selectedElement
        this.contextMenu.markSelected(option => UISelection.ParseValue(`string`, option.value) === selectedElement.value)
        const selectedText = this.selectedOption?.selectedName ?? this.selectedOption?.name ?? this.selectName
        if(this.selectedElementSpan.textContent !== selectedText)
            this.selectedElementSpan.textContent = selectedText
        if(this.options.map(option => option.options?.length ?? 1).reduce((partionSum, a) => partionSum + a, 0) < 1)
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
        this.#updateContextMenuOptions()
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
        if(this.options.map(option => option.options?.length ?? 1).reduce((partionSum, a) => partionSum + a, 0) < 1)
            value = (this.options[0]?.options?.[0] ?? this.options[0])?.value
        if(objectTester(this.value, value))
            return

        const selectedElement = this.selectedElement
        selectedElement.type = typeof value
        selectedElement.value = UISelection.ParseValue(`string`, value)
        selectedElement.style.setProperty('--value', selectedElement.value)
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
        this.selectedElementSpan = this.selectedElement.appendChild(document.createElement(`span`))
        this.selectedElement.class = `ui selected`
        this.contextMenu = new UIContextMenu()
        this.append(this.contextMenu)
        this.contextMenu.addEventListener(`optionselect`, event => {
            this.value = event.detail.value
        })
        this.#updateContextMenuOptions()
        Object.assign(this, prop)

        this.selectedElement.addEventListener(`click`, () => {
            this.#updateSelectElement()
            if(this.contextMenu.visible)
                return
            if(this.options.map(option => option.options?.length ?? 1).reduce((partionSum, a) => partionSum + a, 0) < 1)
                return
            if(this.selectedElement.classList.contains(`single`))
                return
            this.contextMenu.show()
        })
        this.#updateSelectElement()
    }
}
customElements.define(`ui-selection`, UISelection, { extends: `div` })