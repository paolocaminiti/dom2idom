# dom2idom

##### DISCLAIMER
TODO what and why

##### live demos
[circles](http://paolocaminiti.github.io/dom2idom/demo/circles/), benchmark to get a measure inefficiency

##### Usage
```javascript
function patch(target, frag) {
	IncrementalDOM.patch(target, dom2idom, frag)
}

$.fn.patch = function (target) {
    IncrementalDOM.patch(target.get(0), dom2idom, this.get(0))
    return this
}

Element.prototype.patch = function (frag) {
	IncrementalDOM.patch(this, dom2idom, frag)
}
```

##### Utils
[dom2domobj](https://gist.github.com/paolocaminiti/5a169ea7b42dcf947912)

[jsonml2domobj](https://gist.github.com/paolocaminiti/74fcd11b9da29a73c240)
