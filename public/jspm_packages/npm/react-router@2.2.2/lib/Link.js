/* */ 
(function(process) {
  'use strict';
  exports.__esModule = true;
  var _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {'default': obj};
  }
  function _objectWithoutProperties(obj, keys) {
    var target = {};
    for (var i in obj) {
      if (keys.indexOf(i) >= 0)
        continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i))
        continue;
      target[i] = obj[i];
    }
    return target;
  }
  var _react = require('react');
  var _react2 = _interopRequireDefault(_react);
  var _routerWarning = require('./routerWarning');
  var _routerWarning2 = _interopRequireDefault(_routerWarning);
  var _React$PropTypes = _react2['default'].PropTypes;
  var bool = _React$PropTypes.bool;
  var object = _React$PropTypes.object;
  var string = _React$PropTypes.string;
  var func = _React$PropTypes.func;
  var oneOfType = _React$PropTypes.oneOfType;
  function isLeftClickEvent(event) {
    return event.button === 0;
  }
  function isModifiedEvent(event) {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
  }
  function isEmptyObject(object) {
    for (var p in object) {
      if (Object.prototype.hasOwnProperty.call(object, p))
        return false;
    }
    return true;
  }
  function createLocationDescriptor(to, _ref) {
    var query = _ref.query;
    var hash = _ref.hash;
    var state = _ref.state;
    if (query || hash || state) {
      return {
        pathname: to,
        query: query,
        hash: hash,
        state: state
      };
    }
    return to;
  }
  var Link = _react2['default'].createClass({
    displayName: 'Link',
    contextTypes: {router: object},
    propTypes: {
      to: oneOfType([string, object]).isRequired,
      query: object,
      hash: string,
      state: object,
      activeStyle: object,
      activeClassName: string,
      onlyActiveOnIndex: bool.isRequired,
      onClick: func
    },
    getDefaultProps: function getDefaultProps() {
      return {
        onlyActiveOnIndex: false,
        style: {}
      };
    },
    handleClick: function handleClick(event) {
      var allowTransition = true;
      if (this.props.onClick)
        this.props.onClick(event);
      if (isModifiedEvent(event) || !isLeftClickEvent(event))
        return;
      if (event.defaultPrevented === true)
        allowTransition = false;
      if (this.props.target) {
        if (!allowTransition)
          event.preventDefault();
        return;
      }
      event.preventDefault();
      if (allowTransition) {
        var _props = this.props;
        var to = _props.to;
        var query = _props.query;
        var hash = _props.hash;
        var state = _props.state;
        var _location = createLocationDescriptor(to, {
          query: query,
          hash: hash,
          state: state
        });
        this.context.router.push(_location);
      }
    },
    render: function render() {
      var _props2 = this.props;
      var to = _props2.to;
      var query = _props2.query;
      var hash = _props2.hash;
      var state = _props2.state;
      var activeClassName = _props2.activeClassName;
      var activeStyle = _props2.activeStyle;
      var onlyActiveOnIndex = _props2.onlyActiveOnIndex;
      var props = _objectWithoutProperties(_props2, ['to', 'query', 'hash', 'state', 'activeClassName', 'activeStyle', 'onlyActiveOnIndex']);
      process.env.NODE_ENV !== 'production' ? _routerWarning2['default'](!(query || hash || state), 'the `query`, `hash`, and `state` props on `<Link>` are deprecated, use `<Link to={{ pathname, query, hash, state }}/>. http://tiny.cc/router-isActivedeprecated') : undefined;
      var router = this.context.router;
      if (router) {
        var _location2 = createLocationDescriptor(to, {
          query: query,
          hash: hash,
          state: state
        });
        props.href = router.createHref(_location2);
        if (activeClassName || activeStyle != null && !isEmptyObject(activeStyle)) {
          if (router.isActive(_location2, onlyActiveOnIndex)) {
            if (activeClassName) {
              if (props.className) {
                props.className += ' ' + activeClassName;
              } else {
                props.className = activeClassName;
              }
            }
            if (activeStyle)
              props.style = _extends({}, props.style, activeStyle);
          }
        }
      }
      return _react2['default'].createElement('a', _extends({}, props, {onClick: this.handleClick}));
    }
  });
  exports['default'] = Link;
  module.exports = exports['default'];
})(require('process'));
