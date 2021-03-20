import { Component, OnInit } from '@angular/core';
import { VerifyService } from '../verify.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  showOTP: boolean;
  resendFlag: boolean = true;

  constructor(private service: VerifyService) { }
  formObj:any = { "panNumber": "", "city": "Select city", "fullname": "", "email": "", "mobile": ""}
  otp = "";
  cityArr = ["Delhi","Mumbai","Kolkāta","Bangalore","Chennai","Hyderābād","Pune","Ahmadābād","Sūrat","Lucknow","Jaipur","Cawnpore","Mirzāpur","Nāgpur","Ghāziābād","Indore","Vadodara","Vishākhapatnam","Bhopāl","Chinchvad","Patna","Ludhiāna","Āgra"];
  timer = 0;
  clock = 1000*60*3;
  time :any = "03:00";
  resendCount = 0;
  msg = '';
  clockInt;
  msgFlag = false;

  ngOnInit(): void {
  }

  resetClock(){
    this.clock = 1000*60*3;
    this.time = "03:00";
    clearInterval(this.clockInt)

  }

  resendOTP(){
    this.resendCount ++ ;
    if(this.resendCount <= 3) {
      this.resetClock();
      this.getOtp()
    } else {
      this.msg = "Please try again after an hour.";
      this.resendFlag = true;
    }
  }

  isNumberKey(evt){
    
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
  }

  checkField(type?,mob?){
    console.log("In")
    if(type == 'mobile'){
      this.getValidMobile(mob)
    }else{
      if(this.otp.length == 4 ){
        this.verifyOTP();
      }
    }
  }

  getValidMobile(mob){
    if(mob.valid && this.formObj.mobile.length == 10){
      this.getOtp()
    } else {
      this.showOTP = false;
    }
  }

  getOtp(){
    this.resendFlag = true;
    this.formObj.mobile = Number(this.formObj.mobile)
    this.service.getOtp(this.formObj).subscribe(
      (data) => {
        console.log(data);
        this.showOTP = true;
        setTimeout( () => {
          this.resendFlag = false;
        },1000*60*3)
        this.clockInt = setInterval( ()=> {
          this.clock -= 1000; 
          let mins = Math.floor(this.clock / 60000);
          let sec = Math.floor((this.clock / 1000) % 60)
          this.time = '0'+ mins + ':' + ((sec < 10) ? "0" + sec : sec)
        }, 1000);
        
      }, (error) => {
        console.log(error)
    })
  }

  verifyOTP(){
    this.service.verifyOtp({mobile: this.formObj.mobile, otp: this.otp }).subscribe( (res)=>{
      console.log(res)
      this.msgFlag=true;
    })
  }
}
