import React from 'react';
import Router from 'react-routing/src/Router';
import App from '../../app/components/App/App';
import NotFoundPage from '../components/Pages/NotFoundPage/NotFoundPage';
import ErrorPage from '../components/Pages/ErrorPage/ErrorPage';
import Manager from '../components/Manager/Manager';

const router = new Router(on => {
  on('*', async(state, next) => {
    const component = await next();
    return component && <App context={state.context} footer>{component}</App>;
  });

  on('/', async() => <Manager />);

  on('/manager', async() => <Manager />);

  on('error', (state, error) => state.statusCode === 404 ?
    <App context={state.context} error={error}><NotFoundPage /></App> :
    <App context={state.context} error={error}><ErrorPage /></App>
  );
});

export default router;
