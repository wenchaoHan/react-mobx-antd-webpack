import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import wrapDisplayName, { setDisplayName } from '../getDisplayName';

export default function formatVal(BaseComponent) {
  class FormatVal extends Component {
    static propTypes = {
      onChange: PropTypes.func,
      formatVal: PropTypes.func,
      withRef: PropTypes.func,
      /* eslint-disable react/forbid-prop-types */
      value: PropTypes.any,
      /* eslint-enable react/forbid-prop-types */
    }
    static defaultProps = {
      onChange: () => { },
      formatVal: v => v,
      withRef: () => {},
    }

    constructor(props) {
      super(props);
      this.onChange = this.onChange.bind(this);
    }

    onChange(value, label, extra) {
      const newValue = this.props.formatVal(value, false, this.props, {
        label,
        extra,
      });
      this.props.onChange(newValue);
    }

    render() {
      const newProps = {
        value: this.props.formatVal(this.props.value, true, this.props),
        onChange: this.onChange,
        ref: this.props.withRef,
      };
      const {
        /* eslint-disable no-unused-vars */
        formatVal: formatValue,
        withRef,
        /* eslint-enable no-unused-vars */
        ...restProps
      } = this.props;
      return (
        <BaseComponent {...restProps} {...newProps} />
      );
    }
  }

  // if (process.env.NODE_ENV === 'dev') {
  //   return setDisplayName(wrapDisplayName(BaseComponent, 'FormatVal'))(
  //     FormatVal
  //   );
  // }
  return FormatVal;
}
