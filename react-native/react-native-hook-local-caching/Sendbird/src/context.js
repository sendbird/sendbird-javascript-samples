import React, { createContext } from 'react';

export const AppContext = createContext();

export const withAppContext = (Component, mapStateToProp = null) => {
  const ConsumableComponent = props => {
    return (
      <AppContext.Consumer>
        {state => {
          const mappedProps = mapStateToProp ? mapStateToProp(state) : state;
          const mergedProps = { ...props, ...mappedProps };
          return <Component {...mergedProps} />;
        }}
      </AppContext.Consumer>
    );
  };
  return ConsumableComponent;
};
