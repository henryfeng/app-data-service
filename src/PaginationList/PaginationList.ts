export default interface PaginationList {
    /**
     * 总记录数
     */
    count: number;
    /**
     * 当前页码
     */
    pageNo?: number;
    /**
     * 总页数
     */
    pages?: number;
    /**
     * 是否有更多记录
     */
    hasMore?: boolean;
    /**
     * 数据集合
     */
    list: Array<any>;
}