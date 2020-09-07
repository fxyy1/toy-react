import { Component, createElement, render } from './toy-react.js';

// 设置自定义组件
class MyComponent extends Component {
    render() {
        return (
            <div>
                <h1>my component</h1>
                {this.children}
            </div>
        );
    }
}

render(
    (<MyComponent id="a" class="c">
        <div>123</div>
        <div>456</div>
        <div>789</div>
    </MyComponent>),
    document.body
);
