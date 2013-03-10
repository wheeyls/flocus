(function (global) {
  "use strict";

  function is(obj, name) {
    return Object.prototype.toString.call(obj) === '[object ' + name + ']';
  }

  function extend(base) {
    var children = Array.prototype.slice.call(arguments, 1)
      , i, ii
      , child
      , name
      ;

    for (i = 0, ii = children.length; i < ii; i++) {
      if (!(child = children[i])) { continue; }

      for (name in child) {
        if (!child.hasOwnProperty(name)) { continue; }

        base[name] = child[name];
      }
    }

    return base;
  }

  function state(name, opts) {
    return extend({
      name: name
    , events: {}
    }, opts);
  }

  function stateMachine() {
    var currentState
      , me;

    return me = {
      currentState: function (fullState) {
        var curr = currentState || (function () {
          var i;

          for (i in me.states) {
            if (me.states[i].initial) {
              return me.states[i];
            }
          }
        }());

        if (fullState) {
          return curr;
        }

        return curr && curr.name;
      }

    , setState: function (name) {
        currentState = me.states[name];
      }

    , trigger: function (eventName) {
        var nextState = me.currentState(true).events[eventName];
        nextState && me.setState(nextState);
      }

    , states: {}
    };
  }

  function stateDsl(states) {
    function buildEventShortcut(name) {
      states[name] = states[name] || function () {
        states.trigger(name);
      };
    }

    return {
      state: function (name, opts) {
        states.states[name] = state(name, opts);
      }

    , event: function (name, from, to) {
        var i, ii, fromState
          ;

        !is(from, 'Array') && (from = [from]);
        buildEventShortcut(name);

        for (i = 0, ii = from.length; i < ii; i++) {
          fromState = states.states[from[i]];
          fromState.events[name] = to;
        }
      }
    };
  }

  var sm = function stateManager(callback) {
    var stateList = stateMachine()
      , dsl = stateDsl(stateList)
      ;


    callback.call(dsl);

    return stateList;
  };

  global.stateManager = sm;
}(this));
