import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { AccountValidator } from "../../validators/account";
import { UserProvider } from "../../providers/user/user";
import { Storage } from '@ionic/storage';

@IonicPage({
  name:'forget',
})
@Component({
  selector: 'page-forget',
  templateUrl: 'forget.html',
})
export class ForgetPage {

  public isShowPassword:boolean = false;
  public isTimerStart:boolean = false;
  public timerText:string = "发送验证码";
  private timerRemainSeconds:number = 60;
  private forgetForm: FormGroup;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private userProvider: UserProvider,
              private toastCtrl: ToastController,
              private formBuilder: FormBuilder,
              private storage: Storage) {

    this.forgetForm = this.formBuilder.group({
      'account': ['', [Validators.required, AccountValidator.isValid]],
      'code': ['',[Validators.required,Validators.minLength(4),Validators.maxLength(4)]],
      'password': ['', [Validators.required, Validators.minLength(6),Validators.maxLength(32)]]
    });
  }

  ionViewDidLoad() {
  }

  sendCode($event) {
    $event.preventDefault();

    if(!this.forgetForm.controls.account.valid || this.forgetForm.controls.account.errors) {
      let toast = this.toastCtrl.create({
        message: "请输入正确的手机号码或邮箱",
        duration: 3000,
        position: 'top',
        cssClass: 'my-toast'
      });
      toast.present();
      return;
    }

    this.userProvider.getCode(this.forgetForm.value.account,'find').then((data)=>{
      let toast = this.toastCtrl.create({
        message: "验证码已发送到，请注意查收",
        duration: 3000,
        position: 'top',
        cssClass: 'my-toast'
      });
      toast.present();

      this.isTimerStart = true;
      this.timerTracker();
    });
  }

  timerTracker() {
    setTimeout(() => {
      console.log(this.timerRemainSeconds);
      if (this.timerRemainSeconds > 0) {
        this.timerRemainSeconds --;
        this.timerText = this.timerRemainSeconds+"s后再次发送";
        this.timerTracker();
      }
      else {
        this.timerText = "再次发送";
        this.timerRemainSeconds = 60;
        this.isTimerStart = false;
      }
    }, 1000);
  }

  showPassword() {
    this.isShowPassword = !this.isShowPassword;
  }

  goLoginDefaultPage() {
    this.navCtrl.push('login-default');
  }

  goForgetPage() {
    this.navCtrl.push('forget');
  }

  doReset() {
    if(!this.forgetForm.valid){
      if(!this.forgetForm.controls.account.valid || this.forgetForm.controls.account.errors) {
        let toast = this.toastCtrl.create({
          message: "无效的手机号码或邮箱",
          duration: 3000,
          position: 'top',
          cssClass: 'my-toast'
        });
        toast.present();
        return;
      }

      if(!this.forgetForm.controls.code.valid) {
        let toast = this.toastCtrl.create({
          message: "无效的验证码",
          duration: 3000,
          position: 'top',
          cssClass: 'my-toast'
        });
        toast.present();
        return;
      }

      if(!this.forgetForm.controls.password.valid) {
        let toast = this.toastCtrl.create({
          message: "无效的密码",
          duration: 3000,
          position: 'top',
          cssClass: 'my-toast'
        });
        toast.present();
        return;
      }

    }

    this.userProvider.find(this.forgetForm.value).then(data => {
        let toast = this.toastCtrl.create({
          message: "密码修改成功，请重新登录",
          duration: 3000,
          position: 'top',
          cssClass: 'my-toast'
        });
        toast.present();

        this.navCtrl.push('login-default');
    });
  }

}
