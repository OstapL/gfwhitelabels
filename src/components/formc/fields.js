let exports = {
  outstandingSecurityType(index, values, fields) {
    let value = values.security_type;
    let resultVal = '';
    let el;

    if(value == 5) {
      resultVal = values.custom_security_type;
    } else {
      let oneOf = fields.outstanding_securities.schema.security_type.validate.OneOf;
      resultVal = oneOf.labels[oneOf.choices[parseFloat(value)]];
    }

    return `<a href="#" data-name="formc.outstanding_securities[${ index }].security_type"
      data-type='select'data-value="${value}"
      class="createField show-input link-1"> ${resultVal} </a>`;
  },
}

module.exports = exports;
