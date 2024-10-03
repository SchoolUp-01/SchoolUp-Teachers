import ErrorLogger from "../utils/ErrorLogger";
import getUserInfo from "../utils/getUserInfo";
import { supabase } from "./supabaseClient";
import * as ImageManipulator from "expo-image-manipulator";
import { decode } from "base64-arraybuffer";
import {
  class_info_db,
  concern_info_db,
  conversation_info_db,
  daily_task_info_db,
  exam_info_db,
  exam_timetable_info_db,
  holiday_calendar_db,
  leave_applications_db,
  lesson_info_db,
  message_info_db,
  parent_info_db,
  parent_notification_db,
  school_event_info,
  school_info_db,
  school_management_db,
  student_info_db,
  student_memories_db,
  student_report_info_db,
  student_statistics_db,
  subject_info_db,
  subject_notification_db,
  subject_report_info_db,
  teacher_info_db,
  teacher_notification_info_db,
  team_info_db,
  timetable_info_db,
} from "../utils/Constants";
import Teacher from "../state/TeacherManager";
let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

class supabase_api {
  user = null;

  constructor() {
    supabase.auth.getUser().then((user) => {
      this.user = user?.data?.user;
    });
  }

  get uid() {
    if (this.user === null) {
      supabase.auth.getUser().then((value) => {
        this.user = value?.data?.user;
      });
    }
    return this.user?.id ?? supabase.auth.getUser()?.id;
  }

  setUid(value) {
    this.user = value;
  }

  createUser = async (fullName, phoneNumber, avatar_uri) => {
    return new Promise(async (res, rej) => {
      let avatar = null;
      if (avatar_uri !== "") {
        avatar = await this.uploadAvatar(avatar_uri);
      }
      let email = (await supabase.auth.getUser())?.data?.user?.email;
      const { data, error } = await supabase.from(teacher_info_db).insert({
        name: fullName,
        avatar: avatar,
        email_id: email,
        phone_number: phoneNumber,
        device_info: JSON.stringify(getUserInfo()),
      });
      if (error) {
        ErrorLogger.shared.ShowError("SupabaseAPI: CreateUser: ", error);
        rej(error);
      }
      res(data);
    });
  };

  editUser = async (fullName, phoneNumber, avatar_uri, user) => {
    return new Promise(async (res, rej) => {
      let avatar = user.avatar;
      if (avatar_uri !== avatar) {
        avatar = await this.uploadAvatar(avatar_uri, true);
      }
      const { data, error } = await supabase
        .from(teacher_info_db)
        .update({
          name: fullName,
          avatar: avatar,
          phone_number: phoneNumber,
        })
        .eq("id", this.uid);
      if (error) {
        ErrorLogger.shared.ShowError("SupabaseAPI: CreateUser: ", error);
        rej(error);
      }
      res(data);
    });
  };

  uploadAvatar = async (uri, upsert = false) => {
    try {
      let avatar = await this.createTransformedAvatarUrl(uri);
      avatar_url = await this.uploadProfileImageAsync(
        uri,
        avatar.base64,
        this.uid + "/avatar",
        upsert
      );
      return avatar_url;
    } catch (error) {
      ErrorLogger.shared.ShowError(
        "SupabaseAPI: uploadAvatar: ",
        "Exception: " + error
      );
    }
  };

  createTransformedAvatarUrl = async (image) => {
    try {
      let results = await ImageManipulator.manipulateAsync(
        image,
        [
          {
            resize: {
              width: 300,
              height: 300,
            },
          },
        ],
        {
          compress: 1,
          format: ImageManipulator.SaveFormat.PNG,
          base64: true,
        }
      );
      return results;
    } catch (error) {
      ErrorLogger.shared.ShowError(
        "SupabaseAPI: createTransformAvatarURL:",
        error
      );
    }
  };

