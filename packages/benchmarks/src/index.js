/* global document */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import SierpinskiTriangle from './cases/SierpinskiTriangle';
import Tree from './cases/Tree';
import impl from './impl';

const implementations = impl;
const packageNames = Object.keys(implementations);

const createTestBlock = fn => {
  return packageNames.reduce((testSetups, packageName) => {
    const { name, components, version } = implementations[packageName];
    const { Component, getComponentProps, sampleCount, Provider, benchmarkType } = fn(components);

    testSetups[packageName] = {
      Component,
      getComponentProps,
      sampleCount,
      Provider,
      benchmarkType,
      version,
      name,
    };
    return testSetups;
  }, {});
};

const tests = {
  'Mount deep tree': createTestBlock(components => ({
    benchmarkType: 'mount',
    Component: Tree,
    getComponentProps: ({ cycle }) => ({ breadth: 2, components, depth: 7, id: cycle, wrap: 1 }),
    Provider: components.Provider,
    sampleCount: 500,
  })),
  'Mount wide tree': createTestBlock(components => ({
    benchmarkType: 'mount',
    Component: Tree,
    getComponentProps: ({ cycle }) => ({ breadth: 6, components, depth: 3, id: cycle, wrap: 2 }),
    Provider: components.Provider,
    sampleCount: 500,
  })),
  'Update dynamic styles': createTestBlock(components => ({
    benchmarkType: 'update',
    Component: SierpinskiTriangle,
    getComponentProps: ({ cycle }) => {
      return { components, s: 200, renderCount: cycle, x: 0, y: 0 };
    },
    Provider: components.Provider,
    sampleCount: 1000,
  })),
};

ReactDOM.render(<App tests={tests} />, document.querySelector('.root'));
