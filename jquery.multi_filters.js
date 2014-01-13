/*
 * jQuery Multi Filters plugin v0.2
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
			add_filter: function(obj) {
			  // compile template
			  var filter_row = $.tmpl("filter", {id: plugin.filter_index, available_filters: plugin.options.available_filters});

        // update dom
			  if(obj) {
			    $(obj).parent().after(filter_row);
			  }
			  else {
          plugin.append(filter_row);
        }

        // ask restriction to change
        $(filter_row).data("id", plugin.filter_index).find(".key").first().change();

        // update index
        plugin.filter_index++;
        
        this.add_or_remove_check();
		  },
		  
		  remove_filter: function(obj) {
		    $(obj).parent().remove();

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
        }
      },
      templates: {
        filter: '<li class="filter">\
          <select class="key" name="model[filters][${id}][key]">{{tmpl(available_filters) "option"}}</select>\
          <select class="restriction" name="model[filters][${id}][restriction]"></select>\
          ${restrictions}\
          <span class="value_container"></span>\
          <button class="add-filter">+</button>\
          <button class="remove-filter">-</button>\
        </li>',
        option: '<option value="${value}">${title}</option>',
        value_text: '<input class="value" type="text" name="model[filters][${id}][value]"></input>',
        value_date: '<input class="value" type="text" name="model[filters][${id}][value]"></input>',
        value_rating: '<select class="value" name="model[filters][${id}][value]">{{tmpl(value) "option"}}</select>',
        value_status: '<select class="value" name="model[filters][${id}][value]">{{tmpl(value) "option"}}</select>',
      },
      available_filters: {}
		};

		this.options = $.extend(default_options, options);
		
		// cache templates
		$.each(this.options.templates, function(name, tpl) {
		  $.template(name, tpl);
		});
		
		// listen "filter key change"
		$(plugin).on("change", ".key", function() {
		  var $filter = $(this).parent(".filter");
		  var type = $(this).find("option:selected").tmplItem().data.type;
		  
		  // restriction
		  var restrictions = $.tmpl("option", plugin.options.types[type]["restrictions"]);
		  $(this).siblings(".restriction").empty().append(restrictions);

		  // value
		  var value = $.tmpl("value_"+type, {id: $filter.data("id"), value: plugin.options.types[type].value});
		  $(this).siblings(".value_container").empty().append(value);
		});
		
		// append the first filter    
    plugin.dom.add_filter();
    
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