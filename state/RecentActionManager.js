import AsyncStorage from "@react-native-async-storage/async-storage";
let defaultAction = [0, 1, 2, 3];

const saveLastActions = async (actions) => {
  try {
    await AsyncStorage.setItem("lastActions", JSON.stringify(actions));
  } catch (error) {
    console.error("Error saving actions:", error);
  }
};

export const getActions = async () => {
  try {
    let action = await AsyncStorage.getItem("lastActions");
    if (action !== null) defaultAction = JSON.parse(action);
    return defaultAction;
  } catch (error) {
    console.error("Error retrieving actions:", error);
  }
};

export const handleAction = (action) => {
  if (defaultAction.indexOf(action) == -1) {
    defaultAction.pop();
    const updatedActions = [action, ...defaultAction];
    saveLastActions(updatedActions);
  }
};
