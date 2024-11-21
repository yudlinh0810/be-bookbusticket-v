// Import đối tượng environment từ @rails/webpacker để cấu hình Webpack
const { environment } = require('@rails/webpacker');

// Import Webpack để sử dụng các tính năng như plugin
const webpack = require('webpack');

// Thêm DefinePlugin vào danh sách plugin của Webpack
environment.plugins.append(
  'DefinePlugin', // Tên plugin được thêm vào (tên tùy ý)
  new webpack.DefinePlugin({
    // Định nghĩa giá trị cho biến toàn cục __REACT_DEVTOOLS_GLOBAL_HOOK__
    __REACT_DEVTOOLS_GLOBAL_HOOK__: '({isDisable: true})',
    // Biến này được React DevTools sử dụng, Đặt isDisabled là true sẽ vô hiệu hóa DevTools
  })
);
// => React DevTools sẽ không hoạt động do hook bị vô hiệu hóa
