(function (window, document, $) {
  "use strict";

  var allManagers = []
    , stateManager
    , old
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

      function performHelper(direction) {
        $('.js-' + direction + '-state', $root).on('click', function () {
          !$(this).attr('disabled') && perform(direction);
        });
      }

      for (i = 0; i < directions.length; i++) {
        performHelper(directions[i]);
      }

      $('.js-set-state', $root).on('click', function () {
        var hrefVal = $(this).attr('href');
        hrefVal.charAt(0) === "#" && (hrefVal = hrefVal.slice(1));

        updateState(hrefVal);
        return false;
      });
      listenersAttached = true;
    }

    function perform(eventName) {
      var curr = states[pageState]
        , next = curr && curr.events[eventName]
        ;

      next && updateState(next);
    }

    function begin(initialState) {
      !listenersAttached && attachListeners();
      updateState(initialState);
    }

    function state(opts, name, previous, next) {
      var theState = $.extend({
        name: name
      , enter: function () {}
      , leave: function () {}
      }, opts);

      theState.events = $.extend({
        next: next
      , previous: previous
      }, theState.events);

      return theState;
    }


    me = {
      states: states
    , $root: $root
    , getState: function () { return pageState; }
    , perform: perform
    , next: function () { perform('next'); }
    , previous: function () { perform('previous'); }
    , setState: function (newState) { updateState(newState); }
    , add: function (name, newState, previous, next) {
        states[name] = state(newState, name, previous, next);
        return this;
      }
    , begin: begin
    };

    allManagers.push(me);
    return me;
  };

  stateManager.all = allManagers;

  old = window.flocus;
  stateManager.noConflict = function () {
    window.flocus = old;
    return stateManager;
  };

  window.flocus = stateManager;
}(this, this.document, this.jQuery || this.Zepto || this.ender));
