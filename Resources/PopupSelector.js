var $$, PopupSelector, mix;

var __bind = function (fn, me) {
        return function () {
            return fn.apply(me, arguments);
        };
    };
    
mix = function () {
    var arg, child, prop, _i, _len;
    child = {};
    for (_i = 0, _len = arguments.length; _i < _len; _i++) {
        arg = arguments[_i];
        for (prop in arg) {
            if (arg.hasOwnProperty(prop)) {
                child[prop] = arg[prop];
            }
        }
    }
    return child;
};

$$ = {
    window: {
        tabBarHidden: true,
        navBarHidden: true
    },
    tableView: {
        top: 44,
        rowHeight: 44,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#222'
    },
    tableViewRow: {
        height: 44
    },
    maskView: {
        top: 0,
        height: Ti.UI.FILL,
        width: Ti.UI.FILL,
        backgroundColor: '#000',
        opacity: 0.5
    },
    container: {
        top: 100,
        height: 340,
        width: 260,
        backgroundColor: '#444',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#222',
        opacity: 0.85
    },
    doneBtn: {
        top: 8,
        right: 10,
        width: 50,
        height: 30
    },
    titleLabel: {
        top: 10,
        height: 25,
        width: 180,
        textAlign: 'center',
        color: '#fff',
        font: {
            fontFamily: 'Helvetica-Bold',
            fontSize: 18,
            fontWeight: 'BOLD'
        }
    }
};



PopupSelector = (function () {
    function PopupSelector(options) {
        var container, defaults, doneBtn, i_, item, maskView, params, rows, tableView, titleLabel, _len, _ref;
        
        if (options == null) {
            options = {};
        }
        
        defaults = {
            title: '',
            choice: [],
            selected: 0,
            closeWhenTouchOutside: true,
            closeAfterSelect: true,
            doneButton: false,
            doneButtonTitle: 'Done'
        };        
        params = mix(defaults, options);
        
        
        this.listeners = {};
        
        
        this.window = Ti.UI.createWindow({
            opacity: 0
        });
        
        maskView = Ti.UI.createView($$.maskView);
        this.window.add(maskView);
        if (params.closeWhenTouchOutside) {
            maskView.addEventListener('click', __bind(function (e) {
                this.hide();
            }, this));
        }
        
        container = Ti.UI.createView($$.container);
        this.window.add(container);
        
        titleLabel = Ti.UI.createLabel(mix($$.titleLabel, {
            text: params.title
        }));
        container.add(titleLabel);
        
        tableView = Ti.UI.createTableView(mix($$.tableView, {
            height: container.height - 49
        }));
        container.add(tableView);
        
        rows = [];
        _ref = params.choice;
        for (i_ = 0, _len = _ref.length; i_ < _len; i_++) {
            item = _ref[i_];
            rows.push(Ti.UI.createTableViewRow(mix($$.tableViewRow, {
                title: item,
                hasCheck: i_ === params.selected && true || false
            })));
        }
        tableView.setData(rows);
        tableView.addEventListener('click', __bind(function (e) {
            tableView.data[0].rows[params.selected].hasCheck = false;
            tableView.data[0].rows[e.index].hasCheck = true;
            params.selected = e.index;
            this.fireEvent('click', e);
            if (params.closeAfterSelect) {
                this.hide();
            }
        }, this));
        
        if (params.doneButton) {
            doneBtn = Ti.UI.createButton(mix($$.doneBtn, {
                title: params.doneButtonTitle
            }));
            container.add(doneBtn);
            doneBtn.addEventListener('click', __bind(function (e) {
                this.hide();
            }, this));
        }
        return;
    }
    
    PopupSelector.prototype.show = function (animate) {
        if (animate == null) {
            animate = true;
        }
        if (animate) {
            this.window.open();
            this.window.animate({
                opacity: 1,
                duration: 300
            });
        } else {
            this.window.open();
        }
    };
    
    PopupSelector.prototype.hide = function (animate) {
        if (animate == null) {
            animate = true;
        }
        if (animate) {
            this.window.animate({
                opacity: 0,
                duration: 300
            }, __bind(function () {
                this.window.close();
            }, this));
        } else {
            this.window.close();
        }
    };
    
    PopupSelector.prototype.addEventListener = function (eventName, callback) {
        this.listeners = this.listeners || {};
        this.listeners[eventName] = this.listeners[eventName] || [];
        this.listeners[eventName].push(callback);
    };
    
    PopupSelector.prototype.fireEvent = function (eventName, data) {
        var event, eventListeners, _i, _len;
        eventListeners = this.listeners[eventName] || [];
        for (_i = 0, _len = eventListeners.length; _i < _len; _i++) {
            event = eventListeners[_i];
            event.call(this, data);
        }
    };
    return PopupSelector;
})();

module.exports = PopupSelector;