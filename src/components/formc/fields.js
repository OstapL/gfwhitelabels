let exports = {
  outstandingSecurityType(index, values, fields) {
    let value = values.security_type;
    let resultVal = '';
    let el;
    let name = "security_type";

    if(value == 5) {
      resultVal = values.custom_security_type;
      name = "custom_security_type";
    } else {
      let oneOf = fields.outstanding_securities.schema.security_type.validate.choices;
      resultVal = oneOf[value];
    }

    return `<a href="#" data-name="formc.outstanding_securities[${ index }].${ name }"
      data-type='select'data-value="${value}"
      class="createField show-input link-1"> ${resultVal} </a>`;
  },
}

module.exports = exports;
