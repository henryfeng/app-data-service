export default abstract class BaseDataService {

    private static serverProxy: any;

    static setProxy(value: any) {
        BaseDataService.serverProxy = value;
    }

    get service():any {
        return BaseDataService.serverProxy;
    }

    /**
     *
     * @protected
     */
    protected getService():any {
        return BaseDataService.serverProxy;
    }

    /**
     *
     * @param url
     * @param params
     * @param dataProcessor
     */
    async get(url: string, params: any = null, dataProcessor: any = null): Promise<any> {
        return await this.service.get(url, params, dataProcessor);
    }

    /**
     *
     * @param url
     * @param data
     * @param params
     * @param dataProcessor
     */
    async post(url: string, data: any, params: any = null, dataProcessor: any = null): Promise<any> {
        return await this.service.post(url, data, params, dataProcessor);
    }

    /**
     *
     * @param url
     * @param data
     * @param params
     * @param dataProcessor
     */
    async put(url: string, data: any, params: any = null, dataProcessor: any = null): Promise<any> {
        return await this.service.put(url, data, params, dataProcessor);
    }

    /**
     *
     * @param url
     * @param data
     * @param params
     * @param dataProcessor
     */
    async del(url: string, data: any, params: any = null, dataProcessor: any = null): Promise<any> {
        return await this.service.del(url, data, params, dataProcessor);
    }


}