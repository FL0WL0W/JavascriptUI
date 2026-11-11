import { objectTester } from "./UIUtils"
import UIContextMenu from "./UIContextMenu"

function selectionValuesEqual(left, right) {
    const normalize = value => typeof value === `object` ? JSON.parse(JSON.stringify(value)) : value
    return objectTester(normalize(left), normalize(right))
}

export default class UISelection extends HTMLDivElement {
    #updateContextMenuOptions() {
        const headerOption = this.selectHidden
            ? null
            : { name: this.selectName, disabled: this.selectDisabled, value: this.selectValue }
        this.contextMenu.options = headerOption ? [headerOption, ...this.#options] : this.#options
    }

    #updateSelectElement() {
        const selectedOption = this.selectedOption
        const selectedValue = selectedOption?.value ?? this.selectValue
        const selectedText = selectedOption?.selectedName ?? selectedOption?.name ?? this.selectName
        this.selectedElement.style.setProperty('--value', selectedValue)
        this.contextMenu.markSelected(option => selectionValuesEqual(option.value, selectedValue))
        this.selectedElementSpan.textContent = selectedText
        if(this.options.map(option => option.options?.length ?? 1).reduce((partionSum, a) => partionSum + a, 0) < 1)
            this.selectedElement.classList.add(`single`)
        else
            this.selectedElement.classList.remove(`single`)
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
        
        this.#updateSelectElement()
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

        this.#updateSelectElement()
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

    #options = []
    lastValidValue
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
        const value = this.#value
        let selectedOption = this.options.find(x => selectionValuesEqual(x.value, value) || x.options?.some(x => selectionValuesEqual(x.value, value)))
        if(selectedOption?.group)
            selectedOption = selectedOption.options.find(x => selectionValuesEqual(x.value, value))
        if(selectedOption == undefined && this.options.map(option => option.options?.length ?? 1).reduce((partionSum, a) => partionSum + a, 0) == 1)
            selectedOption = this.options[0]?.options?.[0] ?? this.options[0]
        return selectedOption
    }
    set selectedOption(selectedOption) {
        this.value = selectedOption.value
    }

    #value = undefined
    get valueWithoutSelectionVerification() {
        return this.#value
    }
    get value() {
        return this.selectedOption?.value;
    }
    set value(value) {
        if(objectTester(this.#value, value))
            return;

        this.#value = value

        this.#updateSelectElement()
        this.dispatchEvent(new Event(`change`, { bubbles: true }))
    }

    get saveValue() {
        return this.#value
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
