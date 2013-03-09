(function (window, document, $) {
  "use strict";

  var allManagers = []
    , stateManager
    ;

  stateManager = function (root) {
    var pageState
      , states = {}
      , listenersAttached
      , $root = $(root || 'body')
      , me
      ;

    function updateState(newState) {
      var previousState = pageState;
      pageState = newState;

      if (pageState !== previousState) {
        $root.trigger('flocus:state-change', [pageState, previousState]);
      }
    }

    function withjQuery(args, action) {
      if (!args || !action) { return; }

      var i, ii, rest, $el;

      for (i = 0, ii = args.length; i < ii; i++) {
        rest = args[i].slice(1);
        $el = $(args[i][0]);

        $el[action].apply($el, rest);
      }
    }

    function leave(state) {
      if (!state) { return; }

      withjQuery(state.addClasses, 'removeClass');
      withjQuery(state.removeClasses, 'addClass');
      withjQuery(state.bindEvents, 'off');
      withjQuery(state.unbindEvents, 'on');

      state.leave && state.leave();
    }

    function enter(state) {
      if (!state) { return; }

      withjQuery(state.addClasses, 'addClass');
      withjQuery(state.removeClasses, 'removeClass');
      withjQuery(state.bindEvents, 'on');
      withjQuery(state.unbindEvents, 'off');

      state.enter && state.enter();
    }

    function attachListeners() {
      var directions = ['next', 'previous']
        , i
        ;

      $root.on('flocus:state-change', function (ev, currState, prevState) {
        var current = states[currState],
            previous = states[prevState];

        leave(previous);
        enter(current);
      });

      function traverseHelper(direction) {
        $('.js-' + direction + '-state', $root).on('click', function () {
          !$(this).attr('disabled') && traverse(direction);
        });
      }

      for (i = 0; i < directions.length; i++) {
        traverseHelper(directions[i]);
      }

      $('.js-set-state', $root).on('click', function () {
        var hrefVal = $(this).attr('href');
        hrefVal.charAt(0) === "#" && (hrefVal = hrefVal.slice(1));

        updateState(hrefVal);
        return false;
      });
      listenersAttached = true;
    }

    function traverse(direction) {
      var newState = states[pageState] && states[pageState][direction];
      newState && updateState(newState);
    }

    function begin(initialState) {
      !listenersAttached && attachListeners();
      updateState(initialState);
    }

    me = {
      states: states
    , $root: $root
    , getState: function () { return pageState; }
    , traverse: traverse
    , next: function () { traverse('next'); }
    , previous: function () { traverse('previous'); }
    , setState: function (newState) { updateState(newState); }
    , add: function (name, newState, previous, next) {
        next && (newState.next = next);
        previous && (newState.previous = previous);
        states[name] = newState;
        return this;
      }
    , begin: begin
    };

    allManagers.push(me);
    return me;
  };

  stateManager.all = allManagers;
  window.flocus = stateManager;
}(this, this.document, this.jQuery || this.Zepto || this.ender));
