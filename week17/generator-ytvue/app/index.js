var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    async initPackage() {
        let answer = await this.prompt([{
            type: "input",
            name: "name",
            message: "欢迎使用云童项目搭建脚手架，你想为你的项目起什么名字呢？",
            default: this.appname
        }, {
            type: "confirm",
            name: "vuex",
            message: "是否使用Vuex？"
        }, {
            type: "confirm",
            name: "router",
            message: "是否使用vue-router？"
        }])

        const pkgJson = {
            "name": answer.name,
            "version": "1.0.0",
            "description": "",
            "main": "index.js",
            "scripts": {
                "test": "echo \"Error: no test specified\" && exit 1",
                "dev": "webpack-dev-server --config ./build/webpack.dev.js",
                "build": "webpack --config ./build/webpack.prod.js"
            },
            "author": "",
            "license": "ISC",
            "devDependencies": {},
            "dependencies": {}
        }
        this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
        this.npmInstall(["vue"], { 'save-dev': false });
        console.log(answer.vuex);
        console.log(answer.router);
        if (answer.vuex && !answer.router) {
            this._addVuex();
        } else if (!answer.vuex && answer.router) {
            this._addRouter();
        } else if (answer.router && answer.vuex) {
            this._addVuexAndRouter();
        } else {
            this.fs.copyTpl(
                this.templatePath('main.js'),
                this.destinationPath('src/main.js')
            );
        }
        this.npmInstall([
            "webpack@4.44.1",
            "webpack-cli@3.3.12",
            "vue-loader",
            "vue-style-loader",
            "css-loader",
            "vue-template-compiler",
            "html-webpack-plugin",
            "url-loader",
            "file-loader",
            "clean-webpack-plugin",
            "webpack-merge",
            "webpack-dev-server",
            "@babel/core",
            "@babel/preset-env",
            "babel-loader",
            "style-loader"
        ], { 'save-dev': true });
        this.fs.copyTpl(
            this.templatePath('HelloYuntong.vue'),
            this.destinationPath('src/HelloYuntong.vue')
        );
        this.fs.copyTpl(
            this.templatePath('webpack.common.js'),
            this.destinationPath('build/webpack.common.js')
        );
        this.fs.copyTpl(
            this.templatePath('webpack.prod.js'),
            this.destinationPath('build/webpack.prod.js')
        );
        this.fs.copyTpl(
            this.templatePath('webpack.dev.js'),
            this.destinationPath('build/webpack.dev.js')
        );
        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath('src/index.html'), { title: answer.name }
        )
    };

    _addVuex() {
        this.npmInstall(["vuex"], { 'save-dev': false });
        this.fs.copyTpl(
            this.templatePath('mainVuex.js'),
            this.destinationPath('src/main.js')
        );
        this.fs.copyTpl(
            this.templatePath('store/index.js'),
            this.destinationPath('src/store/index.js')
        );
        this.fs.copyTpl(
            this.templatePath('store/getters.js'),
            this.destinationPath('src/store/getters.js')
        );
        this.fs.copyTpl(
            this.templatePath('store/modules/app.js'),
            this.destinationPath('src/store/modules/app.js')
        );
    }
    _addRouter() {
        this.npmInstall(["vue-router"], { "save-dev": false });
        this.fs.copyTpl(
            this.templatePath('mainRouter.js'),
            this.destinationPath('src/main.js')
        );
        this.fs.copyTpl(
            this.templatePath('router/index.js'),
            this.destinationPath('src/router/index.js')
        );
    }

    _addVuexAndRouter() {
        this.npmInstall(["vue-router", "vuex"], { "save-dev": false });
        this.fs.copyTpl(
            this.templatePath('mainAll.js'),
            this.destinationPath('src/main.js')
        );
        this.fs.copyTpl(
            this.templatePath('store/index.js'),
            this.destinationPath('src/store/index.js')
        );
        this.fs.copyTpl(
            this.templatePath('store/getters.js'),
            this.destinationPath('src/store/getters.js')
        );
        this.fs.copyTpl(
            this.templatePath('store/modules/app.js'),
            this.destinationPath('src/store/modules/app.js')
        );
        this.fs.copyTpl(
            this.templatePath('router/index.js'),
            this.destinationPath('src/router/index.js')
        );
    }
};