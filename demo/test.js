import HtmlParser from '../src/parse.js'
const tem = `
    <div id="app" style="color: red;" v-if="show">
        <span></span>
    </div>
`

const ins = new HtmlParser(tem, {})
ins.parse()