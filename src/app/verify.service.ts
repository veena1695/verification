import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, } from '@angular/common/http' 

@Injectable({
  providedIn: 'root'
})
export class VerifyService {

  constructor(private http: HttpClient) { }

    
  
  getOtp(payload){
    console.log(payload);
    return this.http.post( "http://lab.thinkoverit.com/api/getOTP.php",payload,{
      headers: new HttpHeaders({
        "Content-type" : "application/json"
      }),
      params: new HttpParams().set("Body",JSON.stringify(payload)),
      reportProgress : true,
      responseType: "json"
    })
    // return this.http.jsonp(url,'callback').pipe()
  }

  verifyOtp(payload){
    console.log(payload);
    return this.http.post( "http://lab.thinkoverit.com/api/verifyOTP.php",payload,{
      headers: new HttpHeaders({
        "Content-type" : "application/json"
      }),
      params: new HttpParams().set("Body",JSON.stringify(payload)),
      reportProgress : true,
      responseType: "json"
    })
    // return this.http.jsonp(url,'callback').pipe()
  }
}
