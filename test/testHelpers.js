
module.exports = {
  fillForm($form, data) {
    _.each(data, (value, name) => {
      $form.find(`[name=${name}]`).val(value);
    });
  },

  printObject(obj) {
    console.log(JSON.stringify(obj, void(0), 2));
  }

};