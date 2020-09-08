const RENDER_TO_DOM = Symbol('render to dom');

class Component {
    constructor() {
        this.props = Object.create(null);
        this.children = [];
        this._root = null;
        this._range = null;
    }

    setAttribute(name, value) {
        this.props[name] = value;
    }

    appendChild(component) {
        this.children.push(component);
    }

    get vdom() {
        return this.render().vdom;
    }

    [RENDER_TO_DOM](range) {
        this._range = range;
        this.render()[RENDER_TO_DOM](range);
    }

    // 重新绘制指令
    reRender() {
        let oldRange = this._range;
        let range = document.createRange();

        range.setStart(oldRange.startContainer, oldRange.startOffset);
        range.setEnd(oldRange.startContainer, oldRange.startOffset);
        this[RENDER_TO_DOM](range);

        oldRange.setStart(range.endContainer, range.endOffset);
        oldRange.deleteContents();
    }

    // 深拷贝合并
    setState(newState) {
        if (this.state === null || typeof this.state !== 'object') {
            this.state = newState;
            this.reRender();
            return;
        }
        let merge = (oldState, newState) => {
            for (let p in newState) {
                if (oldState[p] === null || typeof oldState[p] !== 'object') {
                    oldState[p] = newState[p];
                } else {
                    merge(oldState[p], newState[p]);
                }
            }
        };
        merge(this.state, newState);
        this.reRender();
    }
}

// 一般节点
class ElementWrapper extends Component {
    constructor(type) {
        super(type);
        this.type = type;
        this.root = document.createElement(type);
    }

    // setAttribute(name, value) {
    //     // 对名字特殊处理
    //     if (name.match(/^on([\s\S]+)$/)) {
    //         this.root.addEventListener(
    //             RegExp.$1.replace(/^[\s\S]/, (c) => c.toLowerCase()),
    //             value
    //         );
    //     } else {
    //         if (name === 'className') {
    //             this.root.setAttribute('class', value);
    //         } else {
    //             this.root.setAttribute(name, value);
    //         }
    //     }
    // }

    // appendChild(component) {
    //     let range = document.createRange();
    //     range.setStart(this.root, this.root.childNodes.length);
    //     range.setEnd(this.root, this.root.childNodes.length);
    //     component[RENDER_TO_DOM](range);
    //     // this.root.appendChild(component.root);
    // }

    get vdom() {
        return {
            type: this.type,
            props: this.props,
            children: this.children.map((child) => child.vdom),
        };
    }

    [RENDER_TO_DOM](range) {
        range.deleteContents();
        range.insertNode(this.root);
    }
}

// 文本节点
class TextWrapper extends Component {
    constructor(content) {
        super(content);
        this.content = content;
        this.root = document.createTextNode(content);
    }

    get vdom() {
        return {
            type: '#text',
            content: this.content,
        };
    }

    [RENDER_TO_DOM](range) {
        range.deleteContents();
        range.insertNode(this.root);
    }
}

// 创建节点
function createElement(type, attributes, ...children) {
    let e = null;

    if (typeof type === 'string') {
        e = new ElementWrapper(type);
    } else {
        e = new type();
    }

    // 设置属性
    for (let p in attributes) {
        e.setAttribute(p, attributes[p]);
    }

    // 添加文本节点
    let insertChildren = (children) => {
        for (let child of children) {
            // 有文本内容，则改变为文本节点
            if (typeof child === 'string') {
                child = new TextWrapper(child);
            }

            // null 不做处理
            if (child === null) {
                continue;
            }

            if (typeof child === 'object' && child instanceof Array) {
                insertChildren(child);
            } else {
                e.appendChild(child);
            }
        }
    };

    insertChildren(children);

    return e;
}

// 渲染或重新渲染
function render(component, parentElement) {
    let range = document.createRange();
    range.setStart(parentElement, 0);
    range.setEnd(parentElement, parentElement.childNodes.length);
    range.deleteContents();
    component[RENDER_TO_DOM](range);
    // parentElement.appendChild(component.root);
}

export { Component, createElement, render };
