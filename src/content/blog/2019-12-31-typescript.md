---
category : front-end
title: "如何实现良好的 TypeScript 类型检查和推断"
description: "如何实现良好的 TypeScript 类型检查和推断"
tags : [编程语言]
---

![新疆三号坑](https://img.alicdn.com/tfs/TB1Xr_LspT7gK0jSZFpXXaTkpXa-3000-1684.jpg)

根据 StateOfJS 的问券调查（附录 1），TypeScript 在 2019 得到了更大规模的普及。TypeScript 能得以流行，其中一个原因便是其结合 VS Code 能获得良好的编程体验。

笔者最早是在 Node.js 环境中使用 TypeScript，主要是利用 Interface 和 Class 进行类型抽象和建模，但却很少考虑自己用 TypeScript 编写的代码库被其他开发者使用时，能否在 VS Code 中获得**良好的静态检查和完整的类型推断**。

最近，icestore 就遇到了这么两个问题。

## 问题一：通过键值对的方式将某个对象注册到类，取值时如何对键进行静态检查，取出的值如何维持原对象的类型推断。

我们遇到的场景是，在 icestore 中提供了 `registerStores` 用于注册预定义的 `stores: {[namespace: string]: object}`：

```javascript
const icestore = new Icestore();

const todos = {
  dataSource: [],
  add(todo) {},
};

icestore.registerStores({
  todos
});
```

当取值时应对 Key 有静态检查：

![Key 值检查](https://img.alicdn.com/tfs/TB1MRZCsbj1gK0jSZFuXXcrHpXa-1680-226.png)

取出的值应维持 `todos` 的类型推断：

![类型推断](https://img.alicdn.com/tfs/TB1JzEwsfb2gK0jSZK9XXaEgFXa-1502-402.png)

在 icestore 的内部实现中，对传入的 `stores` 进行了一些包装，下面是一个类似的示例：

```
// 初始模型，可能会有一些约束
interface Model {
  //[key: string]: any;
}

// 模型的字典
interface Models {
  //[key: string]: Model;
}

// 在 Store 内部被包装后的模型
interface WrapModel extends Model {
  foo: number;
}

// Store，用于包装模型
class Store {
  model: WrapModel;
  constructor(model: Model) {
    this.model = {
      ...model,
      foo: 123,
    };
  }
}

// Store 的字典
interface Stores {
  //[key: string]: Store;
}

// Stores 的管理器
class Manager {
  stores: Stores;
  constructor(models: Models) {
    Object.keys(models).forEach((key) => {
      this.stores[key] = new Store(models[key]);
    });
  }
  getStore(key: string): WrapModel {
    return this.stores[key].model;
  }
}

// 定义一个模型类型
interface Todos {
  dataSource: string[];
  add(todo): void;
}

// 声明模型
const todos: Todos = {
  dataSource: [],
  add(todo) {},
}

const models = { todos };

// 注入到 manager 
const manager = new Manager(models);

// 从 manager 内取出被包装后的模型
const todoStore = manager.getStore('testing'); // 理想状态下这里应该报错，因为 models 内并不存在 testing 索引
```

### 泛型

从示例代码可以看到，当前 `getStore` 方法的定义是 `(key: string): WrapModel`，该定义只声明了 Key 的约束是 `string`，实际上我们期望的是 Key 必须是传入的 `models` 中的索引名称，而每次传入的 `models` 不同则对应不同的类型约束。

要解决这个问题，需要引入 TypeScript 泛型（附录 2）来创建可重用的函数。泛型函数可以支持多种类型的数据，这样开发者就可以以自己的数据类型来使用函数：

```ts
type getStore = <MS>(key: keyof MS & string): WrapModel;
```

这里给 `getStore` 添加了类型变量 `MS`， 并指定函数的 `key` 参数必须是 `MS` 类型的 Key 且是 `string` 类型。在使用函数时，再去指定 `MS` 类型是什么：

```ts
interface ModelConfigs {
  todos: Todos;
}

// 调用 getStore 时传入类型参数，明确指定了 MS 是 ModelConfigs 类型
const todoStore = manager.getStore<ModelConfigs>('test'); // test != keyof ModelConfigs，报错
```

但这仅仅解决了类型的静态检查问题，当开发者去使用 `todoStore` 时，会发现类型推断里只提示了 `foo` 字段，原对象 `Todos` 的其他字段均未提示：

![无类型推断](https://img.alicdn.com/tfs/TB1TfdjsAL0gK0jSZFtXXXQCXXa-771-219.png)

要实现这个效果，需要对上面的代码再进行类型补充，引入泛型类型别名和泛型类，实现类型推断：

```ts
interface CustomModel {
  foo: number;
}
// WrapModel 作为泛型类型别名，MC 类型变量指定需要交叉的类型
type WrapModel<MC> = { [T in keyof MC]: MC[T]; } & CustomModel;

// Store 作为泛型类，MC 类型变量指定初始化 model 的类型
class Store<MC> {
  model: WrapModel<MC>;
  constructor(model: MC) {
    this.model = {
      ...model,
      foo: 123,
    };
  }
}
type Stores<MS> = {
  [K in keyof MS]: Store<MS[K]>;
}

// Manager 作为泛型类，MS 类型变量指定初始化 models 的类型
class Manager<MS> {
  stores: Stores<MS>;
  constructor(models: Models) {
    type K = keyof Models;
    Object.keys(models).forEach((key) => {
      this.stores[key] = new Store<Models[K]>(models[key]);
    });
  }

  // 传递指定 model 的类型给 WrapModel，并以 WrapModel 作为返回值，完成类型推断
  getStore<K extends keyof MS>(key: K & string): WrapModel<MS[K]> {
    return this.stores[key].model;
  }
}
```

这其中关键的改动是 `WrapModel` 引入类型变量 `MC`，及 `getStore` 中引用该泛型作为函数的返回值类型：

```ts
type WrapModel<MC> = { [T in keyof MC]: MC[T]; } & CustomModel;
type getStore = <K extends keyof MS>(key: K & string): WrapModel<MS[K]>;
```

使用时则在实例化 `Manager` 时传入类型参数：

![类型推断](https://img.alicdn.com/tfs/TB1dTGlsAT2gK0jSZPcXXcKkpXa-1532-456.png)

### 类型推论

在上面的示例当中依然需要开发者手动传递类型参数，这显然还不够友好。

有没有进一步优化的空间？有，那就利用上下文归类的方式让 TypeScript 维持类型推论（附录 3）。

首先看一个示例：

![上下文类型](https://img.alicdn.com/tfs/TB10jCmsBv0gK0jSZKbXXbK2FXa-1606-348.png)

在这个示例中，没有进行任何的类型定义，也没有传递类型参数，但是 VS Code 依然能够知道返回的 `wrapModel` 中有 `foo` 字段及其值是 `number` 类型。

同理，在我们的示例中，也可以利用 `Manager` 类构造函数的签名，维持 `MS` 的上下文：

```ts
class Manager<MS> {
  stores: Stores<MS>;

  // 原签名：constructor(models: Model)
  constructor(models: Model & MS) {
    type K = keyof MS;
    Object.keys(models).forEach((key) => {
      this.stores[key] = new Store<MS[K]>(models[key]);
    });
  }
  getStore<K extends keyof MS>(key: K & string): WrapModel<MS[K]> {
    return this.stores[key].model;
  }
}
```

这时再去实例化 `Manager` 并调用 `getStore` 方法，不需要传递类型参数，类型推断依然生效：

![维持上下文](https://img.alicdn.com/tfs/TB1Q8qVspP7gK0jSZFjXXc5aXXa-1530-296.png)

## 问题二：在 React HOC 场景中如何实现 Props 的静态检查和类型推断

在 icestore 的 0.4.1 版本（附录 4）中，我们支持了在 Class 组件中使用 icestore 。实现的原理是通过 HOC 的方式将 Store 作为 Props 注入到组件中。开发者使用的方式如下：

```tsx
class TodoList extends Component {
  render() {
    const {store, title} = this.props;
    return (<div>
      {store.foo}
    </div>);
  }
}
const TodoListWithStore = icestore.withStore('todos')(TodoList);
ReactDOM.render(
  (<div>
    <TodoListWithStore title="标题" />
  </div>),
  rootElement
);
```

`withStore` 方法的接收 `namespace` 及 `mapStoreToProps` 参数，`namespace` 指定需要注入的 Store，`mapStoreToProps` 方法是可选的，用于自定义注入的 Store 字段，其类型定义如下：

```ts
type withStore = (namespace: string, mapStoreToProps?: (store: Store) => { store: Store|object } )
```

这里有两个问题。

### 问题一：Class 组件内的 props 如何维持类型推断

社区有提供了 React 类型定义的 @types/react 包，下面的示例演示了如何在 Class 组件内获得 `props` 的类型推断：

```tsx
interface TodoListProps = {
  title: string;
};
class TodoList extends React.Component<TodoListProps> {
  render() {
    return (
      <div>
        {this.props.title}
      </div>
    );
  }
}
```

那么对于 icestore 场景来说，`TodoList` 的 `props` 类型声明只需补充声明 `store` 字段即可：

```tsx
import {Store} from '@ice/store';

type TodosStore = Store<Todos>; // Store 是 icestore 提供的工具类型，其实现类似于上文中的 WrapModel

interface TodoListProps {
  title: string;
  store: TodosStore;
}

class TodoList extends React.Component<TodoListProps> {
  render() {
    const {store, title} = props;
    return (
      <div>
        {title}
        {/* Todos 上的字段 */}
        <div>{store.dataSource}</div>

        {/* Store 附加的字段 */}
        <div>{store.foo}</div>
      </div>
    );
  }
}
```

在 VS Code 中达到的类型推断效果：

![props-类型推断](https://img.alicdn.com/tfs/TB1UkjJsuL2gK0jSZPhXXahvXXa-865-164.png)

### 问题二：使用 HOC 时如何维持对原有组件 property 的静态检查

例如，在使用 `TodoListWithStore` 时如何维持对 `TodoList` 已有的 property ———— `title` 的静态检查。

可以在 HOC 的类型定义中通过 `Optionalize` 工具类型（附录 6）把 `mapStoreToProps` 函数返回值类型从组件定义的 `props` 类型中剔除掉。

`Optionalize` 的用法如下:

```ts
interface Animal {
  name: string;
}
interface Dog extends Animal {
  breed: string;
}

type DogSpecial = Optionalize<Dog, Animal>; // DogSpecial should be: { breed: string; }
```

在 HOC 中再结合上下文类型推论的特性，即可实现我们的诉求。下面是 `withStore` 的完整实现：

```tsx
function withStore<K extends keyof M>(namespace: K, mapStoreToProps?: (store: Store<M[K]>) => { store: Store<M[K]>|object } ) {
  // 获取 mapStoreToProps 的返回值类型
  type StoreProps = ReturnType<typeof mapStoreToProps>;

  // 组件的 Props 类型是 StoreProps 的扩展
  // P 类型变量维持了组件 props 类型的上下文类型推论
  return <P extends StoreProps>(Component: React.ComponentClass<P>) => {

    // 将 StoreProps 的字段从 P 中剔除掉
    return (props: Optionalize<P, StoreProps>): React.ReactElement => {
      const store: Store<M[K]> = useStore(namespace);
      const storeProps: StoreProps = mapStoreToProps ? mapStoreToProps(store) : {store};
      return (
        <Component
          {...storeProps}
          {...(props as P)}
        />
      );
    };
  };
}
```

在 VS Code 中达到的类型静态检查效果：

![组件的类型静态检查](https://img.alicdn.com/tfs/TB1fGYPsrj1gK0jSZFuXXcrHpXa-1511-250.png)

经过这些优化之后，我们终于可以拍着胸脯说：icestore 的特性之一是良好的 TypeScript 支持（附录 6）；）

## 附录

1. [State of JavaScript 2019](https://2019.stateofjs.com/)
2. [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/generics.html)
3. [TypeScript Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html#contextual-typing)
4. [icestore release 0.4.1](https://github.com/ice-lab/icestore/releases/tag/v0.4.1)
5. [React+TypeScript Cheatsheets](https://github.com/typescript-cheatsheets/react-typescript-cheatsheet)
6. [TypeScript Utilities Cheatsheet](https://github.com/typescript-cheatsheets/typescript-utilities-cheatsheet)
7. [icestore PR: 添加「良好的 TypeScript 支持」特性到 README.md](https://github.com/ice-lab/icestore/pull/42/files#diff-0d10b069ec2726b1e9d0c0b0eae34f3eR31)

> 封面图来自[《新疆三号坑》](https://alvinhui.lofter.com/post/1cb252a0_1c7209543)。