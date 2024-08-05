import React from 'react';

const Toast = React.forwardRef((props, ref) => {
    return (
        <div ref={ref} className="toast">
            {/* Your toast message */}
        </div>
    );
});

export default Toast;
