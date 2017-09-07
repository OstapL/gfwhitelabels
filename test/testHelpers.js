
module.exports = {
  fillForm($form, data) {
    Object.keys(data || {}).forEach((name) => {
      $form.find(`[name=${name}]`).val(data[name]);
    });
  },

  printObject(obj) {
    console.log(JSON.stringify(obj, void(0), 2));
  }

};