function CustomError(code, message){
    this.code = code;
    // Can't inherit Error directly because Error.call return a new object and does not manipulate this.
    this.message = message;
    this.name = 'CustomError';
}
CustomError.prototype = Object.create(Error.prototype);
CustomError.prototype.constructor = CustomError;

module.exports = CustomError;