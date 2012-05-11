
// dependency checks
if (typeof Form === 'undefined') {
    throw new Error('Form class required.');
}

/**
 * SmartForm
 * 
 * Adds additional form functionality including:
 * 
 * - <Ghost> placeholders
 * - Ajax submission
 * - Input value retrieval (used in ajax submission)
 * 
 * @see     https://github.com/onassar/JS-Ghost
 * @see     https://github.com/onassar/JS-Ajax
 * @author  Oliver Nassar <onassar@gmail.com>
 * @extends Form
 */
var SmartForm = new Class({

    /**
     * Extension
     * 
     */
    Extends: Form,

    /**
     * options
     * 
     * @public
     * @var    Object
     */
    options: {
        ajax: false,
        callback: function(response) {
            console && console.log(response);
        },
        ghosts: false
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

        // process constructor
        this.parent(form, options);
    },

    /**
     * check
     * 
     * @public
     * @return void
     * @note   logic to check against GET ajax requests here, as it was too much
     *         work to support them (by appending data to uri)
     */
    check: function() {

        // if Ghosts ought to be created
        if (this.options.ghosts) {

            // depdency check
            if (typeof Ghost === 'undefined') {
                throw new Error('Ghost class required.');
            }
        }

        // if the form ought to be submitted through ajax
        if (this.options.ajax) {

            // depdency check
            if (typeof Ajax === 'undefined') {
                throw new Error('Ajax class required.');
            }

            // if it's a GET, goodbye
            if (this.form.get('method') === 'get') {

                // peace
                throw new Error('Only POST form methods for ajax submissions.');
            }
        }
    },

    /**
     * getInputs
     * 
     * @notes  doesn't support select node's which allow multiple selections
     * @public
     * @param  boolean format
     * @return [HTMLElement]
     */
    getInputs: function() {
        var inputs = this.form.getElements('input,textarea,select'),
            type,
            response = {};
        inputs.each(function(input) {
            type = input.type;

            // if the input doesn't have a name
            if (!input.name) {
                return;
            }
            // if the input is disabled
            else if (input.disabled) {
                return;
            }
            // submit/reset/image button
            else if(['submit', 'reset', 'image'].contains(type)) {
                return;
            }
            // checkbox/radio that's not selected
            else if (
                (type === 'checkbox' || type === 'radio')
                && !input.checked
            ) {
                return;
            }

            // add to hash
            response[input.get('name')] = input.get('value');
        });
        return response;
    },

    /**
     * setup
     * 
     * @public
     * @return void
     */
    setup: function() {

        // dependency checks
        this.check();

        // Ghosts
        if (this.options.ghosts) {

            // grab all Ghostable elements
            var inputs = this.form.getElements(
                'input[type=text], input[type=password], textarea'
            );
            inputs.each(function(input) {
                (new Ghost(input));
            });
        }

        // parent
        this.parent();
    },

    /**
     * setup
     * 
     * @public
     * @return void
     */
    submit: function() {

        // ajax submission
        if (this.options.ajax) {

            // ajax call prep
            var action = this.form.get('action'),
                method = this.form.get('method'),
                inputs = this.getInputs(),
                ajax = (new Ajax(action));

            // call stack
            ajax[method](this.options.callback, inputs);
        }
        // standard submission
        else {
            this.parent()
        }
    }
});
