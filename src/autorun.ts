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
        this.currentObserver = callback
        callback()
        // 这里确保只有在autorun执行时，才会有callback，也就是只会收集autorun的副作用
        this.currentObserver =  null
    }

    // 将原始对象进行代理，返回代理对象，即该对象成为可观察对象
    public observable<T>(obj: ObjectType): T {
        return (this.isObservable(obj) ? this.proxies.get(obj) : this.toObservable(obj)) as T;
    }

    private isObservable(obj : ObjectType) {
        return this.proxies.get(obj);
    }

    // 对原始对象代理
    private toObservable(obj: ObjectType) {
        let self = this
        const proxy = new Proxy(obj, {
            get: function (target, key, receiver) {
                // 只有在autorun中的时候，保证有currentObserver
                if (self.currentObserver) {
                    let map = self.observers.get(target) 
                    if (!map) {
                        // 不存在则新建
                        map = new Map()
                        map.set(key as string, new Set([self.currentObserver]))
                    } else {
                        //已经存在，则利用
                        map.set(key as string, new Set([self.currentObserver]))
                    }
                    self.observers.set(target  ,map)
                }
                
                return Reflect.get(target ,key  , receiver)
            },
            set: function (target, key, value, receiver) {
                const map = self.observers.get(target);
                if (map) {
                    // 只获取key对应的副作用
                  const obsCallback = map.get(key as string);
                  // 执行
                  obsCallback && obsCallback.forEach(ob => ob());
                }
                return Reflect.set(target, key, value, receiver);;
            }
        })
        // proxy缓存
        this.proxies.set(obj, proxy)
        return proxy
    }
}
export const Obs = new Observable()
