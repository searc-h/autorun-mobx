## Mobx中的autorun
- 自动收集依赖
- 检测依赖改变触发副作用

## 实现
```ts
interface ObjectType { 
    [k:string] : unknown
}
type CallBack = () => void 

export class Observable {

    // key:原始对象 ,value:代理对象 【proxy代理缓存】
    proxies: WeakMap<ObjectType, ObjectType>

    // autorun的参数 【回调】
    currentObserver: CallBack | null

    // key:原始对象 ,value:{key:属性值，value：副作用集合} 【原始对象-属性-副作用 三者关系映射】
    observers : WeakMap<ObjectType , Map<string, Set<CallBack>>>

    constructor() {
        this.proxies = new WeakMap()
        this.currentObserver = null
        this.observers = new Map()
    }
    // 自动依赖收集，在依赖改变时，触发回调
    public autorun(callback:CallBack) {
    }

    // 将原始对象进行代理，返回代理对象，即该对象成为可观察对象
    public observable<T>(obj: ObjectType): T {
    }

    // 利用代理缓存判断是否已经代理
    private isObservable(obj : ObjectType) {
    }

    // 对原始对象代理
    private toObservable(obj: ObjectType) {
    }
}
```


## 使用
```TS
import React, { useEffect } from 'react';
const Obs = new Observable()
const obj = {
  name: 'hello',
  age : 23
}

function App() {
  let proxyS = Obs.observable<typeof obj>(obj)
  
  Obs.autorun(() => {
    console.log(proxyS.name)
  })

  Obs.autorun(() => {
    console.log(proxyS.age)
  })

  useEffect(() => {
    setTimeout(() => {
      proxyS.name = 'world'
    }, 2000);
  },[])

  return (
    <div className="App"> </div>
  );
}

export default App;
```


## 源码
```bash
/src/autorun.tss
```