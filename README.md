Flocus
------
Flocus is a simple state-management plugin for a web page.

It was originally designed to build a step-by-step wizard. It is also pretty good at rapidly mocking up interfaces.

The chainable API allows you to describe a number of different states that the page will transition between.

Give each state a name and describe their setup and teardown behavior. The steps can be linked to eachother through their "next" and "previous" properties.

Example
-------
    flocus
    .add('loggedOut', {
      next: 'loggedIn'
    , addClasses: [['.selector', 'classes-to-add when-entering']]
    , removeClasses: [['.selector', 'classes-to-remove when-entering']]
    })
    .add('loggedIn', {
      previous: 'loggedOut'
    , addClasses: [['.selector', 'classes-to-add when-entering']]
    , removeClasses: [['.selector', 'classes-to-remove when-entering']]
    })
    .begin('loggedOut');

You can also see a working demo at https://rawgithub.com/wheeyls/flocus/master/index.html

Changing State
--------------
Calling ```flocus.next()``` and ```flocus.previous()``` will crawl through the states in order.

Calling ```flocus.setState('stateName')``` sets the state directly.

Flocus looks for the classes .js-next-state and .js-previous-state on begin, and will bind the next and previous commands to the click on these elements. This allows an easy way to move through the different states.

Changing the state will trigger the custom event ```'flocus:state-change'```.

Begin
-----
Calling ```flocus.begin('stateName')``` will kick everything into motion, entering the given state, and activating all listeners.

Bookmarklet
-----------
Flocus comes with a bookmarklet that creates an overlay to help to visualize and navigate through the different states on the page.

jQuery/Zepto/ender?
-------------------
Yep.
