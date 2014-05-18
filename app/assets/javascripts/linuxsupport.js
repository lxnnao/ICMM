/*
linux suppor metro-ui gem but window can not
*/

/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 *
 * Requires: 1.2.2+
 */


(function($) {

var types = ['DOMMouseScroll', 'mousewheel'];

if ($.event.fixHooks) {
    for ( var i=types.length; i; ) {
        $.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
    }
}

$.event.special.mousewheel = {
    setup: function() {
        if ( this.addEventListener ) {
            for ( var i=types.length; i; ) {
                this.addEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = handler;
        }
    },

    teardown: function() {
        if ( this.removeEventListener ) {
            for ( var i=types.length; i; ) {
                this.removeEventListener( types[--i], handler, false );
            }
        } else {
            this.onmousewheel = null;
        }
    }
};

$.fn.extend({
    mousewheel: function(fn) {
        return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
    },

    unmousewheel: function(fn) {
        return this.unbind("mousewheel", fn);
    }
});


function handler(event) {
    var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
    event = $.event.fix(orgEvent);
    event.type = "mousewheel";

    // Old school scrollwheel delta
    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }

    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;

    // Gecko
    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
        deltaY = 0;
        deltaX = -1*delta;
    }

    // Webkit
    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }

    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);

    return ($.event.dispatch || $.event.handle).apply(this, args);
}

})(jQuery);
/**
 * jQuery plugin for input elements for Metro UI CSS framework
 */

(function($) {
    var pluginName = 'Accordion',
        initAllSelector = '[data-role="accordion"]',
        paramKeys = [];

    $[pluginName] = function(element, options) {
        if (!element) {
            return $()[pluginName]({initAll: true});
        }

        var defaults = {
        };

        var plugin = this;
        plugin.settings = {};
        var $element = $(element);

        var $li, $triggers, $frames;

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);

            $li = $element.children("li");
            $triggers = $li.children("a");
            $frames = $li.children("div");

            $triggers.on('click', function(e){
                e.preventDefault();
                var $a = $(this),
                    $activeLi = $li.filter('.active'),
                    $parentLi = $a.parent("li"),
                    target = $a.parent('li').children("div");

                if ( $parentLi.hasClass('active') ) {
                    target.slideUp(undefined, function(){
                        $parentLi.removeClass("active");
                    });

                } else {
                    $frames.slideUp(undefined, function(){
                        $activeLi.removeClass("active");
                    });
                    target.slideDown();
                    $parentLi.addClass("active");
                }
            });
        };



        plugin.init();

    };

    $.fn[pluginName] = function(options) {
        var elements = options && options.initAll ? $(initAllSelector) : this;
        return elements.each(function() {
            var that = $(this),
                params = {},
                plugin;
            if (undefined == that.data(pluginName)) {
                $.each(paramKeys, function(index, key){
                    params[key[0].toLowerCase() + key.slice(1)] = that.data('param' + key);
                });
                plugin = new $[pluginName](this, params);
                that.data(pluginName, plugin);
            }
        });
    };
    // autoinit
    $(function(){
        $()[pluginName]({initAll: true});
    });

})(jQuery);
(function($){
    $.fn.ButtonSet = function( options ){
        var defaults = {
        };

        var $this = $(this)
            , $buttons = $this.find("button")
            ;

        var initButtons = function(buttons){
            buttons.on('click', function(e){
                e.preventDefault();
                var $a = $(this);
                if ( $a.hasClass('active') ) return false;
                $buttons.removeClass("active");
                $(this).addClass("active");
            });
        }

        return this.each(function(){
            if ( options ) {
                $.extend(defaults, options)
            }

            initButtons($buttons);
        });
    }

    $(function () {
        $('[data-role="button-set"]').each(function () {
            $(this).ButtonSet();
        })
    })
})(window.jQuery);
/**
 * Calendar - jQuery plugin for MetroUiCss framework
 *
 * this plugin required moment.js library (http://momentjs.com/)
 *
 * to apply this plugin to element use same code:
 * <div class="calnedar"></div> or <div data-role="calendar"></div>
 *
 * init plugin manually
 * <div id="calnedar"></div>
 * $('#calendar').calendar(options)
 *
 * available options:
 * initDate: calendar start date - the instance of moment.js library, or the string like '2013-02-18', if undefined initDate = now date
 * lang: string 'en', 'ru', 'de' etc. More see here - https://github.com/timrwood/moment/blob/develop/min/langs.js
 * yearButtons: if set you will see buttons to switch years
 *
 * handling 'date-selected' event:
 * $('#calendar').on('date-selected', function(el, dateString, dateMoment){
 *     // some code here
 * });
 *
 * to retrieve current calendar date in any time use this code
 * $('#calendar').data('date')
 * you will get the instance of moment.js library
 *
 * you can set any date you want by using $('#calendar').calendarSetDate('2013-03-16');
 * if no argument - will sets current date
 *
 * you can add event on calendar by using $('#calendar').calendarSetEvent({'date': '2013-03-16', 'event': 'today my birthday'})
 * or $('#calendar').calendarSetEvents([{'date': '2013-03-16', 'event': 'today my birthday'}, ...]) to add several events
 * to remove events use clearEvents
 * $('#calendar').calendarClearEvents('all') - will remove all events
 * $('#calendar').calendarClearEvents('2013-03-16') - will remove all events for specified date
 * $('#calendar').calendarClearEvents(['2013-03-16', '2013-03-17', ...]) - will remove all events for specified dates
 * to get events of any date use $('#calendar').calendarGetEvents('2013-03-16')
 *
 */


(function($) {

    var pluginName = 'calendar',
        initAllSelector = '[data-role=calendar], .calendar',
        paramKeys = ['InitDate', 'Lang', 'YearButtons'];

    $[pluginName] = function(element, options) {

        if (!element) {
            return $()[pluginName]({initAll: true});
        }

        // default settings
        var defaults = {
            initDate: false,
            lang: 'en',
            yearButtons: false
        };

        var plugin = this;
        plugin.settings = {};

        var $element = $(element); // reference to the jQuery version of DOM element

        var $prevMonthBtn,
            $nextMonthBtn,
            $prevYearBtn,
            $nextYearBtn,
            $header,
            $days = [],
            calMoment,
            lang,
            dow,
            selectedDateString,
            calendarEvents = {}; // user defined calendar events, structure {'YYYY-MM-DD': ['string', 'string', ...]}

        // initialization
        plugin.init = function () {
            plugin.settings = $.extend({}, defaults, options);

            lang = plugin.settings.lang;
            var date = plugin.settings.initDate;

            dow = moment.langData(lang)._week.dow;

            var selectedDateMoment = date ? moment(date) : moment();
            selectedDateString = selectedDateMoment.format('YYYY-MM-DD');

            renderCalendar();
            plugin.setDate(date);
        };

        /**
         * generate constant elements of calendar
         * moment - is an object of moment.js
         */
        function renderCalendar () {
            var i, j, table, tr, td, mom,
                yearBtns = plugin.settings.yearButtons;

            table = $('<table></table>');

            tr = $('<tr class="current-month"></tr>');
            if (yearBtns) {
                td = $('<th></th>');
                $prevYearBtn = $('<a href="javascript:void(0)" class="icon-arrow-left"></a>');
                td.append($prevYearBtn);
                tr.append(td);
            }
            td = $('<th ' + (yearBtns ? '' : 'colspan="2"') + '></th>');
            $prevMonthBtn = $('<a href="javascript:void(0)" class="icon-arrow-left-3"></a>');
            td.append($prevMonthBtn);
            tr.append(td);
            $header = $('<th colspan="3"></th>');
            tr.append($header);
            td = $('<th ' + (yearBtns ? '' : 'colspan="2"') + '></th>');
            $nextMonthBtn = $('<a href="javascript:void(0)" class="icon-arrow-right-3"></a>');
            td.append($nextMonthBtn);
            tr.append(td);
            if (yearBtns) {
                td = $('<th></th>');
                $nextYearBtn = $('<a href="javascript:void(0)" class="icon-arrow-right"></a>');
                td.append($nextYearBtn);
                tr.append(td);
            }
            table.append(tr);

            mom = moment().lang(lang).startOf('week').add('day', dow);
            tr = $('<tr class="weekdays"></tr>');
            for (i = 0; i < 7; i++) {
                tr.append('<td>' + mom.format('ddd') + '</td>');
                mom.add('day', 1);
            }
            table.append(tr);

            for (i = 0; i < 6; i++) {
                tr = $('<tr></tr>');
                for (j = 0; j < 7; j++) {
                    td = $('<td></td>');
                    $days[i * 7 + j] = td;
                    tr.append(td);
                }
                table.append(tr);
            }

            $element.append(table);

            // append events
            $nextMonthBtn.on('mousedown', function(event){
                event.stopPropagation();
                calMoment.add('month', 1);
                plugin.setDate(calMoment);
            });
            $prevMonthBtn.on('mousedown', function(event){
                event.stopPropagation();
                calMoment.add('month', -1);
                plugin.setDate(calMoment);
            });
            if (yearBtns) {
                $nextYearBtn.on('mousedown', function(event){
                    event.stopPropagation();
                    calMoment.add('year', 1);
                    plugin.setDate(calMoment);
                });
                $prevYearBtn.on('mousedown', function(event){
                    event.stopPropagation();
                    calMoment.add('year', -1);
                    plugin.setDate(calMoment);
                });
            }
            $days.forEach(function(day){
                day.on('mousedown', function(event){
                    event.stopPropagation();
                    var date = day.data('date');
                    if (!date) {
                        return;
                    }
                    calMoment = moment(date);
                    calMoment.lang(lang);
                    selectedDateString = calMoment.format('YYYY-MM-DD');
                    plugin.setDate(calMoment);
                    $element.trigger('date-selected', [date, calMoment]);
                });
            });
        }

        function fillCalendar () {
            var dayIndex, date, dateStr, html;
            // header
            $header.text(calMoment.format('MMM YYYY'));

            // this month
            var thisMonthMom = calMoment.clone().startOf('month');
            var daysInMonth = calMoment.daysInMonth();
            var firstDayIndex = +thisMonthMom.format('d') - dow; // it also day of week index
            firstDayIndex = firstDayIndex < 0 ? firstDayIndex + 7 : firstDayIndex;
            var lastDayIndex = firstDayIndex + daysInMonth;
            for (dayIndex = firstDayIndex; dayIndex < lastDayIndex; dayIndex++) {
                date = thisMonthMom.format('D');
                dateStr = thisMonthMom.format('YYYY-MM-DD');
                html = date;
                if (dateStr === selectedDateString) {
                    $days[dayIndex].prop('class', 'current-day');
                } else {
                    $days[dayIndex].prop('class', 'current-month');
                }
                if (calendarEvents[dateStr]) {
                    $days[dayIndex].addClass('event');
                    $days[dayIndex].prop('title', calendarEvents[dateStr][0]);
                }
                $days[dayIndex].html(html);
                $days[dayIndex].data('date', dateStr);
                thisMonthMom.add('day', 1);
            }

            // prev month
            var prevMonthMom = calMoment.clone().add('month', -1).endOf('month');
            for (dayIndex = firstDayIndex - 1; dayIndex >= 0; dayIndex--) {
                date = prevMonthMom.format('D');
                dateStr = prevMonthMom.format('YYYY-MM-DD');
                html = date;
                $days[dayIndex].prop('class', 'out');
                if (calendarEvents[dateStr]) {
                    $days[dayIndex].addClass('event');
                    $days[dayIndex].prop('title', calendarEvents[dateStr][0]);
                }
                $days[dayIndex].html(html);
                $days[dayIndex].data('date', dateStr);
                prevMonthMom.add('day', -1);
            }

            // next month
            var nextMonthMom = calMoment.clone().add('month', 1).startOf('month');
            for (dayIndex = lastDayIndex; dayIndex < 42; dayIndex++) {
                date = nextMonthMom.format('D');
                dateStr = nextMonthMom.format('YYYY-MM-DD');
                html = date;
                $days[dayIndex].prop('class', 'out');
                if (calendarEvents[dateStr]) {
                    $days[dayIndex].addClass('event');
                    $days[dayIndex].prop('title', calendarEvents[dateStr][0]);
                }
                $days[dayIndex].html(html);
                $days[dayIndex].data('date', dateStr);
                nextMonthMom.add('day', 1);
            }
        }


        // sets date
        // date - string ('YYYY-MM-DD') or instance of moment.js library
        plugin.setDate = function(date) {
            calMoment = date ? moment(date) : moment();
            calMoment.lang(lang);
            $element.data('date', calMoment);
            fillCalendar();
            $element.trigger('date-setted', [date, calMoment]);
        };

        // sets event
        // event - object {'date': '2013-03-01', 'text': 'any text'}
        plugin.setEvent = function(event) {
            var mom = event.date ? moment(event.date) : moment();
            var dateStr = mom.format('YYYY-MM-DD');
            if (!calendarEvents[dateStr]) {
                calendarEvents[dateStr] = [];
            }
            calendarEvents[dateStr].push(event.text);
            fillCalendar();
        };

        // return array of events for specified date
        plugin.getEvents = function (date) {
            var mom = date ? moment(date) : moment();
            var dateStr = mom.format('YYYY-MM-DD');
            return calendarEvents[dateStr];
        }

        // clearing events
        // dates:
        // - string - 'YYYY-MM-DD' - clearing events for this date
        // - string - 'all' - clearing all events
        // - array - ['YYYY-MM-DD', 'YYYY-MM-DD' ...] - clearing events of several dates
        plugin.clearEvents = function (dates) {
            if (dates === 'all') {
                calendarEvents = {};
            } else if (typeof dates === 'string') {
                calendarEvents[dates] = null;
            } else if (typeof dates === 'array') {
                $.each(dates, function(i, date){
                    calendarEvents[date] = null;
                });
            }
            fillCalendar();
        };

        plugin.init();

    };

    // sets date
    $.fn[pluginName + 'SetDate'] = function(date) {
        var plugin = $(this.get(0)).data(pluginName);
        if (typeof plugin !== 'undefined') {
            plugin.setDate(date);
        }
    };
    // sets event
    $.fn[pluginName + 'SetEvent'] = function(event) {
        var plugin = $(this.get(0)).data(pluginName);
        if (typeof plugin !== 'undefined') {
            plugin.setEvent(event);
        }
    };
    // set many events
    $.fn[pluginName + 'SetEvents'] = function(events) {
        var plugin = $(this.get(0)).data(pluginName);
        if (typeof plugin !== 'undefined') {
            $.each(events, function(i, event){
                plugin.setEvent(event);
            });
        }
    };
    // get events
    $.fn[pluginName + 'GetEvents'] = function(date) {
        var plugin = $(this.get(0)).data(pluginName);
        if (typeof plugin !== 'undefined') {
            return plugin.getEvents(date);
        }
    };
    // clear events for any date
    $.fn[pluginName + 'ClearEvents'] = function(dates) {
        var plugin = $(this.get(0)).data(pluginName);
        if (typeof plugin !== 'undefined') {
            plugin.clearEvents(dates);
        }
    };

    $.fn[pluginName] = function(options) {
        var elements = options && options.initAll ? $(initAllSelector) : this;
        return elements.each(function() {
            var that = $(this),
                params = {},
                plugin;
            if (undefined == that.data(pluginName)) {
                $.each(paramKeys, function(index, key){
                    params[key[0].toLowerCase() + key.slice(1)] = that.data('param' + key);
                });
                params = $.extend({}, params, options);
                plugin = new $[pluginName](this, params);
                that.data(pluginName, plugin);
            }
        });
    };
    // autoinit
    $(function(){
        $()[pluginName]({initAll: true});
    });

})(jQuery);


