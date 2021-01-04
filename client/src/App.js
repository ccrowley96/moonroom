import React from "react";
import { ProvideAuth } from './hooks/auth';
import Routes from './components/Routes/Routes';
import { ApolloProvider, createHttpLink, ApolloClient, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context';
import { cache } from './cache';
import { ProvideAppState } from './hooks/provideAppState';
import { ProvideTheme } from './hooks/provideTheme';
import { activeCommunityIdVar } from './cache';
import { removeCommunityFromCache } from "./services/utils";
 
import classNames from 'classnames/bind';
const cx = classNames.bind(require('./App.module.scss'));

export const App = () => {
  return (
    <ApolloProvider client={client}>
      <ProvideAuth>
        <ProvideTheme>
          <ProvideAppState>
            <div className={cx('app')}>
              <Routes/>
            </div>
          </ProvideAppState>
        </ProvideTheme>
      </ProvideAuth>
    </ApolloProvider>
  );
}

const httpLink = createHttpLink({
  uri: '/graphql',
});

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, extensions: { code }}) => {
      console.log(`[GraphQL error]:`, {message, code})
      if(code === 'UNAUTHENTICATED'){
        // redirect to login
        localStorage.removeItem('session');
        window.location = '/login';
      }
      if(code === 'COMMUNITY_NOT_FOUND'){
        localStorage.removeItem('activeCommunityId')
        activeCommunityIdVar(null);
        let communityId = operation?.variables?.communityId;
        removeCommunityFromCache(communityId);
      }
    });

  if (networkError) console.log(`[Network error]: ${networkError}`);
})

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
  link: from([
    authLink,
    errorLink,
    httpLink
  ]),
  cache
})