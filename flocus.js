(function (window, document, $) {
  "use strict";

  var stateManager = function () {
    var pageState,
        states = {},
        listenersAttached;


    function parseSearch(queryKey) {
      var rawString = window.location.search.substring(1),
          vars = rawString.split('&'),
          i, ii,
          result = {};

      for (i = 0, ii = vars.length; i < ii; i++) {
        vars[i].replace(/([\s\S]+)=([\s\S]+)/, function (pattern, key, val) {
          key && val && (result[key] = val);
        });
      }

      queryKey && (result = result[queryKey]);
      return result;
    }

    function updateState(newState) {
      var previousState = pageState;
      pageState = newState;

      if (pageState !== previousState) {
        $(window).trigger('js-state-change', [pageState, previousState]);
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

      $(window).on('js-state-change', function (ev, currState, prevState) {
        var current = states[currState],
            previous = states[prevState];

        leave(previous);
        enter(current);
      });

      function traverseHelper(direction) {
        $('.js-' + direction + '-state').on('click', function () {
          !$(this).attr('disabled') && traverse(direction);
        });
      }

      for (i = 0; i < directions.length; i++) {
        traverseHelper(directions[i]);
      }

      ['next', 'previous'].forEach(function (direction) {
      });

      $('.js-set-state').on('click', function () {
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

    // setup listeners, check for current state in address bar
    function begin(initialState) {
      var s;

      !listenersAttached && attachListeners();

      s = parseSearch('state') || initialState;
      updateState(s);
    }

    return {
      states: states,
      getState: function () {
        return pageState;
      },
      setState: function (newState) {
        updateState(newState);
      },
      next: function () {
        traverse('next');
      },
      previous: function () {
        traverse('previous');
      },
      traverse: traverse,
      add: function (name, newState, previous, next) {
        next && (newState.next = next);
        previous && (newState.previous = previous);
        states[name] = newState;
        return this;
      },
      begin: begin,
      fn: {}
    };
  };

  window.flocus = stateManager();
}(this, this.document, this.jQuery || this.Zepto || this.ender));
