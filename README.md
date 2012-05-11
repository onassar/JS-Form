JS-Form
===
JS-Form provides two classes which are meant to help automate some common
niceties with forms. Depending on your usage (`Form` vs `SmartForm`
instantiations), these currently include the following:

### Form Instantiations

- Enter key submission
- Multiple submission prevention
- Input tab ordering
- Pre/post submission callbacks

### SmartForm Instantiations

- [Ghost](https://github.com/onassar/JS-Ghost) input placeholders
- [Ajax](https://github.com/onassar/JS-Ajax) form submission
- Input value retrieval (used at minimum in ajax form submissions)

The reason for separating the functionality to two classes (whereby `SmartForm`
instances inherit from `Form` instances) was to decouple functionality that is
based on other plugins, rather than in browser DOM features (albeit, that
require [MooTools](http://mootools.net/)).

### Examples
For more comprehensive examples of the flow, see the
[examples](https://github.com/onassar/JS-Form/tree/master/examples) directory.
For a quick view, check this out:

``` javascript

(new Form(
    $$('form').shift(),
    {
        postsubmit: function() {
            alert('Form has been submitted.');
        },
        presubmit: function(callback) {
            alert('Form is about to be submitted.');
            callback();
        }
    }
));
````

In this example, a `Form` instance is created which takes the single form on the
page, and adds a `presubmit` and `post submit` callback (with a simple alert).
The `presubmit` callback accepts one callback, which is a default function for
submitting the form.

If you want the flow of the form submission to work as expected (eg. a form gets
submitted), then simply fire the callback inside the `presubmit` callback
itself.

If however you want to do something else (eg. send it to an ajax submission or
logging method), then you do have the flexibility here to do that.


``` javascript

(new SmartForm(
    $$('form').shift(),
    {
        ajax: true,
        callback: function(response) {
            alert('Ajax response ready.');
            log(response);
        },
        ghosts: true,
        postsubmit: function() {
            alert('Form has been submitted.');
        },
        presubmit: function(callback) {
            alert('Form is about to be submitted.');
            callback();
        }
    }
));
```

In this `SmartForm` example, the single form on the page is again that target of
the instantiation. However in addition to the `post submit` and `presubmit`
functions being defined, [Ghost](https://github.com/onassar/JS-Ghost) input
placeholders are set to be created, the form is to be submitted through an
[Ajax](https://github.com/onassar/JS-Ajax) flow, and the `callback` for this
ajax submission is defined.
