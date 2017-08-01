import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { routerMiddleware, ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createHashHistory'
import { AppContainer } from 'react-hot-loader'
import thunkMiddleware from 'redux-thunk';
import perfAddon from 'react-addons-perf';
import reducer from './redux-modules/reducer';
import Index from './main/Index';

const isProduction = process.env.NODE_ENV === 'production';
const history = createHistory();

const store = ((initialState) => {
    return compose(
        applyMiddleware(
            routerMiddleware(history),
            thunkMiddleware.withExtraArgument({}), //添加额外参数
        ),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )(createStore)(reducer, initialState);
})();

const Root = document.getElementById('root');

const render = (Component, noProduction) => {
    if (noProduction) {
        perfAddon.start();
    }
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <Component />
                </ConnectedRouter>
            </Provider>
        </AppContainer>,
        Root,
        () => {
            if (noProduction) {
                setTimeout(()=> {
                    perfAddon.stop();
                    console.warn('花费的总时间:');
                    perfAddon.printInclusive();
                    console.warn('不包含挂载组件的时间:');
                    perfAddon.printExclusive();
                    console.warn('“浪费”的时间(没有发生任何渲染):');
                    perfAddon.printWasted();
                }, 1000);
            }
        },
    );
};

render(Index, !isProduction);

registerServiceWorker();

if (module.hot && !isProduction) {
    module.hot.accept('./main/Index', () => {
        const NextIndex = require('./main/Index').default;
        ReactDOM.unmountComponentAtNode(Root);
        render(NextIndex, false);
    });
    module.hot.accept('./redux-modules/reducer', () => {
        const nextReducer = require('./redux-modules/reducer').default;
        store.replaceReducer(nextReducer);
    });
}
