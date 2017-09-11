const roles = require('consts/team_member/roles.json');

const OFFICER_ROLES = [
  roles.OFFICER_CEO,
  roles.OFFICER_PFO,
  roles.OFFICER_VP,
  roles.OFFICER_SECRETARY,
  roles.OFFICER_PAO,
];

const DIRECTOR_ROLES = [
  roles.DIRECTOR,
];

const SHAREHOLDER_ROLES = [
  roles.SHAREHOLDER,
];

const ALL_ROLES = [].concat.apply([], [SHAREHOLDER_ROLES, DIRECTOR_ROLES, OFFICER_ROLES]);

const COMMENTS_ROLES_PRIORITY = [
  roles.OFFICER_CEO,
  roles.DIRECTOR,
  roles.OFFICER_PFO,
  roles.OFFICER_VP,
  roles.OFFICER_SECRETARY,
  roles.OFFICER_PAO,
  roles.OFFICER,
  roles.SHAREHOLDER,
];


module.exports = {
  isOfficer(role) {
    return role > 2;
  },

  isDirector(role) {
    return !!(role & roles.DIRECTOR);
  },

  isShareholder(role) {
    return !!(role & roles.SHAREHOLDER);
  },

  extractOfficerRoles(roleBitmap) {
    return this.extractRoles(roleBitmap, OFFICER_ROLES);
  },

  extractDirectorRoles(roleBitmap) {
    return this.extractRoles(roleBitmap, DIRECTOR_ROLES);
  },

  extractShareHolderRoles(roleBitmap) {
    return this.extractRoles(roleBitmap, SHAREHOLDER_ROLES);
  },

  extractRoles(roleBitmap, extractRoles=ALL_ROLES) {
    return (extractRoles || [])
      .filter(r => !!(r & roleBitmap))
      .map((r) => {
        return {
          title: roles.ROLES_SHORT[r],
          id: r,
        };
      });
  },

  extractRolesByPriority(roleBitmap) {
    let extractRoles = COMMENTS_ROLES_PRIORITY;
    let result = (extractRoles || []).find(r => !!(r & roleBitmap));
    return result
      ? [{
        title: roles.COMMENT_PRIORITY_ROLES_SHORT[result],
        id: result,
      }] : [];
  },

};
