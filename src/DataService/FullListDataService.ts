import CommonDataService from "./CommonDataService";

export default class FullListDataService extends CommonDataService {

    /**
     * 获取所有数据列表
     * @param params
     */
    getList(params: any=null): Promise<Array<any>> {
        return this.service.get(this.url, params);
    }

}