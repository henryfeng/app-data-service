# Application Data Service 

[中文文档](./README-CN.md)

This package provides a set of classes for handling data operations via HTTP requests. These classes are built in a hierarchical structure, starting from `BaseDataService` as the foundation, with `CommonDataService`, `PagingDataService`, and `FullListDataService` extending its functionality for specific use cases.

---

## BaseDataService

`BaseDataService` is an abstract base class that provides foundational HTTP request methods (GET, POST, PUT, DELETE) and manages a static proxy for making requests.

### Key Features
- Static proxy configuration for HTTP requests.
- Basic HTTP method implementations.

### Methods
- `static setProxy(value: any): void`
    - Sets the static `serverProxy` used for HTTP requests.
- `get service(): any`
    - Getter for accessing the configured `serverProxy`.
- `protected getService(): any`
    - Protected method to retrieve the `serverProxy`.
- `async get(url: string, params?: any, dataProcessor?: any): Promise<any>`
    - Sends a GET request.
- `async post(url: string, data: any, params?: any, dataProcessor?: any): Promise<any>`
    - Sends a POST request.
- `async put(url: string, data: any, params?: any, dataProcessor?: any): Promise<any>`
    - Sends a PUT request.
- `async del(url: string, data?: any, params?: any, dataProcessor?: any): Promise<any>`
    - Sends a DELETE request.

### Usage

```ts
import BaseDataService from './BaseDataService';
import RestService from '@ticatec/axios-restful-service'; // Example proxy

// Configure the proxy
const restService = new RestService('https://api.example.com');
BaseDataService.setProxy(restService);

```

## CommonDataService

`CommonDataService` extends `BaseDataService` and adds common CRUD (Create, Update, Delete) operations with a predefined URL. It is also abstract and intended to be extended.

### Key Features
* URL-based operations.
* Methods for saving and deleting data.

### Constructor
* `constructor(url: string)`
    * Initializes the service with a base URL.

### Methods
* `save(data: any, isNew: boolean): Promise<any>`
  * Saves data using POST (if isNew is true) or PUT (if isNew is false).
* `remove(item: any): Promise<void>`
  * Deletes a specific item using the DELETE method.
* `protected getDeleteUrl(item: any): string`
  * Returns the URL for deletion (defaults to the base URL; override as needed).
* `async buildNewEntry(options: any): Promise<any>`
  * Builds a new data entry based on provided options (returns a shallow copy by default).

### Usage

```ts
import CommonDataService from './CommonDataService';
import RestService from '@ticatec/axios-restful-service';

BaseDataService.setProxy(new RestService('https://api.example.com'));

class UserService extends CommonDataService {
  constructor() {
    super('/users');
  }

  // Override getDeleteUrl if needed
  protected getDeleteUrl(item: any): string {
    return `${this.url}/${item.id}`;
  }
}

const userService = new UserService();
userService.save({ name: 'John' }, true).then(response => console.log('Saved:', response));
userService.remove({ id: 1 }).then(() => console.log('Deleted'));
```

## FullListDataService

`FullListDataService` extends `CommonDataService` and provides a simple method to fetch a full list of data.

### Key Features
* Specialized for retrieving a complete list of items.
### Methods
* `getList(params: any = null): Promise<Array<any>>`
  * Fetches all data from the specified URL with optional query parameters.

### Usage

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

`PagingDataService` extends `CommonDataService` and adds support for paginated data retrieval with search criteria.

### Key Features

* Paginated data queries.
* Flexible criteria and result-building methods.

### Methods

* `async search(criteria: any): Promise<PaginationList>`
  * Queries paginated data based on provided criteria.
* `protected buildSearchResult(result: any): PaginationList`
  * Constructs the pagination result (override to customize).
* `buildCriteria(options?: any): any`
  * Builds search criteria (returns a shallow copy by default).

### Usage

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


## Setup and Dependencies
1. Proxy Configuration: All services rely on a proxy (e.g., `RestService` from `@ticatec/axios-restful-service`) set via `BaseDataService.setProxy()`.
2. TypeScript: These classes are written in TypeScript and require a compatible environment.
3. Dependencies: Ensure `@ticatec/enhanced-utils` is installed if using `PagingDataService` (for `utils.objectPurge`).

### Example Proxy Setup

```ts
import RestService from '@ticatec/axios-restful-service';
BaseDataService.setProxy(new RestService('https://api.example.com'));
```

## Notes
* **Abstract Classes**: `BaseDataService`, `CommonDataService`, and `PagingDataService` are abstract and must be extended.
* **Customization**: Override protected methods (e.g., `getDeleteUrl`, `buildSearchResult`) to tailor functionality.
* **Error Handling**: Implement error handling in your proxy (e.g., `RestService`) or consumer code.

