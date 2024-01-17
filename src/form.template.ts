const formTemplate = `
<!DOCTYPE html>
<html>
<head>
  <title>XRAY | Graph | Turbo TX Send</title>
  <link rel="icon" href="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTg0cHgiIGhlaWdodD0iMTg0cHgiIHZpZXdCb3g9IjAgMCAxODQgMTg0IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPkdyb3VwIDM8L3RpdGxlPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgaWQ9IkFydGJvYXJkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzY1LjAwMDAwMCwgLTE1MC4wMDAwMDApIj4KICAgICAgICAgICAgPGcgaWQ9Ikdyb3VwLTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM2NS4wMDAwMDAsIDE1MC4wMDAwMDApIj4KICAgICAgICAgICAgICAgIDxyZWN0IGlkPSJSZWN0YW5nbGUiIGZpbGw9IiMxOTQwRUQiIHg9IjAiIHk9IjAiIHdpZHRoPSIxODQiIGhlaWdodD0iMTg0IiByeD0iMzIuMTMyMjc2NiI+PC9yZWN0PgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlJlY3RhbmdsZSIgZmlsbD0iI0ZGRkZGRiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOTIuMjM3NjU1LCA5MS43NzgwMjcpIHNjYWxlKC0xLCAxKSB0cmFuc2xhdGUoLTkyLjIzNzY1NSwgLTkxLjc3ODAyNykgIiBwb2ludHM9IjM1Ljk4NTQ0NTcgNDguNzA1ODgyNCA2OS4yNzg2MjAxIDQ4LjcwNTg4MjQgMTQ4LjQ4OTg2NCAxMzQuODUwMTcyIDExNS4xOTY2OSAxMzQuODUwMTcyIj48L3BvbHlnb24+CiAgICAgICAgICAgICAgICA8cG9seWdvbiBpZD0iUmVjdGFuZ2xlIiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjM1Ljk4NTQ0NTcgNDguNzA1ODgyNCA2OS4yNzg2MjAxIDQ4LjcwNTg4MjQgMTQ4LjQ4OTg2NCAxMzQuODUwMTcyIDExNS4xOTY2OSAxMzQuODUwMTcyIj48L3BvbHlnb24+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==" />
  <style>
    html, body {
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }
    .app {
      max-width: 640px !important;
      padding: 40px 20px;
      margin: 0 auto;
    }
    .textarea {
      border: 1px solid #ececec;
      box-sizing: border-box;
      border-radius: 8px;
      resize: vertical;
      width: 100%;
      min-height: 142px;
      padding: 10px;
      margin: 0 0 20px 0;
    }
    .result {
      display: none;
      font-size: 14px;
      background: #f3f3f3;
      border-radius: 8px;
      margin-bottom: 20px;
      padding: 10px;
    }
    .success, .hash, .failed, .empty, .error {
      display: none;
      color: #3FCB9B;
      word-break: break-all;
    }
    .failed {
      color: #D33535;
    }
    .empty, .error, .hash {
      color: #000;
    }
    .response {
      color: #aaaaaa;
      margin-top: 5px;
      display: none;
      word-break: break-all;
    }
    .button {
      padding: 10px 25px;
      font-weight: bold;
      border: none;
      border-radius: 8px;
      background: #1940ED;
      color: #ffffff;
      cursor: pointer;
      margin-right: 5px;
    }
    .button:hover {
      background: #4A67EA;
    }
    .button.disabled {
      opacity: 0.6;
      pointer-events: none;
    }
    .button.reset {
      padding: 10px 15px;
      background: #ffffff;
      color: #000000;
    }
    .button.reset:hover {
      background: #f3f3f3;
    }
    .visible {
      display: block;
    }
  </style>
</head>
<body>
<div class="app">
  <h4>XRAY | Graph | Turbo TX Send</h4>
  <textarea class="textarea" rows="8" placeholder="Paste TX in CBOR (string) format..."></textarea>
  <div class="result">
    <div class="success"><strong>Success</strong></div>
    <div class="hash"></div>
    <div class="failed"><strong>Failed</strong></div>
    <div class="empty">Insert a transaction...</div>
    <div class="error">Something went wrong. Try again later...</div>
    <div class="response"></div>
  </div>
  <button class="button submit" onclick="submitForm()">Submit TX</button>
  <button class="button reset" onclick="resetForm()">Reset Form</button>
</div>
<script>
  var textarea = document.getElementsByClassName("textarea")[0]
  var result = document.getElementsByClassName("result")[0]
  var success = document.getElementsByClassName("success")[0]
  var hash = document.getElementsByClassName("hash")[0]
  var failed = document.getElementsByClassName("failed")[0]
  var empty = document.getElementsByClassName("empty")[0]
  var error = document.getElementsByClassName("error")[0]
  var response = document.getElementsByClassName("response")[0]
  var submit = document.getElementsByClassName("submit")[0]
  var reset = document.getElementsByClassName("reset")[0]

  async function submitForm() {
    var tx = textarea.value
    if (tx) {
      resetForm(false)
      submit.classList.add("disabled")
      var __response = await fetch("https://graph.xray.app/turbo-tx-send/mainnet", {
        method: "POST",
        headers: {
          "content-type": "text/plain"
        },
        body: tx
      })
      if (__response.ok) {
        var __result = await __response.json()
        if (__result.status === "success") {
          success.classList.add("visible")
          result.classList.add("visible")
          hash.innerHTML = "Tx Hash: <a href='https://cardanoscan.io/transaction/" + __result.hash + "' target='_blank'>" + __result.hash + "</a>"
          hash.classList.add("visible")
          response.innerHTML = JSON.stringify(__result)
          response.classList.add("visible")
        } else {
          result.classList.add("visible")
          failed.classList.add("visible")
          response.innerHTML = JSON.stringify(__result)
          response.classList.add("visible")
        }
      } else {
        result.classList.add("visible")
        error.classList.add("visible")
      }
      submit.classList.remove("disabled")
      return
    } else {
      resetForm()
      result.classList.add("visible")
      empty.classList.add("visible")
    }
  }

  function resetForm(resetTx = true) {
    if (resetTx) textarea.value = ""
    response.innerHTML = ""
    hash.innerHTML = ""
    result.classList.remove("visible")
    success.classList.remove("visible")
    hash.classList.remove("visible")
    failed.classList.remove("visible")
    empty.classList.remove("visible")
    error.classList.remove("visible")
    response.classList.remove("visible")
  }
</script>
</body>
</html>
`

export default formTemplate
