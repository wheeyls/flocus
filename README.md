Flocus
------
Flocus is a simple state-machine with hooks for building web interactions.

It was originally designed to build a step-by-step wizard. It is also pretty good at rapidly mocking up interfaces.

The chainable API allows you to describe a number of different states that the page will transition between.

Give each state a name and describe their setup and teardown behavior. Then create events that transition between the diffent states.
There are some built in shortcuts around the "next" and "previous" events.

Example
-------
    flocus
    .add('loggedOut', {
      events: {
        login: 'loggedIn'
      }
    , addClasses: [['.selector', 'classes-to-add when-entering']]
    , removeClasses: [['.selector', 'classes-to-remove when-entering']]
    , enter: function () { /* run when entering this state */ }
    })
    .add('loggedIn', {
      events: {
        logout: 'loggedOut'
      }
    , addClasses: [['.selector', 'classes-to-add when-entering']]
    , removeClasses: [['.selector', 'classes-to-remove when-entering']]
    , leave: function () { /* run when leaving this state */ }
    })
    .begin('loggedOut');

You can also see a working demo at https://rawgithub.com/wheeyls/flocus/master/index.html

Changing State
--------------
Calling ```flocus.next()``` and ```flocus.previous()``` will crawl through the states in order.

Calling ```flocus.perform('eventName')``` will change state based on the named event.

Calling ```flocus.setState('stateName')``` can be used to force the state directly.

Changing the state will trigger the custom event ```'flocus:state-change'```.

Next and Previous
-----------------
Flocus looks for the classes .js-next-state and .js-previous-state on begin, and will bind the next and previous events to the click on these elements. This allows an easy way to move through the different states.

Begin
-----
Calling ```flocus.begin('stateName')``` will kick everything into motion, entering the given state, and activating all listeners.

Bookmarklet
-----------
Flocus comes with a bookmarklet that creates an overlay to help to visualize and navigate through the different states on the page.

jQuery/Zepto/ender?
-------------------
Yep.
