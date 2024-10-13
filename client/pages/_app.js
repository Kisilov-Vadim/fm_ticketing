import React from 'react'

import {buildClient} from '../api';
import {Header} from '../components';

import 'bootstrap/dist/css/bootstrap.css';

const AppComponent = ({Component, pageProps, currentUser}) => (
  <div>
    <Header currentUser={currentUser} />
    <Component {...pageProps} />
  </div>
)

AppComponent.getInitialProps = async appContext => {
  const client = buildClient(appContext.ctx);

  const {data} = await client.get('/api/users/currentuser');

  const pageProps = appContext.Component.getInitialProps ?
    await appContext.Component.getInitialProps(appContext.ctx) :
    {};

  return {
    ...data,
    pageProps,
  };
}

export default AppComponent;