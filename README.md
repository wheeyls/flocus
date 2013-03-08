Flocus
------
Flocus is a simple state-management plugin for a web page.

The chainable API allows you to describe a number of different states that the page will transition between.

Simply give each state a name and describe their setup and teardown behavior, and then you can get started. The steps can be linked to eachother through their "next" and "previous" properties.

Example
-------
    flocus
    .add('firstState', {
      next: 'secondState'
    , addClasses: [['.selector', 'classes-to-add when-entering']]
    , removeClasses: [['.selector', 'classes-to-remove when-entering']]
    })
    .add('secondState', {
      previous: 'firstState'
    , addClasses: [['.selector', 'classes-to-add when-entering']]
    , removeClasses: [['.selector', 'classes-to-remove when-entering']]
    })
    .begin('firstState');

You can also see a working demo at https://rawgithub.com/wheeyls/flocus/master/index.html

Next & Previous
---------------
Flocus looks for the classes .js-next-state and .js-previous-state on begin, and will bind the next and previous commands to the click on these elements. This allows an easy way to move through the different states.

Begin
-----
Calling ```flocus.begin('stateName')``` will kick everything into motion, entering the given state, and activate all listeners.

The value passed into begin will be overridden by the query string, if there are any parameters in the form of:

    ?state=stateName

Bookmarklet
-----------
Flocus comes with a bookmarklet that creates an overlay to help to visualize and navigate through the different states on the page.