/**
 * datepicker plugin
 *
 * this plugin required moment.js library (http://momentjs.com/)
 *
 * to apply this plugin to element use same code:
 * <div class="datepicker"></div> or <div data-role="datepicker"></div>
 *
 * init plugin manually
 * <div id="datepicker"></div>
 * $('#datepicker').datepicker(options)
 *
 * available options:
 * initDate: calendar start date - the instance of moment.js library, or the string like '2013-02-18', if undefined initDate = now date
 * lang: string 'en', 'ru', 'de' etc. More see here - https://github.com/timrwood/moment/blob/develop/min/langs.js
 * yearButtons: if set you will see buttons to switch years
 *
 * handling 'date-selected' event:
 * $('#datepicker').on('date-selected', function(el, dateString, dateMoment){
 *     // some code here
 * });
 *
 * to retrieve current calendar date in any time use this code
 * $('#datepicker').data('date')
 * you will get the instance of moment.js library
 *
 * you can set any date you want by using $('#datepicker').datepickerSetDate('2013-03-16');
 * if no argument - will sets current date
 *
 * you can add event on datepicker by using $('#datepicker').datepickerSetEvent({'date': '2013-03-16', 'event': 'today my birthday'})
 * or $('#datepicker').datepickerSetEvents([{'date': '2013-03-16', 'event': 'today my birthday'}, ...]) to add several events
 * to remove events use clearEvents
 * $('#datepicker').datepickerClearEvents('all') - will remove all events
 * $('#datepicker').datepickerClearEvents('2013-03-16') - will remove all events for specified date
 * $('#datepicker').datepickerClearEvents(['2013-03-16', '2013-03-17', ...]) - will remove all events for specified dates
 * to get events of any date use $('#datepicker').datepickerGetEvents('2013-03-16')
 *
 */
(function($) {

    var pluginName = 'datepicker',
        initAllSelector = '[data-role=datepicker], .datepicker';
        paramKeys = ['InitDate', 'Lang', 'YearButtons'];

    $[pluginName] = function(element, options) {

        if (!element) {
            return $()[pluginName]({initAll: true});
        }

        // default settings
        var defaults = {
            initDate: false,
            lang: 'en',
            yearButtons: false
        };

        var plugin = this;
        plugin.settings = {};

        var $element = $(element); // reference to the jQuery version of DOM element

        var $calendar,
            $input,
            $button;

        // initialization
        plugin.init = function () {
            var settings = plugin.settings = $.extend({}, defaults, options);

            $input = $element.find('input');
            $button = $element.find('button');

            var $calendarWrap = $('<div class="span4" style="position:relative"></div>');
            $calendar = $('<div class="calendar span4" style="position:absolute;display:none;z-index:10000"></div>');
            $element.data('calendar', $calendar);
            $calendarWrap.append($calendar);
            $element.after($calendarWrap);
            $calendar.calendar({
                initDate: settings.initDate,
                lang: settings.lang,
                yearButtons: settings.yearButtons
            });

            dateSelected(null, null, $calendar.data('date'));

            $input.on('focus', showCalendar);
            $button.on('click', showCalendar);
            $element.on('mousedown', function(event){
                event.stopPropagation();
            });
            $calendar.on('mousedown', function(event){
                event.stopPropagation();
            });

            $calendar.on('date-selected', dateSelected);
            $calendar.on('date-setted', dateSetted);
        };

        function showCalendar (event) {
            if ($calendar.css('display') !== 'none') {
                return;
            }
            var doc = $(document);
            $calendar.css('bottom', '');
            var docHeight = doc.height();
            $calendar.show();
            var docHeightNew = doc.height();
            if (docHeight < docHeightNew) {
                $calendar.css('bottom', $element.height() + 11);
            }
            $input.prop('disabled', true);
            $(document).one('mousedown.calendar', hideCalendar);
        }

        function hideCalendar () {
            $calendar.hide();
            $input.prop('disabled', false);
            $(document).off('mousedown.calendar');
            $input.blur();
        }

        function dateSelected (event, dateString, dateMoment) {
            hideCalendar();
            $input.val(dateMoment.format('ll'));
            $element.data('date', dateMoment);
            $input.trigger('date-selected', [dateString, dateMoment]);
        }
        function dateSetted (event, dateString, dateMoment) {
            $input.val(dateMoment.format('ll'));
            $element.data('date', dateMoment);
        }

        plugin.init();

    };

    // sets date
    $.fn[pluginName + 'SetDate'] = function(date) {
        var $calendar = $(this.get(0)).data('calendar');
        if (typeof $calendar !== 'undefined') {
            $calendar.calendarSetDate(date);
        }
    };
    // sets event
    $.fn[pluginName + 'SetEvent'] = function(event) {
        var $calendar = $(this.get(0)).data('calendar');
        if (typeof $calendar !== 'undefined') {
            $calendar.calendarSetEvent(event);
        }
    };
    // set many events
    $.fn[pluginName + 'SetEvents'] = function(events) {
        var $calendar = $(this.get(0)).data('calendar');
        if (typeof $calendar !== 'undefined') {
            $.each(events, function(i, event){
                $calendar.calendarSetEvent(event);
            });
        }
    };
    // get events
    $.fn[pluginName + 'GetEvents'] = function(date) {
        var $calendar = $(this.get(0)).data('calendar');
        if (typeof $calendar !== 'undefined') {
            return $calendar.calendarGetEvents(date);
        }
    };
    // clear events for any date
    $.fn[pluginName + 'ClearEvents'] = function(dates) {
        var $calendar = $(this.get(0)).data('calendar');
        if (typeof $calendar !== 'undefined') {
            $calendar.calendarClearEvents(dates);
        }
    };

    $.fn[pluginName] = function(options) {
        var elements = options && options.initAll ? $(initAllSelector) : this;
        return elements.each(function() {
            var that = $(this),
                params = {},
                plugin;
            if (undefined == that.data(pluginName)) {
                $.each(paramKeys, function(index, key){
                    params[key[0].toLowerCase() + key.slice(1)] = that.data('param' + key);
                });
                plugin = new $[pluginName](this, params);
                that.data(pluginName, plugin);
            }
        });
    };
    // autoinit
    $(function(){
        $()[pluginName]({initAll: true});
    });

})(jQuery);
/**
 * Carousel - jQuery plugin for MetroUiCss framework
 */


