import { observable, action, toJS, computed, autorun } from 'mobx';


class BaseDetail
{
    @observable visibleUnit = true;
    @observable selectedSite = 'gubei';

    @action.bound
    onBtnOk()
    {
        this.visibleUnit = false;
    }

    @action.bound
    onSelectSite(site)
    {
        this.selectedSite = site;
    }
}
const store = new BaseDetail();
export default store;
