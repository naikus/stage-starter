const {createComponent, elem} = require("vidom"),
    VALID = {valid: true, message: ""},

    defaultFieldRenderer = fldModel => {
      const {node: Field, valid, message, showLabel, hint} = fldModel,
          {id, type, name, label} = Field.attrs,
          labelComponent = showLabel ? (
            <label htmlFor={id}>
              <span>{label}</span>
              {hint ? <span className="hint">{hint}</span> : null}
            </label>
          ) : null,
          messageComponent = !valid ? (<span className="v-msg hint">{message}</span>) : null;

      return (
        <div class={`field-container ${name} ${type} valid-${valid}`}>
          {labelComponent}
          {Field}
          {messageComponent}
        </div>
      );
    },

    Form = createComponent({
      displayName: "Form",

      initializeFields() {
        const {children} = this,
            fields = children.map((child, i) => {
              return this.createFieldModel(child, i);
            });
        this.setState({
          pristine: true,
          valid: true,
          fields
        });
      },

      createFieldModel(fldNode, index) {
        const {name, defaultValue} = fldNode.attrs,
            fieldId = fldNode.attrs.id || fldNode.key || "field_" + index,
            fieldName = name || fieldId;
        return {
          node: fldNode,
          name: fieldName,
          valid: true,
          pristine: true,
          message: null,
          value: defaultValue || null
        };
      },

      validateField(name, value, fields) {
        const {rules = {}} = this.attrs,
            fieldRules = rules[name],
            field = fields[name];

        let result = VALID;
        if(!fieldRules) {
          return result;
        }

        fieldRules.some(r => {
          const v = r(value, field, fields);
          if(typeof (v) !== "undefined" && !v.valid) {
            result = v;
            return true;
          }
          return false;
        });
        return result;
      },

      getFieldsMap(fields) {
        return fields.reduce((coll, f) => {
          coll[f.name] = f;
          return coll;
        }, {});
      },

      validateForm(fields) {
        let valid = true, fieldsInfo = this.getFieldsMap(fields);
        fields.some(f => {
          const v = this.validateField(f.name, f.value, fieldsInfo);
          if(!v.valid) {
            valid = false;
            return true;
          }
        });
        return valid;
      },

      handleFieldChange(name, event) {
        const {target} = event,
            type = target.type,
            value = (type === "checkbox" || type === "radio") ?
              target.checked : target.value || target.textContent,
            {onChange} = this.attrs,
            {fields} = this.state,
            fieldsInfo = this.getFieldsMap(fields),
            validation = this.validateField(name, value, fieldsInfo),
            {valid, message} = validation,
            newFields = fields.map(f => {
              if(f.name === name) {
                return Object.assign({}, f, {
                  valid,
                  message,
                  pristine: false,
                  value
                });
              }
              return f;
            }),
            newState = {
              valid: valid ? this.validateForm(newFields) : false,
              pristine: false,
              fields: newFields
            };
        if(newState.valid) {
          newState.fields.forEach(f => {
            f.valid = true,
            f.message = "";
          });
        }
        this.setState(newState);
        // console.log(newState);
        onChange && onChange(newState);
      },

      setFormState() {
        const {fields, pristine} = this.state,
            {onChange} = this.attrs,
            valid = this.validateForm(fields),
            newState = {
              valid,
              pristine,
              fields
            };
        // console.log("Form state", newState);
        this.setState(newState);
        onChange && onChange(newState);
      },

      renderField(field, index) {
        const {fieldRenderer = defaultFieldRenderer} = this.attrs,
            nodeAttrs = field.node.attrs,
            attrs = {
              ...nodeAttrs,
              value: field.value,
              onChange: e => {
                this.handleFieldChange(attrs.name, e);
                nodeAttrs.onChange && nodeAttrs.onChange(e);
              }
              /*
              onInput: e => {
                this.handleFieldChange(attrs.name, e);
                nodeAttrs.onInput && nodeAttrs.onInput(e);
              }
              */
            },
            fieldModel = Object.assign({}, field, {
              node: field.node.clone(attrs, field.node.children, null),
              hint: attrs["data-hint"],
              showLabel: attrs["data-showlabel"] === false ? false : true
            });

        return fieldRenderer(fieldModel);
      },

      preventSubmit(e) {
        e.preventDefault();
        return false;
      },

      onInit() {
        this.initializeFields();
      },

      onMount() {
        this.setFormState();
      },

      onRender() {
        // console.log("Children", this.children);
        const fields = this.state.fields.map((fm, i) => {
          return this.renderField(fm, i);
        });
        return (
          <form onSubmit={this.preventSubmit} class={"form " + (this.attrs.class || "")}>
            {fields}
          </form>
        );
      }
    });

module.exports = Form;
