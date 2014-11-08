
$.query = (query_data) ->
    data: JSON.stringify(query_data or {})
    contentType: 'application/json'


$.fn.htmlTemplate = (args...) ->
    @html()?.trim()?.template args...

$.getSelectedElements = (selector) ->
    selection = window.getSelection()
    range = []
    if selection.rangeCount
        range = selection
            .getRangeAt(0)
            .cloneContents()
            .childNodes
    if selector?
        jQuery selector, range
    else
        jQuery range

$.getQueryStringArgs = (query=document.location.search) ->
    qs = if query.length then query.substring 1 else ''
    args = {}
    items = qs.split '&'
    for item in items
        [name, value] = _.map item.split('='), decodeURIComponent
        if name in _.keys args
            if not _.isArray args[name]
                args[name] = [args[name]]
            args[name].push value
        else
            args[name] = value
    args

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

#
# Inputs
#

$.fn.setChecked = (value) ->
    if value
        @attr 'checked', 'checked'
    else
        @removeAttr 'checked'

$.fn.isInput = ->
    _.all(element.tagName in ['SELECT', 'INPUT'] for element in this)


# Underscore
String::template ?= (args...) -> _.template this, args...
String::escape ?= -> _.escape this
String::unescape ?= -> _.unescape this


# Spine

csrf_token = $.getCookie 'csrftoken'
$(document).ajaxSend (e, xhr, settings) ->
    xhr.setRequestHeader 'X-CSRFToken', csrf_token

(->
    # A simple way to stop users from killing pending ajax calls.
    pending = 0
    msg = gettext("Don't leave yet! I'm still working")  # TODO: i18n!!!
    @addEventListener "beforeunload", (e)->
        if pending > 0
            (e or @.event).returnValue = msg
            msg.preventDefault()
            msg
    $el = $()
    $ ->
       $el = $ '#loading-img'

    $(document).ajaxSend (e, xhr, settings) ->
        if pending is 0 and $el.length
            $el.fadeIn()
        if settings.type isnt 'GET'
            pending++

    $(document).ajaxComplete (e, xhr, settings)->
        if settings.type isnt 'GET'
            pending--
        if pending is 0 and $el.length
            $el.fadeOut 'fast'
)(window)



class Spine.Model extends Spine.Model
    constructor: ->
        super
        @bind 'ajaxError', @processAjaxError

    updateFrom: (instance) ->
        attributes = instance.attributes?() or instance
        for attr, value of attributes
            @[attr] = value
        @trigger 'update'

    processAjaxError: (instance, xhr) =>
        try
            error_data = JSON.parse xhr.responseText
            if (not 'errors' of error_data or
                  not 'instance' of error_data)
                console.error 'Syntax error: ', xhr.responseText
                return
        catch error
            console.error 'ERROR: there is a communication error'
            return

        @id = null if @cid is @id
        @updateFrom error_data.instance
        @trigger 'error', error_data.errors


class Spine.FormController extends Spine.Controller
    Model: null
    read_only: []

    elements:
        '[name]': 'fields'
        '.control-group': 'control_groups'

    events:
        'submit': 'submit'
        'submit form': 'submit'
        'keypress input': 'submit_on_enter'

    get_field: (name) ->
        @fields.filter "[name=#{name}]"

    field_value: (name, value) ->
        field = @get_field name
        if value?
            field.val value
            field.filter('[type=checkbox]').setChecked value
            field.filter('img').attr 'src', value
            field.filter('span').text String value
            field.trigger 'change'
        else
            if field.attr('type') is 'checkbox'
                field.is ':checked'
            else
                field.val()

    constructor: ->
        super
        @init_instance()
        @unbind()

    init_instance: (options) =>
        @instance = options.instance if options?.instance?
        if options?.force
            @instance = new @Model
        else
            @instance ?= new @Model
        @populate_fields()
        @bind_instance()

    bind_instance: ->
        @instance.bind 'error', @show_errors

    unbind_instance: ->
        @instance.unbind 'error', @show_errors

    show_errors: (instance, errors) =>
        if errors.__all__?
            @el.prepend """
                <div class="alert hide alert-error text-center">
                    #{errors.__all__}
                </div>
            """
            @$('.alert').slideDown()

        for attr, msg of errors
            field = @get_field attr
            field
                .attr 'data-title', field.attr 'title'
                .removeAttr 'title'
                .tooltip title: msg
                .tooltip 'show'
                .parents '.control-group'
                .addClass 'error'

    hide_errors: =>
        @el.removeClass 'error'
        @control_groups.removeClass 'error'
        @fields.tooltip 'destroy'
        for field in @fields
            field.title = field.getAttribute 'data-title'
        @$('.alert').slideUp 'fast', -> @remove()

    reset_form: =>
        @fields
            .val ''
            .text ''
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
            if name not in @read_only
                value = @field_value name
                if @instance[name] isnt value
                    @instance[name] = value
                    modified = true
        modified

    submit_on_enter: (e) =>
        @submit() if e.keyCode is ENTER

    submit: (e) =>
        e?.preventDefault?()
        @save()

    save: =>
        if @populate_instance()
            @hide_errors()
            @instance.save done: @on_saved

    on_saved: =>
        @reset_form()
        @unbind_instance()
        @init_instance force: true
        @parent?.hide?()

