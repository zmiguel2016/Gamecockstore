import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app'
import { Router } from '@angular/router';
import { UserService } from '../user.service';




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = ""
  password:string = ""
  constructor(private router: Router,public afAuth: AngularFireAuth, public user: UserService) { }

  ngOnInit() {
  }

  async login(){
      const { username, password } = this
      try {
          const res = await this.afAuth.auth.signInWithEmailAndPassword(username, password)
          if(res.user){
            this.user.setUser({
              username,
              uid: res.user.uid
            })
          
            this.router.navigate(['/tabs/tab1']);
          }
          }catch(err){
        console.dir(err)
        if(err.code === "auth/user-not-found"){
          console.log("User not found")
        }
      }
  }
  goToSignup(){
    this.router.navigate(["/register"]);
  }
  bypass(){
    this.router.navigate(["/tabs/tab1"]);
  }

}