
let debug = __DEV__;
class ErrorLogger {
  constructor() {}

  ShowError = async (message, error) => {
    if (debug) console.error(message, error);
    else{
        console.error(message, error);
    }
  };
}

ErrorLogger.shared = new ErrorLogger();
export default ErrorLogger;
