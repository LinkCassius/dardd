import { getCurrentUser } from "../services/authService";
import NavigationsItems from "../_nav";

export const generateNavigationItems = () => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const permissionObject = currentUser.permission;

  if (permissionObject && permissionObject.includes("Everything Access")) {
    return NavigationsItems;
  }

  let navItems = NavigationsItems;
  for (let index = 0; index < navItems.items.length; index++) {
    const element = navItems.items[index];

    if (typeof element !== "undefined") {
      if (typeof element.children !== "undefined") {
        for (let j = 0; j < element.children.length; j++) {
          const subElement = element.children[j];
          if (typeof subElement !== "undefined") {
            let i = permissionObject.findIndex((obj) =>
              obj.includes(subElement.permission)
            );
            if (i < 0) {
              delete navItems.items[index].children[j];
            }
          }
        }
        element.children = element.children.filter(function (el) {
          return el != null;
        });
        if (element.children.length === 0) {
          delete navItems.items[index];
        }
      } else {
        let i = permissionObject.findIndex((obj) =>
          obj.includes(element.permission)
        );
        if (i < 0) {
          delete navItems.items[index];
        }
      }
    }
  }
  navItems.items = navItems.items.filter(function (el) {
    return el != null;
  });
  return navItems;
};

export const check = (action) => {
  const permissions = getCurrentUser().permission;
  if (permissions.includes("Everything Access")) {
    return true;
  }

  if (!permissions) {
    // role is not present in the rules
    return false;
  }
  if (action && permissions.includes(action)) {
    // static rule not provided for action
    return true;
  }
  return false;
};