  uploadProfileImageAsync = async (image, base64, filePath, upsert) => {
    try {
      const fileExt = image.split(".").pop();
      let uploadError = null;
      if (upsert) {
        let { error } = await supabase.storage
          .from("teacher")
          .update(filePath, decode(base64), {
            contentType: "image/" + fileExt,
            upsert: upsert,
          });
        uploadError = error;
      } else {
        let { error } = await supabase.storage
          .from("teacher")
          .upload(filePath, decode(base64), {
            contentType: "image/" + fileExt,
          });
        uploadError = error;
      }
      if (uploadError) {
        ErrorLogger.shared.ShowError(
          "SupabaseAPI: uploadProfileImageAsync: ",
          uploadError
        );
        return null;
      } else {
        const { data } = supabase.storage
          .from("teacher")
          .getPublicUrl(filePath);
        return data?.publicUrl;
      }
    } catch (error) {
      ErrorLogger.shared.ShowError(
        "SupabaseAPI: UploadProfileImageAsync:",
        error + " " + filePath
      );
    }
  };

  updateMasterChild = async (id) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(parent_info_db)
        .update({
          master_child: id,
        })
        .eq("id", this.uid);
    });
  };

  getParentInfo = async (uid, values) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(parent_info_db)
        .select(values)
        .eq("id", uid)
        .limit(1);
      if (error) rej(error);
      if (data) res(data[0]);
    });
  };

  getStudentDetailsWithVerification = (studentID, schoolName, value) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(student_info_db)
        .select(value)
        .eq("id", studentID)
        .eq("school_info.name", schoolName)
        .limit(1);
      if (error) rej(error);
      if (data) res(data.length !== 0 ? data[0] : null);
    });
  };

  getMasterStudentInfoFromParent = () => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(parent_info_db)
        .select(
          "student_info!inner(id,name,avatar,class_info!inner(id,standard,section,classteacher_id,teacher_info(name,avatar)),school_info!inner(id,name)),children_list"
        )
        .eq("id", this.uid)
        .single();
      if (error) rej(error);
      res(data);
    });
  };

  editStudentInfo = async (homeAddress, contactNumber, avatar_uri, user) => {
    return new Promise(async (res, rej) => {
      let avatar = user.avatar;
      if (avatar_uri !== avatar) {
        avatar = await this.uploadStudentAvatar(user, avatar_uri, false);
      }
      const { data, error } = await supabase
        .from(student_info_db)
        .update({
          home_address: homeAddress,
          avatar: avatar,
          contact_number: contactNumber,
        })
        .eq("id", user?.id)
        .select(
          "id,name,avatar,home_address,contact_number,class_info!inner(id,standard,section,classteacher_id,teacher_info(name,avatar)),school_info!inner(id,name)"
        )
        .single();
      if (error) {
        ErrorLogger.shared.ShowError("SupabaseAPI: editStudentInfo: ", error);
        rej(error);
      }
      res(data);
    });
  };

  uploadStudentAvatar = async (user, uri, upsert = false) => {
    try {
      const {
        id,
        school_info: { id: schoolID },
      } = user;
      let avatar = await this.createTransformedAvatarUrl(uri);
      avatar_url = await this.uploadStudentImageAsync(
        uri,
        avatar.base64,
        schoolID + "/student/" + id + "/" + Date.now(),
        upsert
      );
      return avatar_url;
    } catch (error) {
      ErrorLogger.shared.ShowError(
        "SupabaseAPI: uploadStudentAvatar: ",
        "Exception: " + error
      );
    }
  };

  uploadStudentImageAsync = async (image, base64, filePath, upsert) => {
    try {
      const fileExt = image.split(".").pop();
      let uploadError = null;
      if (upsert) {
        let { error } = await supabase.storage
          .from("school")
          .update(filePath, decode(base64), {
            contentType: "image/" + fileExt,
            upsert: upsert,
          });
        uploadError = error;
      } else {
        let { error } = await supabase.storage
          .from("school")
          .upload(filePath, decode(base64), {
            contentType: "image/" + fileExt,
          });
        uploadError = error;
      }
      if (uploadError) {
        ErrorLogger.shared.ShowError(
          "SupabaseAPI: uploadStudentImageAsync: ",
          uploadError
        );
        return null;
      } else {
        const { data } = supabase.storage.from("school").getPublicUrl(filePath);
        return data?.publicUrl;
      }
    } catch (error) {
      ErrorLogger.shared.ShowError(
        "SupabaseAPI: uploadStudentImageAsync:",
        error + " " + filePath
      );
    }
  };

  getSchoolInformation = (schoolID) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(school_info_db)
        .select("*")
        .eq("id", schoolID)
        .limit(1);
      if (error) rej(error);
      res(data.length !== 0 ? data[0] : null);
    });
  };

  getSchoolNameSuggestions = (searchText) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(school_info_db)
        .select("name")
        .ilike("name", `%${searchText.split()}%`)
        .limit(3); // Limit the number of suggestions
      if (error) rej(error);
      else res(data);
    });
  };

  getSchoolManagementInformation = (schoolID, startIndex = 0, endIndex = 5) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(school_management_db)
        .select("name,avatar,designation,education,description")
        .eq("school_id", schoolID)
        .range(startIndex, endIndex);
      if (error) rej(error);
      res(data);
    });
  };

  getSchoolEventInformation = (schoolID, startIndex = 0, endIndex = 5) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(school_event_info)
        .select("title,description,avatar,created_at")
        .eq("school_id", schoolID)
        .range(startIndex, endIndex);
      if (error) rej(error);
      res(data);
    });
  };

  getStudentStatistics = (studentID, values) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(student_statistics_db)
        .select(values)
        .eq("id", studentID)
        .limit(1);
      if (error) rej(error);
      if (data) res(data[0]);
    });
  };

  getStudentDetails = (studentID, value) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(student_info_db)
        .select(value)
        .eq("id", studentID)
        .limit(1);
      if (error) rej(error);
      if (data) res(data.length !== 0 ? data[0] : null);
    });
  };

  addStudentToParentList = async (id) => {
    return new Promise(async (res, rej) => {
      const { data: oldData, error: oldError } = await supabase
        .from(parent_info_db)
        .select("children_list")
        .eq("id", this.uid)
        .single();
      if (oldError) rej(oldError);
      let newList = oldData.children_list || [];
      newList = [...newList, id];
      //update masterStudentID to new StudentID
      Student.shared.setStudentID(id);
      Student.shared.setStudentMasterList(newList);
      supabase.auth.updateUser({
        data: { masterStudentID: id },
      });
      const { data, error } = await supabase
        .from(parent_info_db)
        .update({ children_list: newList })
        .eq("id", this.uid);
      if (error) rej(error);
      else res(data);
    });
  };

  removeStudentFromParentList = async (id) => {
    return new Promise(async (res, rej) => {
      const { data: oldData, error: oldError } = await supabase
        .from(parent_info_db)
        .select("children_list")
        .eq("id", this.uid)
        .single();
      if (oldError) rej(oldError);
      let newList = oldData.children_list || [];

      const indexToRemove = newList.indexOf(id);
      if (indexToRemove !== -1) {
        newList = newList.filter((itemId) => itemId !== id);
      }
      Student.shared.setStudentMasterList(newList);
      const { data, error } = await supabase
        .from(parent_info_db)
        .update({ children_list: newList })
        .eq("id", this.uid);
      if (error) rej(error);
      else res(data);
    });
  };

  getMasterStudentInfoList = async (children_list) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(student_info_db)
        .select(
          "id,name,avatar,roll_no,home_address,contact_number,class_info!inner(id,standard,section,classteacher_id,teacher_info(name,avatar)),school_info!inner(id,name)"
        )
        .in("id", children_list);
      if (error) rej(error);
      res(data);
    });
  };

  getStudentHolidayList = async (school_id) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(holiday_calendar_db)
        .select("start_date,end_date,type,avatar,remark")
        .order("start_date", { ascending: true });
      // .eq("school_id", Student.shared.getMasterStudentSchoolID());//todo rj change it to Master School ID
      if (error) rej(error);
      else res(data);
    });
  };

  getStudentInfoFromList = async (
    children_list,
    value = "id,name,avatar,roll_no"
  ) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(student_info_db)
        .select(value)
        .in("id", children_list);
      if (error) rej(error);
      res(data);
    });
  };

  addLeaveRequest = async (from, to, type, reason) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(leave_applications_db)
        .insert({
          student_id: Student.shared.studentID,
          parent_id: this.uid,
          teacher_id: Student.shared.getMasterStudentTeacherID(),
          reason,
          start_date: new Date(from),
          end_date: new Date(to),
          type: type,
        });
      if (error) rej(error);
      else {
        await supabase.rpc("increment_leave_count", {
          row_id: Student.shared.studentID,
        });
        if (type === "Sick Leave")
          await supabase.rpc("increment_sick_count", {
            row_id: Student.shared.studentID,
          });
        res(data);
      }
    });
  };

  updateLeaveRequest = async (leaveID, reason, approve) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(leave_applications_db)
        .update({
          approved: approve,
          approved_on: new Date().toISOString(),
          remark: reason,
        })
        .eq("id", leaveID);
      if (error) rej(error);
      res(data);
    });
  };

  getLeaveApplication = async (startIndex = 0, endIndex = 5) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(leave_applications_db)
        .select(
          "id,created_at,reason,approved,approved_on,start_date,end_date,type,parent_id,parent_info!inner(name),teacher_info!inner(id,name),student_info!inner(id,name,avatar,class_info!inner(standard,section))"
        )
        .gte("end_date", new Date().toISOString()) // Get all leaves that are not expired yet
        .order("start_date", { ascending: false })
        .eq("teacher_id", this.uid)
        .range(startIndex, endIndex);
      if (error) rej(error);
      else res(data);
    });
  };

  getTeachersDetails = async (classID, value) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(subject_info_db)
        .select("subject,progress,teacher_info!inner(id,name,avatar)")
        .eq("class_id", classID);
      if (error) rej(error);
      else res(data);
    });
  };

  getTeacherSubjectDetails = async (classID, value) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(subject_info_db)
        .select(
          "subject,progress,class_info!inner(id,standard,section,student_count)"
        )
        .eq("teacher_id", this.uid);
      if (error) rej(error);
      else res(data);
    });
  };

  getTimeTable = async (classID) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(timetable_info_db)
        .select(
          "class_id,end_hour,end_minute,location,start_hour,start_minute,subject_id,title,day,subject_info!inner(subject,teacher_id),class_info!inner(standard,section)"
        )
        .eq("subject_info.teacher_id", this.uid);
      if (error) rej(error);
      else res(data);
    });
  };

  getTimeTableForDay = async (day) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(timetable_info_db)
        .select(
          "class_id,end_hour,end_minute,location,start_hour,start_minute,subject_id,title,day,subject_info!inner(subject,teacher_id,teacher_info(name,avatar))"
        )
        .eq("class_id", Student.shared.getMasterStudentClassID())
        .eq("day", day);
      if (error) rej(error);
      else res(data);
    });
  };

  getRemainingTimeTable = async () => {
    return new Promise(async (res, rej) => {
      const today = new Date(); // Current date
      const currentHour = today.getHours(); // Current hour
      const currentMinutes = today.getMinutes(); // Current minutes

      const { data, error } = await supabase
        .from(timetable_info_db)
        .select(
          "id, class_id, class_info!inner(standard,section), end_hour, end_minute, location, start_hour, start_minute, subject_id, title, day, subject_info!inner(subject,teacher_id,team_info(name,avatar))"
        )
        .eq("day", days[today.getDay()]) // Filter by the current day of the week
        .order("start_hour") // Order by start hour
        .order("start_minute") // Order by start time
        .eq("subject_info.teacher_id", this.uid);
      // .neq("daily_task_info.timetable_id",'7d257e2b-1f9c-4c54-9a3c-a7746192c57a') // Filter by teacher_id
      // .eq(
      //   `daily_task_info.timetable_id.eq.${timetable_info_db}.id`, // Check timetable_id equality
      // );
      if (error) {
        rej(error);
      }
      res(data);
    });
  };

  getExamTimeTable = async (classID) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(exam_info_db)
        .select("id,title,start_date,end_date")
        .order("start_date", { ascending: false })
        .eq("class_id", Student.shared.getMasterStudentClassID())
        .limit(1);
      if (error) rej(error);
      else res(data.length == 0 ? null : data[0]);
    });
  };

  getExamTimeTableDetails = async (examID) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(exam_timetable_info_db)
        .select(
          "subject_id,subject_info(subject),start_time,end_time,exam_date,portion"
        )
        .order("exam_date", { ascending: true })
        .eq("exam_id", examID);
      if (error) rej(error);
      else res(data);
    });
  };

  getSubjectInfoList = async () => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(subject_info_db)
        .select(
          "class_id,id,progress,subject,teacher_id,teacher_info(name,avatar),class_info(standard,section)"
        )
        .eq("teacher_id", "0d05b200-1a18-4d88-a27d-c4a469fca586");
      if (error) rej(error);
      else res(data);
    });
  };

  //Raise a concern
  addConcernReport = async (type, reason) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase.from(concern_info_db).insert({
        parent_id: this.uid,
        child_id: Student.shared.studentID,
        teacher_id: Student.shared.getMasterStudentTeacherID(),
        reason,
        type,
        school_id: Student.shared.getMasterStudentSchoolID(),
      });
      if (error) rej(error);
      else {
        await supabase.rpc("increment_student_concern_count", {
          row_id: Student.shared.studentID,
        });
        await supabase.rpc("increment_school_concern_count", {
          row_id: Student.shared.getMasterStudentSchoolID(),
        });
        res(data);
      }
    });
  };

  getConcernReport = async () => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(concern_info_db)
        .select(
          "id,created_at,parent_info!inner(id,name,avatar),student_info!inner(id,name,avatar),type,reason,remarks,closed_on"
        )
        .eq("teacher_id", this.uid);
      if (error) rej(error);
      else {
        res(data);
      }
    });
  };

  getExamInfo = async() =>{
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
      .from(exam_info_db)
      .select(
        "id,title,note,start_date,end_date,status,class_data")
        .eq("school_id",Teacher.shared.getSchoolID())
        if (error) rej(error);
        else {
          res(data);
          }
          });



  }

  async updateExam(values,exam_id) {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase.from(exam_info_db).update(values)
      .eq('id',exam_id);
      if (error) rej(error);
      res(data);
    });
  }

  async updateExamTimeTableInfo(values,exam_id,subject_id) {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase.from(exam_timetable_info_db).update(values)
      .match({'exam_id':exam_id,"subject_id":subject_id});
      if (error) rej(error);
      res(data);
    });
  }

  async getClassDetailsFromExam(exam_id) {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase.rpc('fetch_exam_details_by_exam_id',{
        exam_id_input: exam_id
      })
      if (error) rej(error);
      res(data);
    });
  }

  getIncompleteAcademicReportInfo = async () => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(exam_timetable_info_db)
        .select(
          "subject_id,exam_date,subject_info!inner(subject,teacher_id,class_id,class_info!inner(id,section,standard)),exam_id,exam_info!inner(id,title)"
        )
        .eq("subject_info.teacher_id", this.uid);
      if (error) rej(error);
      res(data);
    });
  };

  getStudentReportInfoDetails = async (exam_id) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(subject_report_info_db)
        .select(
          "total_marks,marks_scored,remarks,subject_id,subject_info!inner(subject,teacher_info(id,name,avatar))"
        )
        .eq("exam_id", exam_id);
      if (error) rej(error);
      res(data);
    });
  };

  getConversationInformation = async () => {
    console.log("UID: ", this.uid);
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(conversation_info_db)
        .select(
          "id,teacher_id,parent_info!inner(id,name,avatar),student_info!inner(name,avatar,class_info!inner(standard,section)),teacher_info!inner(id,name,avatar),last_uid,last_message,updated_on"
        )
        .eq("teacher_id", "0d05b200-1a18-4d88-a27d-c4a469fca586")
        .order("updated_on", { ascending: false });
      if (error) rej(error);
      res(data);
    });
  };

  getConversationID = async (parents_id) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(conversation_info_db)
        .select("id")
        .eq("parent_id", parents_id)
        .eq("teacher_id", this.uid)
        .limit(1);
      if (error) rej(error);
      res(data !== null ? data[0]?.id ?? null : null);
    });
  };

  addNewConversation = async (parentID) => {
    try {
      const { data, error } = await supabase
        .from(conversation_info_db)
        .insert({
          parent_id: parentID,
          teacher_id: this.uid,
        })
        .select("id")
        .limit(1);

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  };

  addTeacherMessage = async (conversationID, parentID, message) => {
    try {
      let newConversationID = conversationID;

      if (newConversationID === null) {
        // If conversationID is null, create a new conversation
        const result = await this.addNewConversation(parentID);
        newConversationID = result[0].id; // Assuming data is an array with one object
      }
      const { data, error } = await supabase.from(message_info_db).insert({
        message: message,
        chat_id: newConversationID,
        type: "normal",
        from: this.uid,
      });
      if (error) throw error;
      const { data: chatData, error: chatError } = await supabase
        .from(conversation_info_db)
        .update({
          last_message: message,
          last_uid: this.uid,
          updated_on: new Date(),
        })
        .eq("id", newConversationID);
      if (chatError) throw chatError;
      await supabase.rpc("increment_unseencount", {
        row_id: newConversationID,
      });
      return newConversationID;
    } catch (error) {
      throw error;
    }
  };

  getMessagesFromConversationID = async (
    conversationID,
    startIndex,
    endIndex
  ) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(message_info_db)
        .select("*")
        .eq("chat_id", conversationID)
        .order("created_at", { ascending: false })
        .range(startIndex, endIndex);
      if (error) rej(error);
      res(data);
    });
  };

  getSubjectTopicDetails = async (subject, standard, type) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(lesson_info_db)
        .select("title,description")
        .match({ subject, class: standard, type });
      if (error) rej(error);
      res(data);
    });
  };

  getStudentMemories = async () => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(student_memories_db)
        .select("url,caption")
        .order("created_at", { ascending: false })
        .contains("student_list", [Student.shared.studentID]);
      // .range(startIndex, endIndex);
      if (error) rej(error);
      else res(data);
    });
  };

  getTeacherInfo = async () => {
    return new Promise(async (res, rej) => {
      let userID = this.uid;
      if (this.uid === undefined) {
        userID = supabase.auth.getUser()?.id;
      }
      console.log("user: ", userID);
      const { data, error } = await supabase
        .from(team_info_db)
        .select(
          "id,name,avatar,school_id,phone_number,email_id,school_info(name,avatar)"
        )
        .eq("id", userID)
        .single();
      if (error) rej(error);
      res(data);
    });
  };

  getTeacherNotificationInfo = async () => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(teacher_notification_info_db)
        .select(
          "id,leave_request,parent_concern,academic_report,notification,unread_message"
        )
        .eq("id", this.uid).single();
      if (error) rej(error);
      res(data);
    });
  };

  getTeacherTimeTableInfo = (date) => {
    return new Promise(async (res, rej) => {
      let day = new Date(date).getDay();
      console.log("Day", days[day]);
      const { data, error } = await supabase
        .from(timetable_info_db)
        .select(
          "id,class_id,class_info!inner(standard,section),end_hour,end_minute,location,start_hour,start_minute,subject_id,title,day,subject_info!inner(subject,teacher_id,teacher_info(name,avatar))"
        )
        .eq("day", days[day])
        .order("slot") // Order by start time
        .eq("subject_info.teacher_id", this.uid);
      if (error) rej(error);
      if (data) res(data);
    });
  };

  updateDailyTask = async (subject_id, topic, absent_list, timetable_id) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase.from(daily_task_info_db).insert({
        subject_id,
        topic,
        absent_list,
        timetable_id,
      });
      if (error) rej(error);
      res(data);
    });
  };

  getDailyTaskApplication = async () => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(daily_task_info_db)
        .select(
          "id,created_at,subject_id,subject_info!inner(subject,class_id,teacher_id,class_info!inner(standard,section)),topic,absent_list,remark,timetable_info!inner(slot)"
        )
        .eq("subject_info.teacher_id", this.uid)
        .order("created_at", { ascending: false });
      // .order('timetable_info.c',{ascending:true});

      if (error) rej(error);
      res(data);
    });
  };

  getClassChildrenInfo = (class_id, start_index = 0, end_index = 5) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(student_info_db)
        .select("id,name,avatar,roll_no")
        .order("roll_no", { ascending: true })
        .range(start_index, end_index)
        .eq("class_id", class_id);
      if (error) rej(error);
      res(data);
    });
  };

  addSubjectNotification = (item, reminder, date) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(subject_notification_db)
        .insert({
          reminder,
          teacher_id: this.uid,
          subject_id: item.subject_id,
          class_id: item.class_id,
          date: new Date(date),
        });
      if (error) rej(error);
      res(data);
    });
  };

  uploadMedia = (media, id, path) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (media.type === "image") {
          let [uri, thumbnail_uri] = await Promise.all([
            this.uploadPostAsync(media, id, path),
            this.uploadThumbnailAsync(media, id, path),
          ]);
          // let uri = await this.uploadPostAsync(media, id, path);
          // let thumbnail_uri = await this.uploadThumbnailAsync(media, id, path);
          const result = {
            uri: uri,
            thumbnail_uri: thumbnail_uri,
            type: media.type,
            height: media.height,
            width: media.width,
          };
          console.log(result);
          resolve(result);
        } else {
          let name_path =
            Teacher.shared.getSchoolID() +
            "/" +
            this.uid +
            "/" +
            id +
            "/" +
            Date.now();
          const fileExt = media?.video_uri.split(".").pop();
          let formData = new FormData();
          formData.append("videoFile", {
            name: id,
            uri: media?.video_uri,
            type: `${media?.type}/` + fileExt,
          });
          formData.append("id", Date.now());
          let { error } = await supabase.storage
            .from(path)
            .upload(name_path, formData, {
              contentType: `${media.type}/` + fileExt,
            });
          media.type = "image";
          let [uri, thumbnail_uri] = await Promise.all([
            this.uploadPostAsync(media, id, path),
            this.uploadThumbnailAsync(media, id, path),
          ]);
          const { data } = supabase.storage.from(path).getPublicUrl(name_path);
          let video_uri = data?.publicUrl;
          const video_result = {
            video_uri: video_uri,
            uri: uri,
            thumbnail_uri: thumbnail_uri,
            type: "video",
            height: media.height,
            width: media.width,
          };
          resolve(video_result);
        }
      } catch (error) {
        reject(error);
      }
    });
  };

  uploadPostAsync = async (image, name, filePath) => {
    return new Promise(async (resolve, reject) => {
      try {
        let results = image;
        if (results?.base64 == null) {
          results = await ImageManipulator.manipulateAsync(
            image.uri,
            [
              {
                resize: {
                  width: image?.width,
                  height: image?.height,
                },
              },
            ],
            {
              compress: 1,
              format: ImageManipulator.SaveFormat.PNG,
              base64: true,
            }
          );
        }
        const fileExt = results?.uri.split(".").pop();
        let namePath =
          Teacher.shared.getSchoolID() +
          "/" +
          this.uid +
          "/" +
          name +
          "/" +
          Date.now();
        let { error, data } = await supabase.storage
          .from(filePath)
          .upload(namePath, decode(results?.base64), {
            contentType: `${image.type}/` + fileExt,
          });
        if (error) {
          ErrorLogger.shared.ShowError("SupabaseAPI: uploadPostAsync", error);
          reject(error);
        } else {
          console.log("getting public url");
          const { data } = supabase.storage
            .from(filePath)
            .getPublicUrl(namePath);
          resolve(data?.publicUrl);
        }
      } catch (error) {
        ErrorLogger.shared.ShowError(
          "Exception: SupabaseAPI: uploadPostAsync",
          error
        );
        reject(error);
      }
    });
  };

  uploadThumbnailAsync = async (image, name, filePath) => {
    return new Promise(async (resolve, reject) => {
      try {
        const results = await ImageManipulator.manipulateAsync(
          image.uri,
          [{ resize: { width: 10, height: 10 } }],
          {
            compress: 0.1,
            format: ImageManipulator.SaveFormat.PNG,
            base64: true,
          }
        );

        const fileExt = results?.uri.split(".").pop();

        let namePath =
          Teacher.shared.getSchoolID() +
          "/" +
          this.uid +
          "/" +
          name +
          "/" +
          Date.now();
        let { error, data } = await supabase.storage
          .from(filePath)
          .upload(namePath, decode(results?.base64), {
            contentType: "image/" + fileExt,
          });
        if (error) {
          ErrorLogger.shared.ShowError(
            "SupabaseAPI: uploadThumbnailAsync",
            error
          );
          reject(error);
        } else {
          const { data } = supabase.storage
            .from(filePath)
            .getPublicUrl(namePath);
          resolve(data?.publicUrl);
        }
      } catch (error) {
        console.log("Error:", error);
        reject(error);
      }
    });
  };

  deleteFolderContents = async (bucket, filepath) => {
    try {
      const { data: list, error: fetchError } = await supabase.storage
        .from(bucket)
        .list(`${filepath}`);
      const filesToRemove = list.map((x) => `${filepath}/${x.name}`);
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove(filesToRemove);
    } catch (error) {
      ErrorLogger.shared.ShowError("Exception: deleteFolderContents: ", error);
    }
  };

  addStudentMemory = async (title, description, type, mediaList,class_list) => {
    try {
      let insertObject = {
        title: title,
        caption: description,
        teacher_id: this.uid,
        type: type,
      };

      if (type === "School") {
        insertObject.school_id = Teacher.shared.getSchoolID();
      } else if (type === "Class") {
        insertObject.class_list = class_list;
      }

      const { data, error } = await supabase
        .from(student_memories_db)
        .insert(insertObject)
        .select("id")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      const memoryId = data?.id;
      const promises = mediaList.map((media) =>
        this.uploadMedia(media, memoryId, "memories")
      );

      const responses = await Promise.allSettled(promises);
      let uploadedMedia = [];
      responses.forEach((response) => {
        if (response.status == "fulfilled") uploadedMedia.push(response.value);
        else throw response.reason;
      });
      const { data: updateData, error: updateError } = await supabase
        .from(student_memories_db)
        .update({
          media: JSON.stringify(uploadedMedia),
        })
        .eq("id", memoryId);
      if (updateError) return { error: updateError };
      return { data: updateData };
    } catch (error) {
      console.error("Error adding student memory:", error);
      throw error;
    }
  };

  removeStudentMemory = async (id) => {
    try {
      let filePath = Teacher.shared.getSchoolID() + "/" + this.uid + "/" + id;
      this.deleteFolderContents("memories", filePath);
      const { data, error } = await supabase
        .from(student_memories_db)
        .delete()
        .eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      ErrorLogger.shared.ShowError("Error deleting student memory:", error);
      throw error;
    }
  };

  getAllMemories = async (start_index = 0, end_index = 10) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(student_memories_db)
        .select(
          "id,created_at,title,caption,media,student_list,class_list,school_id,created_at"
        )
        .eq("teacher_id", this.uid)
        .order("created_at", { ascending: false })
        .range(start_index, end_index);
      if (error) rej(error);
      res(data);
    });
  };

  addAnnouncement = async (data, distribution, startDate, endDate) => {
    const { title, type, description, mediaList } = data;
    try {
      let insertObject = {
        title: title,
        caption: description,
        teacher_id: this.uid,
        type: type,
      };

      if (distribution === "school") {
        insertObject.school_id = Teacher.shared.getSchoolID();
      } else if (distribution === "class") {
        insertObject.class_id = null;
      }

      const { data, error } = await supabase
        .from(parent_notification_db)
        .insert(insertObject)
        .select("id")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      const announcementID = data?.id;
      const promises = mediaList.map((media) =>
        this.uploadMedia(media, announcementID, "announcement")
      );

      const responses = await Promise.allSettled(promises);
      let uploadedMedia = [];
      responses.forEach((response) => {
        if (response.status == "fulfilled") uploadedMedia.push(response.value);
        else throw response.reason;
      });
      const { data: updateData, error: updateError } = await supabase
        .from(parent_notification_db)
        .update({
          media: JSON.stringify(uploadedMedia),
        })
        .eq("id", announcementID);
      if (updateError) return { error: updateError };
      return { data: updateData };
    } catch (error) {
      ErrorLogger.shared.ShowError("Error adding announcement:", error);
      throw error;
    }
  };

  getAllClasses = async () => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(class_info_db)
        .select("id,standard,section,student_count")
        .eq("classteacher_id", this.uid);
      if (error) rej(error);
      res(data);
    });
  };

  getUniqueClassIds = async () => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(subject_info_db)
        .select("class_info!inner(id,standard,section)", { distinct: true })
        .eq("teacher_id", this.uid);
      if (error) rej(error);
      const uniqueData = data.filter((item, index, array) => {
        return array.findIndex(t => t.class_info.id === item.class_info.id) === index;
      });
      res(uniqueData);
    });
  };

  getSchoolClasses = async () => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(class_info_db)
        .select("id,standard,section,student_count")
        .eq("school_id", Teacher.shared.getSchoolID());
      if (error) rej(error);
      res(data);
    });
  };

  getAllAnnouncement = async (start_index = 0, end_index = 10) => {
    return new Promise(async (res, rej) => {
      const { data, error } = await supabase
        .from(parent_notification_db)
        .select(
          "id,created_at,student_id,class_id,school_id,type,title,caption,media"
        )
        .eq("teacher_id", this.uid)
        .range(start_index, end_index);
      if (error) rej(error);
      res(data);
    });
  };
}

supabase_api.shared = new supabase_api();
export default supabase_api;
