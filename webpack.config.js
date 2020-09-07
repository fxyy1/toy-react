const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

// 创建一个插件实例对象
const htmlPlugin = new HtmlWebPackPlugin({
    template: path.join(__dirname, './dist/main.html'), // 源文件
    filename: 'index.html' // 生产的内存中首页的名称
})


module.exports = {
    entry: {
        main: './src/main.js',
    },
    mode: 'development',
    plugins: [htmlPlugin],
    optimization: {
        minimize: false,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        // babel 的 config 快捷配置
                        presets: ['@babel/preset-env'],
                        plugins: [
                            [
                                '@babel/plugin-transform-react-jsx',
                                { pragma: 'createElement' },
                            ],
                        ],
                    },
                },
            },
        ],
    },
};
