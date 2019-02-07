const generator = require('babel-generator').default;


function InputValueHandler(expression, hasHandler) {
    const {code} = generator(expression.node),
        keys = code.split('.');

    let codeRemix = null,
        value = null,
        name = undefined;

    if(keys[0] === 'this') {
        if(keys[1] === 'state') {
            name = keys[2];
            if(name) {
                codeRemix = code.replace('this.state.', '');
            }else {
                throw expression.buildCodeFrameError('Do not use the variable "this.state" directly. Please refer to the relevant specifications of React!');
            }
            value = `this.state.${name}`;
        }else if(keys[1] === 'props') {
            if(hasHandler) {
                name = keys[2];
                codeRemix = code;
                value = `this.state.${name}`;
            }else {
                throw expression.buildCodeFrameError(`The "handler" is missing, you can't directly change the value of "this.props", please refer to the relevant specifications of React!`);
            }
        }else {
            throw expression.buildCodeFrameError(`Do not use "this.xxx" because it can't update the render. Please refer to the relevant specifications of React!`);
        }
    }else {
        name = keys[0];
        codeRemix = code;
        value = name;
    }

    return {
        name,
        code,
        value,
        from: keys[1],
        codeRemix
    }
}


module.exports = ({ types: babelTypes, template }) => ({
    visitor: {
        JSXIdentifier(path) {
            if (path.node.name === 'v-model') {
                const {
                        JSXAttribute,
                        JSXIdentifier,
                        JSXExpressionContainer,
                        Identifier,
                        FunctionExpression
                    } = babelTypes,
                    parentPath = path.parentPath,
                    model = parentPath.get('value.expression'),
                    htmlTag = parentPath.parent.name.name;

                let InputValue = 'e.target.value',
                    InputType = null,
                    InputRadioVal = undefined;


                if(!/input|textarea|select/.test(htmlTag)) return;

                if(htmlTag === 'input'){
                    const attributes = parentPath.parent.attributes;
                    let isRadio = false;
                    for(let i = 0; i < attributes.length; i++) {
                        const attributeName = attributes[i].name.name;
                        if(attributeName === 'type'){
                            const type = attributes[i].value.value;
                            InputType = type;
                            if(type === 'checkbox') {
                                InputValue = 'e.target.checked';
                            }
                            if(type === 'radio') {
                                isRadio = true;
                            }
                            if(!isRadio) break;
                        }
                        if(isRadio && attributeName === 'value') {
                            const expression = attributes[i].value.expression;
                            InputRadioVal = (expression)? expression : attributes[i].value;
                            break;
                        }
                    }
                }

                let name = null,
                    onChange = undefined;

                if (model.isIdentifier()) {
                    name = path.container.value.expression.name;

                    onChange = (
                        JSXAttribute(
                            JSXIdentifier("onChange"),
                            JSXExpressionContainer(
                                template(`
                                        (e) => {
                                            this.setState({
                                                ${name}: ${InputValue}
                                            })
                                        }
                                    `)().expression
                            )
                        )
                    )
                } else if (model.isObjectExpression()) {

                    let options = {},
                        replace = {},
                        templateText = '(e) => {';      
                        
                        
                    const properties = parentPath.get('value.expression.properties');

                    for(let i = 0; i < properties.length; i++) {
                        const itemPath = properties[i],
                        item = itemPath.node;

                        const key_name = item.key.name,
                            KEY_NAME = key_name.toUpperCase();

                        options[key_name] = itemPath;
                        if(key_name !== 'bind') {
                            const text = `const ${key_name} = ${KEY_NAME};`;
                            if(item.value) {
                                replace[KEY_NAME] = item.value;
                                templateText += text;
                            }else if(item.params && item.body) {
                                replace[KEY_NAME] = FunctionExpression(
                                    null,
                                    item.params,
                                    item.body
                                );
                                templateText += text;
                            }
                        }
                    }

                    const bindValuePath = options.bind.get('value');

                    name = bindValuePath.node.name;

                    const isMemberExpression = bindValuePath.isMemberExpression();
                    if(bindValuePath.isThisExpression()) {
                        throw bindValuePath.buildCodeFrameError('Do not use "this" directly. Please refer to the relevant specifications of React!');
                    }

                    const handler = (str) => (options.handler)? `handler(${str})` : `this.setState(${str})`;
                    if(name) {
                        replace.NAME = Identifier(name);
                        replace.VALUE = template(InputValue)();

                        const bindValue = `{NAME: ${(options.filter)? 'filter(VALUE)' : 'VALUE'}}`;
                        templateText += handler(bindValue);
                    }else if(isMemberExpression){
                        const {code, name, value, from} = InputValueHandler(bindValuePath, options.handler);
                        const filterValue = (options.filter)? `filter(${InputValue})` : InputValue;
                        replace.NAME = Identifier(name);
                        replace.VALUE = template(value)();
                        let bindValue = undefined;
                        if(from === 'props') {
                            bindValue = filterValue
                        }else {
                            bindValue = `{NAME: VALUE}`;
                            templateText += `${code} = ${filterValue};`
                        }
                     

                        templateText += handler(bindValue);
                    }
                    
                    templateText += '}';

                    onChange = (
                        JSXAttribute(
                            JSXIdentifier("onChange"),
                            JSXExpressionContainer(
                                template(templateText)(replace).expression
                            )
                        )
                    );

                    parentPath.get('value').replaceWith(
                        JSXExpressionContainer(
                            bindValuePath.node
                        )
                    );
                }else if (model.isMemberExpression()) {
                    const {code, name, value} = InputValueHandler(
                        parentPath.get('value.expression')
                    );

                    onChange = (
                        JSXAttribute(
                            JSXIdentifier("onChange"),
                            JSXExpressionContainer(
                                template(`
                                    (e) => {
                                        ${code} = ${InputValue};
                                        ${
                                            (name === code)?
                                            ''
                                            :
                                            `this.setState({
                                                ${name}: ${value}
                                            });`
                                        }
                                    }
                                `)().expression
                            )
                        )
                    )                   
                }

                parentPath
                    .findParent(path => path.isJSXOpeningElement())
                    .pushContainer(
                        'attributes',
                        onChange
                    );

                if(InputType === "radio") {
                    parentPath.get('value').replaceWith(
                        JSXExpressionContainer(
                            template(`${name} == VALUE`)({ VALUE: InputRadioVal }).expression
                        )
                    );
                }
                parentPath.get('name').replaceWith(
                    JSXIdentifier(
                        (InputType === "checkbox" || InputType === "radio")? 'checked' : 'value'
                    )
                )
            }

        },
    }
});