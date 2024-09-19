import { Appearance } from "react-native";

class Theme {
  currentTheme = null;
  constructor() {
    this.addAppearanceListener();
  }

  addAppearanceListener = async () => {
    currentTheme = Appearance.getColorScheme();
    Appearance.addChangeListener((mAppearance) => {
      currentTheme = mAppearance.colorScheme;
    });
  };
  get currentTheme() {
    return 'white'; //todo change accordingly if required
  }
}
Theme.shared = new Theme();
export default Theme;
