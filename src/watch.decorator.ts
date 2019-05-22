import { WatchOptions } from './interfaces';

export function Watch<T = any>(propName: keyof T, options: WatchOptions = { immediate: true }) {
    const valueKey = Symbol();

    return (target: object, methodName: string): any => {
        const propertyDescriptor = Object.getOwnPropertyDescriptor(target, propName);

        let setter: (value: any) => boolean;

        if (propertyDescriptor) {
            setter = function set(value: any): boolean {
                const prevValue = propertyDescriptor.get.call(this);
                const isInitialValue = propertyDescriptor.set.call(this, value);
                const method = <() => any> this[methodName];

                if (method && (!isInitialValue || options.immediate)) {
                    method.call(this, value, prevValue, isInitialValue);
                }

                return isInitialValue;
            };
        } else {
            setter = function set(value: any): boolean {
                const prevValue = this[valueKey];
                const isInitialValue = !this.hasOwnProperty(valueKey);
                const method = <() => any> this[methodName];
                this[valueKey] = value;


                if (method && (!isInitialValue || options.immediate)) {
                    method.call(this, value, prevValue, isInitialValue);
                }

                return isInitialValue;
            };
        }

        Object.defineProperty(target, propName, {
            set: setter,
            configurable: true,

            get(): any {
                return this[valueKey];
            }
        });
    };
}
