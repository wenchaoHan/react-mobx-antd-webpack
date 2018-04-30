
import { observable, action, computed, autorun } from 'mobx';


class HomeInfo{

    constructor()
    {
        // this.collapsed = false;
        // this.currentScenic = "gubei";

        autorun(()=>{ console.log("autorun log",this.collapsed,this.currentScenic)});
    }

    @observable collapsed = false;
    @observable currentScenic = "gubei";

    @action.bound
    setCurrentScenic(value)
    {
        this.currentScenic = value;
    }

    @action.bound
    changeCollapsed()
    {
        this.collapsed = !this.collapsed;
        console.log("collapsed ",this.collapsed);
    }
}
const store = new HomeInfo();

console.log("次数",store.collapsed,store.currentScenic);

export default store;
