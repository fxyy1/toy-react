// 一般节点
class ElementWrapper {
    constructor(type) {
        this.root = document.createElement(type);
    }
    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }
    appendChild(component) {
        this.root.appendChild(component.root);
    }
}

// 文本节点
class TextWrapper {
    constructor(content) {
        this.root = document.createTextNode(content);
    }
}

class Component {
    constructor() {
        this.props = Object.create(null);
        this.children = [];
        this._root = null;
    }
    setAttribute(name, value) {
        this.props[name] = value;
    }
    appendChild(component) {
        this.children.push(component);
    }
    get root() {
        if (!this._root) {
            this._root = this.render().root;
        }
        return this._root;
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

            // 
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

function render(component, parentElement) {
    parentElement.appendChild(component.root);
}

export { Component, createElement, render };
