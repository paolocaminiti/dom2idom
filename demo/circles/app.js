'use strict';

// Change N to change the number of drawn circles.
var N = 1000;

function setN (target) {
	N = parseInt(target.value) || 1
}

//benchmark
var timeout, totalTime, loopCount;
var timingOutput;

var benchmarkLoop = function (fn) {
	var startDate = new Date();
	fn();
	var endDate = new Date();
	totalTime += endDate - startDate;
	loopCount++;
	if (loopCount % 20 === 0) {
		timingOutput.text('Performed ' + loopCount + ' iterations in ' + totalTime +
											' ms (average ' + (totalTime / loopCount).toFixed(2) + ' ms per loop).');
	}
	timeout = _.defer(benchmarkLoop, fn);
};

var reset = function() {
	$('#grid').empty();
	$('#timing').html('&nbsp;');
	timingOutput = $('#timing')
	clearTimeout(timeout);
	loopCount = 0;
	totalTime = 0;
};

// The React implementation:
(function(){'use strict';
	var BoxView = React.createClass({
		render: function() {
			var count = this.props.count + 1;
			return (
				React.DOM.div(
					{className: "box-view"},
					React.DOM.div(
						{
							className: "box",
							style: {
								top: Math.sin(count / 10) * 10,
								left: Math.cos(count / 10) * 10,
								background: 'rgb(0, 0,' + count % 255 + ')'
							}
						},
						count % 100
					)
				)
			);
		}
	});

	var range;

	var BoxesView = React.createClass({
		render: function() {
			var boxes = range.map(function(i) {
				return BoxView({key: i, count: this.props.count});
			}, this);
			return React.DOM.div(null, boxes);
		}
	});

	var counter;
	var reactInit = function() {
		range = _.range(N);
		counter = -1;
		reactAnimate();
	};

	var reactAnimate = function() {
		React.renderComponent(
			BoxesView({count: counter++}),
			document.getElementById('grid')
		);
	};

	window.runReact = function() {
		reset();
		reactInit();
		benchmarkLoop(reactAnimate);
	};
})();

// rawdog
(function(){'use strict';
	var BoxView = function(number){
		this.el = document.createElement('div');
		this.el.className = 'box-view';
		this.el.innerHTML = '<div class="box" id="box-' + number + '"></div>';
		this.count = 0;
		this.render();
	};

	BoxView.prototype.render = function(){
		var count = this.count;
		var el = this.el.firstChild;
		el.style.top = Math.sin(count / 10) * 10 + 'px';
		el.style.left = Math.cos(count / 10) * 10 + 'px';
		el.style.background = 'rgb(0,0,' + count % 255 + ')';
		el.textContent = String(count % 100);
	};

	BoxView.prototype.tick = function(){
		this.count++;
		this.render();
	};

	var boxes;

	var init = function() {
		boxes = _.map(_.range(N), function(i) {
			var view = new BoxView(i);
			$('#grid').append(view.el);
			return view;
		});
	};

	var animate = function() {
		for (var i = 0, l = boxes.length; i < l; i++) {
		boxes[i].tick();
		}
	};

	window.runRawdog = function() {
		reset();
		init();
		benchmarkLoop(animate);
	};
})();

// Incremental DOM
(function(){
	var state
	var container

	var elementOpen = IncrementalDOM.elementOpen;
	var elementClose = IncrementalDOM.elementClose;
	var elementVoid = IncrementalDOM.elementVoid;
	var text = IncrementalDOM.text;
	var patch = IncrementalDOM.patch;

	function init() {
		state = {
			boxes: []
		}
		for (var i = 0; i < N; i++) state.boxes.push({ count: 0 })
		container = window.document.getElementById('grid')
	}

	var handlers = {}

	var boxViewStatics = ['class', 'box-view']
	var boxStatics = ['class', 'box']

	function box(i, index) {
		var count = i.count
		var boxStyle = 'top: ' + (Math.sin(count / 10) * 10) + 'px; left: ' + (Math.cos(count / 10) * 10) + 'px; background: rgb(0, 0,' + (count % 255) + ')'
		elementOpen('div', index, boxViewStatics)
			elementOpen('div', null, boxStatics, 'style', boxStyle)
				text(count % 100)
			elementClose('div')
		elementClose('div')
	}

	function render(s) {
		//elementOpen('div')
			s.boxes.map(box)
		//elementClose('div')
	}

	function update() {
		patch(container, render, state)
	}

	function tick(b) {
		b.count++
	}

	function animate() {
		var boxes = state.boxes
		for (var i = 0, l = boxes.length; i < l; i++) tick(boxes[i])
		update()
	}

	window.runIncDOM = function() {
		reset();
		init();
		benchmarkLoop(animate);
	};
})();

