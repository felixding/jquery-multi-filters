/*
 * jQuery Multi Filters plugin v0.4
 * http://dingyu.me/portfolio/jquery-multi-filters
 * 
 * by Felix Ding
 *
 * MIT License. 
 */
(function($) {
  $.fn.multi_filters = function(options) {
    var plugin = this;
    plugin.filter_index = 0;
    plugin.dom = {
      add_filter: function(obj, existing_filter) {
        // compile template
        var filter_row = $.tmpl("filter", {name: options.name, id: plugin.filter_index, available_filters: plugin.options.available_filters});

        // update dom
        if(obj) {
          $(obj).parent().parent().parent().after(filter_row);
        }
        else {
          plugin.append(filter_row);
        }
        
        // give it an id
        $(filter_row).data("id", plugin.filter_index);

        if(existing_filter) {
          $(filter_row).find(".key").first().val(existing_filter["key"]).change();
          $(filter_row).find(".restriction").first().val(existing_filter["restriction"]).change();
          $(filter_row).find(".value").first().val(existing_filter["value"]);
        }
        else {
          // ask restriction to change
          $(filter_row).find(".key").first().change();
        }

        // update index
        plugin.filter_index++;

        this.add_or_remove_check();
      },

      remove_filter: function(obj) {
        $(obj).parent().parent().parent().remove();

        this.add_or_remove_check();
      },

      add_or_remove_check: function() {
        if(plugin.find(".filter").length == 1) {
          plugin.find(".remove-filter").attr("disabled", "disabled"); 
        }
        else if(plugin.find(".filter").length > 1) {
          plugin.find(".remove-filter").removeAttr("disabled"); 
        }
      }
    }

    // options
    var default_options = {
      types:  {
        "text":{
          "restrictions":[
            {
            "title":"Contains",
            "value":"contains"
          },
          {
            "title":"Is",
            "value":"is"
          }
          ]
        },
        "rating":{
          "restrictions":[
            {
            "title":"Less Than",
            "value":"less_than"
          },
          {
            "title":"Greater Than",
            "value":"greater_than"
          },
          {
            "title":"Is",
            "value":"is"
          }
          ],
          "value":[ 
            { "title" : "1 Star",
              "value" : 1
          },
          { "title" : "2 Stars",
            "value" : 2
          },
          { "title" : "3 Stars",
            "value" : 3
          },
          { "title" : "4 Stars",
            "value" : 4
          },
          { "title" : "5 Stars",
            "value" : 5
          }
          ]
        },
        "date":{
          "restrictions":[
            {
            "title":"Before",
            "value":"before"
          },
          {
            "title":"After",
            "value":"after"
          },
          {
            "title":"Is",
            "value":"is"
          }
          ]
        },
        "status":{
          "restrictions":[
            {
            "title":"Is",
            "value":"is"
          },
          {
            "title":"Is Not",
            "value":"is_not"
          }
          ],
          "value":[ 
            { "title" : "Open",
              "value" : "open"
          },
          { "title" : "In Progress",
            "value" : "in_progress"
          },
          { "title" : "Closed",
            "value" : "closed"
          }
          ]
        },
        "no_restrictions": {
          "restrictions": null,
          "value": [ 
            { "title" : "Set to 1",
              "value" : "1"
          },
          { "title" : "Set to 2",
            "value" : "2"
          }
          ]
        }
      },
      templates: {
        filter: '<li class="filter">\
        <div class="row">\
        <div class="col-md-3 col-sm-3 col-xs-12">\
        <select class="key col-xs-12" name="model[${name}][${id}][key]">{{tmpl(available_filters) "option"}}</select>\
        </div>\
        <div class="col-md-3 col-sm-3 col-xs-12">\
        <select class="restriction col-xs-12" name="model[${name}][${id}][restriction]"></select>\
        </div>\
        ${restrictions}\
        <div class="col-md-3 col-sm-3 col-xs-12">\
        <span class="value_container"></span>\
        </div>\
        <div class="col-md-3 col-sm-3 col-xs-12" style="text-align:right1">\
        <button class="add-filter">+</button>\
        <button class="remove-filter">-</button>\
        </div>\
        </div>\
        </li>',
        option: '<option value="${value}">${title}</option>',
        value_text: '<input class="value col-xs-12" type="text" name="model[${name}][${id}][value]"></input>',
        value_date: '<input class="value col-xs-12" type="text" name="model[${name}][${id}][value]"></input>',
        value_rating: '<select class="value col-xs-12" name="model[${name}][${id}][value]">{{tmpl(value) "option"}}</select>',
        value_status: '<select class="value col-xs-12" name="model[${name}][${id}][value]">{{tmpl(value) "option"}}</select>',
        value_no_restrictions: '<select class="value col-xs-12" name="model[${name}][${id}][value]">{{tmpl(value) "option"}}</select>'
      },
      available_filters: {},
      multiple: true
    };

    this.options = $.extend(default_options, options);

    // cache templates
    $.each(this.options.templates, function(name, tpl) {
      $.template(name, tpl);
    });
    
    $( "#whichkey" ).on( "keydown", function( event ) {
      $( "#log" ).html( event.type + ": " +  event.which );
    });
    
    // prevent hitting the Enter key from adding a new filter row
    $(plugin).on("keydown", function(event) {
      if(event.which == 13) {
        return false;
      }
    });

    // listen "filter key change"
    $(plugin).on("change", ".key", function(event) {
      var $filter = $(this).parent().parent().parent();
      var type = $(this).find("option:selected").tmplItem().data.type;

      // restriction
      if(plugin.options.types[type]["restrictions"]) {
        var restrictions = $.tmpl("option", plugin.options.types[type]["restrictions"]);
        $(this).parent().parent().find(".restriction").empty().append(restrictions);
      }
      else {
        $(this).parent().parent().find(".restriction").parent().remove();
      }

      // value
      var value = $.tmpl("value_"+type, {id: $filter.data("id"), name: options.name, value: plugin.options.types[type].value});
      $(this).parent().parent().find(".value_container").empty().append(value);

      // add & remove buttons
      if(!plugin.options.multiple) {
        $(this).parent().parent().find("button").remove();
      }
    });
    
    // any existing filters?
    var existing_filters = plugin.options.existing_filters;
    if(existing_filters && existing_filters.length > 0) {
      // yes, iterate
      for (var i in existing_filters) {
        plugin.dom.add_filter(null, existing_filters[i]);
      }
    }
    else {
      // append the first filter    
      plugin.dom.add_filter();
    }

    // listen "add button"
    $(plugin).on("click", ".add-filter", function() {
      plugin.dom.add_filter(this);
      return false;
    });

    // listen "remove button"
    $(plugin).on("click", ".remove-filter", function() {
      plugin.dom.remove_filter(this);
      return false;
    });
  };
})(jQuery);
