import { observable, action } from 'mobx';

class store {
    @observable userinfo = {
        name: ''
    };

    @observable loading = false;

    @action.bound
    setLoading(value)
    {
        this.loading = value;
    }

}

export default new store();

