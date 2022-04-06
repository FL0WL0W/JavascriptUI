import UIButton from "./UIButton.js"
export default class UIDialog extends HTMLSpanElement {
    get value() { return undefined; }
    set value(value) { }
    get saveValue() { return undefined; }
    set saveValue(saveValue){ }

    content = document.createElement(`div`);
    #button = new UIButton();
    #dialog = document.createElement(`dialog`);
    #titleBarElement = document.createElement(`div`);
    #titleElement = document.createElement(`div`);
    #closeElement = document.createElement(`div`);


    get title() {
        return this.#titleElement.textContent;
    }
    set title(title) {
        this.#titleElement.textContent = title;
    }

    get buttonLabel() {
        return this.#button.label;
    }
    set buttonLabel(buttonLabel) {
        this.#button.label = buttonLabel;
    }

    get title() {
        return this.#titleElement.innerText;
    }
    set title(title) {
        this.#titleElement.innerText = title;
    }

    constructor(prop) {
        super();
        this.title = `Dialog`;
        this.buttonLabel - `Open`;
        this.append(this.#button);
        this.#dialog.class = `ui dialog`;
        this.#dialog.style.bottom = `0px`;
        document.getElementsByTagName(`body`)[0].append(this.#dialog);
        this.#titleBarElement.class = `titlebar`;
        this.#dialog.append(this.#titleBarElement);
        this.content.class = `content`
        this.#dialog.append(this.content);
        this.#titleElement.class = `title`;
        this.#titleBarElement.append(this.#titleElement);
        this.#closeElement.class = `close`;
        this.#titleBarElement.append(this.#closeElement);
        Object.assign(this, prop);
        const thisClass = this;
        this.#button.addEventListener(`click`, function() {
            thisClass.#dialog.show();
            if(thisClass.#dialog.style.right == 0) {
                thisClass.#dialog.style.top = `0px`;
                thisClass.#dialog.style.left = `0px`;
            }
        });
        this.#closeElement.addEventListener(`click`, function() {
            thisClass.#dialog.close();
            delete thisClass.#dialog.style.top;
            delete thisClass.#dialog.style.left;
        })
        this.#titleBarElement.addEventListener(`mousedown`, function(event) {
            thisClass.#dialog.style.left = thisClass.#dialog.offsetLeft;
            thisClass.#dialog.style.right = `auto`;
            thisClass.#dialog.style.top = thisClass.#dialog.offsetTop;
            thisClass.#dialog.style.bottom = `auto`;
            let state = {
                pageX: event.pageX,
                pageY: event.pageY,
                left: parseFloat(thisClass.#dialog.style.left),
                top: parseFloat(thisClass.#dialog.style.top)
            }
            function mouseMove(mevent) {
                let xDiff = mevent.pageX - state.pageX;
                let yDiff = mevent.pageY - state.pageY;
                thisClass.#dialog.style.left = state.left + xDiff;
                thisClass.#dialog.style.top = state.top + yDiff;
            }
            function mouseUp() {
                document.removeEventListener(`mousemove`, mouseMove);
                document.removeEventListener(`mouseup`, mouseUp);
            }
            document.addEventListener(`mousemove`, mouseMove);
            document.addEventListener(`mouseup`, mouseUp);
        })
    }
}
customElements.define('ui-dialog', UIDialog, { extends: `span` });