import { observable, action } from 'mobx';


class StoreData{
    @observable time = 0;

    @action.bound
    onCose(){

    }
}

const store = new StoreData();
export default store;