// vanilla in fragment > dom2idom
(function(){
	var BoxView = function(number){
		this.el = document.createElement('div');
		this.el.className = 'box-view';
		this.el.setAttribute('_key', number)
		this.el.innerHTML = '<div class="box" id="box-' + number + '"></div>';
		this.count = 0;
		this.render();
	};

	BoxView.prototype.render = function(){
		var count = this.count;
		var el = this.el.firstChild;
		el.style.top = Math.sin(count / 10) * 10 + 'px';
		el.style.left = Math.cos(count / 10) * 10 + 'px';
		el.style.background = 'rgb(0,0,' + count % 255 + ')';
		el.textContent = String(count % 100);
	};

	BoxView.prototype.tick = function(){
		this.count++;
		this.render();
	};

	var boxes;
	var grid;
	var gridFrag;

	var init = function() {
		grid = document.getElementById('grid');
		gridFrag = document.createElement('span')
		boxes = _.map(_.range(N), function(i) {
			var view = new BoxView(i);
			gridFrag.appendChild(view.el);
			return view;
		});
	};

	var animate = function() {
		for (var i = 0, l = boxes.length; i < l; i++) {
			boxes[i].tick();
		}
		IncrementalDOM.patch(grid, dom2idom, gridFrag)
	};

	window.runVanillaFragDom2idom = function() {
		reset();
		init();
		benchmarkLoop(animate);
	};
})();

// vanilla to string > innerHTML
(function(){
	var state
	var container

	function init() {
		state = {
			boxes: []
		}
		for (var i = 0; i < N; i++) state.boxes.push({ count: 0 })
		container = window.document.getElementById('grid')
	}

	function render2String(s) {
		var html = [];
		var boxes = s.boxes
		for (var i = 0, l = boxes.length; i < l; i++) {
			var box = boxes[i]
			var count = box.count
			var textContent = String(count % 100)
			var top = Math.sin(count / 10) * 10 + 'px'
			var left = Math.cos(count / 10) * 10 + 'px'
			var background = 'rgb(0,0,' + count % 255 + ')'
			var style = 'top: ' + top + '; left: ' + left + '; background: ' + background + ';'

			html.push('<div class="box-view">\
				<div class="box" id="box-' + i + '" style="' + style + '">\
					' + textContent + '\
				</div>\
			</div>')
		}
		return html.join('')
	}

	function update() {
		var htmlString = render2String(state)
		container.innerHTML = htmlString
	}

	function tick(b) {
		b.count++
	}

	function animate() {
		var boxes = state.boxes
		for (var i = 0, l = boxes.length; i < l; i++) tick(boxes[i])
		update()
	}

	window.runVanillaStringInnerHTML = function() {
		reset();
		init();
		benchmarkLoop(animate);
	};
})();

// vanilla to string > dom2idom
(function(){
	var state
	var container

	function init() {
		state = {
			boxes: []
		}
		for (var i = 0; i < N; i++) state.boxes.push({ count: 0 })
		container = window.document.getElementById('grid')
	}

	function render2String(s) {
		var html = [];
		var boxes = s.boxes
		for (var i = 0, l = boxes.length; i < l; i++) {
			var box = boxes[i]
			var count = box.count
			var textContent = String(count % 100)
			var top = Math.sin(count / 10) * 10 + 'px'
			var left = Math.cos(count / 10) * 10 + 'px'
			var background = 'rgb(0,0,' + count % 255 + ')'
			var style = 'top: ' + top + '; left: ' + left + '; background: ' + background + ';'

			html.push('<div class="box-view" _key="' + i + '">\
				<div class="box" id="box-' + i + '" style="' + style + '">\
					' + textContent + '\
				</div>\
			</div>')
		}
		return html.join('')
	}

	function update() {
		var htmlString = render2String(state)
		IncrementalDOM.patch(container, dom2idom, htmlString)
	}

	function tick(b) {
		b.count++
	}

	function animate() {
		var boxes = state.boxes
		for (var i = 0, l = boxes.length; i < l; i++) tick(boxes[i])
		update()
	}

	window.runVanillaStringDom2idom = function() {
		reset();
		init();
		benchmarkLoop(animate);
	};
})();

// jQuery > dom2idom
$.fn.patch = function (target) {
    IncrementalDOM.patch(target.get(0), dom2idom, this.get(0))
    return this
};

(function(){
	var state
	var $container

	function init() {
		state = {
			boxes: []
		}
		for (var i = 0; i < N; i++) state.boxes.push({ count: 0 })
		$container = $('#grid')
	}

	function render(s) {
		var $root = $('<span></span>')
		var boxes = s.boxes
		for (var i = 0, l = boxes.length; i < l; i++) {
			var box = boxes[i]
			var count = box.count
			var textContent = String(count % 100)
			var top = Math.sin(count / 10) * 10 + 'px'
			var left = Math.cos(count / 10) * 10 + 'px'
			var background = 'rgb(0,0,' + count % 255 + ')'
			var style = 'top: ' + top + '; left: ' + left + '; background: ' + background + ';'

			var $boxView = $('<div class="box-view"></div>')
			var $box = $('<div></div>', {
					'class': 'box',
					'id': i,
					'style': style
				})
				.text(textContent)
			    .appendTo($boxView)
			$boxView.appendTo($root)
		}
		return $root
	}

	function update() {
		var $frag = render(state)
		$frag.patch($container)
	}

	function tick(b) {
		b.count++
	}

	function animate() {
		var boxes = state.boxes
		for (var i = 0, l = boxes.length; i < l; i++) tick(boxes[i])
		update()
	}

	window.runjQueryDom2idom = function() {
		reset();
		init();
		benchmarkLoop(animate);
	};
})();