(function($) {
    var pluginName = 'Carousel',
        initAllSelector = '[data-role=carousel], .carousel',
        paramKeys = ['Auto', 'Period', 'Duration', 'Effect', 'Direction', 'Markers', 'Arrows', 'Stop'];

    $[pluginName] = function(element, options) {
        if (!element) {
            return $()[pluginName]({initAll: true});
        }

        // default settings
        var defaults = {
            // auto slide change
            auto: true,
            // slide change period
            period: 6000,
            // animation duration
            duration: 1000,
            // animation effect (fade, slide, switch, slowdown)
            effect: 'slide',
            // animation direction (left, right) for some kinds of animation effect
            direction: 'left',
            // markers below the carousel
            markers: 'on',
            // prev and next arrows
            arrows: 'on',
            // stop sliding when cursor over the carousel
            stop: 'on'
        };

        var plugin = this;
        // plugin settings
        plugin.settings = {};

        var $element = $(element); // reference to the jQuery version of DOM element

        var slides, // all slides DOM objects
            currentSlideIndex, // index of current slide
            slideInPosition, // slide start position before it's appear
            slideOutPosition, // slide position after it's disappear
            parentWidth,
            parentHeight,
            animationInProgress,
            autoSlideTimer,
            markers,
            stopAutoSlide = false;

        // initialization
        plugin.init = function () {

            plugin.settings = $.extend({}, defaults, options);

            slides = $element.find('.slides:first-child > .slide');

            // if only one slide
            if (slides.length <= 1) {
                return;
            }

            currentSlideIndex = 0;

            // parent block dimensions
            parentWidth = $element.innerWidth();
            parentHeight = $element.innerHeight();
            // slides positions, used for some kinds of animation
            slideInPosition = getSlideInPosition();
            slideOutPosition = getSlideOutPosition();

            // prepare slide elements
            slides.each(function (index, slide) {
                $slide = $(slide);
                // each slide must have position:absolute
                // if not, set it
                if ($slide.css('position') !== 'absolute') {
                    $slide.css('position', 'absolute');
                }
                // disappear all slides, except first
                if (index !== 0) {
                    $slide.hide();
                }
            });

            if (plugin.settings.arrows === 'on') {
                // prev next buttons handlers
                $element.find('span.control.left').on('click', function(){
                    changeSlide('left');
                    startAutoSlide();
                });
                $element.find('span.control.right').on('click', function(){
                    changeSlide('right');
                    startAutoSlide();
                });
            } else {
                $element.find('span.control').hide();
            }

            // markers
            if (plugin.settings.markers === 'on') {
                insertMarkers();
            }

            // enable auto slide
            if (plugin.settings.auto === true) {
                startAutoSlide();

                // stop sliding when cursor over the carousel
                if (plugin.settings.stop === 'on') {
                    $element.on('mouseenter', function () {
                        stopAutoSlide = true;
                    });
                    $element.on('mouseleave', function () {
                        stopAutoSlide = false;
                        startAutoSlide();
                    });
                }
            }

            // u can use same code:
            // $('#carusel').trigger('changeSlide', [{direction: 'left', effect: 'fade', index: 1}])
            // any option not required
            $element.on('changeSlide', function(event, options){
                options = options || {};
                changeSlide(options.direction, options.effect, options.index);
            });
        };

        /**
         * returns start position for appearing slide {left: xxx}
         */
        var getSlideInPosition = function () {
            var pos;
            if (plugin.settings.direction === 'left') {
                pos = {
                    'left': parentWidth
                }
            } else if (plugin.settings.direction === 'right') {
                pos = {
                    'left': -parentWidth
                }
            }
            return pos;
        };

        /**
         * returns end position of disappearing slide {left: xxx}
         */
        var getSlideOutPosition = function () {
            var pos;
            if (plugin.settings.direction === 'left') {
                pos = {
                    'left': -parentWidth
                }
            } else if (plugin.settings.direction === 'right') {
                pos = {
                    'left': parentWidth
                }
            }
            return pos;
        };

        /**
         * start or restart auto change
         */
        var startAutoSlide = function () {
            clearInterval(autoSlideTimer);
            // start slide changer timer
            autoSlideTimer = setInterval(function () {
                if (stopAutoSlide) {
                    return;
                }
                changeSlide();
            }, plugin.settings.period);
        };

        /**
         * inserts markers below the carousel
         */
        var insertMarkers = function () {
            var div, ul, li, i;

            div = $('<div class="markers"></div>');
            ul = $('<ul></ul>').appendTo(div);

            for (i = 0; i < slides.length; i++) {
                li = $('<li><a href="javascript:void(0)" data-num="' + i + '"></a></li>');
                if (i === 0) {
                    li.addClass('active');
                }
                li.appendTo(ul);
            }

            markers = ul.find('li');

            ul.find('li a').on('click', function () {
                var $this = $(this),
                    index;

                // index of appearing slide
                index = $this.data('num');
                if (index === currentSlideIndex) {
                    return;
                }

                changeSlide(undefined, 'switch', index);
                startAutoSlide();
            });

            div.appendTo($element);
        };

        /**
         * changes slide to next
         */
        var changeSlide = function(direction, effect, slideIndex) {

            var outSlide, // disappearin slide element
                inSlide, // appearing slide element
                nextSlideIndex,
                delta = 1,
                slideDirection = 1;

            effect = effect || plugin.settings.effect;
            // correct slide direction, used for 'slide' and 'slowdown' effects
            if ((effect === 'slide' || effect === 'slowdown') && typeof direction !== 'undefined' && direction !== plugin.settings.direction) {
                slideDirection = -1;
            }
            if (direction === 'left') {
                delta = -1;
            }

            outSlide = $(slides[currentSlideIndex]);

            nextSlideIndex = (typeof slideIndex !== 'undefined' && slideIndex !== currentSlideIndex) ? slideIndex : currentSlideIndex + delta;
            if (nextSlideIndex >= slides.length) {
                nextSlideIndex = 0;
            }
            if (nextSlideIndex < 0) {
                nextSlideIndex = slides.length - 1;
            }

            inSlide = $(slides[nextSlideIndex]);

            if (animationInProgress === true) {
                return;
            }

            // switch effect is quickly, no need to wait
            if (effect !== 'switch') {
                // when animation in progress no other animation occur
                animationInProgress = true;
                setTimeout(function () {
                    animationInProgress = false;
                }, plugin.settings.duration)
            }

            // change slide with selected effect
            switch (effect) {
                case 'switch':
                    changeSlideSwitch(outSlide, inSlide);
                    break;
                case 'slide':
                    changeSlideSlide(outSlide, inSlide, slideDirection);
                    break;
                case 'fade':
                    changeSlideFade(outSlide, inSlide);
                    break;
                case 'slowdown':
                    changeSlideSlowdown(outSlide, inSlide, slideDirection);
                    break;
            }

            currentSlideIndex = nextSlideIndex;

            // switch marker
            if (plugin.settings.markers === 'on') {
                markers.removeClass('active');
                $(markers.get(currentSlideIndex)).addClass('active');
            }

        };
        /**
         * switch effect
         */
        var changeSlideSwitch = function (outSlide, inSlide) {
            inSlide.show().css({'left': 0});
            outSlide.hide();
        };
        /**
         * slide effect
         */
        var changeSlideSlide = function (outSlide, inSlide, slideDirection) {
            var unmovedPosition = {'left': 0},
                duration = plugin.settings.duration;

            if (slideDirection !== -1) {
                inSlide.css(slideInPosition);
                inSlide.show();
                outSlide.animate(slideOutPosition, duration);
                inSlide.animate(unmovedPosition, duration);
            } else {
                inSlide.css(slideOutPosition);
                inSlide.show();
                outSlide.animate(slideInPosition, duration);
                inSlide.animate(unmovedPosition, duration);
            }
        };
        /**
         * slowdown slide effect (custom easing 'doubleSqrt')
         */
        var changeSlideSlowdown = function (outSlide, inSlide, slideDirection) {
            var unmovedPosition = {'left': 0},
                options;

            options = {
                'duration': plugin.settings.duration,
                'easing': 'doubleSqrt'
            };

            if (slideDirection !== -1) {
                inSlide.css(slideInPosition);
                inSlide.show();
                outSlide.animate(slideOutPosition, options);
                inSlide.animate(unmovedPosition, options);
            } else {
                inSlide.css(slideOutPosition);
                inSlide.show();
                outSlide.animate(slideInPosition, options);
                inSlide.animate(unmovedPosition, options);
            }
        };
        /**
         * fade effect
         */
        var changeSlideFade = function (outSlide, inSlide) {
            inSlide.hide();
            inSlide.css({
                left: 0,
                top: 0
            });
            inSlide.fadeIn(plugin.settings.duration);
            outSlide.fadeOut(plugin.settings.duration);
        };

        plugin.init();

    };

    // easing effect for jquery animation
    $.easing.doubleSqrt = function(t, millisecondsSince, startValue, endValue, totalDuration) {
        var res = Math.sqrt(Math.sqrt(t));
        return res;
    };

    $.fn[pluginName] = function(options) {
        var elements = options && options.initAll ? $(initAllSelector) : this;
        return elements.each(function() {
            var that = $(this),
                params = {},
                plugin;
            if (undefined == that.data(pluginName)) {
                $.each(paramKeys, function(index, key){
                    params[key[0].toLowerCase() + key.slice(1)] = that.data('param' + key);
                });
                plugin = new $[pluginName](this, params);
                that.data(pluginName, plugin);
            }
        });
    };
    // autoinit
    $(function(){
        $()[pluginName]({initAll: true});
    });

})(jQuery);
$(function(){
$(".contextmenu").hide();
$(document).on("contextmenu", function(event) {
    event.preventDefault();
    $(".contextmenu")
    .show()
    .css({top: event.pageY + "px", left: event.pageX + "px"});
}).on("click", function(event) {
    $(".contextmenu").hide();
});
});
/*  Author: Valerio Battaglia (vabatta)
 *  Description: Function to create dialog box. You can have a dialog box open at once.
 *  Version: 1.1b
 *
 *  Params:
 *      title - Title of the dialog box (HTML format)
 *      content - Content of the dialog box (HTML format)
 *      draggable - Set draggable to dialog box, available: true, false (default: false)
 *      overlay - Set the overlay of the page, available: true, false (default: true)
 *      closeButton - Enable or disable the close button, available: true, false (default: false)
 *      buttonsAlign - Align of the buttons, available: left, center, right (default: center)
 *      keepOpened - Keep the window opened after buttons click, available: true, false (default: false)
 *      buttons - Set buttons in the action bar (JSON format)
 *          name - Text of the button (JSON format)
 *              action - Function to bind to the button
 *      position - Set the initial position of the dialog box (JSON format)
 *          zone - Zone of the dialog box, available: left, center, right (default: center)
 *          offsetY - Top offset pixels
 *          offsetX - Left offset pixels
 *
 *  API:
 *      $.Dialog.content() - Getter or setter for the content of opened dialog (HTML format)
 *      $.Dialog.title() - Getter or setter for the title of opened dialog (HTML format)
 *      $.Dialog.buttons() - Setter for the buttons of opened dialog (JSON Format)
 *      $.Dialog.close() - Close, if any, current dialog box
 *
 *   Goal for next versions:
 *      Add style param to set custom css to the dialog box controls
 *      Add possibility to resize window
 *      Create setup with steps
 */


(function($) {
    $.Dialog = function(params) {
        if(!$.Dialog.opened) {
            $.Dialog.opened = true;
        } else {
            return false;
        }

        $.Dialog.settings = params;

        params = $.extend({ 'position': {'zone': 'center'}, 'overlay': true }, params);

        var buttonsHTML = '<div';

        // Buttons position
        if(params.buttonsAlign)
        {
            buttonsHTML += ' style=" float: ' + params.buttonsAlign + ';">';
        } else {
            buttonsHTML += '>';
        }

        $.each(params.buttons, function(name, obj) {
            // Generating the markup for the buttons

            buttonsHTML += '<button>' + name + '</button>';

            if(!obj.action)
            {
                obj.action = function() {};
            }
        });

        buttonsHTML += '</div>';

        var markup = [
            // If overlay is true, set it

            '<div id="dialogOverlay">',
            '<div id="dialogBox" class="dialog">',
            '<div class="header"><span>',
            params.title,'</span>',
            (params.closeButton)?('<div><button><i class="icon-cancel-2"></i></button></div>'):(''),
            '</div>',
            '<div class="content">', params.content, '</div>',
            '<div class="action" id="dialogButtons">',
            buttonsHTML,
            '</div></div></div>'
        ].join('');

        $(markup).hide().appendTo('body').fadeIn();

        if(!params.overlay) {
            $('#dialogOverlay').css('background-color', 'rgba(255, 255, 255, 0)');
        }

        // Setting initial position
        if(params.position.zone == "left")
        {
            $('#dialogBox').css("top", Math.max(0, (($(window).height() - $('#dialogBox').outerHeight()) / 3) +
                                                $(window).scrollTop()) + "px");
            $('#dialogBox').css("left", 0);
        }
        else if(params.position.zone == "right")
        {
            $('#dialogBox').css("top", Math.max(0, (($(window).height() - $('#dialogBox').outerHeight()) / 3) +
                                                $(window).scrollTop()) + "px");
            $('#dialogBox').css("left", Math.max(0, (($(window).width() - $('#dialogBox').outerWidth())) +
                                                            $(window).scrollLeft()) + "px");
        }
        else
        {
            $('#dialogBox').css("top", (params.position.offsetY)?(params.position.offsetY):(Math.max(0, (($(window).height() - $('#dialogBox').outerHeight()) / 3) +
                                                                                                $(window).scrollTop()) + "px"));
            $('#dialogBox').css("left", (params.position.offsetX)?(params.position.offsetX):(Math.max(0, (($(window).width() - $('#dialogBox').outerWidth()) / 2) +
                                                                                                $(window).scrollLeft()) + "px"));
        }

        if(params.draggable) {
            // Make draggable the window

            $('#dialogBox div.header').css('cursor', 'move').on("mousedown", function(e) {
                var $drag = $(this).addClass('active-handle').parent().addClass('draggable');

                var z_idx = $drag.css('z-index'),
                    drg_h = $drag.outerHeight(),
                    drg_w = $drag.outerWidth(),
                    pos_y = $drag.offset().top + drg_h - e.pageY,
                    pos_x = $drag.offset().left + drg_w - e.pageX;

                $drag.css('z-index', 99999).parents().on("mousemove", function(e) {
                    var t = (e.pageY > 0)?(e.pageY + pos_y - drg_h):(0);
                    var l = (e.pageX > 0)?(e.pageX + pos_x - drg_w):(0);

                    if(t >= 0 && t <= window.innerHeight) {
                        $('.draggable').offset({top: t});
                    }
                    if(l >= 0 && l <= window.innerWidth) {
                        $('.draggable').offset({left: l});
                    }

                    $('.draggable').on("mouseup", function() {
                        $(this).removeClass('draggable').css('z-index', z_idx);
                    });
                });
                // disable selection

                e.preventDefault();
            }).on("mouseup", function() {
                $(this).removeClass('active-handle').parent().removeClass('draggable');
            });
        }

        $('#dialogBox .header button').click(function() {
            // Bind close button to close dialog

            $.Dialog.close();
            return false;
        });

        var buttons = $('#dialogBox .action button'),
            i = 0;

        $.each(params.buttons, function(name, obj) {
            buttons.eq(i++).click(function() {
                // Calling function and close the dialog

                var result = obj.action();
                if(!params.keepOpened || result != false) {
                   $.Dialog.close();
                   return false;
                }
            });
        });
    }

    $.Dialog.content = function(newContent) {
        // Prevent using function without dialog opened
        if(!$.Dialog.opened) {
            return false;
        }

        if(newContent) {
            $('#dialogBox .content').html(newContent);
        } else {
            return $('#dialogBox .content').html();
        }
    }

    $.Dialog.title = function(newTitle) {
        // Prevent using function without dialog opened
        if(!$.Dialog.opened) {
            return false;
        }

        if(newTitle) {
            $('#dialogBox .header span').html(newTitle);
        } else {
            return $('#dialogBox .header span').html();
        }
    }

    $.Dialog.buttons = function(newButtons) {
        // Prevent using function without dialog opened or no params
        if(!$.Dialog.opened || !newButtons) {
            return false;
        }

        var buttonsHTML = '<div';

        // Buttons position
        if($.Dialog.settings.buttonsAlign)
        {
            buttonsHTML += ' style=" float: ' + $.Dialog.settings.buttonsAlign + ';">';
        } else {
            buttonsHTML += '>';
        }

        $.each(newButtons, function(name, obj) {
            // Generating the markup for the buttons

            buttonsHTML += '<button>' + name + '</button>';

            if(!obj.action)
            {
                obj.action = function() {};
            }
        });

        buttonsHTML += '</div>';

        $('#dialogButtons').html(buttonsHTML);

        var buttons = $('#dialogBox .action button'),
            i = 0;

        $.each(newButtons, function(name, obj) {
            buttons.eq(i++).click(function() {
                // Calling function and close the dialog

                obj.action();
                if(!$.Dialog.settings.keepOpened) {
                   $.Dialog.close();
                }
                return false;
            });
        });
    }

    $.Dialog.close = function() {
        // Prevent using function without dialog opened
        if(!$.Dialog.opened) {
            return false;
        }

        $('#dialogOverlay').fadeOut(function() {
            $.Dialog.opened = false;
            $(this).remove();
        });
    }
})(jQuery);
(function($){
    $.fn.Dropdown = function( options ){
        var defaults = {
        };

        var $this = $(this)
            ;

        var clearDropdown = function(){
            $(".dropdown-menu").each(function(){
                if ( $(this).css('position') == 'static' ) return;
                $(this).slideUp('fast', function(){});
                $(this).parent().removeClass("active");
            });
        };

        var initSelectors = function(selectors){
        	selectors.off("click.dropdown");
            selectors.on('click.dropdown', function(e){
                //e.stopPropagation();
                //$("[data-role=dropdown]").removeClass("active");
            	if($(e.originalEvent.target).parent().is("[data-role]")) e.stopPropagation();

                clearDropdown();
                $(this).parents("ul").css("overflow", "visible");

                var $m = $(this).children(".dropdown-menu, .sidebar-dropdown-menu");
                $(this).parents("ul").children(".dropdown").children(".dropdown-menu, .sidebar-dropdown-menu").each(function(){
                    if(!$(this).hasClass("keep-opened") && !$m.hasClass("keep-opened")) {
                        $(this).slideUp('fast');
                        $(this).parents("li").removeClass("active");
                    }
                });

                if ($m.css('display') == "block") {
                    $m.slideUp('fast');
                    $(this).removeClass("active");
                } else {
                    $m.slideDown('fast');
                    $(this).addClass("active");
                }
            }).on("mouseleave", function(){
                //$(this).children(".dropdown-menu").hide();
            });
            $('html').on("click", function(e){
            	if(e.originalEvent && $(e.originalEvent.target).parents('[data-role="dropdown"]').length == 0)
            		clearDropdown();
            });
        };

        return this.each(function(){
            if ( options ) {
                $.extend(defaults, options);
            }

            initSelectors($this);
        });
    };

    $(function () {
        $('[data-role="dropdown"]').each(function () {
            $(this).Dropdown();
        });
    });
})(window.jQuery);


