import React from 'react';
import PropTypes from 'prop-types';

import styles from './index.css';

const tagList = {
  rmb: '¥',
  dollar: '$',
};

const Price = ({ extraClass, children, fixed, type }) => {
  const className = extraClass || '';
  const price = +children;
  const tag = tagList[type];
  return (
    <span className={className}>
      <i className={styles.rmb}>{tag}</i>
      {price.toFixed(fixed)}
    </span>
  );
};

Price.propTypes = {
  extraClass: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  fixed: PropTypes.number,
  type: PropTypes.oneOf([
    'rmb', 'dollar',
  ]),
};

Price.defaultProps = {
  fixed: 2,
  type: 'rmb',
};

export default Price;

export const BizPrice = ({ price = {}, right = true, fixed }) => (price.amount !== undefined &&
  <div className={right ? styles.right : ''}>
    <Price type={price.currency !== 'USD' ? 'rmb' : 'dollar'} fixed={fixed}>{price.amount}</Price>
  </div>);

BizPrice.propTypes = {
  right: PropTypes.bool,
  fixed: PropTypes.number,
  /* eslint-disable react/no-unused-prop-types */
  price: PropTypes.shape({
    amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    currency: PropTypes.string,
  }),
  /* eslint-enable react/no-unused-prop-types */
};
