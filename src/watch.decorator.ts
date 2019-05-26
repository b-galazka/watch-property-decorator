import { WatchOptions } from './interfaces';

export function Watch<T = any>(propName: keyof T, options: WatchOptions = { immediate: true }) {
    const valueKey = Symbol();

    return (target: object, methodName: string): any => {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(target, propName);

        if (propertyDescriptor) {
            return Object.defineProperty(target, propName, {
                set(value: any): boolean {
                    const prevValue = propertyDescriptor.get.call(this);
                    const isInitialValue = propertyDescriptor.set.call(this, value);
                    const method = <() => any> this[methodName];

                    if (!isInitialValue || options.immediate) {
                        method.call(this, value, prevValue, isInitialValue);
                    }

                    return isInitialValue;
                },

                get(): any {
                    return propertyDescriptor.get.call(this);
                },

                configurable: true
            });
        }

        return Object.defineProperty(target, propName, {
            set(value: any): boolean {
                const prevValue = this[valueKey];
                const isInitialValue = !this.hasOwnProperty(valueKey);
                const method = <() => any> this[methodName];
                this[valueKey] = value;

                if (!isInitialValue || options.immediate) {
                    method.call(this, value, prevValue, isInitialValue);
                }

                return isInitialValue;
            },

            get(): any {
                return this[valueKey];
            },

            configurable: true
        });
    };
}
