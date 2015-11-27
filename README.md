# dom2idom

##### DISCLAIMER
This came out of curiosity, it's a very inefficient way to use IncrementalDOM, and should absolutely not be your pick for new projects.

In old existing codebases that you need to put your hands on, it may help you take advantage of in place mutations and refactor stuff a bit with a more declarative style without modifing your UI DOM generation. For such codebases it comes as a relatively lightweight dependecy (IncrementalDOM is < 10Kb).

##### What is this?
This little utility allows in place DOM to DOM mutations.

It will take an HTML string, a DOM fragment, or an equivalent plain object, and execute it as [IncrementalDOM](https://github.com/google/incremental-dom) instructions.

##### live demos
[circles](http://paolocaminiti.github.io/dom2idom/demo/circles/), benchmark to get a measure of inefficiency

##### Usage
```javascript
// Make yourself an helper
function patch(target, frag) {
	IncrementalDOM.patch(target, dom2idom, frag)
}

// If you leave in JQuery chains
$.fn.patch = function (target) {
    IncrementalDOM.patch(target.get(0), dom2idom, this.get(0))
    return this
}

// If you like the danger or are convinced this should be part of the standard
Element.prototype.patch = function (frag) {
	IncrementalDOM.patch(this, dom2idom, frag)
}
```

##### Utils
[dom2domobj](https://gist.github.com/paolocaminiti/5a169ea7b42dcf947912)

[jsonml2domobj](https://gist.github.com/paolocaminiti/74fcd11b9da29a73c240)