(function($){
    $.fn.PullDown = function( options ){
        var defaults = {
        };

        var $this = $(this)
            ;

        var initSelectors = function(selectors){

            selectors.on('click', function(e){
                e.preventDefault();
                var $m = $this.parent().children("ul");
                //console.log($m);
                if ($m.css('display') == "block") {
                    $m.slideUp('fast');
                } else {
                    $m.slideDown('fast');
                }
                //$(this).toggleClass("active");
            });
        };

        return this.each(function(){
            if ( options ) {
                $.extend(defaults, options);
            }

            initSelectors($this);
        });
    };

    $(function () {
        $('.pull-menu, .menu-pull').each(function () {
            $(this).PullDown();
        });
    });
})(window.jQuery);
/**
 * jQuery plugin for input elements for Metro UI CSS framework
 */

(function($) {
    var pluginName = 'Input',
        initAllSelector = '.input-control',
        paramKeys = [];

    $[pluginName] = function(element, options) {
        if (!element) {
            return $()[pluginName]({initAll: true});
        }

        var defaults = {
        };

        var plugin = this;
        plugin.settings = {};
        var $element = $(element);

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);

            if ($element.hasClass('text')) {
                initTextInput();
            } else if ($element.hasClass('password')) {
                initPasswordInput();
            }
        };

        /**
         * initialize text input element behavior
         */
        var initTextInput = function () {
            var $helper,
                input;
            $helper = $element.children('.helper, .btn-clear');

            if (!$helper.get(0)) {
                return;
            }

            $helper.attr('tabindex', '-1');
            $helper.attr('type', 'button');

            // clear text when click on helper
            $helper.on('click', function () {
                input = $element.children('input');
                if (input.prop('readonly')) {
                    return;
                }
                input.val('');
                input.focus();
            });
        };

        /**
         * initialize password input element behavior
         */
        var initPasswordInput = function () {
            var $helper,
                password,
                text;
            $helper = $element.children('.helper, .btn-reveal');
            if (!$helper.get(0)) {
                return;
            }

            text = $('<input type="text" />');
            password = $element.children('input');
            $helper.attr('tabindex', '-1');
            $helper.attr('type', 'button');

            // insert text element and hode password element when push helper
            $helper.on('mousedown', function () {
                password.hide();
                text.insertAfter(password);
                text.val(password.val());
            });

            // return password and remove text element
            $helper.on('mouseup, mouseout', function () {
                text.detach();
                password.show();
                password.focus();
            });
        };

        plugin.init();

    };

    $.fn[pluginName] = function(options) {
        var elements = options && options.initAll ? $(initAllSelector) : this;
        return elements.each(function() {
            var that = $(this),
                params = {},
                plugin;
            if (undefined == that.data(pluginName)) {
                $.each(paramKeys, function(index, key){
                    params[key[0].toLowerCase() + key.slice(1)] = that.data('param' + key);
                });
                plugin = new $[pluginName](this, params);
                that.data(pluginName, plugin);
            }
        });
    };
    // autoinit
    $(function(){
        $()["Input"]({initAll: true});
    });

})(jQuery);
(function($){
    $.fn.PageControl = function( options ){
        var defaults = {
        };

        var $this = $(this)
            , $ul = $this.children("ul")
            , $selectors = $ul.find("li a")
            , $selector = $ul.find(".active a")
            , $frames = $this.find(".frames .frame")
            , $frame = $frames.children(".frame.active")
            ;

        var initSelectors = function(selectors){
            $.each(selectors, function(i, s){
                if ($(s).parent("li").hasClass("active")) {
                    var target = $(s).attr("href");
                    $(target).show();
                }
            })

            selectors.on('click', function(e){
                e.preventDefault();
                var $a = $(this);
                if (!$a.parent('li').hasClass('active')) {
                    $frames.hide();
                    $ul.find("li").removeClass("active");
                    var target = $($a.attr("href"));
                    target.show();
                    $(this).parent("li").addClass("active");
                }
                if ($(this).parent("li").parent("ul").parent(".page-control").find(".menu-pull-bar").is(":visible")) {
                    $(this).parent("li").parent("ul").slideUp("fast", function () {
                        $(this).css("overflow", "").css("display", "");
                    });
                }
            });

            $(".page-control .menu-pull-bar").text($(".page-control ul li.active a").text());
            $(".page-control ul li a").click(function (e) {
                e.preventDefault();
                $(this).parent("li").parent("ul").parent(".page-control").find(".menu-pull-bar").text($(this).text());
            });
        }

        return this.each(function(){
            if ( options ) {
                $.extend(defaults, options)
            }

            initSelectors($selectors);
        });
    }

    $(function () {
        $('[data-role="page-control"]').each(function () {
            $(this).PageControl();
        })
        $(window).resize(function(){
            if ($(window).width() >= 768) {
                $(".page-control ul").css({
                    display: "block"
                    ,overflow: "visible"
                })
            }
            if ($(window).width() < 768 && $(".page-control ul").css("display") == "block") {
                $(".page-control ul").hide();
            }
        })
    })
})(window.jQuery);
/*  Author: Kation
 *  Description: Function to create page list.
 *  Version: 0.1.1
 *
 *  Tutorial:
 *      var page = $("#page").pagelist();
 *      page.total = 10;  //Total pages
 *      page.current = 5;  //Current page
 *      page.showcount = 2;  //Default is 2
 *      page.url = "/List?page={page}";  //Jump url
 *      page.ajax = "#contnet";  //if you want to use ajax, set value to target element, defaul is null
 *      //If you want to use your own template
 *      //page.pageTemplate = '...';
 *      //page.pageSideTemplate = '...';
 *      //page.pageItemTemplate = '...';
 *      //page.pageCurrentTemplate = '...';
 *      //page.pageMoreTemplate = '...';
 *      //page.pageJumpTemplate = '...';
 *      page.create(); //Create page list
 */


(function ($) {
    $.extend($.fn, {
        pagelist: function () {
            //Invoke element
            this.element = $(this);
            //Total Page
            this.total = 1;
            //Current Page
            this.current = 1;
            //Url with {page} parameter
            //Example : /List?page={page}
            this.url = '';
            //If showcount = 2, current = 5, total = 10
            //You will see like this
            //1 ... 3 4 5 6 7 ... 10
            //Show 3 to 7
            this.showcount = 2;
            //Page list Template
            //Must have {previous},{content},{next}
            //Optional {jump}
            this.pageTemplate = '<div class="pagelist"><div class="pagePrevious">{previous}</div><div class="pageContent">{content}</div><div class="pageNext">{next}</div><div class="pageJump">{jump}</div></div>';
            //Previous, Next Button Template
            this.pageSideTemplate = '<a class="button">{page}</a>';
            //Each Page Item Template, 1,2,3,4...
            this.pageItemTemplate = '<a class="tool-button">{page}</a>';
            //Current Page Item Template
            this.pageCurrentTemplate = '<a class="pageCurrent tool-button">{page}</a>';
            //'...' Template
            this.pageMoreTemplate = '<span>...</span>';
            //Jump Template
            //Must have id="pageGoValue", id="pageGo"
            this.pageJumpTemplate = '<input type="text" id="pageGoValue" /><button class="tool-button" id="pageGo"></button>';
            //Ajax target , example : '#content'
            this.ajax = null;
            //Ajax success execute function
            this.ajaxResult = function (pageList, result) {
                $(pageList.ajax).html(result);
            };
            //Display text of buttons
            this.text = {
                previous: 'Previous',
                next: 'Next',
                go: 'Go'
            };
            //Execute when navigate to a page
            this.click = function (pageList, page) {
                var url = pageList.url.replace('{page}', page);
                if (pageList.ajax != null) {
                    $.ajax({
                        url: url,
                        async: true,
                        success: function (result, status) {
                            pageList.ajaxResult(pageList, result);
                        }
                    });
                }
                else {
                    location.href = url;
                }
            };

            var pageContent = null;
            var previousContent = null;
            var nextContent = null;
            var jumpContent = null;
            //Create page list elements.
            this.create = function () {
                var pageDivString = this.pageTemplate.replace('{content}', '<div id="pageContent"/>');
                pageDivString = pageDivString.replace('{previous}', '<div id="pagePrevious"/>');
                pageDivString = pageDivString.replace('{next}', '<div id="pageNext"/>');
                pageDivString = pageDivString.replace('{jump}', '<div id="pageJump"/>');
                var pageDiv = $(pageDivString);
                pageContent = pageDiv.find('#pageContent').parent();
                previousContent = pageDiv.find('#pagePrevious').parent();
                nextContent = pageDiv.find('#pageNext').parent();
                if (pageDiv.find('#pageJump').length != 0)
                    jumpContent = pageDiv.find('#pageJump').parent();
                rebuildPage(pageContent, previousContent, nextContent, jumpContent, this);
                this.element.append(pageDiv);
            }

            //Navigate function
            this.navigateTo = function (page) {
                if (page == '-1') {
                    if (this.current == 1) {
                        return false;
                    }
                    this.current--;
                }
                else if (page == '+1') {
                    if (this.current == this.total) {
                        return false;
                    }
                    this.current++;
                }
                else {
                    try
                    {
                        var val = Math.round(new Number(page));
                        if (val < 1 || val > this.total || isNaN(val))
                            return false;
                        this.current = val;
                    }
                    catch (err) {

                    }
                }
                if (this.ajax != null) {
                    rebuildPage(pageContent, previousContent, nextContent, jumpContent, this);
                }
                this.click(this, this.current);
                return true;
            }

            return this;
        }
    });

    function rebuildPage(pageContent, previousContent, nextContent, jumpContent, pagelist) {
        var previous = createPage('-1', pagelist.text.previous, pagelist.pageSideTemplate);
        previous.click(function () {
            var page = $(this).attr('data-page');
            pagelist.navigateTo(page);
        });
        var next = createPage('+1', pagelist.text.next, pagelist.pageSideTemplate);
        next.click(function () {
            var page = $(this).attr('data-page');
            pagelist.navigateTo(page);
        });
        pageContent.html('');
        previousContent.html('');
        nextContent.html('');
        if (jumpContent != null)
            jumpContent.html('');

        previousContent.append(previous);

        if (pagelist.current - pagelist.showcount > 1) {
            var first = createPage('1', '1', pagelist.pageItemTemplate);
            first.click(function () {
                var page = $(this).attr('data-page');
                pagelist.navigateTo(page);
            });
            pageContent.append(first);
            pageContent.append($(pagelist.pageMoreTemplate));
        }

        var start = pagelist.current - pagelist.showcount;
        var stop = pagelist.current + pagelist.showcount;
        if (start < 1) {
            stop += 1 - start;
            start = 1;
        }
        if (stop > pagelist.total) {
            start -= stop - pagelist.total;
            stop = pagelist.total;
        }
        for (var i = start; i <= stop; i++) {
            if (i < 1 || i > pagelist.total) {
                continue;
            }
            var page
            if (i == pagelist.current) {
                page = createPage(i, i, pagelist.pageCurrentTemplate);
            } else {
                page = createPage(i, i, pagelist.pageItemTemplate);
            }
            page.click(function () {
                var page = $(this).attr('data-page');
                pagelist.navigateTo(page);
            });
            pageContent.append(page);
        }

        if (pagelist.current + pagelist.showcount < pagelist.total) {
            var last = createPage(pagelist.total, pagelist.total, pagelist.pageItemTemplate);
            last.click(function () {
                var page = $(this).attr('data-page');
                pagelist.navigateTo(page);
            });
            pageContent.append($(pagelist.pageMoreTemplate));
            pageContent.append(last);
        }
        nextContent.append(next);
        if (jumpContent != null) {
            jumpContent.html(pagelist.pageJumpTemplate);
            var pageGoValue = jumpContent.find("#pageGoValue");
            var pageGo = jumpContent.find("#pageGo");
            pageGo.html(pagelist.text.go);
            pageGo.click(function () {
                var result = pagelist.navigateTo(pageGoValue.val());
                if (result == false) {
                    $.Dialog({
                        'title': 'Jump Page',
                        'content': 'Your input a invalid value.',
                        'draggable': true,
                        'overlay': true,
                        'closeButton': false,
                        'buttonsAlign': 'right',
                        'position': {
                            'zone': 'center'
                        },
                        'buttons': {
                            'OK': {
                                'action': function () {
                                    pageGoValue.val('');
                                }
                            }
                        }
                    });
                }
            });
        }
    }

    function createPage(page, name, template) {
        var content = template.replace('{page}', name);
        var a = $(content);
        a.attr('data-page', page);
        return a;
    }
}(jQuery));
/**
 * jQuery plugin for rating component of MetroUiCss framework
 * use attribute data-role="rating" or class="rating" to initialize rating plugin for some element
 * or use $(ratingElement).rating({parameters})
 *
 * available parameters (attributes):
 * data-role-stars="integer" stars count for this rating element (default 5)
 * data-role-rating="integer" current average rating (default 0)
 * data-role-vote="string" ('on' or 'off') (default 'on')
 *
 * to control rating you can use:
 * $('ratingID').RatingValue(float)                 - set rating
 * $('ratingID').RatingValue()                      - return rating
 * $('ratingID').RatingPercents(0 < float < 100)    - set rating by percents
 * $('ratingID').RatingPercents()                   - return rating percents
 * $('ratingID').RatingVote(true or 'on')           - set vote=on rating mode
 * $('ratingID').RatingVote(false or 'off')         - set vote=off rating mode
 */

