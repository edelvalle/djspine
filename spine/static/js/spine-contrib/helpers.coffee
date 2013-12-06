
$.query = (query_data) ->
    data: JSON.stringify(query_data or {})
    contentType: 'application/json'


$.fn.htmlTemplate = (args...) ->
    @html()?.trim()?.template args...

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

Spine.Model.updateInstance = (old_instance, instance) ->
    for attr, value of instance.attributes?() or instance
        old_instance[attr] = value
    old_instance.trigger 'update'
    old_instance


class Spine?.FormController extends Spine.Controller
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
        if value? and field.length
            field.val value
            field.filter('img').attr 'src', value
            field.filter('span').text String(value)
            field.trigger 'change'
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
            @instance = Spine.Model.updateInstance @instance, instance

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
            @instance.save()

    on_saved: (old_instance, new_instance) =>
        @reset_form()
        @instance = Spine.Model.updateInstance @instance, new_instance
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

    field_value: (name, value) ->
        field = @get_field name
        if value?
            field.text String(value)
        else
            (field.text() or '').trim()

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
        window.getSelection().removeAllRanges()

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
        @$('[type][name]:visible:first').focus()

    save: =>
        @body_controller?.save?()


RIGHT_MOUSE_BUTTON = 3

class Spine?.DropdownController extends Spine.Controller
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

if Spine?.DropdownController?
    $(window).bind 'click', Spine.DropdownController.hide_open


class Spine?.EditionDropdown extends Spine.DropdownController
    events:
        'click .rename-action': 'focus_name'
        'click .remove-action': 'remove_instances'

    name_attr: 'name'
    selected_items_selector: '.ui-selected[data-model][data-id]'

    focus_name: (e) =>
        e?.preventDefault()
        @hide()
        (@item.get_field @name_attr).focus()

    selected_references: =>
        for selected in $ @selected_items_selector
            {
                model: selected.getAttribute 'data-model'
                id: +selected.getAttribute 'data-id'
            }

    remove_instances: (e) =>
        e?.preventDefault()
        references = @selected_references()
        if confirm gettext 'Are you sure?'
            for reference in references
                eval(reference.model).destroy reference.id
        else
            @hide()

class Spine?.ItemWithContextualMenu extends Spine.ItemController
    DropdownController: Spine.DropdownController

    events: _.extend(
        _.clone Spine.ItemController::events
        'mouseenter .contextual-dropdown': 'on_mouse_enter'
        'mouseleave .contextual-dropdown': 'on_mouse_leave'
        'mousemove .contextual-dropdown': 'on_mouse_move'
    )

    elements: _.extend(
        _.clone Spine.ItemController::elements
        'ul.dropdown-menu': 'menu'

    )

    mouse_is_inside: false
    timer: null

    refreshElements: ->
        super
        @menu_controller?.release()
        @menu_controller = new @DropdownController el: @menu, item: this

    delegateEvents: ->
        super
        @el.bind 'click', @on_click

    on_click: =>
        @on_mouse_leave()

    on_mouse_enter: (e) =>
        @mouse_event = e
        if @timer is null
            @timer = @delay @show_dropdown_if_mouse_is_inside, 1000

    on_mouse_move: (e) =>
        @mouse_event = e

    on_mouse_leave: =>
        clearTimeout @timer
        @timer = null
        @mouse_event = false

    show_dropdown_if_mouse_is_inside: =>
        if @timer isnt null
            @show_dropdown @mouse_event
            @timer = null

    show_dropdown: (e) =>
        e.preventDefault()
        unless @el.hasClass 'ui-selected'
            $('.ui-selected').removeClass 'ui-selected'
            @el.addClass 'ui-selected'
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
                Model.bind 'refresh', @add
                Model.fetch $.query query

    add: (instances) =>
        added_items = []
        for instance in instances
            item = @get_item instance
            if item and item not in @items
                @container().append item.render()
                @items.push item
                added_items.push item
        added_items

    release_item: (item) =>
        @items = @items.without item

    get_item: (instance) ->
        item = @items.find (item) ->
            instance.constructor is item.instance.constructor and (
                (instance.cid is item.instance.cid) or
                (instance.id and instance.id is item.instance.id)
            )

        if item?
            Spine.Model.updateInstance item.instance, instance
        else
            ItemController = _.find @item_controllers, (controller, name) ->
                 instance.constructor.className is name
            item = new ItemController instance: instance
            item.bind 'release', @release_item
        item


class Spine?.InfiniteListController extends Spine.ListController
    ScrollingModel: null

    constructor: ->
        super
        @page_number = 1
        @infinite_load = false
        @load_until_id = parseInt window.location.hash[1..]
        @load_until_id = false if @load_until_id is NaN

    add: =>
        items_added = super
        last_item = items_added.last()
        if last_item?.instance.constructor is @ScrollingModel
            if @load_until_id
                for item in items_added
                    if item.instance.id is @load_until_id
                        $.scrollTo? "[data-id=#{item.instance.id}]", 300
                        item.el.addClass 'ui-selected'
                        @load_until_id = false
                        break

            if @infinite_load or @load_until_id
                @load_more()
            else
                last_before_item = @items.rest(items_added.length - 1).first()
                last_before_item?.el.waypoint 'destroy'
                last_item.el.waypoint @load_more,
                    continuous: false
                    triggerOnce: true
                    offset: 'bottom-in-view'
        items_added

    load_more: =>
        @page_number += 1
        query = @default_query @ScrollingModel
        query.p = @page_number
        @ScrollingModel.fetch $.query query

    activate_infinite_loading: =>
        @infinite_load = true
        @load_more()


class Spine?.InfiniteGridController extends Spine.InfiniteListController

    constructor: ->
        super
        $(window).resize @arrange

    add: =>
        last_item = @items.last()
        items = if last_item then [last_item] else []
        added_items = super
        items = items.concat added_items
        @arrange items
        $.waypoints 'refresh'
        added_items

    release_item: (item) =>
        index = @items.indexOf item
        super
        @arrange @items[index - 1..]

    arrange: (items) =>
        items = @items if not _.isArray items
        if items.length
            last_top = items.first().el.offset().top
            for item in items
                item.el.removeClass 'first'
                item_top = item.el.offset().top
                if item_top isnt last_top
                    item.el.addClass 'first'
                    item_top = item.el.offset().top
                last_top = item_top
