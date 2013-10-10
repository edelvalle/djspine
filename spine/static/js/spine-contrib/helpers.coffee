
$.query = (query_data) ->
    data: JSON.stringify(query_data or {})


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



csrfToken = $.getCookie 'csrftoken'
$(document).ajaxSend (e, xhr, settings) ->
    xhr.setRequestHeader 'X-CSRFToken', csrfToken


# Content editables with input events

ENTER = 13

$ ->
    $contenteditables = $('[contenteditable]')
    $contenteditables.keydown (e) ->
        if e.keyCode is ENTER
            e.preventDefault()
            $(@).trigger 'change'

    $contenteditables.blur (e) ->
        $(@).trigger 'change'


# Spine


class Spine?.ListController extends Spine.Controller
    events:
        'click [data-action=add]':     'on_add'

    constructor: ->
        super
        @ItemController ?= ItemController
        @Model.bind 'refresh', @add_items
        @Model.bind 'create', @add_item
        @Model.fetch()

    add_items: (instances) =>
        _.each instances, @add_item

    add_item: (instance) =>
        item = new @ItemController instance: instance, modal: @modal
        @prepend item.render()

    on_add: =>
        null


class Spine?.ItemController extends Spine.Controller
    events:
        'click [data-action=destroy]': 'on_destroy'
        'dblclick [data-action=edit]': 'on_edit'

    constructor: ->
        super
        @instance.bind 'update', @render
        @instance.bind 'destroy', @destroy

    render: =>
        @replace @template @instance
        @el

    destroy: =>
        @el.slideUp('fast', @release)

    on_destroy: =>
        @instance.destroy() if confirm 'Sure?'

    on_edit: =>
        @modal?.show @instance
