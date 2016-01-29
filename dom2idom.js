var dom2idom = (function () {
	var elementOpen = IncrementalDOM.elementOpen
	var elementClose = IncrementalDOM.elementClose
	var skip = IncrementalDOM.skip
	var text = IncrementalDOM.text

	var KEY_ATTRIBUTE_NAME = 'key'
	var SKIP_ATTRIBUTE_NAME = 'skip'

	function asIDOM(frag) {
		var childNodes = frag.childNodes

		for (var i = 0, len = childNodes.length; i < len; i++) {
			var node = childNodes[i]
			var nodeType = node.nodeType
			var nodeName = node.nodeName

			if (nodeType === 1) {
				var openArgs = [nodeName, null, null]
				var attrs = node.attributes
				var skip = false

				if (attrs) {
					for (var a = 0; a < attrs.length; a++) {
						var attr = attrs[a]
						var name = attr.name
						var value = attr.value

						if (name === KEY_ATTRIBUTE_NAME) {
							openArgs[1] = value
						} else if (name === SKIP_ATTRIBUTE_NAME) {
							skip = true
						}

						openArgs.push(name)
						openArgs.push(value)
					}
				}

				elementOpen.apply(null, openArgs)

				if (skip) {
					skip()
				} else {
					if (node.childNodes.length > 0)	{
						asIDOM(node)
					}
				}

				elementClose(nodeName)
			} else if (nodeType === 3) {
				text(node.data)
			}
		}
	}

	function parse(frag) {
		if (typeof frag === 'string') {
			var f = document.createElement('span')
			f.innerHTML = frag
			frag = f
		}

		asIDOM(frag)
	}

	return parse
})();
