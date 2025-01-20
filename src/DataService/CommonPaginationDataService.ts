import CommonDataService from "./CommonDataService";
import PaginationList from "../PaginationList";
import {utils} from "@ticatec/enhanced-utils";

export default abstract class CommonPaginationDataService extends CommonDataService {

    /**
     * 根据条件分页查询符合条件的数据
     * @param criteria
     */
    async search(criteria: any): Promise<PaginationList> {
        let result = await this.service.get(this.url, utils.objectPurge(criteria)) ;
        return this.buildSearchResult(result);
    }

    /**
     * 构造查询结果
     * @param result
     * @protected
     */
    protected buildSearchResult(result: PaginationList): PaginationList {
        return result;
    }

    /**
     * 构造查询条件
     * @param options
     */
    abstract buildCriteria(options?: any): any;
}