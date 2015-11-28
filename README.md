### In place DOM to DOM mutations, via IncrementalDOM.

##### DISCLAIMER
This came out of curiosity, it's a very inefficient way to use IncrementalDOM, and should absolutely not be your pick for new projects.

In old existing codebases that you need to put your hands on, it may help you take advantage of in place mutations and refactor things in a bit more declarative style without modifing your UI DOM generation. For such codebases it comes as a relatively lightweight dependecy (IncrementalDOM is < 10Kb).

##### Live demos
[circles](http://paolocaminiti.github.io/dom2idom/demo/circles/), benchmark to get a measure of inefficiency

##### Usage
```javascript
// Make yourself an helper
function patch(target, frag) {
	IncrementalDOM.patch(target, dom2idom, frag)
}

// If you live in JQuery chains
$.fn.patch = function (target) {
    IncrementalDOM.patch(target.get(0), dom2idom, this.get(0))
    return this
}

// If you like the danger or are convinced this should be part of the standard
Element.prototype.patch = function (frag) {
	IncrementalDOM.patch(this, dom2idom, frag)
}
```

##### How does it work?
It will take an HTML string, a DOM fragment, or an equivalent plain object, and execute its equivalent  [IncrementalDOM](https://github.com/google/incremental-dom) instructions.

In the circles demo you can clearly see the difference between replacing the innerHTML and patching it, from the devtools Elements tab.

Mutating the DOM in place means its current elements instances will be respected, this is of great advantage when updating your UI.

Although not of great help with static content, you can optionally assign elements a key or declare that their descendants should be skipped by assigning attributes to you static DOM fragment *\<div _key="unique" _skip="true"\>*, you can change the attrs name in the code. For more on keys and skip usage refere to the [IncrementalDOM documentation](http://google.github.io/incremental-dom/#about).

##### DOM equivalent plain object?
An object with the exact same properties as the DOM interface, this gives you serialized DOM without string parsers. You can find two little gists here:

[dom2domobj](https://gist.github.com/paolocaminiti/5a169ea7b42dcf947912), from DOM fragment or HTML string.

[jsonml2domobj](https://gist.github.com/paolocaminiti/74fcd11b9da29a73c240), from JSOML.
