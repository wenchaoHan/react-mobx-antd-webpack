import { observable, action } from 'mobx';

const getParams = () => ({
  name: '',
});

class Store {

  @observable idx = -1;
  @observable visible = false;
  @observable params = getParams();

  @action.bound
  init() {
    this.params = getParams();
  }
}

export default new Store();