ENTER = 13

class Spine.ItemController extends Spine.FormController

    elements:
        '[name]': 'fields'
        '[contenteditable], [name]': 'control_groups'

    events:
        'keydown [contenteditable][name]': 'trigger_field_change'
        'blur [contenteditable][name]': 'trigger_field_change'
        'change [name]': 'save'

    field_value: (name, value) ->
        field = @get_field name
        if value?
            if field.attr('type') is 'checkbox'
                field.setChecked value
            else if field.isInput()
                field.val value
            else
                field.text value
        else
            if field.attr('type') is 'checkbox'
                field.is ':checked'
            else if field.isInput()
                field.val()
            else
                field.text().trim()

    bind_instance: =>
        super
        @instance.bind 'update ajaxSuccess', @render_on_update
        @instance.bind 'destroy', @destroy

    trigger_field_change: (e) =>
        if e.keyCode is ENTER
            e.preventDefault()

        if e.type is 'focusout' or e.keyCode is ENTER
            $(e.target).trigger 'change'

    destroy_instance: =>
        @instance.destroy() if confirm gettext 'Are you sure?'

    destroy: =>
        @el.fadeOut 'fast', @release

    render_on_update: =>
        @render()
        @post_render?()

    render: =>
        selected = @el.hasClass 'ui-selected'
        @replace @template @instance
        @el.addClass 'ui-selected' if selected
        @el

    reset_form: =>
        @hide_errors()

    unbind_instance: =>
    on_saved: =>


class Spine.ModalController extends Spine.Controller
    BodyController: null

    elements:
        '.title': 'title'
        '.modal-body': 'body'
        '[type][name]:visible:first': 'first_visible_field'

    events:
        'click .cancel': 'hide'
        'click .save': 'save'

    constructor: ->
        super
        @el.on 'shown', @shown
        @body_controller = new @BodyController
            parent: @
            el: @body
            options: @body_init

    show: (options)=>
        @title.html title if options?.title?
        @body_controller?.init_instance? options
        @el.modal 'show'

    hide: =>
        @el.modal 'hide'

    shown: =>
        @first_visible_field.focus()

    save: =>
        @body_controller?.save?()


RIGHT_MOUSE_BUTTON = 3

class Spine.DropdownController extends Spine.Controller
    @open: null
    selected_items_selector: '.ui-selected'

    @set_open: (menu) ->
        menu.el.slideDown 'fast'
        if Spine.DropdownController.open isnt menu
            Spine.DropdownController.hide_open()
            Spine.DropdownController.open = menu

    @hide_open: (e) ->
        Spine.DropdownController.open?.hide() if not e? or
            e?.which isnt RIGHT_MOUSE_BUTTON

    are_multiple_items_selected: ->
        return $(@selected_items_selector).length > 1

    show: (e) =>
        not_common_items = @$('li').not('.common')
        if @are_multiple_items_selected()
            not_common_items.hide()
        else
            not_common_items.show()

        if e?.pageX? and e?.pageY?
            do positionate_under_the_mouse = =>
                @el.css
                    position: 'fixed'
                    left: e.clientX
                    top: e.clientY
        Spine.DropdownController.set_open this

    hide: =>
        @el.slideUp 'fast'
        if Spine.DropdownController.open is this
            Spine.DropdownController.open = null

if Spine.DropdownController?
    $(window).bind 'click', Spine.DropdownController.hide_open


class Spine.EditionDropdown extends Spine.DropdownController
    events:
        'click .remove-action': 'remove_instances'

    selected_items_selector: '.ui-selected[data-model][data-id]'

    selected_references: (model) =>
        selector = @selected_items_selector
        selector += "[data-model='#{model}']" if model
        for selected in $ selector
            model: selected.getAttribute 'data-model'
            id: +selected.getAttribute 'data-id'

    remove_instances: (e) =>
        e?.preventDefault()
        references = @selected_references()
        for reference in references
            eval(reference.model).find(reference.id).trigger 'destroy'

