
$.query = (query_data) ->
    data: JSON.stringify(query_data or {})
    contentType: 'application/json'


$.fn.htmlTemplate = (args...) ->
    @html().trim().template args...

$.getSelectedElements = (selector) ->
    selection = window.getSelection()
    range = []
    if selection.rangeCount
        range = selection.getRangeAt(0).cloneContents().childNodes
    if selector?
        jQuery selector, range
    else
        jQuery range

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

# Underscore

Array::each ?= (args...) -> _.each this, args...
Array::map ?= (args...) -> _.map this, args...
Array::reduce ?= (args...) -> _.reduce this, args...
Array::find ?= (args...) -> _.find this, args...
Array::filter ?= (args...) -> _.filter this, args...
Array::extend ?= (args...) -> _.extend this, args...
Array::reject ?= (args...) -> _.reject this, args...
Array::every ?= (args...) -> _.every this, args...
Array::all ?= (args...) -> _.all this, args...
Array::some ?= (args...) -> _.some this, args...
Array::any ?= (args...) -> _.any this, args...
Array::max ?= (args...) -> _.max this, args...
Array::min ?= (args...) -> _.min this, args...
Array::sortBy ?= (args...) -> _.sortBy this, args...
Array::groupBy ?= (args...) -> _.groupBy this, args...
Array::countBy ?= (args...) -> _.countBy this, args...
Array::first ?= (args...) -> _.first this, args...
Array::initial ?= (args...) -> _.initial this, args...
Array::last ?= (args...) -> _.last this, args...
Array::rest ?= (args...) -> _.rest this, args...
Array::tail ?= (args...) -> _.tail this, args...
Array::flatten ?= (args...) -> _.flatten this, args...
Array::without ?= (args...) -> _.without this, args...
Array::union ?= (args...) -> _.union this, args...
Array::intersection ?= (args...) -> _.intersection this, args...
Array::difference ?= (args...) -> _.difference this, args...
Array::uniq ?= (args...) -> _.uniq this, args...
Array::zip ?= (args...) -> _.zip this, args...
Array::object ?= (args...) -> _.object this, args...
Array::indexOf ?= (args...) -> _.indexOf this, args...
Array::lastIndexOf ?= (args...) -> _.lastIndexOf this, args...
Array::sortedIndex ?= (args...) -> _.sortedIndex this, args...
Array::compact ?= -> _.compact this
Array::shuffle ?= -> _.shuffle this

String::template ?= (args...) -> _.template this, args...
String::escape ?= -> _.escape this
String::unescape ?= -> _.unescape this


# Spine

csrf_token = $.getCookie 'csrftoken'
$(document).ajaxSend (e, xhr, settings) ->
    xhr.setRequestHeader 'X-CSRFToken', csrf_token

$ ->
    $loading = $ '#loading-img'
    if $loading.length
        $(document).ajaxStart -> $loading.fadeIn()
        $(document).ajaxStop -> $loading.fadeOut 'fast'

update = (old_instance, instance) ->
    instance = _.extend old_instance, instance
    instance.trigger 'update'
    instance


class Spine?.FormController extends Spine.Controller
    Model: null

    elements:
        '[name]': 'fields'
        '.control-group': 'control_groups'

    get_field: (name) ->
        @fields.filter "[name=#{name}]"

    field_value: (name, value) ->
        field = @get_field name
        if value?
            field.val value
            field.filter('img').attr 'src', value
        else
            field.val()

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
            catch error
                if xhr.status isnt 200
                    alert 'Error: there is a communication error!'
                throw error
            return [error_data.instance, error_data.errors]

        [instance, errors] = parse_error_response xhr

        do restore_instance_state = =>
            if @instance.cid is @instance.id
                @instance.id = null
            @instance = update @instance, instance

        do show_errors = =>
            if errors.__all__?
                @el.prepend """
                    <div class="alert hide alert-error text-center">
                        #{errors.__all__}
                    </div>
                """
                @$('.alert').slideDown()

            for attr, msg of errors
                (@get_field attr)
                    .parents('.control-group')
                    .addClass('error')
                    .tooltip(title: msg)
                    .tooltip('show')

    hide_errors: =>
        (@control_groups.removeClass 'error').tooltip 'destroy'
        @$('.alert').slideUp 'fast', -> @remove()

    reset_form: =>
        @fields.val ''
        @hide_errors()

    populate_fields: =>
        @reset_form()
        for attr, value of @instance.attributes()
            @field_value attr, value

    populate_instance: =>
        modified = false
        for field in @fields
            $field = $ field
            name = $field.attr 'name'
            value = @field_value name
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

    on_saved: (old_instance, new_instance) =>
        @reset_form()
        @instance= update @instance, new_instance
        @unbind_instance()
        @parent?.hide?()

