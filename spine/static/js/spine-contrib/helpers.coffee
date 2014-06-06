
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

$ ->
    $loading = $ '#loading-img'
    if $loading.length
        $(document).ajaxStart -> $loading.fadeIn()
        $(document).ajaxStop -> $loading.fadeOut 'fast'



class Spine.Model extends Spine.Model
    constructor: ->
        super
        @bind 'ajaxError', @processAjaxError

    updateFrom: (instance) ->
        for attr, value of instance.attributes?() or instance
            @[attr] = value
        @trigger 'update'

    processAjaxError: (instance, xhr) =>
        try
            error_data = JSON.parse xhr.responseText
            if (not 'errors' of error_data or
                  not 'instance' of error_data)
                throw SyntaxError
        catch error
            if xhr.status isnt 200
                alert 'Error: there is a communication error!'
            throw error

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
        @instance.bind 'update', @render_on_update
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
        window.getSelection().removeAllRanges()

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
                    left: e.pageX
                    top: e.pageY
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
        if confirm gettext 'Are you sure?'
            for reference in references
                eval(reference.model).destroy reference.id
        else
            @hide()

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
        @menu_controller?.release()
        @menu_controller = new @DropdownController el: @menu, item: this

    show_dropdown: (e) =>
        e.preventDefault()
        unless @el.hasClass 'ui-selected'
            $('.ui-selected').removeClass 'ui-selected'
            @el.addClass 'ui-selected'
        @menu_controller.show e


class Spine.ListController extends Spine.Controller
    item_controllers: {}
    default_query: -> {}
    container: -> @el

    constructor: ->
        super
        @items = []
        for Model in (eval name for name of @item_controllers)
            Model.bind 'refresh', @add
            Model.fetch $.query @default_query Model

    add: (instances) =>
        added_items = []
        for instance in instances
            item = @get_item instance
            if item and item not in @items
                @container().append item.render()
                item.post_render?()
                @items.push item
                added_items.push item
        added_items

    release_item: (item) =>
        @items = @items.without item

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
        @page_number = 1
        @infinite_load = false
        @load_until_id = parseInt window.location.hash[1..]
        @load_until_id = false if @load_until_id is NaN
        @el.waypoint? @load_more,
            continuous: false
            offset: 'bottom-in-view'
            enabled: false

    add: =>
        items_added = super
        @el.waypoint 'enable'
        last_item = _.last items_added
        if last_item?.instance.constructor is @ScrollingModel
            if @load_until_id
                for item in items_added
                    if item.instance.id is @load_until_id
                        $.scrollTo? "[data-id=#{item.instance.id}]", 300
                        item.el.addClass 'ui-selected'
                        @load_until_id = false
                        break

            @load_more() if @infinite_load or @load_until_id
        items_added

    load_more: =>
        @el.waypoint 'disable'
        @page_number += 1
        query = @default_query @ScrollingModel
        query.p = @page_number
        @ScrollingModel.fetch $.query query

    activate_infinite_loading: =>
        @infinite_load = true
        @load_more()
