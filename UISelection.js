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

    #updateSelectElement() {
        const selectedElement = this.selectedElement;
        let selected = false;
        [...this.contextMenuElement.children].forEach(function(element) { 
            [...element.children].forEach(function(element) { 
                if(element.value !== selectedElement.value) element.classList.remove(`selected`);
                else { element.classList.add(`selected`); selected = true;}
            });
            if(element.value !== selectedElement.value) element.classList.remove(`selected`);
            else { element.classList.add(`selected`); selected = true;}
        });
        const selectedText = this.selectedOption?.name ?? this.selectName;
        if(selectedElement.textContent !== selectedText)
            selectedElement.textContent = selectedText;
        if(!selected)
            this.#selectElement.classList.add(`selected`);
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

        const thisClass = this
        for(let i = options.length + (thisClass.selectHidden? 0 : 1); i < thisClass.contextMenuElement.children.length; i++){
            thisClass.contextMenuElement.removeChild(thisClass.contextMenuElement.children[i])
        }
        if(!thisClass.selectHidden){
            this.#selectElement = thisClass.contextMenuElement.children[0]
            if(this.#selectElement == undefined)
                this.#selectElement = thisClass.contextMenuElement.appendChild(document.createElement(`div`))
            setElementOption(this.#selectElement, { name: thisClass.selectName, disabled: thisClass.selectDisabled, value: thisClass.selectValue })
        }
        options.forEach(function(option, index) {
            let optionElement = thisClass.contextMenuElement.children[index + (thisClass.selectHidden? 0 : 1)]
            if(optionElement == undefined)
                optionElement = thisClass.contextMenuElement.appendChild(document.createElement(`div`))
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
        if(this.value === value)
            return
            
        const selectedElement = this.selectedElement
        selectedElement.type = typeof value
        selectedElement.value = UISelection.ParseValue(`string`, value)
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
        const thisClass = this

        let visible = false
        this.selectedElement.addEventListener(`click`, function() {
            if(visible) 
                return
            if(thisClass.selectHidden && thisClass.options.length < 2)
                return

            function clickHandler() {
                if(!visible) 
                    return
                thisClass.removeChild(thisClass.contextMenuElement)
                document.removeEventListener(`click`, clickHandler)
                visible = false
            }
            document.addEventListener(`click`, clickHandler)
            window.setTimeout(function() { thisClass.append(thisClass.contextMenuElement); visible = true; }, 1)
        })
        this.contextMenuElement.addEventListener(`click`, function(event) {
            if(event.target.classList.contains(`selectdisabled`))
                return
            if(!event.target.classList.contains(`selectoption`))
                return
            
            thisClass.value = UISelection.ParseValue(event.target.type, event.target.value)
        })
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
        option.options.forEach(function(option) {
            let optionElement = element.appendChild(document.createElement(`div`))
            setElementOption(optionElement, option)
        })
    } else {
        element.classList.add(`selectoption`)
        if(option.disabled)
            element.classList.add(`selectdisabled`)
        element.type = typeof option.value
        element.value =  UISelection.ParseValue(`string`, option.value)
        element.textContent = option.name + (option.info? ` ${option.info}` : ``)
    }
}
customElements.define(`ui-selection`, UISelection, { extends: `div` })