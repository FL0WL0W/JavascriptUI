export default class UITemplate extends HTMLSpanElement {
    constructor(prop) {
        super()
        if(prop)
            this.Setup(prop)
    }

    Setup(prop) {
        prop ??= {}
        const propSaveValue = prop.saveValue
        const propValue = prop.value
        delete prop.saveValue
        delete prop.value
        Object.assign(this, prop)
        if(propSaveValue !== undefined)
            this.saveValue = propSaveValue
        if(propValue !== undefined)
            this.value = propValue
        const thisClass = this
        var thisEntries = Object.entries(this)
        thisEntries.forEach(function([elementName, element]) {
            element?.addEventListener?.(`change`, function() {
                thisClass.dispatchEvent(new Event(`change`, {bubbles: true}))
            })
        })

        const template = this.template ?? this.constructor.template
        this.innerHTML = template
        this.querySelectorAll(`[data-element]`).forEach(function(element){
            let found = thisEntries.find(function([elementName, e]) { return element.dataset.element === elementName })
            if(!found)
                return
            let [matchingUIName, matchingUI] = found
            element.replaceWith(matchingUI)
        })
    }
    
    get saveValue() {
        let saveValue = {}

        Object.entries(this).forEach(function([elementName, element]) {
            if(element?.saveValue !== undefined)
                saveValue[elementName] = element.saveValue
        })

        if(Object.keys(saveValue).length === 0)
            return undefined

        return saveValue
    }

    set saveValue(saveValue) {
        if(saveValue === undefined)
            return

        Object.entries(this).forEach(function([elementName, element]) {
            if(saveValue[elementName] !== undefined && typeof element === `object` && Object.keys(element).indexOf(`saveValue`)) {
                element.saveValue = saveValue[elementName]
            }
        })
    }
    
    get value() {
        let value = {}

        Object.entries(this).forEach(function([elementName, element]) {
            if(element?.value !== undefined)
                value[elementName] = element.value
        })

        if(Object.keys(value).length === 0)
            return undefined

        return value
    }

    set value(value) {
        if(value === undefined)
            return

        Object.entries(this).forEach(function([elementName, element]) {
            if(value[elementName] !== undefined && typeof element === `object`) {
                element.value = value[elementName]
            }
        })
    }
}
customElements.define('ui-template', UITemplate, { extends: `span` })