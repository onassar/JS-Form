
// dependency checks
if (typeof MooTools === 'undefined') {
    throw new Error('MooTools required.');
}

/**
 * Form
 * 
 * Provides general Form functionality, including:
 * 
 * - enter key submission (<input> and <select> nodes)  
 * - multiple submission prevention
 * - ordered input tabbing
 * - pre/post submit callbacks
 * 
 * The following can be customized:
 * 
 * - Pre/post submit callbacks
 * - Whether the enter key should spark a submission
 * - Whether ordered input tabbing should be automated
 * 
 * Has MooTools as a dependency.
 * 
 * @author     Oliver Nassar <onassar@gmail.com>
 * @implements Options
 */
var Form = new Class({

    /**
     * Interfaces to implement (aka extend).
     * 
     * Currently only requires the support of the Options class.
     */
    Implements: Options,

    /**
     * enabled
     * 
     * @public
     * @var    Boolean (default: true)
     */
    enabled: true,

    /**
     * form
     * 
     * @public
     * @var    HTMLElement (default: null)
     */
    form: null,

    /**
     * options
     * 
     * @public
     * @var    Object
     */
    options: {
        postsubmit: function() {},
        presubmit: function(callback) {
            callback();
        },
        submit: true,
        tabbing: true
    },

    /**
     * initialize
     * 
     * @public
     * @param  HTMLElement form
     * @param  Object options
     * @return void
     */
    initialize: function(form, options) {

        // data validation
        if (typeOf(form) === 'null') {
            throw new Error('Form node must be provided.');
        }

        // process constructor
        this.form = form;
        this.setOptions(options);
        this.setup();
    },

    /**
     * disable
     * 
     * @public
     * @return void
     */
    disable: function() {
        this.enabled = false;
    },

    /**
     * enable
     * 
     * @public
     * @return void
     */
    enable: function() {
        this.enabled = true;
    },

    /**
     * setup
     * 
     * @public
     * @return void
     */
    setup: function() {

        // form natural submission
        var self = this;
        this.form.addEvent('submit', function(event) {
            event && event.stop();

            /**
             * If the form is submittabled (hasn't already been submitted, or
             * isn't in the process of being submitted)
             */
            if (self.enabled) {
                self.disable();
                self.options.presubmit.bind(self)(function() {
                    self.submit();
                    self.options.postsubmit();
                });
            }
        });

        // if the enter key submit event ought to happen
        if (this.options.submit) {

            // input enter key (including select)
            this.form.getElements('input,select').addEvent(
                'keydown',
                function(event) {
                    if (event && event.key === 'enter') {
                        self.form.fireEvent('submit', event);
                    }
                }
            );
        }

        // if tab indexing ought to occur
        if (this.options.tabbing) {

            // find beginning tabIndex
            var tabindex = $$('*').indexOf(this.form) + 1;

            // bind attribute
            this.form.getElements('input[type!=hidden],textarea,select,button').each(
                function(field) {
                    field.setProperty('tabindex', tabindex);
                    ++tabindex;
                }
            );
        }
    },

    /**
     * submit
     * 
     * @public
     * @return void
     */
    submit: function() {
        this.form.submit();
    }
});
