import React from 'react';
import { Spin as AntSpin } from 'antd';

const Spin = () => {
  return (
    <div className=" [&_.ant-spin-dot-item]:bg-primary">
      <AntSpin />
    </div>
  );
};

export default Spin;