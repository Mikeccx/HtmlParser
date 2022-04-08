import { startTag, startTagClose, attribute, endTag } from './reg.js'
export default class HtmlParser {
    constructor(template, opts) {
        this.template = template
        this.options = opts
        this.init()
    }
    init() {
        let { template } = this
        this.index = 0
        this.template = template.trim()
        // 保证匹配
        this.stack = []
        this.curP = null
        this.root = null
    }
    // 截取html
    advance(n) {
        this.index += n
        this.template = this.template.substring(n)
    }
    startTagHandle() {
        const start = this.template.match(startTag)
        if (start) {
            const match = {
              tagName: start[1],
              attrs: [],
              start: this.index,
              children: [],
              parent: null
            };
            this.advance(start[0].length)
            var end, attr
            while (!(end = this.template.match(startTagClose)) && (attr = this.template.match(attribute))) {
              attr.start = this.index
              this.advance(attr[0].length)
              attr.end = this.index
              match.attrs.push({
                  key: attr[1],
                  value: attr[3]
              })
            }
            if (end) {
              match.unarySlash = end[1]
              this.advance(end[0].length)
              match.end = this.index
            }
            if (!this.root) {
                // 確定根節點
                this.root = match
                this.curP = match
            } else {
                match.parent = this.curP
                this.curP.children.push(match)
            }
            this.stack.push(match.tagName)
        }
    }
    getTop () {
        const len = this.stack.length
        return this.stack[len - 1]
    }
    endTagHandle() {
        const end = this.template.match(endTag)
        if (end) {
            this.advance(end[0].length)
            // 闭合标签没有对应上
            if (this.getTop() !== end[1]) {
                console.log('存在没有闭合的标签对')
                this.template = ''
            } else {
                this.stack.pop()
            }
        }
    }
    parse() {
        const index = this.template.indexOf('<')
        while(this.template) {
            if (endTag.test(this.template)) {
                this.endTagHandle()
            }
            if (startTag.test(this.template)) {
                this.startTagHandle()
            }
            // 处理文字todo

            this.template = this.template.trim()
        }
        console.log('this.root:', this.root)
        console.log('this.template:', this.stack)
        return this.root
    }
}