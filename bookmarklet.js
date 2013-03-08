(function (window, document) {
var nodeName,
    elements = {},
    template = "<div class='flocus-node' id='%s' style='overflow: auto;'>\
    <div style='width: 30%; float: left; box-sizing: border-box; padding: 2px;'>%s</div>\
    <div style='width: 30%; float: left; box-sizing: border-box; padding: 2px;'>%s</div>\
    <div style='width: 30%; float: left; box-sizing: border-box; padding: 2px;'>%s</div>\
    <div style='clear:both'> </div>\
    </div>\
    ";

  function sprintf(text) {
    var i=1, args = arguments;
    return text.replace(/%s/g, function (pattern) {
      return (i < args.length) ? args[i++] : "";
    });
  }

  function createNode(name, node) {
      var el = document.createElement('div'),
          next = node.next || '',
          prev = node.previous || '';
      el.innerHTML = sprintf(template, 'state-' + name, prev, name, next);
      el = el.firstChild;
      el.addEventListener('click', function () {
          flocus.setState(name);
      }, false);
      return el;
  }

function buildStyle() {
  var style = "\
  #state-bookmarklet-root .current {\
    border: 1px solid red;\
  }\
  ", el = document.createElement('style');

  el.innerHTML = style;
  document.getElementsByTagName('head')[0].appendChild(el);
}

var rootTemp = "<div id='state-bookmarklet-root' style='opacity: .8; position: fixed; top: 0pt; left: 0pt; z-index: 9999; background: none repeat scroll 0% 0% white; padding: 5px; width: 300px;'>\
    <div style='width: 30%; float: left; padding: 2px;'>Previous</div>\
    <div style='width: 30%; float: left; padding: 2px;'>State</div>\
    <div style='width: 30%; float: left; padding: 2px;'>Next</div>\
    <div style='clear:both'> </div>\
</div>\
";
var rootEl = document.createElement('div');
rootEl.innerHTML = sprintf(rootTemp);
rootEl = rootEl.firstChild;

for (nodeName in flocus.states) {
    elements[nodeName] = elements[nodeName] || createNode(nodeName, flocus.states[nodeName]);
    rootEl.appendChild(elements[nodeName]);
}

buildStyle();
document.body.appendChild(rootEl);

if (typeof $ === 'function') {
  $(window).on('flocus:state-change', function (ev, state) {
    $('.current').removeClass('current');
    $('#state-'+state).addClass('current');
  });
  $('#state-'+flocus.getState()).addClass('current');
}
}(this.window, this.document));