(function($) {
    var pluginName = 'Rating',
        initAllSelector = '[data-role=rating], .rating',
        paramKeys = ['Stars', 'Rating', 'Vote'];

    $[pluginName] = function(element, options) {
        if (!element) {
            return $()[pluginName]({initAll: true});
        }

        var defaults = {
            // stars count
            stars:      5,
            // init value
            rating:     0,
            // voting mode
            vote:       'on'

        };

        var plugin = this;

        plugin.settings = {};

        var $element = $(element),
            starElements = [],
            $starElements,
            $innerElement, // for vote=off mode
            currentRating;

        plugin.init = function() {

            plugin.settings = $.extend({}, defaults, options);

            currentRating = plugin.settings.rating;

            if (plugin.settings.vote === 'on') {
                voteOnInit();
            } else {
                voteOffInit();
            }

        };

        /**
         * public methods to set and get rating (value, percent)
         * use it like this: $('#ratingElementID').data('Rating').setRating(4)
         */
        plugin.setRating = function (rating) {
            setRating(rating);
            return rating;
        };
        plugin.setRatingPercents = function (ratingPercents) {
            setRating((ratingPercents / 100) * plugin.settings.stars);
            return ratingPercents;
        };
        plugin.getRating = function () {
            return currentRating;
        };
        plugin.getRatingPercents = function () {
            return currentRating / plugin.settings.stars * 100;
        };
        /**
         * public method for change vote mode
         */
        plugin.voteOn = function () {
            plugin.settings.vote = 'on';
            voteOnInit();
        };
        plugin.voteOff = function () {
            plugin.settings.vote = 'off';
            voteOffInit();
        };


        /**
         * init vote=off mode rating
         */
        var voteOffInit = function () {

            var width,
                settings = plugin.settings;

            $element.empty();

            // special class for vote=off mode
            $element.addClass('static-rating');

            width = ($element.hasClass('small') ? '14' : '27') * settings.stars;
            $element.css('width', width);

            $innerElement = $('<div class="rating-value"></div>');
            $innerElement.appendTo($element);

            setRating(currentRating);

        };

        /**
         * init vote=on mode rating
         */
        var voteOnInit = function () {
            var settings = plugin.settings,
                a, i;

            $element.empty();
            $element.removeClass('static-rating');

            // create stars (count starts from 1)
            for (i = 1; i <= settings.stars; i++) {
                a = starElements[i] = $('<a href="javascript:void(0)"></a>');
                a.data('starIndex', i);
                a.appendTo($element);
            }

            // event handlers for voting
            $starElements = $element.find('a');

            $starElements.on('mouseenter', function () {
                var index = $(this).data('starIndex');
                lightStars(0, true);
                lightStars(index);
                $element.trigger('hovered', [index]);
            });
            $starElements.on('mouseleave', function () {
                lightStars(0);
                lightStars(currentRating, true);
            });
            $starElements.on('click', function(){
                var index = $(this).data('starIndex');
                currentRating = index;
                $element.trigger('rated', [index]);
            });

            setRating(currentRating);
        };

        /**
         * make stars fired (from first to (starIndex - 1))
         * or turn off stars if starIndex = 0
         * @param starIndex
         * @param rated if true - add 'rated' class, else 'hover'
         */
        var lightStars = function (starIndex, rated) {
            var class_ = rated ? 'rated' : 'hover';
            starIndex = Math.round(starIndex);
            $starElements.removeClass(class_);
            $starElements.filter(':lt(' + starIndex + ')').addClass(class_);
        };

        /**
         * light stars and store rating
         * @param rating
         */
        var setRating = function (rating) {
            var settings = plugin.settings,
                percents;
            currentRating = rating;
            if (settings.vote === 'on') {
                lightStars(rating, true);
            } else {
                percents = rating / settings.stars * 100;
                $innerElement.css('width', percents + '%');
            }

        };

        plugin.init();

    };

    /**
     * get or set rating value to/from first element in set
     */
    $.fn.RatingValue = function(value) {
        var ratingPlugin = $(this.get(0)).data('Rating');
        if (typeof ratingPlugin !== 'undefined') {
            if (typeof value !== 'undefined') {
                return ratingPlugin.setRating(value);
            } else {
                return ratingPlugin.getRating();
            }
        }
    };
    /**
     * get or set rating percents to/from first element in set
     */
    $.fn.RatingPercents = function(value) {
        var ratingPlugin = $(this.get(0)).data('Rating');
        if (typeof ratingPlugin !== 'undefined') {
            if (typeof value !== 'undefined') {
                return ratingPlugin.setRatingPercents(value);
            } else {
                return ratingPlugin.getRatingPercents();
            }
        }
    };

    /**
     * changes rating mode
     */
    $.fn.RatingVote = function(vote) {
        var ratingPlugin = $(this.get(0)).data('Rating');
        if (typeof ratingPlugin !== 'undefined') {
            if (vote === true || vote === 'on') {
                ratingPlugin.voteOn();
            } else if (vote === false || vote === 'off') {
                ratingPlugin.voteOff();
            }
        }
    };

    $.fn[pluginName] = function(options) {
        var elements = options && options.initAll ? $(initAllSelector) : this;
        return elements.each(function() {
            var that = $(this),
                params = {},
                plugin;
            if (undefined == that.data(pluginName)) {
                $.each(paramKeys, function(index, key){
                    params[key[0].toLowerCase() + key.slice(1)] = that.data('param' + key);
                });
                plugin = new $[pluginName](this, params);
                that.data(pluginName, plugin);
            }
        });
    };
    // autoinit
    $(function(){
        $()[pluginName]({initAll: true});
    });

})(jQuery);
/**
 * Slider - jQuery plugin for MetroUiCss framework
 *
 * there is "change" event triggering when marker moving
 * and "changed" event when stop moving
 *
 * you may use this code to handle events:

$(window).ready(function(){
    $('.slider').on('change', function(e, val){
        console.log('change to ' + val);
    }).on('changed', function(e, val){
        console.log('changed to ' + val);
    });
});

 * and this, to retrieve value

$('.slider').data('value')

 *
 */


(function($) {

    var pluginName = 'Slider',
        initAllSelector = '[data-role=slider], .slider',
        paramKeys = ['InitValue', 'Accuracy'];

    $[pluginName] = function(element, options) {
        if (!element) {
            return $()[pluginName]({initAll: true});
        }

        // default settings
        var defaults = {
            // start value of slider
            initValue: 0,
            // accuracy
            accuracy: 1
        };

        var plugin = this;
        plugin.settings = {};

        var $element = $(element); // reference to the jQuery version of DOM element

        var complete, // complete part element
            marker, // marker element
            currentValuePerc, // current percents count
            sliderLength,
            sliderOffset,
            sliderStart,
            sliderEnd,
            percentPerPixel,
            markerSize,
            vertical = false;

        // initialization
        plugin.init = function () {

            plugin.settings = $.extend({}, defaults, options);

            // create inside elements
            complete = $('<div class="complete"></div>');
            marker = $('<div class="marker"></div>');

            complete.appendTo($element);
            marker.appendTo($element);

            vertical = $element.hasClass('vertical');

            initGeometry();

            // start value
            currentValuePerc = correctValuePerc(plugin.settings.initValue);
            placeMarkerByPerc(currentValuePerc);

            // init marker handler
            marker.on('mousedown', function (e) {
                e.preventDefault();
                startMoveMarker(e);
            });

            $element.on('mousedown', function (e) {
                e.preventDefault();
                startMoveMarker(e);
            });

        };

        /**
         * correct percents using "accuracy" parameter
         */
        var correctValuePerc = function (value) {
            var accuracy = plugin.settings.accuracy;
            if (accuracy === 0) {
                return value;
            }
            if (value === 100) {
                return 100;
            }
            value = Math.floor(value / accuracy) * accuracy + Math.round(value % accuracy / accuracy) * accuracy;
            if (value > 100) {
                return 100;
            }
            return value;
        };

        /**
         * convert pixels to percents
         */
        var pixToPerc = function (valuePix) {
            var valuePerc;
            valuePerc = valuePix * percentPerPixel;
            return correctValuePerc(valuePerc);
        };

        /**
         * convert percents to pixels
         */
        var percToPix = function (value) {
            if (percentPerPixel === 0) {
                return 0;
            }
            return value / percentPerPixel;
        };

        /**
         * place marker
         */
        var placeMarkerByPerc = function (valuePerc) {
            var size, size2;

            if (vertical) {
                size = percToPix(valuePerc) + markerSize;
                size2 = sliderLength - size;
                marker.css('top', size2);
                complete.css('height', size);
            } else {
                size = percToPix(valuePerc);
                marker.css('left', size);
                complete.css('width', size);
            }

        };

        /**
         * when mousedown on marker
         */
        var startMoveMarker = function (e) {
            // register event handlers
            $(document).on('mousemove.sliderMarker', function (event) {
                movingMarker(event);
            });
            $(document).on('mouseup.sliderMarker', function () {
                $(document).off('mousemove.sliderMarker');
                $(document).off('mouseup.sliderMarker');
                $element.data('value', currentValuePerc);
                $element.trigger('changed', [currentValuePerc]);
            });

            initGeometry();

            movingMarker(e)
        };

        /**
         * some geometry slider parameters
         */
        var initGeometry = function () {
            if (vertical) {
                sliderLength = $element.height(); // slider element length
                sliderOffset = $element.offset().top; // offset relative to document edge
                markerSize = marker.height();
            } else {
                sliderLength = $element.width();
                sliderOffset = $element.offset().left;
                markerSize = marker.width();

            }

            percentPerPixel = 100 / (sliderLength - markerSize); // it depends on slider element size
            sliderStart = markerSize / 2;
            sliderEnd = sliderLength - markerSize / 2;
        };

        /**
         * moving marker
         */
        var movingMarker = function (event) {
            var cursorPos,
                percents,
                valuePix;

            // cursor position relative to slider start point
            if (vertical) {
                cursorPos = event.pageY - sliderOffset;
            } else {
                cursorPos = event.pageX - sliderOffset;
            }

            // if outside
            if (cursorPos < sliderStart) {
                cursorPos = sliderStart;
            } else if (cursorPos > sliderEnd) {
                cursorPos = sliderEnd;
            }

            // get pixels count
            if (vertical) {
                valuePix = sliderLength - cursorPos - markerSize / 2;
            } else {
                valuePix = cursorPos - markerSize / 2;
            }

            // convert to percent
            percents = pixToPerc(valuePix);

            // place marker
            placeMarkerByPerc(percents);

            currentValuePerc = percents;

            $element.trigger('change', [currentValuePerc]);
        };

        // public methods

        /**
         * if argument value is defined - correct it, store, place marker and return corrected value
         * else just return current value
         * you can use it like this: $('.slider').data('slider').val(38)
         * @param value (percents)
         */
        plugin.val = function (value) {
            if (typeof value !== 'undefined') {
                currentValuePerc = correctValuePerc(value);
                placeMarkerByPerc(currentValuePerc);
                return currentValuePerc;
            } else {
                return currentValuePerc;
            }
        };

        plugin.init();

    };

    $.fn[pluginName] = function(options) {
        var elements = options && options.initAll ? $(initAllSelector) : this;
        return elements.each(function() {
            var that = $(this),
                params = {},
                plugin;
            if (undefined == that.data(pluginName)) {
                $.each(paramKeys, function(index, key){
                    params[key[0].toLowerCase() + key.slice(1)] = that.data('param' + key);
                });
                plugin = new $[pluginName](this, params);
                that.data(pluginName, plugin);
            }
        });
    };
    // autoinit
    $(function(){
        $()[pluginName]({initAll: true});
    });

})(jQuery);
/**
 * use this plugin if you want to make tiled menu like windows 8 start menu
 * what plugin needs for?
 * it needs for following elements structure
 *  <div class="page">
 *      <div class="tiles">
 *          <div class="tile-group">
 *              <div class="tile"></div>
 *              <div class="tile"></div>
 *              .........
 *              <div class="tile"></div>
 *          </div>
 *      </div>
 *  </div>
 *
 * if you do some changes, for example, move tile from one group, you have to use
 * $('.tiles').trigger('changed')
 * and all tiles will placed to own place
 */

