import { observable, action,computed,toJS } from 'mobx';
import Request from 'BizUtils/Request';

// import { configure } from 'mobx';

// don't allow state modifications outside actions
// configure({enforceActions: true});

class LabelStore
{
    @observable site=undefined;
    @observable data={
        annotations:[],
    };

    /*查看一个标签数据*/
    @action.bound
    selectLabelData(id){

    }

    /*修改一个标签数据*/
    @action.bound
    updateLabelData(label){

    }

}

const store = new LabelStore();
export default store;
