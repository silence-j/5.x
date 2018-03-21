/**
 * @author monkeywang
 * Date: 17/4/21
 */
class PreviewControl {
  editorControl (elId) {
    let hiddenArry = document.getElementsByClassName('editor')
    let editorNd = document.getElementById(elId)
    Array.prototype.forEach.call(hiddenArry, function (el, i) {
      el.style.display = 'none'
    })
    editorNd.style.display = 'block'
  }
}
window.previewControl = new PreviewControl()
