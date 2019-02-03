import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import "./index.scss"



class App extends Component {
    constructor(props){
        super(props);

        this.state = {
            num: 233,
            text: "abc",
            bool: true,
            radio: 2,
            html: `<span>2</span><i>33</i>`,
            selectValue: 2333
        }

        this.setVal = this.setVal.bind(this)
    }

    setVal(Val) {
        this.setState(Val);
    }


    filter(value) {
        return (value > 0)? value : 0
    }

    render() {
        const { num, text, radio, bool, selectValue } = this.state;

        return (
           <div className="main">
               <h4>React v-model example：</h4>
               <div>
                   <p>simple: </p>
                   <label>
                       Textarea:
                       <textarea v-model={text}/>
                   </label>
                   <label>
                       Text:
                       <input type="text" v-model={text}/>
                   </label>
                   <label>
                       Number:
                       <input type="number" v-model={num}/>
                   </label>
                   <label>
                       Checkbox:
                       <input type="checkbox" v-model={bool}/>
                   </label>
                   <label>
                       Radio:
                       <input type="radio" name="radio" value={1} v-model={radio}/>
                       <input type="radio" name="radio" value="2" v-model={{
                           bind: radio,
                           filter(value) {
                               return Number(value);
                           },
                           handler: this.setVal
                       }}/>
                   </label>
                   <select v-model={selectValue}>
                       <option value={2333}>2333</option>
                       <option value={6666}>6666</option>
                   </select>
                   <p>complex:</p>
                   <label>
                       Number with filter and handler:
                       <input type="number" v-model={{
                           bind: num,
                           filter(value) {
                               return (value > 0)? value : 0
                           },
                           handler: this.setVal
                       }}/>
                   </label>
                   <label>
                       v-model with handler:
                       <input type="checkbox" v-model={{
                           bind: bool,
                           handler: this.setVal
                       }}/>
                   </label>
                   <label>
                       <select v-model={{
                           bind: selectValue,
                           handler: this.setVal
                       }}>
                           <option value={2333}>2333</option>
                           <option value={6666}>6666</option>
                       </select>
                   </label>
               </div>
           </div>
        )
    }
}



ReactDOM.render(<App/>, document.getElementById('app'));