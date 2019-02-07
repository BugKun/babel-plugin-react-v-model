import {observable, action} from 'mobx'

class TextStore {
    @observable myText = '';

    @action
    setText(str) {
        this.myText = str
    }
    setText = this.setText.bind(this)
}

export default new TextStore();
