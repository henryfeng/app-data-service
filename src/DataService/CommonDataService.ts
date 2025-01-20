import BaseDataService from "./BaseDataService";

export default abstract class CommonDataService extends BaseDataService {

    protected readonly url: string;

    constructor(url: string) {
        super();
        this.url = url;
    }

    /**
     * 保存数据
     * @param data
     * @param isNew
     */
    save(data: any, isNew: boolean): Promise<any> {
        if (isNew) {
            return this.service.post(this.url, data);
        } else {
            return this.getService().put(this.url, data);
        }
    }

    /**
     * 删除指定的一条数据
     * @param item
     */
    remove(item: any): Promise<void> {
        return this.service.del(this.getDeleteUrl(item));
    }

    /**
     *
     * @param item
     * @protected
     */
    protected getDeleteUrl(item: any): string {
        return this.url;
    }

}
