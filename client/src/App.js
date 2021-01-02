import React from "react";
import { ProvideAuth } from './hooks/auth';
import Routes from './components/Routes/Routes';
import { ApolloProvider, createHttpLink, ApolloClient } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { cache } from './cache';
import { ProvideAppState } from './hooks/provideAppState';
import { ProvideTheme } from './hooks/provideTheme';

import classNames from 'classnames/bind';
const cx = classNames.bind(require('./App.module.scss'));

export const App = () => {
  return (
    <ProvideAuth>
      <ApolloProvider client={client}>
        <ProvideTheme>
          <ProvideAppState>
            <div className={cx('app')}>
              <Routes/>
            </div>
          </ProvideAppState>
        </ProvideTheme>
      </ApolloProvider>
    </ProvideAuth>
  );
}

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  let token = null;
  let sessionString = localStorage.getItem('session');
  if(sessionString){
    let session = JSON.parse(sessionString);
    if(session.token){
      token = session.token;
    }
  }
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache
})