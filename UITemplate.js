const templateContentCache = new Map()

function getTemplateContent(template) {
    let cachedContent = templateContentCache.get(template)
    if(cachedContent)
        return cachedContent

    const templateElement = document.createElement(`template`)
    templateElement.innerHTML = template
    cachedContent = templateElement.content
    templateContentCache.set(template, cachedContent)
    return cachedContent
}

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
        if(propSaveValue != undefined)
            this.saveValue = propSaveValue
        if(propValue != undefined)
            this.value = propValue
        const thisEntries = Object.entries(this)
        const entryMap = new Map(thisEntries)
        const template = this.template ?? this.constructor.template
        this.replaceChildren(getTemplateContent(template).cloneNode(true))
        this.querySelectorAll(`[data-element]`).forEach(element => {
            const matchingUI = entryMap.get(element.dataset.element)
            if(matchingUI == undefined)
                return
            element.replaceWith(matchingUI)
        })
    }
    
    get saveValue() {
        let saveValue = {}

        Object.entries(this).forEach(([elementName, element]) => {
            if(element?.saveValue != undefined)
                saveValue[elementName] = element.saveValue
        })

        if(Object.keys(saveValue).length === 0)
            return undefined

        return saveValue
    }

    set saveValue(saveValue) {
        if(saveValue == undefined)
            return

        Object.entries(this).forEach(([elementName, element]) => {
            if(saveValue[elementName] != undefined && typeof element === `object` && Object.keys(element).indexOf(`saveValue`)) {
                element.saveValue = saveValue[elementName]
            }
        })
    }
    
    get value() {
        let value = {}

        Object.entries(this).forEach(([elementName, element]) => {
            if(element?.value != undefined)
                value[elementName] = element.value
        })

        if(Object.keys(value).length === 0)
            return undefined

        return value
    }

    set value(value) {
        if(value == undefined)
            return

        Object.entries(this).forEach(([elementName, element]) => {
            if(value[elementName] != undefined && typeof element === `object`) {
                element.value = value[elementName]
            }
        })
    }
}
customElements.define('ui-template', UITemplate, { extends: `span` })