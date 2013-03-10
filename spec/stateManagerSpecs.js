/*global module test ok */

(function (global, states, q) {
  "use strict";

  module('stateManagerSpecs');

  test('it exists', function () {
    ok(typeof states === 'function');
  });

  var newStates;

  module('dsl');
  q.testStart(function () {
    newStates = states(function () {
      this.state('young', { initial: true });
      this.state('old');
      this.state('bliss');

      this.event('age', 'young', 'old');
      this.event('surgery', 'old', 'young');
      this.event('cake', ['young', 'old'], 'bliss');
    });
  });

  test('builds states and attaches to state property', function () {
    q.deepEqual(newStates.states.young,
                { events: { age: 'old', cake: 'bliss' }
                , name: 'young'
                , initial: true });

    q.deepEqual(newStates.states.old,
               { events: { surgery: 'young', cake: 'bliss' }
               , name: 'old' });
  });

  test('currentState defaults to initial', function () {
    q.equal(newStates.currentState(), 'young');
  });

  test('can directly change state', function () {
    newStates.setState('old');
    q.equal(newStates.currentState(), 'old');
  });

  test('can trigger events for current state', function () {
    newStates.trigger('age');
    q.equal(newStates.currentState(), 'old');
    newStates.trigger('surgery');
    q.equal(newStates.currentState(), 'young');
    newStates.trigger('cake');
    q.equal(newStates.currentState(), 'bliss');
  });

  test('cannot trigger events for other states', function () {
    newStates.surgery();
    q.equal(newStates.currentState(), 'young');
  });

  test('has methods for each event', function () {
    newStates.age();
    q.equal(newStates.currentState(), 'old');
    newStates.cake();
    q.equal(newStates.currentState(), 'bliss');
  });

  test('does not overwrite existing properties', function () {
    var st = states(function () {
      this.state('simple');

      this.event('states', 'simple', 'complicated');
    });

    q.equal(typeof st.states, 'object');
  });
}(this, this.stateManager, this.QUnit));
