import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app'
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore'
import { UserService } from '../user.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  username:string = ""
  password:string = ""
  cpassword:string = ""


  constructor(private router: Router, 
    public afAuth: AngularFireAuth, 
    public alert: AlertController,
    public user: UserService,
    public afStore: AngularFirestore) { }

  ngOnInit() {
  }

  async signup(){
    const {username, password, cpassword} = this
    if(password !== cpassword){
      this.showAlert("Error!","Passwords don't match")
      return console.error("Passwords don't match")
    }
    try{
      const res = await this.afAuth.auth.createUserWithEmailAndPassword(username ,password)
      this.afStore.doc(`users/${res.user.uid}`).set({
        username
      })

      this.user.setUser({
        username,
        uid: res.user.uid
      })

      this.showAlert("Success", "Account created")
      this.router.navigate(['/tabs/tab1']);
    }catch(error){
      console.dir(error)
      this.showAlert("Error", error.message)
    }
  }
  bypass(){
    this.router.navigate(['/tabs']);
  }
  
  async showAlert(header: string, message: string){
    const alert  = await this.alert.create({
      header,
      message,
      buttons: ["Ok"]
    })
    await alert.present()
  }

}
