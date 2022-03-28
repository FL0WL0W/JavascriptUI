export default class UITemplate extends HTMLDivElement {
    onChange = [];

    constructor(prop) {
        super();
        this.style.display = `inline-block`;
        if(prop)
            this.Setup(prop);
    }

    Setup(prop) {
        Object.assign(this, prop);
        if(!Array.isArray(this.onChange))
            this.onChange = [ this.onChange ];
        const thisClass = this;
        this.addEventListener(`change`, function() {
            thisClass.onChange.forEach(function(onChange) { onChange(); });
        });
        var thisEntries = Object.entries(this);
        thisEntries.forEach(function([elementName, element]) {
            element?.addEventListener?.(`change`, function() {
                thisClass.dispatchEvent(new Event(`change`));
            });
        });

        const template = this.Template ?? this.constructor.Template;
        this.innerHTML = template;
        this.querySelectorAll(`[data-element]`).forEach(function(element){
            let found = thisEntries.find(function([elementName, e]) { return element.dataset.element === elementName; });
            if(!found)
                return;
            let [matchingUIName, matchingUI] = found;
            element.replaceWith(matchingUI);
        });
    }
    
    get saveValue() {
        let saveValue = {};

        Object.entries(this).forEach(function([elementName, element]) {
            if(element.saveValue !== undefined)
                saveValue[elementName] = element.saveValue;
        });

        if(Object.keys(saveValue).length === 0)
            return undefined;

        return saveValue;
    }

    set saveValue(saveValue) {
        if(saveValue === undefined)
            return;

        Object.entries(this).forEach(function([elementName, element]) {
            if(saveValue[elementName] !== undefined && typeof element === `object`) {
                element.saveValue = saveValue[elementName];
            }
        });
    }
    
    get value() {
        let value = {};

        Object.entries(this).forEach(function([elementName, element]) {
            if(element.value !== undefined)
                value[elementName] = element.value;
        });

        if(Object.keys(value).length === 0)
            return undefined;

        return value;
    }

    set value(value) {
        if(value === undefined)
            return;

        Object.entries(this).forEach(function([elementName, element]) {
            if(value[elementName] !== undefined && typeof element === `object`) {
                element.value = value[elementName];
            }
        });
    }
}
customElements.define('ui-template', UITemplate, { extends: 'div' });