class Spine.ItemWithContextualMenu extends Spine.ItemController
    DropdownController: Spine.DropdownController

    events: _.extend(
        _.clone Spine.ItemController::events
        'contextmenu .contextual-dropdown': 'show_dropdown'
    )

    elements: _.extend(
        _.clone Spine.ItemController::elements
        'ul.dropdown-menu:first': 'menu'
    )

    refreshElements: ->
        super
        if @el.hasClass 'contextual-dropdown'
            @el.on 'contextmenu', @show_dropdown
        @menu_controller?.release()
        @menu_controller = new @DropdownController el: @menu, item: this

    show_dropdown: (e) =>
        e.preventDefault()
        unless @el.hasClass 'ui-selected'
            $('.ui-selected').removeClass 'ui-selected'
            @el.addClass 'ui-selected'
        @menu_controller.show e


_.insertAt = (collection, item, index) ->
    before = if index > 0 then collection[..index - 1] else []
    after = collection[index..]
    before.push item
    before.concat after...

_.removeAt = (collection, index) ->
    before = if index > 0 then collection[..index-1] else []
    after = collection[index+1..]
    before.concat after...

    destroy: =>
        Phototagging.UndoController.destroy_items [this]


class Spine.ListController extends Spine.Controller
    item_controllers: {}
    default_query: -> {}
    container: -> @el
    ordering_key: (instance) -> 0

    constructor: ->
        super
        @items_keys = []
        @items = []
        for Model in (eval name for name of @item_controllers)
            Model.bind 'refresh', @add
            Model.fetch $.query @default_query Model

    insert: (instance, item) ->
        instance_key = @ordering_key instance
        index = _.sortedIndex(@items_keys, instance_key)
        @items_keys = _.insertAt @items_keys, instance_key, index
        @items = _.insertAt @items, item, index
        rendered_item = item.render()
        if index > 0
            $(rendered_item).insertAfter @container().children()[index - 1]
        else
            @container().prepend rendered_item
        index

    add: (instances) =>
        added_items = []
        for instance in instances
            item = @get_item instance
            if item and item not in @items
                @insert instance, item
                item.post_render?()
                added_items.push item
        added_items

    release_item: (item) =>
        index = _.indexOf @items, item
        @items_keys = _.removeAt @items_keys, index
        @items = _.removeAt @items, index

    get_item: (instance) ->
        item = _.find @items, (item) ->
            instance.constructor is item.instance.constructor and (
                (instance.cid is item.instance.cid) or
                (instance.id and instance.id is item.instance.id)
            )
        if item?
            item.instance.updateFrom instance
        else
            ItemController = _.find @item_controllers, (controller, name) ->
                 instance.constructor.className is name
            item = new ItemController instance: instance
            item.bind 'release', @release_item
        item


class Spine.InfiniteListController extends Spine.ListController
    ScrollingModel: null

    constructor: ->
        super
        @last_amount = 0
        @infinite_load = false
        @load_until_id = parseInt window.location.hash[1..]
        @load_until_id = false if isNaN @load_until_id
        @bottom_element = if (found = $('.load-more')).length
            found
        else
            found = $('<div class="load-more"></div>')
            found.insertAfter @el
            found

    add: =>
        items_added = super
        @bottom_element.removeClass 'spining'
        if items_added.length
            @update_waypoint()
        last_item = _.last items_added
        if last_item?.instance.constructor is @ScrollingModel
            if @load_until_id
                for item in items_added
                    if item.instance.id is @load_until_id
                        $.scrollTo? "[data-id=#{item.instance.id}]", 300
                        item.el.addClass 'ui-selected'
                        @load_until_id = false
                        break
            if (@infinite_load or
                @load_until_id or
                @view_port_smaller_than_window())
                    @load_more()
        items_added

    update_waypoint: (offset='bottom-in-view') =>
        @bottom_element.waypoint @load_more,
            continuous: false
            triggerOnce: true
            offset: offset

    view_port_smaller_than_window: ->
         @el.height() <= $(window).height()

    load_more: (direction='down') =>
        if direction is 'down' and @ScrollingModel.count() isnt @last_amount
            @bottom_element
                .waypoint 'destroy'
                .addClass 'spining'
            @load_query()

    load_query: (last_amount=null) ->
        query = @default_query @ScrollingModel
        @last_amount = query.__amount_loaded__ = last_amount or @items.length
        @ScrollingModel.fetch $.query query

    activate_infinite_loading: =>
        @infinite_load = true
        @load_more()
