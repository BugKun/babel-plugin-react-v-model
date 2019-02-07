import React, { Component } from "react"
import PropTypes from "prop-types"
import {inject, observer} from "mobx-react"
import "./index.scss"

@inject("TextStore")
@observer
export default class PageLayout extends Component {
    constructor(props) {
        super(props);

        this.state = {
            num: 233,
            text: "abc",
            bool: true,
            radio: "2",
            obj: {
                text: 666,
                obj: {
                    text:2333
                }
            }
        };

        this.setVal = this.setVal.bind(this);
    }

    static propTypes = {
        children: PropTypes.node
    };

    setVal(Val) {
        this.setState(Val);
    }


    filter(value) {
        return (value > 0)? value : 0;
    }

    render() {
        const { num, text, radio, bool, selectValue } = this.state;
        const {TextStore} = this.props;
        const {myText, setText} = TextStore;

        return (
            <div className="main">
                <h4>v-model example：</h4>
                <div>
                    <h4>Simple: </h4>
                    <label>
                        Textarea:
                        <textarea v-model={text}/>
                    </label>
                    <br />
                    <label>
                        Text Input:
                        <input type="text" v-model={text}/>
                    </label>
                    <br />
                    <label>
                        Textarea:
                        <textarea v-model={{
                            bind: this.state.obj.obj.text,
                            handler: this.setVal
                        }}/>
                    </label>
                    <br />
                    <p>{myText}</p>
                    <br />
                    <label>
                        Textarea(Store):
                        <textarea v-model={{
                            bind: this.props.TextStore.myText,
                            handler: setText
                        }}/>
                    </label>
                    <br />
                    <label>
                        Number:
                        <input type="number" v-model={num}/>
                    </label>
                    <br />
                    <label>
                        Checkbox:
                        <input type="checkbox" v-model={bool}/>
                    </label>
                    <br />
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
                    <br />
                    <label>
                        Select:
                        <select v-model={selectValue}>
                            <option value={2333}>2333</option>
                            <option value={6666}>6666</option>
                        </select>
                    </label>
                    <br />
                    <h4>With options:</h4>
                    <br />
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
                    <br />
                    <label>
                        v-model with handler:
                        <input type="checkbox" v-model={{
                            bind: bool,
                            handler: this.setVal
                        }}/>
                    </label>
                    <br />
                    <label>
                        Select:
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
        );
    }
}

