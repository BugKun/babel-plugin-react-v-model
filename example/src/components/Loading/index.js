import React from 'react';

export default ({isLoading, error}) => {
    if (isLoading) {
        return <div>正在加载模块中~~~~</div>
    } else if (error) {
        console.log(error);
        return <div>Sorry !</div>
    } else {
        return null;
    }
}