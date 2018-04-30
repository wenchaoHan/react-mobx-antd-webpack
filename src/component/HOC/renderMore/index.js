import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import wrapDisplayName, { setDisplayName } from '../getDisplayName';

export default function renderMore(BaseComponent) {
  class RenderMore extends Component {
    static propTypes = {
      renderBefore: PropTypes.func,
      renderAfter: PropTypes.func,
      /* eslint-disable react/forbid-prop-types */
      renderChildren: PropTypes.func,
      /* eslint-enable react/forbid-prop-types */
    }
    static defaultProps = {
      renderBefore: () => { },
      renderAfter: () => { },
      renderChildren: (Children, props) => <Children {...props} />,
    }

    render() {
      const {
        renderBefore,
        renderAfter,
        renderChildren,
        ...restProps
      } = this.props;
      return (
        <div className={'.inline-block'}>
          {renderBefore()}
          {renderChildren(BaseComponent, restProps)}
          {renderAfter()}
        </div>
      );
    }
  }

  // if (process.env.NODE_ENV === 'dev') {
  //   return setDisplayName(wrapDisplayName(BaseComponent, 'RenderMore'))(
  //     RenderMore
  //   );
  // }
  return RenderMore;
}
