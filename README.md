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