(function($) {

    $.StartMenu = function(element, options) {

        var $startMenu,
            plugin = this,
            maxGroupHeight;

        plugin.init = function() {
            var resizeTimer;

            $startMenu = $('.tiles');

            addMouseWheel();
            setPageWidth();
            tuneUpStartMenu(); // need twice

            $(window).on('resize', function(){
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function(){
                    tuneUpStartMenu();
                }, 200);
            });
            $startMenu.on('changed', function(){
                tuneUpStartMenu();
            });
        };

        /**
         * called on init
         * and on resize window
         * and any tiles moves
         */
        var tuneUpStartMenu = function () {
            var $groups = $startMenu.find('.tile-group');
            if ($groups.length === 0) {
                return;
            }

            maxGroupHeight = $(window).height() - $($groups.get(0)).offset().top;

            $groups.each(function(index, group){
                var $group = $(group);
                // finding min width for group
                var groupWidth = 0;
                var $tiles = $group.find('.tile');
                if ($tiles.length === 0) {
                    return;
                }
                // finding min width according to the widest tile
                $tiles.each(function(index, tile){
                    var $tile = $(tile);
                    var tileWidth = 161;
                    if ($tile.hasClass('double')) {
                        tileWidth = 322;
                    } else if ($tile.hasClass('triple')) {
                        tileWidth = 483;
                    } else if ($tile.hasClass('quadro')) {
                        tileWidth = 644;
                    }

                    if (tileWidth > groupWidth) {
                        groupWidth = tileWidth;
                    }
                });

                $group.css({
                    width: 'auto',
                    maxWidth: groupWidth
                });

                var counter, groupHeight_,
                groupHeight = $group.height();
                while (groupHeight > maxGroupHeight) {
                    if (counter > $tiles.length) { // protection from endless loop
                        break;
                    } else if (groupHeight === groupHeight_) {
                        counter++;
                    } else {
                        counter = 1;
                    }
                    groupHeight_ = groupHeight;
                    groupWidth += 161;
                    $group.css({
                        'maxWidth': groupWidth
                    });
                    groupHeight = $group.height();
                }
            });

            setPageWidth();
        };

        var setPageWidth = function () {
            var tilesWidth = 0;

            $startMenu.find(".tile-group").each(function(){
                tilesWidth += $(this).outerWidth() + 80;
            });

            $startMenu.css("width", 120 + tilesWidth + 20);

            $(".page").css('width', '').css({
                width: $(document).width()
            });
        };

        var addMouseWheel = function (){
            $("body").mousewheel(function(event, delta){
                var scroll_value = delta * 50;
                $(document).scrollLeft($(document).scrollLeft() - scroll_value);
                return false;
            });
        };

        plugin.init();

    };

    $.fn.StartMenu = function(options) {

        return this.each(function() {
            if (undefined == $(this).data('StartMenu')) {
                var plugin = new $.StartMenu(this, options);
                $(this).data('StartMenu', plugin);
            }
        });
    };

})(jQuery);

$(function(){
    $.StartMenu();
});
/**
 * drag'n'drop plugin
 *
 * this plugin allows to drag tiles between groups
 *
 * this plugin auto enabled to 'tile-group' elements
 * or elements with attribute data-role="tile-group"
 *
 * to handle drag/drop events use next code
 *

 $(function(){
    $('#tile_group_id').on('drag', function(e, draggingTile, parentGroup){
       ... your code ...
    });
    $('#tile_group_id').on('drop', function(e, draggingTile, targetGroup){
        ... your code ...
    });
});

 *
 */

(function($) {

    $.TileDrag = function(element, options) {

        var defaults = {};

        var plugin = this;

        plugin.settings = {};

        var $element = $(element),
            $startMenu,
            $groups,
            settings,
            tiles,
            $draggingTile,
            $parentGroup, // parent group for dragging tile
            draggingTileWidth,
            draggingTileHeight,
            $phantomTile,
            tileDeltaX,
            tileDeltaY,
            tilesCoordinates,
            tileSearchCount = 0, // uses for findTileUnderCursor function
            tileUnderCursorIndex,
            tileUnderCursorSide,
            newGroupsCoordinates,
            newGroupSearchCount = 0,
            newGroupPhantom,
            targetType, // 'new' or 'existing' group
            groupsMaxHeight,
            mouseMoved,
            tileDragTimer,
            tileStartDragTimer;

        plugin.init = function() {
            settings = plugin.settings = $.extend({}, defaults, options);

            $startMenu = $('.tiles');

            // search other 'tile-group' elements
            $groups = $('[data-role=tile-group], .tile-group');

            // select all tiles within group
            tiles = $groups.children('.tile');

            tiles.on('mousedown', function(event) {
                event.preventDefault();
                clearTimeout(tileStartDragTimer);
                var el = $(this);
                tileStartDragTimer = setTimeout(function() {
                    startDrag(el, event);
                }, 1000);
            }).on('mouseup mouseout', function() {
                clearTimeout(tileStartDragTimer);
            });

            //tiles.on('mousedown', startDrag);
        };

        var startDrag = function(el, event) {
            var $tile,
                tilePosition,
                tilePositionX,
                tilePositionY;

            event.preventDefault();

            // currently dragging tile
            $tile = $draggingTile = el;
            //$tile.animate({"width": "-=20px", "height": "-=20px"}, "fast").animate({"width": "+=20px", "height": "+=20px"}, "fast");

            // dragging tile dimentions
            draggingTileWidth = $tile.outerWidth();
            draggingTileHeight = $tile.outerHeight();

            // hidden tile to place it where dragging tile will dropped
            $phantomTile = $('<div></div>');
            $phantomTile.css({
                'background': 'none'
            });
            $phantomTile.addClass('tile');
            if ($tile.hasClass('double')) {
                $phantomTile.addClass('double');
            } else if ($tile.hasClass('triple')) {
                $phantomTile.addClass('triple');
            } else if ($tile.hasClass('quadro')) {
                $phantomTile.addClass('quadro');
            }
            if ($tile.hasClass('double-vertical')) {
                $phantomTile.addClass('double-vertical');
            } else if ($tile.hasClass('triple-vertical')) {
                $phantomTile.addClass('triple-vertical');
            } else if ($tile.hasClass('quadro-vertical')) {
                $phantomTile.addClass('quadro-vertical');
            }

            // place phantom tile instead dragging one
            $phantomTile.insertAfter($tile);
            targetType = 'existing';

            // search parent group
            $parentGroup = $tile.parents('.tile-group');

            // dragging tile position within group
            tilePosition = $tile.offset();
            tilePositionX = tilePosition.left - (event.pageX - event.clientX);
            tilePositionY = tilePosition.top - (event.pageY - event.clientY);

            // pixels count between cursor and dragging tile border
            tileDeltaX = event.clientX - tilePositionX;
            tileDeltaY = event.clientY - tilePositionY;

            // move tile element to $draggingTileContainer
            $tile.detach();
            $tile.insertAfter($($groups.get(-1))); // it need for invalid IE z-index

            // from now it fixed positioned
            $tile.css({
                'position':     'fixed',
                'left':         tilePositionX,
                'top':          tilePositionY,
                'z-index':      100000
            });

            // store it for future
            $tile.data('dragging', true);
            storeTilesCoordinates();
            storeNewGroupsCoordinates();

            // some necessary event handlers
            $(document).on('mousemove.tiledrag', dragTile);
            $(document).one('mouseup.tiledrag', dragStop);

            mouseMoved = false;

            // triggering event
            $groups.trigger('drag', [$draggingTile, $parentGroup]);
        };

        /**
         * it function called on every mousemove event
         */
        var dragTile = function (event) {
            mouseMoved = true;

            event.preventDefault();

            // move dragging tile
            $draggingTile.css({
                'left': event.clientX - tileDeltaX,
                'top':  event.clientY - tileDeltaY
            });

            clearTimeout(tileDragTimer);
            tileDragTimer = setTimeout(function(){
                findPlace(event);
            }, 50);
        };

        // finding place where put dragging tile
        var findPlace = function (event) {
            // all we need is index of tile under cursor (and under dragging tile) if it exists
            var findTileIndex,
                findNewGroup;

            findTileIndex = findTileUnderCursor(event);
            if (findTileIndex) {
                clearPlaceForTile($(tiles[findTileIndex]));
            } else {
                findNewGroup = findNewGroupUnderCursor(event);
                if (findNewGroup) {
                    showNewGroupPhantom(findNewGroup.group, findNewGroup.side);
                }
            }
        };

        /**
         * when this function called dragging tile dropping to clear place (instead phantom tile)
         * removing events
         * and some other necessary changes
         */
        var dragStop = function (event) {
            var targetGroup;

            if (!mouseMoved) {
                // emulate default click behavior
                if ($draggingTile.is('a')) {
                    if ($draggingTile.prop('target') === '_blank') {
                        window.open($draggingTile.attr('href'));
                    } else {
                        window.location.href = $draggingTile.attr('href');
                    }
                }
            } else {
                event.preventDefault();
            }

            clearTimeout(tileDragTimer);
            findPlace(event);

            $draggingTile.detach();
            // it is two way now: drop to existing group or drop to new group
            // first drop to existing group
            if (targetType === 'existing') {
                $draggingTile.insertAfter($phantomTile);
                targetGroup = $phantomTile.parents('.tile-group');
                $phantomTile.remove();
            } else {
                newGroupPhantom.css({
                    'backgroundColor': '',
                    'width': 'auto',
                    'max-width': '322px',
                    'height': ''
                });
                $draggingTile.appendTo(newGroupPhantom);
                targetGroup = newGroupPhantom;
                newGroupPhantom = undefined;
            }

            // remove parent group if it was a last tile there
            if ($parentGroup.find('.tile').length === 0) {
                $parentGroup.remove();
            }

            $draggingTile.css({
                'position': '',
                'left':     '',
                'top':      '',
                'z-index':  ''
            });

            $draggingTile.data('dragging', false);
            $(document).off('mousemove.tiledrag');

            $groups = $('[data-role=tile-group], .tile-group');
            $groups.trigger('drop', [$draggingTile, targetGroup]);

            $startMenu.trigger('changed');
        };

        /*
         * stores tiles coordinates for future finding one tile under cursor
         * excluding current dragging tile
         */
        var storeTilesCoordinates = function () {
            tilesCoordinates = {};
            tiles.each(function (index, tile) {
                var $tile, offset;

                $tile = $(tile);

                // we dont need dragging tile coordinates
                if ($tile.data('dragging')) return;

                offset = $tile.offset();
                // it is not real coordinates related to document border
                // but corrected for less computing during dragging (tile moving)
                tilesCoordinates[index] = {
                    x1: offset.left + tileDeltaX - draggingTileWidth / 2,
                    y1: offset.top + tileDeltaY - draggingTileHeight / 2,
                    x2: offset.left + $tile.outerWidth() + tileDeltaX - draggingTileWidth / 2,
                    y2: offset.top + $tile.outerHeight() + tileDeltaY - draggingTileHeight / 2
                }
            });
        };

        /**
         * if tile dragging under this place it will creating new group there
         */
        var storeNewGroupsCoordinates = function () {
            groupsMaxHeight = 0;
            newGroupsCoordinates = [];
            $groups.each(function(index){
                var offset,
                    width,
                    height,
                    $group;

                $group = $(this);

                offset = $group.offset();

                width = $group.width();
                height = $group.height();

                // make it possible to insert new group before first one
                if (index === 0) {
                    newGroupsCoordinates.push({
                        x1: offset.left - 70 + tileDeltaX - draggingTileWidth / 2,
                        x2: offset.left + tileDeltaX - draggingTileWidth / 2,
                        y1: offset.top + tileDeltaY - draggingTileHeight / 2,
                        y2: offset.top + height + tileDeltaY - draggingTileHeight / 2,
                        side: 'before',
                        group: $group
                    });
                }

                newGroupsCoordinates.push({
                    x1: offset.left + width + tileDeltaX - draggingTileWidth / 2,
                    x2: offset.left + width + 70 + tileDeltaX - draggingTileWidth / 2,
                    y1: offset.top + tileDeltaY - draggingTileHeight / 2,
                    y2: offset.top + height + tileDeltaY - draggingTileHeight / 2,
                    side: 'after',
                    group: $group
                });

                if (groupsMaxHeight < height) {
                    groupsMaxHeight = height;
                }

            });
        };

        /**
         * search tile under cursor using tileCoordinates from storeTilesCoordinates function
         * search occurred only one time per ten times for less load and more smooth
         */
        var findTileUnderCursor = function (event) {
            var i, coord,
                tileIndex = false,
                tileSide;

            for (i in tilesCoordinates) {
                if (!tilesCoordinates.hasOwnProperty(i)) return;
                coord = tilesCoordinates[i];
                if (coord.x1 < event.pageX && event.pageX < coord.x2 && coord.y1 < event.pageY && event.pageY < coord.y2) {
                    tileIndex = i;
                    break;
                }
            }

            // detect side of tile (left or right) to clear place before or after tile
            if (tileIndex) {
                if (event.pageX < coord.x1 + $(tiles[tileIndex]).outerWidth() / 2) {
                    tileSide = 'before';
                } else {
                    tileSide = 'after';
                }
            }
            if (tileSide === tileUnderCursorSide && tileIndex === tileUnderCursorIndex) {
                return false;
            }
            tileUnderCursorSide = tileSide;
            tileUnderCursorIndex = tileIndex;

            return tileIndex;
        };

        var findNewGroupUnderCursor = function (event) {
            var i, coord, newGroup = false;

            for (i in newGroupsCoordinates) {
                if (!newGroupsCoordinates.hasOwnProperty(i)) return;
                coord = newGroupsCoordinates[i];
                if (coord.x1 < event.pageX && event.pageX < coord.x2 && coord.y1 < event.pageY && event.pageY < coord.y2) {
                    newGroup = coord;
                    break;
                }
            }

            if (!newGroup) {
                return false;
            } else {
                return newGroup;
            }
        };

        /**
         * just put phantom tile near tile under cursor (before or after)
         * and remove previous phantom tile
         */
        var clearPlaceForTile = function ($tileUnderCursor) {
            var $oldPhantomTile,
                $newParentGroup;

            $oldPhantomTile = $phantomTile;
            $phantomTile = $oldPhantomTile.clone();
            targetType = 'existing';

            // before or after, this is question ...
            if (tileUnderCursorSide === 'before') {
                $phantomTile.insertBefore($tileUnderCursor);
            } else {
                $phantomTile.insertAfter($tileUnderCursor);
            }

            if (newGroupPhantom) {
                newGroupPhantom.remove();
            }
            $oldPhantomTile.remove();

            // check if it was last tile in group and it drag out
            if ($parentGroup.find('.tile').length === 0) {
                $newParentGroup = $tileUnderCursor.parent('.tile-group');
                if ($parentGroup[0] !== $newParentGroup[0]) {
                    // and if it true, make parent group invisible
                    $parentGroup.css({
                        'width': 0,
                        'margin': 0
                    });
                }
            }

            $startMenu.trigger('changed');
            storeAllNecessaryCoordinates();
        };

        /**
         * makes visible new group place
         * @param relGroup relative group
         * @param side 'after' or 'before'
         */
        var showNewGroupPhantom = function (relGroup, side) {
            if ($phantomTile) {
                $phantomTile.remove()
            }
            if (newGroupPhantom) {
                newGroupPhantom.remove();
            }

            newGroupPhantom = $('<div class="tile-group"></div>');
            newGroupPhantom.css({
                'height': groupsMaxHeight,
                'width': '70px',
                'backgroundColor': '#333333',
                'position': 'relative'
            });
            relGroup[side](newGroupPhantom);
            targetType = 'new';

            // check if it was last tile in group and it drag out
            if ($parentGroup.find('.tile').length === 0) {
                $parentGroup.css({
                    'width': 0,
                    'margin': 0
                });
            }

            $startMenu.trigger('changed');
            storeAllNecessaryCoordinates();
        };

        var storeAllNecessaryCoordinates = function () {
            storeTilesCoordinates();
            storeNewGroupsCoordinates();
        };

        // return all groups involved to this plugin
        plugin.getGroups = function () {
            return $groups;
        };

        plugin.init();

    };

    $.fn.TileDrag = function(options) {

        //this.each(function() {
        var group = $(this[0]);
        if (undefined == group.data('TileDrag')) {
            var plugin = new $.TileDrag(group, options);
            var $groups = plugin.getGroups();
            $groups.data('TileDrag', plugin);
        }
        //});

    };

})(jQuery);

