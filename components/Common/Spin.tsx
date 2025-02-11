import React from 'react';
import { Spin as AntSpin } from 'antd';

const Spin = ({className=''}) => {
  return (
    <div className={`${className} [&_.ant-spin-dot-item]:bg-primary`}>
      <AntSpin />
    </div>
  );
};

export default Spin;