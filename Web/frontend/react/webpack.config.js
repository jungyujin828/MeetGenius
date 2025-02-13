const webpack = require('webpack');
const dotenv = require('dotenv');

// .env 파일을 로드하여 환경 변수를 설정
dotenv.config();

module.exports = {
  // Webpack 설정
  resolve: {
    // process를 브라우저에서 사용할 수 있도록 polyfill 설정
    fallback: {
      process: require.resolve('process/browser'),
    },
  },
  plugins: [
    // 환경 변수를 브라우저 코드에서 사용할 수 있도록 설정
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
  ],
};