$(function(){
    var allTileGroups = $('[data-role=tile-group], .tile-group');
    if (allTileGroups.length > 0) {
        $(allTileGroups).TileDrag({});
    }
});
$.easing.doubleSqrt = function(t, millisecondsSince, startValue, endValue, totalDuration) {
    var res = Math.sqrt(Math.sqrt(t));
    return res;
};

(function($) {

    $.tileBlockSlider = function(element, options) {

        // 薪邪褋褌褉芯泄泻懈 锌芯 褍屑芯谢褔邪薪懈褞
        var defaults = {
            // 锌械褉懈芯写 褋屑械薪褘 泻邪褉褌懈薪芯泻
            period: 2000,
            // 锌褉芯写芯谢卸懈褌械谢褜薪芯褋褌褜 邪薪懈屑邪褑懈懈
            duration: 1000,
            // 薪邪锌褉邪胁谢械薪懈械 邪薪懈屑邪褑懈懈 (up, down, left, right)
            direction: 'up'
        };
        // 芯斜褗械泻褌 锌谢邪谐懈薪邪
        var plugin = this;
        // 薪邪褋褌褉芯泄泻懈 泻芯薪泻褉械褌薪芯谐芯 芯斜褗械泻褌邪
        plugin.settings = {};

        var $element = $(element), // reference to the jQuery version of DOM element
            element = element;    // reference to the actual DOM element

        var blocks, // 胁褋械 泻邪褉褌懈薪泻懈
            currentBlockIndex, // 懈薪写械泻褋 褌械泻褍褖械谐芯 斜谢芯泻邪
            slideInPosition, // 褋褌邪褉褌芯胁芯械 锌芯谢芯卸械薪懈械 斜谢芯泻邪 锌械褉械写 薪邪褔邪谢芯屑 锌芯褟胁谢械薪懈褟
            slideOutPosition, // 褎懈薪邪谢褜薪芯械 锌芯谢芯卸械薪懈械 斜谢芯泻邪 锌褉懈 褋泻褉褘褌懈懈
            tileWidth, // 褉邪蟹屑械褉褘 锌谢懈褌泻懈
            tileHeight;

        // 懈薪懈褑懈邪谢懈蟹懈褉褍械屑
        plugin.init = function () {

            plugin.settings = $.extend({}, defaults, options);

            // 胁褋械 斜谢芯泻懈
            blocks = $element.children(".tile-content");

            // 械褋谢懈 斜谢芯泻 胁褋械谐芯 1, 褌芯 褋谢邪泄写懈薪谐 薪械 薪褍卸械薪
            if (blocks.length <= 1) {
                return;
            }

            // 懈薪写械泻褋 邪泻褌懈胁薪芯谐芯 胁 写邪薪薪褘泄 屑芯屑械薪褌 斜谢芯泻邪
            currentBlockIndex = 0;

            // 褉邪蟹屑械褉褘 褌械泻褍褖械泄 锌谢懈褌泻懈
            tileWidth = $element.innerWidth();
            tileHeight = $element.innerHeight();
            // 锌芯谢芯卸械薪懈械 斜谢芯泻芯胁
            slideInPosition = getSlideInPosition();
            slideOutPosition = getSlideOutPosition();

            // 锌芯写谐芯褌邪胁谢懈胁邪械屑 斜谢芯泻懈 泻 邪薪懈屑邪褑懈懈
            blocks.each(function (index, block) {
                block = $(block);
                // 斜谢芯泻懈 写芯谢卸薪褘 斜褘褌褜 position:absolute
                // 胁芯蟹屑芯卸薪芯 褝褌芯褌 锌邪褉邪屑械褌褉 蟹邪写邪薪 褔械褉械蟹 泻谢邪褋褋 褋褌懈谢械泄
                // 锌褉芯胁械褉褟械屑, 懈 写芯斜邪胁谢褟械屑 械褋谢懈 褝褌芯 薪械 褌邪泻
                if (block.css('position') !== 'absolute') {
                    block.css('position', 'absolute');
                }
                // 褋泻褉褘胁邪械屑 胁褋械 斜谢芯泻懈 泻褉芯屑械 锌械褉胁芯谐芯
                if (index !== 0) {
                    block.css('left', tileWidth);
                }
            });

            // 蟹邪锌褍褋泻邪械屑 懈薪褌械褉胁邪谢 写谢褟 褋屑械薪褘 斜谢芯泻芯胁
            setInterval(function () {
                slideBlock();
            }, plugin.settings.period);
        };

        // 褋屑械薪邪 斜谢芯泻芯胁
        var slideBlock = function() {

            var slideOutBlock, // 斜谢芯泻 泻芯褌芯褉褘泄 薪邪写芯 褋泻褉褘褌褜
                slideInBlock, // 斜谢芯泻 泻芯褌芯褉褘泄 薪邪写芯 锌芯泻邪蟹邪褌褜
                mainPosition = {'left': 0, 'top': 0},
                options;

            slideOutBlock = $(blocks[currentBlockIndex]);

            currentBlockIndex++;
            if (currentBlockIndex >= blocks.length) {
                currentBlockIndex = 0;
            }
            slideInBlock = $(blocks[currentBlockIndex]);

            slideInBlock.css(slideInPosition);

            options = {
                duration: plugin.settings.duration,
                easing: 'doubleSqrt'
            };

            slideOutBlock.animate(slideOutPosition, options);
            slideInBlock.animate(mainPosition, options);
        };

        /**
         * 胁芯蟹胁褉邪褖邪械褌 褋褌邪褉褌芯胁褍褞 锌芯蟹懈褑懈褞 写谢褟 斜谢芯泻邪 泻芯褌芯褉褘泄 写芯谢卸械薪 锌芯褟胁懈褌褜褋褟 {left: xxx, top: yyy}
         */
        var getSlideInPosition = function () {
            var pos;
            if (plugin.settings.direction === 'left') {
                pos = {
                    'left': tileWidth,
                    'top': 0
                }
            } else if (plugin.settings.direction === 'right') {
                pos = {
                    'left': -tileWidth,
                    'top': 0
                }
            } else if (plugin.settings.direction === 'up') {
                pos = {
                    'left': 0,
                    'top': tileHeight
                }
            } else if (plugin.settings.direction === 'down') {
                pos = {
                    'left': 0,
                    'top': -tileHeight
                }
            }
            return pos;
        };

        /**
         * 胁芯蟹胁褉邪褖邪械褌 褎懈薪邪谢褜薪褍褞 锌芯蟹懈褑懈褞 写谢褟 斜谢芯泻邪 泻芯褌芯褉褘泄 写芯谢卸械薪 褋泻褉褘褌褜褋褟 {left: xxx, top: yyy}
         */
        var getSlideOutPosition = function () {
            var pos;
            if (plugin.settings.direction === 'left') {
                pos = {
                    'left': -tileWidth,
                    'top': 0
                }
            } else if (plugin.settings.direction === 'right') {
                pos = {
                    'left': tileWidth,
                    'top': 0
                }
            } else if (plugin.settings.direction === 'up') {
                pos = {
                    'left': 0,
                    'top': -tileHeight
                }
            } else if (plugin.settings.direction === 'down') {
                pos = {
                    'left': 0,
                    'top': tileHeight
                }
            }
            return pos;
        };

        plugin.getParams = function() {

            // code goes here

        }

        plugin.init();

    }

    $.fn.tileBlockSlider = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('tileBlockSlider')) {
                var plugin = new $.tileBlockSlider(this, options);
                $(this).data('tileBlockSlider', plugin);
            }
        });
    }

})(jQuery);


