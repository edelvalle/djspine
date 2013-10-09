
class Spine.Form extends Spine.Controller
    events:
        'click [type="submit"]': 'on_submit'

    elements:
        '[name]': 'fields'

    constructor: ->
        super
        @set_focus_on_first_field()
        for $field in ($ f for f in @fields)
            name = $field.attr('name')
            @[name] = $field if name not of @

    set_focus_on_first_field: =>
        for $field in ($ f for f in @fields)
            if $field.is ':visible'
                $field.focus()
                return

    on_submit: (e) =>
        e?.preventDefault()


class Spine.ModelForm extends Spine.Form
    model = null
    search_field = null
    instance = null
    query = null

    constructor: ->
        super
        @model.bind 'refresh', @on_refresh
        if @search_field
            @query = {}
            @query[@search_field] = @[@search_field].val()

        if not @instance and @query
            @model.fetch $.query @query

    on_refresh: =>
        if not @instance and @query
            @instance = @model.findByAttribute @query
            if @instance
                @bind_instance()
                @render()

    bind_instance: =>
        @instance.bind 'ajaxError', @render_errors
        @instance.bind 'update', @render

    populate_instance: =>
        @for_each_field ($field, field_name) ->
            value = $field.val()
            if $field.attr('type') is 'checkbox'
                value = $field.is ':checked'
            @instance[field_name] = value

    for_each_field: (func) =>
        for $field in ($(f) for f in @fields)
            func.call(@, $field, $field.attr('name'))

    render: =>
        @for_each_field ($field, field_name) ->
            if field_name of @instance
                value = @instance[field_name]
                if $field.attr('type') is 'checkbox'
                    @log $field.attr 'name'
                    $field.setChecked value
                else
                    $field.val value

    on_submit: =>
        super
        if not @instance
            @instance = new @model
            @bind_instance()
        @populate_instance()
        @instance.save()

    render_errors: (intance, xhr) =>
        if @instance.cid is @instance.id
            @instance.id = null
        @el.showFormErrors (JSON.parse xhr.responseText).errors
