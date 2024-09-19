import AsyncStorage from "@react-native-async-storage/async-storage";

class Teacher {
  constructor() {
    this.getAllDetails();
  }
  subscribers = [];
  masterSubscribers = [];
  masterListInfo = [];
  TeacherMasterList = null;
  TeacherInfoComplete = null;

  getAllDetails = async () => {
    let teacherData = await AsyncStorage.getItem("MasterTeacher");
    teacherData = JSON.parse(teacherData);
    if (teacherData !== null) {
      this.setTeacherInfoComplete(teacherData);
    } else {
      this.setTeacherInfoComplete(null);
    }

  };

  get teacherID() {
    return this._teacherID;
  }

  setTeacherID(newTeacherID) {
    this._teacherID = newTeacherID;
  }

  getTeacherInfo() {
    return this.TeacherInfoComplete;
  }

  setTeacherInfoComplete(TeacherInfoComplete) {
    this.setTeacherID(TeacherInfoComplete?.id)
    this.TeacherInfoComplete = TeacherInfoComplete;
    this.updateAsyncStorage("MasterTeacher", TeacherInfoComplete);
    this.notifySubscribers();
  }

  updateAsyncStorage = async (key, value) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  };

  subscribe = (callback) => {
    this.subscribers.push(callback);
  };

  unsubscribe = (callback) => {
    const index = this.subscribers.indexOf(callback);
    if (index !== -1) {
      this.subscribers.splice(index, 1);
    }
  };

  notifySubscribers = () => {
    this.subscribers.forEach((callback) => {
      callback(this.TeacherInfoComplete);
    });
  };

  getSchoolID = () => {
    return this.TeacherInfoComplete?.school_id;
  };
}

Teacher.shared = new Teacher();
export default Teacher;
