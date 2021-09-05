/*
 * @Author: Deng Fan
 * @Date: 2021-09-05 22:44:20
 * @Description: 
 */
 let conversion = document.getElementById('conversion');
  let copyBtn = document.getElementById('copy');
  let copySuccessBtn = document.getElementById('copySuccessText')
  let inputOperate = document.getElementById('input-operate');
  var inputEditor = CodeMirror.fromTextArea(inputOperate,{
    mode: 'application/json',
    tabSize: 2,
    smartIndent: true, // 是否智能缩进
    styleActiveLine: true, // 当前行高亮
    lineNumbers: true, // 显示行号
    theme: 'mdn-like',
    gutters: ["CodeMirror-linenumbers"],
    lineWrapping: true, // 自动换行
    matchBrackets: true, // 括号匹配显示
    autoCloseBrackets: true, // 输入和退格时成对
    autoRefresh: true, // 自动刷新
    foldOptions: {
            widget: (from, to) => {
              var count = undefined;

              // Get open / close token
              var startToken = '{', endToken = '}';
              var prevLine = window.editor_json.getLine(from.line);
              if (prevLine.lastIndexOf('[') > prevLine.lastIndexOf('{')) {
                startToken = '[', endToken = ']';
              }

              // Get json content
              var internal = window.editor_json.getRange(from, to);
              var toParse = startToken + internal + endToken;

              // Get key count
              try {
                var parsed = JSON.parse(toParse);
                count = Object.keys(parsed).length;
              } catch(e) { }

              return count ? `\u21A4${count}\u21A6` : '\u2194';
            }
          }
  });

  inputEditor.on('change',function (cm) {
    console.log(cm.getValue())
    if(!includesClass(copySuccessBtn,'disabled')) {
      copyBtn.classList.add('disabled');
    }
  })

  let outputOperate = document.getElementById('output-operate');
  var outputEditor = CodeMirror.fromTextArea(outputOperate, {
    mode: "javascript",
    lineNumbers: true,
    lineWrapping: true,
    tabSize: 2,
    smartIndent: true, // 是否智能缩进
    styleActiveLine: true, // 当前行高亮
    lineNumbers: true, // 显示行号
    theme: 'idea',
    gutters: ["CodeMirror-linenumbers"],
    lineWrapping: true, // 自动换行
    matchBrackets: true, // 括号匹配显示
    autoCloseBrackets: true, // 输入和退格时成对
    autoRefresh: true, // 自动刷新
    readOnly:'nocursor'
  });

  conversion.onclick = function () {
    try {
      data = JSON.parse(inputEditor.getValue());
      let interface = toInterface(data)
      console.log("🚀 ~ file: index.html ~ line 103 ~ interface", interface)
      outputEditor.setValue(interface);
      copyBtn.classList.remove('disabled');
    } catch (err) {
      console.error(err);
      outputEditor.setValue(err);
    }
  }

copyBtn.addEventListener('click', async function () {
  let interface = outputEditor.getValue();
  if(!includesClass(copyBtn,'disabled')) {
    let s = await navigator.clipboard.writeText(interface);
    if(includesClass(copySuccessBtn,'hidden')) {
      copySuccessBtn.classList.remove('hidden');
      setTimeout(() => {
        copySuccessBtn.classList.add('hidden')
      }, 2500)
    }
  }

})
// 判断dom是否存在某个 class
function includesClass(dom,className) {
  return Array.from(dom.classList).includes(className);
}