$(window).ready(function(){
    var slidedTiles = $('[data-role=tile-slider], .block-slider, .tile-slider');
    slidedTiles.each(function (index, tile) {
        var params = {};
        tile = $(tile);
        params.direction = tile.data('paramDirection');
        params.duration = tile.data('paramDuration');
        params.period = tile.data('paramPeriod');
        tile.tileBlockSlider(params);
    })

});
















/**
 * Carousel - jQuery plugin for MetroUiCss framework
 */



(function($) {
    var pluginName = 'Carousel',
        initAllSelector = '[data-role=carousel], .carousel',
        paramKeys = ['Auto', 'Period', 'Duration', 'Effect', 'Direction', 'Markers', 'Arrows', 'Stop'];


    $[pluginName] = function(element, options) {
        if (!element) {
            return $()[pluginName]({initAll: true});
        }


        // default settings
        var defaults = {
            // auto slide change
            auto: true,
            // slide change period
            period: 6000,
            // animation duration
            duration: 1000,
            // animation effect (fade, slide, switch, slowdown)
            effect: 'slide',
            // animation direction (left, right) for some kinds of animation effect
            direction: 'left',
            // markers below the carousel
            markers: 'on',
            // prev and next arrows
            arrows: 'on',
            // stop sliding when cursor over the carousel
            stop: 'on'
        };


        var plugin = this;
        // plugin settings
        plugin.settings = {};


        var $element = $(element); // reference to the jQuery version of DOM element


        var slides, // all slides DOM objects
            currentSlideIndex, // index of current slide
            slideInPosition, // slide start position before it's appear
            slideOutPosition, // slide position after it's disappear
            parentWidth,
            parentHeight,
            animationInProgress,
            autoSlideTimer,
            markers,
            stopAutoSlide = false;


        // initialization
        plugin.init = function () {


            plugin.settings = $.extend({}, defaults, options);


            slides = $element.find('.slides:first-child > .slide');


            // if only one slide
            if (slides.length <= 1) {
                return;
            }


            currentSlideIndex = 0;


            // parent block dimensions
            parentWidth = $element.innerWidth();
            parentHeight = $element.innerHeight();
            // slides positions, used for some kinds of animation
            slideInPosition = getSlideInPosition();
            slideOutPosition = getSlideOutPosition();


            // prepare slide elements
            slides.each(function (index, slide) {
                $slide = $(slide);
                // each slide must have position:absolute
                // if not, set it
                if ($slide.css('position') !== 'absolute') {
                    $slide.css('position', 'absolute');
                }
                // disappear all slides, except first
                if (index !== 0) {
                    $slide.hide();
                }
            });


            if (plugin.settings.arrows === 'on') {
                // prev next buttons handlers
                $element.find('span.control.left').on('click', function(){
                    changeSlide('left');
                    startAutoSlide();
                });
                $element.find('span.control.right').on('click', function(){
                    changeSlide('right');
                    startAutoSlide();
                });
            } else {
                $element.find('span.control').hide();
            }


            // markers
            if (plugin.settings.markers === 'on') {
                insertMarkers();
            }


            // enable auto slide
            if (plugin.settings.auto === true) {
                startAutoSlide();


                // stop sliding when cursor over the carousel
                if (plugin.settings.stop === 'on') {
                    $element.on('mouseenter', function () {
                        stopAutoSlide = true;
                    });
                    $element.on('mouseleave', function () {
                        stopAutoSlide = false;
                        startAutoSlide();
                    });
                }
            }


            // u can use same code:
            // $('#carusel').trigger('changeSlide', [{direction: 'left', effect: 'fade', index: 1}])
            // any option not required
            $element.on('changeSlide', function(event, options){
                options = options || {};
                changeSlide(options.direction, options.effect, options.index);
            });
        };


        /**
         * returns start position for appearing slide {left: xxx}
         */
        var getSlideInPosition = function () {
            var pos;
            if (plugin.settings.direction === 'left') {
                pos = {
                    'left': parentWidth
                }
            } else if (plugin.settings.direction === 'right') {
                pos = {
                    'left': -parentWidth
                }
            }
            return pos;
        };


        /**
         * returns end position of disappearing slide {left: xxx}
         */
        var getSlideOutPosition = function () {
            var pos;
            if (plugin.settings.direction === 'left') {
                pos = {
                    'left': -parentWidth
                }
            } else if (plugin.settings.direction === 'right') {
                pos = {
                    'left': parentWidth
                }
            }
            return pos;
        };


        /**
         * start or restart auto change
         */
        var startAutoSlide = function () {
            clearInterval(autoSlideTimer);
            // start slide changer timer
            autoSlideTimer = setInterval(function () {
                if (stopAutoSlide) {
                    return;
                }
                changeSlide();
            }, plugin.settings.period);
        };


        /**
         * inserts markers below the carousel
         */
        var insertMarkers = function () {
            var div, ul, li, i;


            div = $('<div class="markers"></div>');
            ul = $('<ul></ul>').appendTo(div);


            for (i = 0; i < slides.length; i++) {
                li = $('<li><a href="javascript:void(0)" data-num="' + i + '"></a></li>');
                if (i === 0) {
                    li.addClass('active');
                }
                li.appendTo(ul);
            }


            markers = ul.find('li');


            ul.find('li a').on('click', function () {
                var $this = $(this),
                    index;


                // index of appearing slide
                index = $this.data('num');
                if (index === currentSlideIndex) {
                    return;
                }


                changeSlide(undefined, 'switch', index);
                startAutoSlide();
            });


            div.appendTo($element);
        };


        /**
         * changes slide to next
         */
        var changeSlide = function(direction, effect, slideIndex) {


            var outSlide, // disappearin slide element
                inSlide, // appearing slide element
                nextSlideIndex,
                delta = 1,
                slideDirection = 1;


            effect = effect || plugin.settings.effect;
            // correct slide direction, used for 'slide' and 'slowdown' effects
            if ((effect === 'slide' || effect === 'slowdown') && typeof direction !== 'undefined' && direction !== plugin.settings.direction) {
                slideDirection = -1;
            }
            if (direction === 'left') {
                delta = -1;
            }


            outSlide = $(slides[currentSlideIndex]);


            nextSlideIndex = (typeof slideIndex !== 'undefined' && slideIndex !== currentSlideIndex) ? slideIndex : currentSlideIndex + delta;
            if (nextSlideIndex >= slides.length) {
                nextSlideIndex = 0;
            }
            if (nextSlideIndex < 0) {
                nextSlideIndex = slides.length - 1;
            }


            inSlide = $(slides[nextSlideIndex]);


            if (animationInProgress === true) {
                return;
            }


            // switch effect is quickly, no need to wait
            if (effect !== 'switch') {
                // when animation in progress no other animation occur
                animationInProgress = true;
                setTimeout(function () {
                    animationInProgress = false;
                }, plugin.settings.duration)
            }


            // change slide with selected effect
            switch (effect) {
                case 'switch':
                    changeSlideSwitch(outSlide, inSlide);
                    break;
                case 'slide':
                    changeSlideSlide(outSlide, inSlide, slideDirection);
                    break;
                case 'fade':
                    changeSlideFade(outSlide, inSlide);
                    break;
                case 'slowdown':
                    changeSlideSlowdown(outSlide, inSlide, slideDirection);
                    break;
            }


            currentSlideIndex = nextSlideIndex;


            // switch marker
            if (plugin.settings.markers === 'on') {
                markers.removeClass('active');
                $(markers.get(currentSlideIndex)).addClass('active');
            }


        };
        /**
         * switch effect
         */
        var changeSlideSwitch = function (outSlide, inSlide) {
            inSlide.show().css({'left': 0});
            outSlide.hide();
        };
        /**
         * slide effect
         */
        var changeSlideSlide = function (outSlide, inSlide, slideDirection) {
            var unmovedPosition = {'left': 0},
                duration = plugin.settings.duration;


            if (slideDirection !== -1) {
                inSlide.css(slideInPosition);
                inSlide.show();
                outSlide.animate(slideOutPosition, duration);
                inSlide.animate(unmovedPosition, duration);
            } else {
                inSlide.css(slideOutPosition);
                inSlide.show();
                outSlide.animate(slideInPosition, duration);
                inSlide.animate(unmovedPosition, duration);
            }
        };
        /**
         * slowdown slide effect (custom easing 'doubleSqrt')
         */
        var changeSlideSlowdown = function (outSlide, inSlide, slideDirection) {
            var unmovedPosition = {'left': 0},
                options;


            options = {
                'duration': plugin.settings.duration,
                'easing': 'doubleSqrt'
            };


            if (slideDirection !== -1) {
                inSlide.css(slideInPosition);
                inSlide.show();
                outSlide.animate(slideOutPosition, options);
                inSlide.animate(unmovedPosition, options);
            } else {
                inSlide.css(slideOutPosition);
                inSlide.show();
                outSlide.animate(slideInPosition, options);
                inSlide.animate(unmovedPosition, options);
            }
        };
        /**
         * fade effect
         */
        var changeSlideFade = function (outSlide, inSlide) {
            inSlide.hide();
            inSlide.css({
                left: 0,
                top: 0
            });
            inSlide.fadeIn(plugin.settings.duration);
            outSlide.fadeOut(plugin.settings.duration);
        };


        plugin.init();


    };


    // easing effect for jquery animation
    $.easing.doubleSqrt = function(t, millisecondsSince, startValue, endValue, totalDuration) {
        var res = Math.sqrt(Math.sqrt(t));
        return res;
    };


    $.fn[pluginName] = function(options) {
        var elements = options && options.initAll ? $(initAllSelector) : this;
        return elements.each(function() {
            var that = $(this),
                params = {},
                plugin;
            if (undefined == that.data(pluginName)) {
                $.each(paramKeys, function(index, key){
                    params[key[0].toLowerCase() + key.slice(1)] = that.data('param' + key);
                });
                plugin = new $[pluginName](this, params);
                that.data(pluginName, plugin);
            }
        });
    };
    // autoinit
    $(function(){
        $()[pluginName]({initAll: true});
    });


})(jQuery);

/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
* Licensed under the MIT License (LICENSE.txt).
*
* Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
* Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
* Thanks to: Seamus Leahy for adding deltaX and deltaY
*
* Version: 3.0.6
*
* Requires: 1.2.2+
*/

(function($) {
var types = ['DOMMouseScroll', 'mousewheel'];
if ($.event.fixHooks) {
for ( var i=types.length; i; ) {
$.event.fixHooks[ types[--i] ] = $.event.mouseHooks;
}
}
$.event.special.mousewheel = {
setup: function() {
if ( this.addEventListener ) {
for ( var i=types.length; i; ) {
this.addEventListener( types[--i], handler, false );
}
} else {
this.onmousewheel = handler;
}
},
teardown: function() {
if ( this.removeEventListener ) {
for ( var i=types.length; i; ) {
this.removeEventListener( types[--i], handler, false );
}
} else {
this.onmousewheel = null;
}
}
};
$.fn.extend({
mousewheel: function(fn) {
return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
},
unmousewheel: function(fn) {
return this.unbind("mousewheel", fn);
}
});
function handler(event) {
var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
event = $.event.fix(orgEvent);
event.type = "mousewheel";
// Old school scrollwheel delta
if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
if ( orgEvent.detail ) { delta = -orgEvent.detail/3; }
// New school multidimensional scroll (touchpads) deltas
deltaY = delta;
// Gecko
if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
deltaY = 0;
deltaX = -1*delta;
}
// Webkit
if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
// Add event and delta to the front of the arguments
args.unshift(event, delta, deltaX, deltaY);
return ($.event.dispatch || $.event.handle).apply(this, args);
}
})(jQuery);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//





;