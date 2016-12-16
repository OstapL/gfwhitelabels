const isBoolean = function(val) {
  return val == 0 || val == 1 || val == true || val == false;
}

module.exports = {
  calcProgress: function(data) {
    return {
      'general_information': 
        data.pitch.length > 5 &&
        data.intended_use_of_proceeds.length > 5 &&
        data.business_model.length > 5,
      'media':
        data.header_image_image_id != null &&
        data.list_image_image_id != null &&
        data.gallery_group_data.length > 0,
      'specifics': 
        data.minimum_raise >= 25000 &&
        data.maximum_raise <= 1000000 &&
        data.minimum_increment >= 100 &&
        data.length_days >= 60 &&
        data.investor_presentation_file_id != null &&
        isBoolean(data.security_type),
      'team-members': data.team_members.length > 0,
      'perks': data.perks.length > 0
    }
  },

  updateMenu: function(progress) {
    let complited = 0;
    _(progress).each((v,k) => {
      let el = null;
      if(v == false) {
        el = document.querySelector('#menu_c_' + k + ' .icon-check');
        if(el != null) {
          el.remove();
        }
      } else {
        if(k != 'perks') {
          complited ++;
        }
        if(document.querySelector('#menu_c_' + k + ' .icon-check') == null) {
          document.querySelector('#menu_c_' + k).innerHTML += ' <div class="icon-check"><i class="fa fa-check-circle-o"></i></div>';
        }
      }
    });
    
    if(complited == 4) {
      document.querySelectorAll('#form_c a.disabled').forEach((v, i) => {
        v.className = v.className.replace('disabled', '');
      });
    }
  },
};
