export default abstract class BaseDataService {

    private static serverProxy;

    static setProxy(value: any) {
        BaseDataService.serverProxy = value;
    }

    get service() {
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
        return await this.getService().get(url, params, dataProcessor);
    }

    /**
     *
     * @param url
     * @param data
     * @param params
     * @param dataProcessor
     */
    async post(url: string, data: any, params: any = null, dataProcessor: any = null): Promise<any> {
        return await this.getService().post(url, data, params, dataProcessor);
    }

    /**
     *
     * @param url
     * @param data
     * @param params
     * @param dataProcessor
     */
    async put(url: string, data: any, params: any = null, dataProcessor: any = null): Promise<any> {
        return await this.getService().put(url, data, params, dataProcessor);
    }

    /**
     *
     * @param url
     * @param data
     * @param params
     * @param dataProcessor
     */
    async del(url: string, data: any, params: any = null, dataProcessor: any = null): Promise<any> {
        return await this.getService().del(url, data, params, dataProcessor);
    }


}