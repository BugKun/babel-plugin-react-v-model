import {observable, action, computed, runInAction} from 'mobx'

class ServerStore {
    @observable serverActive = false;

    @action
    getServerState() {

    }
}

export default new ServerStore();
