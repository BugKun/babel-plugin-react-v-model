module.exports = ({ types: babelTypes, template }) => ({
    visitor: {
        JSXIdentifier(path) {
            if (path.node.name === 'v-model') {
                const {
                        JSXAttribute,
                        JSXIdentifier,
                        JSXExpressionContainer,
                        Identifier,
                        FunctionExpression,
                    } = babelTypes,
                    model = path.container.value.expression,
                    htmlTag = path.parentPath.parent.name.name;


                let InputValue = 'e.target.value',
                    InputType = null,
                    InputRadioVal = undefined;


                if(!/input|textarea|select/.test(htmlTag)) return;

                if(htmlTag === 'input'){
                    const attributes = path.parentPath.parent.attributes;
                    let isRadio = false;
                    for(let i = 0; i < attributes.length; i++) {
                        const $_name = attributes[i].name.name;
                        if($_name === 'type'){
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
                        if(isRadio && $_name === 'value') {
                            const expression = attributes[i].value.expression;
                            InputRadioVal = (expression)? expression : attributes[i].value;
                            break;
                        }
                    }
                }

                let name = null;

                if (model.type === 'Identifier') {
                    name = path.container.value.expression.name;

                    path.parentPath.parent.attributes.push(
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
                } else if (model.type === 'ObjectExpression') {
                    const properties = path.container.value.expression.properties;

                    let options = {};
                    properties.forEach(item => {
                        options[item.key.name] = item
                    });
                    name = options.bind.value.name;

                    let replace = {
                        NAME: Identifier(name),
                        VALUE: template(InputValue)()
                    };

                    properties.forEach(item => {
                        options[item.key.name] = item
                    });
                    let templateText = '(e) => {';

                    if (options.filter) {
                        const text = `const filter = FILTER;`;
                        if(options.filter.value) {
                            replace.FILTER = options.filter.value;
                            templateText += text;
                        }else if(options.filter.params && options.filter.body) {
                            replace.FILTER = FunctionExpression(
                                null,
                                options.filter.params,
                                options.filter.body
                            );
                            templateText += text;
                        }
                    }
                    if (options.handler) {
                        const text = `const setVal = SETVAL;`;
                        if(options.handler.value) {
                            replace.SETVAL = options.handler.value;
                            templateText += text;
                        }else if(options.handler.params && options.handler.body) {
                            replace.SETVAL = FunctionExpression(
                                null,
                                options.handler.params,
                                options.handler.body
                            );
                            templateText += text;
                        }
                    }

                    if (options.filter && options.handler) {
                        templateText += `setVal({NAME: filter(VALUE)});`
                    } else if (options.filter) {
                        templateText += `this.setState({NAME: filter(VALUE)});`
                    } else if (options.handler) {
                        templateText += `setVal({NAME: VALUE});`
                    } else {
                        templateText += `this.setState({NAME: VALUE});`
                    }
                    templateText += '}';

                    path.parentPath.parent.attributes.push(
                        JSXAttribute(
                            JSXIdentifier("onChange"),
                            JSXExpressionContainer(
                                template(templateText)(replace).expression
                            )
                        )
                    );

                    path.container.value = JSXExpressionContainer(
                        Identifier(name)
                    );
                }
                if(InputType === "radio") {
                    path.container.value = JSXExpressionContainer(
                        template(`${name} == VALUE`)({ VALUE: InputRadioVal }).expression
                    );
                }
                path.container.name.name = (InputType === "checkbox" || InputType === "radio")? 'checked' : 'value';
            }

        },
    }
});