ENTER = 13

class Spine?.ItemController extends Spine.FormController

    elements:
        '[contenteditable]': 'fields'
        '[contenteditable]': 'control_groups'

    events:
        'keydown [contenteditable][name]': 'trigger_field_change'
        'blur [contenteditable][name]': 'trigger_field_change'
        'change [name]': 'save'

    constructor: ->
        super

    field_value: (name, value) ->
        field = @get_field name
        if value?
            field.text String(value).escape()
        else
            (field.text() or '').trim().unescape()

    bind_instance: =>
        super
        @instance.bind 'update', @populate_fields
        @instance.bind 'destroy', @destroy

    trigger_field_change: (e) =>
        if e.keyCode is ENTER
            e.preventDefault()

        if e.type is 'focusout' or e.keyCode is ENTER
            $(e.target).trigger 'change'

    destroy_instance: =>
        @instance.destroy() if confirm 'Sure?'

    destroy: =>
        @el.fadeOut 'fast', @release

    render: =>
        @replace @template @instance

    reset_form: =>
        @fields.text('')
        @hide_errors()

    unbind_instance: =>


class Spine?.ModalController extends Spine.Controller
    BodyController: null

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

    show: (options)=>
        @title.html title if options?.title?
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


class Spine?.DropdownController extends Spine.Controller
    events:
        'click li': 'hide'

    elements:
        '*': 'children'

    constructor: ->
        super
        @el.bind 'mouseout', @mouseout

    show: (e) =>
        if e?.pageX? and e.pageY
            do positionate_under_the_mouse = =>
                @el.css
                    left: e.pageX - 10
                    top: e.pageY - 17
        @el.slideDown 'fast'

    mouseout: (e) =>
        to_element = e?.toElement
        @hide() if to_element not in @all_elements()

    hide: =>
        @el.slideUp 'fast'

    all_elements: ->
        children = @children.toArray()
        children.push @el[0]
        children


class Spine.EditionDropdown extends Spine.DropdownController
    events: _.extend(
        _.clone Spine.DropdownController::events
        'click .rename-action': 'focus_name'
        'click .remove-action': 'remove_instances'
    )
    name_attr: 'name'

    focus_name: =>
        (@item.get_field @name_attr).focus()

    remove_instances: =>
        all_selected = $.getSelectedElements '[data-model][data-id]'
        if all_selected.length and confirm 'Sure?'
            references = []
            for selected in all_selected
                references.push(
                    [
                        eval(selected.getAttribute 'data-model'),
                        +selected.getAttribute 'data-id'
                    ]
                )
            Model.destroy id for [Model, id] in references
        else
            @item.destroy_instance()


class Spine.ItemWithContextualMenu extends Spine.ItemController
    DropdownController: Spine.DropdownController

    events: _.extend(
        _.clone Spine.ItemController::events
        'contextmenu .contextual-dropdown': 'show_dropdown'
    )

    elements: _.extend(
        _.clone Spine.ItemController::elements
        'ul.dropdown-menu': 'menu'
    )

    refreshElements: =>
        super
        @menu_controller?.release()
        @menu_controller = new @DropdownController el: @menu, item: this

    show_dropdown: (e) =>
        e.preventDefault()
        @menu_controller.show e


class Spine?.ListController extends Spine.Controller
    item_controllers: {}
    default_query: -> {}
    container: -> @el

    constructor: ->
        super
        @items = []
        for Model in (eval name for name of @item_controllers)
            query = @default_query Model
            if query?
                Model.bind 'refresh', @add_all
                Model.fetch $.query query

    add_all: (instances) =>
        instances.each @add

    add: (instance) =>
        item = @get_item instance
        if item not in @items
            @container().append item.render()
            @items.push item

    release_item: (item) =>
        @items = @items.without item

    get_item: (instance) ->
        item = @items.find (item) -> item.instance.eql instance
        if item?
            _.extend item.instance, instance
            item.instance.trigger 'update'
        else
            ItemController = _.find @item_controllers, (controller, name) ->
                 instance.constructor.className is _.last name.split '.'
            item = new ItemController instance: instance
            item.bind 'release', @release_item
        item
