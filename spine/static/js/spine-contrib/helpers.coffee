
$.query = (query_data) ->
    data: JSON.stringify(query_data or {})
    contentType: 'application/json'


$.fn.htmlTemplate = ->
    @html().trim()

#
# Cookies
#

$.getCookies = () ->
    cookies = {}
    for cookie in document.cookie.split('; ')
        [attr_name, value] = cookie.split('=')
        cookies[attr_name] = value
    cookies

$.setCookie = (name, value) ->
    document.cookie = "#{name}=#{value}"

$.getCookie = (name) ->
    $.getCookies()[name]

$.fn.setChecked = (value) ->
    if value
        @attr 'checked', 'checked'
    else
        @removeAttr 'checked'

# Spine

csrfToken = $.getCookie 'csrftoken'
$(document).ajaxSend (e, xhr, settings) ->
    xhr.setRequestHeader 'X-CSRFToken', csrfToken


class Spine?.FormController extends Spine.Controller
    elements:
        '[name]': 'fields'
        '.control-group': 'control_groups'

    get_field: (name) -> @fields.filter("[name=#{name}]")

    constructor: ->
        super
        @el.submit @submit
        @init_instance()

    init_instance: (options) ->
        @instance = options.instance if options?.instance?
        if options?.force
            @instance = new @Model
        else
            @instance ?= new @Model
        @populate_fields()
        @bind_instance()

    bind_instance: ->
        @instance.bind 'ajaxError', @show_errors
        @instance.bind 'ajaxSuccess', @on_saved

    unbind_instance: ->
        @instance.unbind 'ajaxError', @show_errors
        @instance.unbind 'ajaxSuccess', @on_saved

    show_errors: (_instance, xhr) =>
        parse_error_response = (xhr) ->
            # reads the error message
            try
                error_data = JSON.parse xhr.responseText
                if (not 'errors' of error_data or
                    not 'instance' of error_data)
                        throw SyntaxError
            catch SyntaxError
                alert 'Error: there is a communication error!'
                throw SyntaxError
            return [error_data.instance, error_data.errors]

        [instance, errors] = parse_error_response xhr

        do restore_instance_state = =>
            if @instance.cid is @instance.id
                @instance.id = null
            @instance = _.extend(@instance, instance)

        do show_errors = =>
            if errors.__all__?
                @el.prepend """
                    <div class="alert hide alert-error text-center">
                        #{errors.__all__}
                    </div>
                """
                @$('.alert').slideDown()

            for attr, msg of errors
                field = @get_field attr
                (field.parents '.control-group')
                    .addClass('error')
                    .tooltip title: msg

    hide_errors: =>
        (@control_groups.removeClass 'error').tooltip 'destroy'
        @$('.alert').slideUp 'fast', -> @remove()

    reset_form: =>
        @fields.val ''
        @hide_errors()

    populate_fields: =>
        @reset_form()
        for attr in @instance.attributes()
            (@get_field attr).val @instance[attr]

    populate_instance: =>
        modified = false
        for field in @fields
            $field = $ field
            name = $field.attr 'name'
            if field.contentEditable is 'true'
                value = $field.html().trim()
            else
                value = $field.val()

            if @instance[name] isnt value
                @instance[name] = value
                modified = true
        modified

    submit: (e) =>
        e?.preventDefault?()
        @save()

    save: =>
        if @populate_instance()
            @hide_errors()
            @instance.save()

    on_saved: (_instance, server_data) =>
        @reset_form()
        @instance = _.extend(@instance, server_data)
        @unbind_instance()
        @parent?.hide?()

ENTER = 13

class Spine?.ItemController extends Spine.FormController

    events:
        'keydown [contenteditable][name]': 'trigger_field_change'
        'blur [contenteditable][name]': 'trigger_field_change'
        'change [name]': 'save'

    constructor: ->
        super

    bind_instance: =>
        super
        @instance.bind 'update', @render
        @instance.bind 'destroy', @destroy

    trigger_field_change: (e) =>
        if e.keyCode is ENTER
            e.preventDefault()

        if e.type is 'focusout' or e.keyCode is ENTER
            $(e.target).trigger 'change'

    destroy: =>
        @el.fadeOut 'fast', @release

    render: =>
        @replace @template @instance

    populate_fields: =>
    reset_form: =>
    unbind_instance: =>


class Spine?.ModalController extends Spine.Controller
    elements:
        '.title': 'title'
        '.modal-body': 'body'
        '[name]:visible': 'first_visible_field'

    events:
        'click .cancel': 'hide'
        'click .save': 'save'

     constructor: ->
        super
        @el.on 'hidden', @hidden
        @el.on 'shown', @shown
        @body_controller = new @BodyController
            parent: @
            el: @body

    show: (title, options)=>
        @title.html title if title?
        @body_controller.init_instance options
        @el.modal 'show'

    hide: =>
        @el.modal 'hide'

    hidden: =>
        @body_controller.init_instance force: true

    shown: =>
        @$('[name]:visible').focus()

    save: =>
        @body_controller?.save?()
