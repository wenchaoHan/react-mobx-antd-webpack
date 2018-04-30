
import { observable, action, autorun,toJS,computed } from 'mobx';
import Request from 'BizUtils/Request';
import notify from "BizComponent/Notification";
class InfoTable {

    constructor()
    {
        autorun(()=>{ console.log("table autorun",this.modalData);})
    }
    @observable spinVisible = false;
    @observable site="";
    @observable data={
        labels : [],
        labelData:{
            visible : false,
            modalData : {}
        },
        annotationData:{
            visible : false,
            annotation : {}
        }
    };

    @computed get labelDataList(){
        let labels = toJS(this.data.labels);
        let ret_labels = [];
        for(let label of labels.values()){
            console.log(label);
            switch (label.type)
            {
                case 1:
                    label.type = '食';
                    break;
                case 2:
                    label.type = '宿';
                    break;
                case 3:
                    label.type = '娱';
                    break;
                case 4:
                    label.type = '俗';
                    break;
                case 5:
                    label.type = '助';
                    break;
                default:
                    break;
            }
            ret_labels.push(label);
        }
        console.log("deal done :",ret_labels);
        return ret_labels;
    };

    @computed get labelMData(){
        return toJS(this.data.labelData);
    }

    @computed get annotationData(){
        return toJS(this.data.annotationData);
    }

    @action.bound
    onUpdateLabelDataHandler(data){
        this.spinVisible = true;
        data['site'] = this.site;
        Request.post('line/label_data/',{
            data:data
        }).then((response)=> {
            console.log(response);
            if(response.status == 0){
                this.data.labelData.modalData = response.data;
            }
            notify.success("修改成功");
            this.spinVisible = false;
            this.data.labelData.visible = false;

        }).catch((error) => {
            console.log(error);
            this.spinVisible = false;
        });
    }

    /*更换景区并获取数据*/
    @action.bound
    changeSiteAndGetLabels(site){
        this.spinVisible = true;
        Request.get('line/labels/',{
            data:{
                site:site
            }
        }).then((response)=> {
            console.log(response);
            if(response.status == 0){
                this.data.labels = response.data;
            }
            this.site = site;
            this.spinVisible = false;
        }).catch((error) => {
            console.log(error);
            this.spinVisible = false;
        });
    };

    /*查看一个弹框数据*/
    @action.bound
    selectAnnotationData(id){
        this.spinVisible = true;
        Request.get('line/annotation/',{
            data:{
                id:id,
                site:this.site
            }
        }).then((response)=> {
            console.log(response);
            if(response.status == 0){
                this.data.annotationData.annotation = response.data;
                this.data.annotationData.visible = true;
            }
            this.spinVisible = false;
        }).catch((error) => {
            console.log(error);
            this.spinVisible = false;
        });
    };

    /*修改一个弹框数据*/
    @action.bound
    updateAnnotationData(annotation_){
        this.spinVisible = true;
        let annotation = annotation_;
        annotation.set('site',this.site);
        Request.post('line/annotation/',{
            data:{
                annotation
            }
        }).then((response)=> {
            console.log(response);
            if(response.status == 0){
                this.data.labels = response.data;
            }
            this.spinVisible = false;
        }).catch((error) => {
            console.log(error);
            this.spinVisible = false;
        });
    }

    /*删除一个标签*/
    @action.bound
    delectLabel(id)
    {

    }

    @action.bound
    setVisible(value)
    {
        this.visible = value;
    }

    @action.bound
    onCancel()
    {
        this.visible = false;
    }

    @action.bound
    onLabelModalOk()
    {
        //这里做添加和修改的操作
        this.data.labelData.visible = false;
        this.data.labelData.modalData = {};
    }

    @action.bound
    onAnnotationModalOk()
    {
        //这里做添加和修改的操作
        this.data.annotationData.visible = false;
        this.data.annotationData.modalData = {};
    }

    @action.bound
    setLabelModalData(value)
    {
        let data = value||{};
        this.data.labelData.visible = true;
        this.data.labelData.modalData = data;
    }

    @action.bound
    setAnnotationModalData(value)
    {
        let data = value||{};
        this.data.annotationData.visible = true;
        this.data.annotationData.annotation = data;
    }

    // @action.bound
    // addBtnClick()
    // {
    //     this.data.labelData.visible = true;
    //     this.data.labelData.modalData = {};
    // }
}

export default new InfoTable();