/*  真实dom创建的过程 */
// 保存原始的DOM API
const originalApis = {
  createElement: document.createElement.bind(document),
  createTextNode: document.createTextNode.bind(document),
  appendChild: Node.prototype.appendChild,
  insertBefore: Node.prototype.insertBefore,
  removeChild: Node.prototype.removeChild,
  replaceChild: Node.prototype.replaceChild,
  cloneNode: Node.prototype.cloneNode,
  createDocumentFragment: document.createDocumentFragment.bind(document),
  createComment: document.createComment.bind(document),
}

// 重载createElement
document.createElement = function (tagName, options) {
  const element = originalApis.createElement(tagName, options)
  console.log(`[DOM API] (createElement) created:`, element)
  return element
}

// 重载createTextNode
document.createTextNode = function (data) {
  const textNode = originalApis.createTextNode(data)
  console.log(`[DOM API] (createTextNode) created:`, textNode)
  return textNode
}

// 重载appendChild
Node.prototype.appendChild = function (child) {
  console.log(
    `[DOM API] (appendChild) parent:`,
    this,
    ` appending child:`,
    child,
  )
  return originalApis.appendChild.call(this, child)
}

// 重载insertBefore
Node.prototype.insertBefore = function (newNode, referenceNode) {
  console.log(
    '[DOM API] (insertBefore) parent:',
    this,
    ' insert:',
    newNode,
    ' before:',
    referenceNode,
  )
  return originalApis.insertBefore.call(this, newNode, referenceNode)
}

// 重载removeChild
Node.prototype.removeChild = function (child) {
  console.log(
    `[DOM API] (removeChild) parent:`,
    this,
    ` removing child:`,
    child,
  )
  return originalApis.removeChild.call(this, child)
}

// 重载replaceChild
Node.prototype.replaceChild = function (newNode, oldNode) {
  console.log(
    `[DOM API] (replaceChild) parent:`,
    this,
    ` replace:`,
    oldNode,
    ` with:`,
    newNode,
  )
  return originalApis.replaceChild.call(this, newNode, oldNode)
}

// 重载cloneNode
Node.prototype.cloneNode = function (deep) {
  const clonedNode = originalApis.cloneNode.call(this, deep)
  console.log(
    `[DOM API] (cloneNode) original:`,
    this,
    ` cloned:`,
    clonedNode,
    ` deep:`,
    deep,
  )
  return clonedNode
}
