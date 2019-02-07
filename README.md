# babel-plugin-react-v-model

Babel plugin for React component to add a syntactic sugar like Vue's `v-model`.

## Installation

```bash
$ npm install babel-plugin-react-v-model --save-dev
```

## Motivation

When you are building a input in React component, usullay, you have to write two JSXAttributes (`value` and `onChange`) to Two-WayDataBinding, like this.
``` jsx
class App extends React.Component{
  constructor() {
    super();
    
    this.state = {
      text: ''
    };
  }
 
  render() {
    const {text} = this.state;

    return (
      <div>
        <input 
          type="text"
          value={text}
          onChange={(e) => 
            this.setState({
              text: e.target.value
            })
          }
        />
      </div>
    )
  }
}

```
it looks simple, but if It is not a single input instead of a large number of inputs,It will be very troublesome.
So, this plugin is born to resolve these thorny problems.
With this plugin, you can easily code.

For instance,

``` jsx
class App extends React.Component{
  constructor() {
    super();
    
    this.state = {
      text: '',
      num: 1,
      radioVal: 1,
      checkboxVal: true,
      selectVal: 'A'
    };
  }

  render() {
    const {text, num, radioVal, checkboxVal, selectVal} = this.state;
    const {storeData, setItem} = this.props;// Store Supported

    return (
      <div>
        <input 
          type="text"
          v-model={text}
        />
        <textarea 
          v-model={text}
        />
        <label>
          <input 
            type="radio"
            name="radio"
            value={0}
            v-model={radioVal}
          />
          <input 
            type="radio"
            name="radio"
            value={1}
            v-model={radioVal}
          />
        </label>
        <input 
          type="checkbox"
          v-model={checkboxVal}
        />
        <select
          v-model={selectVal}
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
        <input 
          type="number"
          v-model={{
            bind: num,
            filter(val) {
              return (val > 0)? val : 0
            }
          }}
        />
        <input 
          type="text"
          v-model={{
            bind: storeData,
            handler: setItem
          }}
        />
      </div>
    )
  }
}
```

## Usage

Write via [babelrc](https://babeljs.io/docs/usage/babelrc/).

``` json
// .babelrc
{
  "plugins": [
    "react-v-model"
  ]
}

```
