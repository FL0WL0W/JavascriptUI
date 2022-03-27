import UIButton from "./UIButton.js"
export default class UIDialog extends HTMLDivElement {
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
        return this.#titleElement.innerHTML;
    }
    set title(title) {
        this.#titleElement.innerHTML = title;
    }

    constructor(prop) {
        super();
        this.title = `Dialog`;
        this.buttonLabel - `Open`;
        this.class = `ui dialog`;
        this.append(this.#button);
        this.append(this.#dialog);
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
            thisClass.#dialog.showModal();
            thisClass.#dialog.style.top = `0px`;
            thisClass.#dialog.style.left = `0px`;
        });
        this.#closeElement.addEventListener(`click`, function() {
            thisClass.#dialog.close();
            delete thisClass.#dialog.style.top;
            delete thisClass.#dialog.style.left;
        })
        this.#titleBarElement.addEventListener(`mousedown`, function(event) {
            let state = {
                pageX: event.pageX,
                pageY: event.pageY
            }
            function mouseMove(event) {
                let xDiff = event.pageX - state.pageX;
                let yDiff = event.pageY - state.pageY;
                thisClass.#dialog.style.left = parseFloat(thisClass.#dialog.style.left) + (xDiff*2) + `px`;
                thisClass.#dialog.style.top = parseFloat(thisClass.#dialog.style.top) + (yDiff*2) + `px`;
                state.pageX += xDiff;
                state.pageY += yDiff;
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
customElements.define('ui-dialog', UIDialog, { extends: 'div' });