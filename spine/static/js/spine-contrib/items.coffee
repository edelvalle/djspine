
class Spine.ItemController extends Spine.Controller

    constructor: ->
        super
        @instance.bind 'update', @on_update
        @instance.bind 'destroy', @on_destroy

    on_update: (options) ->
        @render()

    on_destroy: (options) ->
        @release()

    render: (template=@template) ->
        @replace $.jqote @template, @instance
        @el


class Spine.EditableItemController extends Spine.ItemController

    constructor: ->
        super
        @is_editing ?= false

    render: ->
        template = if @is_editing then @editing_template else @template
        super template
