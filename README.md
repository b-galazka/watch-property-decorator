# watch-property-decorator

Inspired by [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator#Watch).  
Should **not** be used on arrow function methods.

## Angular example usage

```ts
@Component({
  selector: 'hello',
  template: `<h1>Hello {{name}}!</h1>`
})
export class HelloComponent  {
  @Input() public name: string;

  @Watch<HelloComponent>('name')
  public handleNameChangeImmediately(value: string, previousValue: string, isInitialValue: boolean): void {
    console.log(value, previousValue, isInitialValue);
  }

  @Watch<HelloComponent>('name', { immediate: false })
  public handleNameChange(value: string, previousValue: string, isInitialValue: boolean): void {
    console.log(value, previousValue, isInitialValue);
  }
}
```
