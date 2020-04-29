class BaseModal {
    constructor(data, message) {
        if (typeof data === 'string') {
            this.message = data;
            data = null;
            message = null;
        }
        if (data) {
            this.data = data;
        }
        if (message) {
            this.message = messgae;
        }
    }
}
 class SuccessModal extends BaseModal{
     constructor(data, message){
         super(data, message);
         this.errno = 0;
     }
 }

 class ErroModal extends BaseModal {
     constructor(data, message) {
         super(data, message);
         this.errno = -1;
     }    
 }

 module.exports = {
     SuccessModal,
     ErroModal
 } 