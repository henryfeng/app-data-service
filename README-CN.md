# 应用数据服务

[English Documentation](./README.md)

本文档提供了一组 TypeScript 服务类的概述和使用说明，这些类用于通过 HTTP 请求处理数据操作。它们以分层结构构建，以 `BaseDataService` 为基础，`CommonDataService`、`PagingDataService` 和 `FullListDataService` 扩展了它的功能，以满足特定的使用场景。

---

## BaseDataService

`BaseDataService` 是一个抽象基类，提供了基础的 HTTP 请求方法（GET、POST、PUT、DELETE），并管理一个静态代理用于发送请求。

### 主要特点
- 通过静态代理配置 HTTP 请求。
- 基础的 HTTP 方法实现。

### 方法
- `static setProxy(value: any): void`
    - 设置用于 HTTP 请求的静态 `serverProxy`。
- `get service(): any`
    - 获取已配置的 `serverProxy`。
- `protected getService(): any`
    - 受保护方法，用于获取 `serverProxy`。
- `async get(url: string, params?: any, dataProcessor?: any): Promise<any>`
    - 发送 GET 请求。
- `async post(url: string, data: any, params?: any, dataProcessor?: any): Promise<any>`
    - 发送 POST 请求。
- `async put(url: string, data: any, params?: any, dataProcessor?: any): Promise<any>`
    - 发送 PUT 请求。
- `async del(url: string, data?: any, params?: any, dataProcessor?: any): Promise<any>`
    - 发送 DELETE 请求。

### 使用示例

```ts
import BaseDataService from './BaseDataService';
import RestService from '@ticatec/axios-restful-service'; // 示例代理

// 配置代理
const restService = new RestService('https://api.example.com');
BaseDataService.setProxy(restService);

```

## CommonDataService

`CommonDataService` 继承 `BaseDataService`，并添加了基于 URL 的常见 CRUD（创建、更新、删除）操作。它也是一个抽象类，需继承后使用。

### 主要特点
* 基于 URL 的数据操作。
* 提供保存和删除数据的方法。

### 构造函数
* `constructor(url: string)`
    * 通过基础 URL 初始化服务。

### 方法
* `save(data: any, isNew: boolean): Promise<any>`
    * 通过 POST（若 `isNew` 为 `true`）或 PUT（若 `isNew` 为 `false`）保存数据。
* `remove(item: any): Promise<void>`
    * 通过 DELETE 方法删除数据。
* `protected getDeleteUrl(item: any): string`
    * 返回删除 URL（默认为基础 URL，可重写）。
* `async buildNewEntry(options: any): Promise<any>`
    * 基于提供的选项构建新的数据条目（默认返回浅拷贝）。

### 使用示例

```ts
import CommonDataService from './CommonDataService';
import RestService from '@ticatec/axios-restful-service';

BaseDataService.setProxy(new RestService('https://api.example.com'));

class UserService extends CommonDataService {
  constructor() {
    super('/users');
  }

  protected getDeleteUrl(item: any): string {
    return `${this.url}/${item.id}`;
  }
}

const userService = new UserService();
userService.save({ name: 'John' }, true).then(response => console.log('Saved:', response));
userService.remove({ id: 1 }).then(() => console.log('Deleted'));
```

## FullListDataService

`FullListDataService` 继承 `CommonDataService`，提供获取完整数据列表的方法。

### 主要特点
* 适用于获取完整列表数据。

### 方法
* `getList(params: any = null): Promise<Array<any>>`
    * 通过 URL 获取完整数据列表，可附带查询参数。

### 使用示例

```ts
import FullListDataService from './FullListDataService';
import RestService from '@ticatec/axios-restful-service';

BaseDataService.setProxy(new RestService('https://api.example.com'));

class ProductService extends FullListDataService {
  constructor() {
    super('/products');
  }
}

const productService = new ProductService();
productService.getList({ category: 'electronics' })
  .then(products => console.log('Products:', products));
```

## PagingDataService

`PagingDataService` 继承 `CommonDataService`，支持带搜索条件的分页数据查询。

### 主要特点

* 支持分页数据查询。
* 提供灵活的条件查询和结果构建方法。

### 方法

* `async search(criteria: any): Promise<PaginationList>`
    * 基于提供的查询条件获取分页数据。
* `protected buildSearchResult(result: any): PaginationList`
    * 构建分页查询结果（可重写以自定义返回值）。
* `buildCriteria(options?: any): any`
    * 构建查询条件（默认返回浅拷贝）。

### 使用示例

```ts
import PagingDataService from './PagingDataService';
import PaginationList from '../PaginationList';
import RestService from '@ticatec/axios-restful-service';

BaseDataService.setProxy(new RestService('https://api.example.com'));

class OrderService extends PagingDataService {
  constructor() {
    super('/orders');
  }

  protected buildSearchResult(result: any): PaginationList {
    return new PaginationList(result.items, result.total, result.page);
  }
}

const orderService = new OrderService();
orderService.search({ status: 'pending', page: 1 })
  .then(pagination => console.log('Orders:', pagination));
```

## 设置与依赖
1. **代理配置**: 所有服务类依赖一个代理（如 `RestService`），可通过 `BaseDataService.setProxy()` 进行设置。
2. **TypeScript**: 这些类使用 TypeScript 编写，需在兼容的环境中运行。
3. **依赖项**: 使用 `PagingDataService` 时，确保安装了 `@ticatec/enhanced-utils`（用于 `utils.objectPurge`）。

### 示例代理设置

```ts
import RestService from '@ticatec/axios-restful-service';
BaseDataService.setProxy(new RestService('https://api.example.com'));
```

## 备注
* **抽象类**: `BaseDataService`、`CommonDataService` 和 `PagingDataService` 均为抽象类，需继承使用。
* **自定义**: 可重写受保护方法（如 `getDeleteUrl`、`buildSearchResult`）以调整功能。
* **错误处理**: 需在代理（如 `RestService`）或调用代码中实现错误处理。

