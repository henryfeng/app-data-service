# DataService

## BaseDataService
BaseDataService是一个TypeScript类，为客户端应用程序创建数据服务提供了一个简单的模板。它包括一个静态属性serverProxy，可以设置为处理与远程服务器通信的代理对象。该类还包括一个受保护的方法getService()，它返回serverProxy。

### 对象结构

#### 方法

|名称| 修饰符       | 参数  | 返回值           | 说明          | 备注                                             |
|---|-----------|-----|---------------|-------------|------------------------------------------------|
|getService| protected |  无  | 无             | 获取当前的代理服务   |                                                |
|setProxy | static    | value | 无 |  实际的后台服务接口类 | BaseDataService.setProxy(new RestfulService()) |


### 使用方法
要使用BaseDataService，可以扩展该类并实现自己的方法。例如：

```typescript
import {BaseDataService} from '@ticatec/app-data-service';

class MyDataService extends BaseDataService {
  getUsers(): Promise<any[]> {
    const service = this.getService();
    return service.get('/users');
  }

  updateUser(id: number, data: any): Promise<any> {
    const service = this.getService();
    return service.put(`/users/${id}`, data);
  }
}
```
在此示例中，MyDataService扩展了BaseDataService并为getUsers()和updateUser()方法提供了自己的实现。这些方法使用getService()方法获取对serverProxy对象的引用，然后使用它进行HTTP请求。

在使用MyDataService之前，您需要设置BaseDataService的serverProxy属性。您可以通过调用setProxy()方法来实现：

```typescript
import axios from 'axios';
import MyDataService from './MyDataService';

const serverProxy = axios.create({
  baseURL: 'https://api.example.com'
});

BaseDataService.setProxy(serverProxy);

const myDataService = new MyDataService();
```
在这个示例中，我们创建了一个新的Axios实例并使用它创建了serverProxy。然后，我们将BaseDataService的serverProxy属性设置为这个实例。最后，我们创建了一个新的MyDataService实例，并可以使用它来向我们的服务器发出请求。


## CommonDataService

CommonDataService是一个抽象的TypeScript类，它扩展了BaseDataService，并提供了一组常见的数据服务方法，可用于与远程服务器交互。它包括保存和删除数据的方法。

### 结构

* 父类： BaseDataService

通用的数据查询接口，该接口实现了数据的保存/更新/删除三类操作

#### 方法

| 名称   | 修饰符    | 参数           | 返回值    | 说明                              | 备注                             |
|------|--------|--------------------|--------|---------------------------------|--------------------------------|
| -    | 构造方法   | url           | 新实例    | 本接口的根地址                         | new CommonDataService('/user') |
| save | public | data: any<br/>isNew: boolean| 保存后的数据 | 调用保存接口<br/>data为待保存的数据<br/>isNew是新增还更新 | 异步                             |
|remove | public | item: any | 无      |              调用删除数据的接口          | 异步                             |
|getDeleteUrl|protected | item | string | 删除调用的url |                                |



### 使用方法
要使用CommonDataService，您可以扩展该类并为getDeleteUrl()方法提供自己的实现。例如：

```typescript
import {CommonDataService} from '@ticatec/app-data-service';

class MyDataService extends CommonDataService {
  constructor() {
    super('/users');
  }

  getDeleteUrl(item: any): string {
    return `${this.url}/${item.id}`;
  }
}
```
在这个例子中，MyDataService扩展了CommonDataService，并为getDeleteUrl()方法提供了自己的实现。这个方法用于生成将用于删除项的URL。

要使用MyDataService，您可以创建该类的一个实例，并使用它的save()和remove()方法与服务器交互：

```typescript
const myDataService = new MyDataService();

// Create a new user
myDataService.save({ name: 'John Doe', email: 'john.doe@example.com' }, true).then((response) => {
    console.log('User created:', response.data);
}).catch((error) => {
    console.error('Failed to create user:', error);
});

// Update an existing user
myDataService.save({ id: 1, name: 'Jane Smith', email: 'jane.smith@example.com' }, false).then((response) => {
    console.log('User updated:', response.data);
}).catch((error) => {
    console.error('Failed to update user:', error);
});

// Delete a user
const user = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
myDataService.remove(user).then(() => {
    console.log('User deleted:', user);
}).catch((error) => {
    console.error('Failed to delete user:', error);
});
```
在这个例子中，我们创建了一个MyDataService的新实例，并使用它的save()和remove()方法与服务器交互。save()方法需要两个参数：要保存的数据和一个布尔值，指示数据是新的还是现有的。remove()方法需要一个参数：要删除的项。

## CommonPaginationDataService
CommonPaginationDataService 是一个抽象的 TypeScript 类，它继承了 CommonDataService 并提供了一种在远程服务器上搜索和分页数据的方法。

### 结构

* 父类：CommonDataService

通用的带分页数据接口，该服务继承自BaseDataService，同时增加了分页查询接口，该类为抽象类，不能直接实例化。

| 名称     | 修饰符                | 参数                           | 返回值       | 说明          | 备注  |
|--------|--------------------|------------------------------|-----------|-------------|-----|
| search | public             | criteria: any | 符合查询条件的数据 | 返回为一个分页查询结果 | 异步  |
| buildCriteria | protected abstract | options:any                  | 构造默认的查询条件 |             |   |

**分页查询数据结构**
```json
{
  "count": 55,
  "pageNo": 1,
  "pages": 3,
  "hasMore": true,
  "list": []
}
```

**说明**

|名称|类型|说明|
|---|---|---|
|count|数字|符合查询条件的记录数|
|pageNo|数字|当前的页吗|
|pages|数字|总页数|
|hasMore|是否有更多的记录|非必须|
|list|数组|符合条件分页后的记录|


### 用法
要使用 CommonPaginationDataService，你可以扩展该类并为 buildCriteria() 方法提供自己的实现。例如：

```typescript
import {CommonPaginationDataService} from '@ticatec/app-data-service';

class MyPaginationDataService extends CommonPaginationDataService {
    constructor() {
    super('/users');
}

    buildCriteria(): any {
        return { page: 1, size: 10 };
    }
}
```
在这个例子中，MyPaginationDataService 扩展了 CommonPaginationDataService 并为 buildCriteria() 方法提供了自己的实现。该方法用于生成将发送到服务器的搜索条件。

要使用 MyPaginationDataService，可以创建该类的一个实例并使用其 search() 方法在服务器上搜索和分页数据：

```typescript
const myPaginationDataService = new MyPaginationDataService();

// Search for users
myPaginationDataService.search(myPaginationDataService.buildCriteria()).then((paginationList) => {
    console.log('Users found:', paginationList.list);
}).catch((error) => {
    console.error('Failed to search for users:', error);
});
```
在这个例子中，我们创建了一个 MyPaginationDataService 的新实例，并使用其 search() 方法在服务器上搜索和分页数据。search() 方法接受一个参数：要使用的搜索条件。


