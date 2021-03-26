import { Component, OnInit } from '@angular/core';
import { VerifyService } from '../verify.service'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  showOTP: boolean;
  resendFlag: boolean = true;
  verifyForm: FormGroup;

  constructor(private service: VerifyService, private formBuilder: FormBuilder) { }
  formObj:any = { "panNumber": "", "city": "Select city", "fullname": "", "email": "", "mobile": ""}
  cityArr = ["Delhi","Mumbai","Kolkāta","Bangalore","Chennai","Hyderābād","Pune","Ahmadābād","Sūrat","Lucknow","Jaipur","Cawnpore","Mirzāpur","Nāgpur","Ghāziābād","Indore","Vadodara","Vishākhapatnam","Bhopāl","Chinchvad","Patna","Ludhiāna","Āgra"];
  timer = 0;
  clock = 1000*60*3;
  time :any = "03:00";
  resendCount = 0;
  msg = '';
  clockInt;
  msgFlag = false;
  expireFlag: boolean = false;
  ngOnInit(): void {
    console.log(document.cookie)
    if(document.cookie) {
      this.expireFlag = true
    }
    // var user = getCookie("username");

    this.verifyForm = this.formBuilder.group({
      userDetails : this.formBuilder.group({
        city: new FormControl('', Validators.required),
        email: ['', [Validators.required, Validators.email, Validators.maxLength(255), Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
        panNumber: ['',[ Validators.required , Validators.maxLength(10), Validators.pattern("[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}")]],
        mobile: ['', [Validators.required , Validators.maxLength(10)]],
        fullname: ['', [Validators.required , Validators.maxLength(140)]],
      }),
      otp : ['',[Validators.required]]
  });
  // this.otp= new FormControl("",[Validators.required , Validators.maxLength(4)]);
  }

  get city() { return this.verifyForm.get('userDetails.city'); }
  get email() { return this.verifyForm.get('userDetails.email'); }
  get panNumber() { return this.verifyForm.get('userDetails.panNumber'); }
  get mobile() { return this.verifyForm.get('userDetails.mobile'); }
  get fullname() { return this.verifyForm.get('userDetails.fullname'); }
  get otp() { return this.verifyForm.get('otp'); }

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
      this.setCookie(1000*60*60)
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
      if(this.otp.value.length == 4 ){
        this.verifyOTP();
      }
    }
  }

  getValidMobile(mob){
    if(this.mobile.status == 'VALID' && this.mobile.value.length == 10){
      this.getOtp()
    } else {
      this.showOTP = false;
    }
  }

  getOtp(){
    console.log(this.verifyForm);
    this.resendFlag = true;
    this.mobile.setValue(Number(this.mobile.value))
    this.service.getOtp(this.verifyForm.controls.userDetails.value).subscribe(
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
    this.service.verifyOtp({mobile: this.mobile.value, otp: this.otp.value }).subscribe( (res)=>{
      console.log(res)
      this.msgFlag=true;
    })
  };

  setCookie(time) {
    var d = new Date();
    d.setTime(d.getTime() + time);
    var expires = "expires=" + d;
    document.cookie = "resendFlag" + "=" + d.getTime() + ";" + expires + ";path=/";
  }
}
