import { Watch } from '../src';

class TestObject {
    public fieldImmediate = 'initial value';
    public field = 'initial value';
    public fieldArrow = 'initial value';
    public fieldMultiple = 'initial value';

    @Watch<TestObject>('fieldImmediate')
    public handleImmediateFieldValueChange(
        value: string,
        prevValue: string,
        isInitial: boolean
    ): void { }

    @Watch<TestObject>('field', { immediate: false })
    public handleFieldValueChange(
        value: string,
        prevValue: string,
        isInitial: boolean
    ): void { }

    @Watch<TestObject>('fieldArrow')
    public handleFieldValueChangeArrow = (
        value: string,
        prevValue: string,
        isInitial: boolean
    ): void => { }

    @Watch<TestObject>('fieldMultiple')
    public handleFieldValueChangeMulti1(
        value: string,
        prevValue: string,
        isInitial: boolean
    ): void { }

    @Watch<TestObject>('fieldMultiple')
    public handleFieldValueChangeMulti2(
        value: string,
        prevValue: string,
        isInitial: boolean
    ): void { }

    @Watch<TestObject>('fieldMultiple')
    public handleFieldValueChangeMulti3(
        value: string,
        prevValue: string,
        isInitial: boolean
    ): void { }

    @Watch<TestObject>('fieldMultiple')
    public handleFieldValueChangeMulti4(
        value: string,
        prevValue: string,
        isInitial: boolean
    ): void { }
}

describe('@Watch', () => {
    it('should call handler on field initialization by default', () => {
        const spy = jest.spyOn(TestObject.prototype, 'handleImmediateFieldValueChange');

        new TestObject();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('initial value', undefined, true);
    });

    it('should not call handler on field initialization ' +
        'when `immediate` parameter is set to `false`', () => {

        const spy = jest.spyOn(TestObject.prototype, 'handleFieldValueChange');
        const testObj = new TestObject();

        testObj.field = 'new value';

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('new value', 'initial value', false);
    });

    it('should work with arrow function', () => {
        const testObj = new TestObject();
        const spy = jest.spyOn(testObj, 'handleFieldValueChangeArrow');

        testObj.fieldArrow = 'new value';

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith('new value', 'initial value', false);
    });

    it('should allow to watch single field by multiple methods', () => {
        const spies = [
            jest.spyOn(TestObject.prototype, 'handleFieldValueChangeMulti1'),
            jest.spyOn(TestObject.prototype, 'handleFieldValueChangeMulti2'),
            jest.spyOn(TestObject.prototype, 'handleFieldValueChangeMulti3'),
            jest.spyOn(TestObject.prototype, 'handleFieldValueChangeMulti4')
        ];

        const testObj = new TestObject();

        testObj.fieldMultiple = 'second value';
        testObj.fieldMultiple = 'third value';

        spies.forEach((spy) => {
            expect(spy).toHaveBeenCalledTimes(3);
            expect(spy).toHaveBeenNthCalledWith(1, 'initial value', undefined, true);
            expect(spy).toHaveBeenNthCalledWith(2, 'second value', 'initial value', false);
            expect(spy).toHaveBeenNthCalledWith(3, 'third value', 'second value', false);
        });
    });
});
