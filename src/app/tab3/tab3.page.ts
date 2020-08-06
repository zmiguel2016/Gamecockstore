import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app'
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  constructor(private router: Router,public afAuth: AngularFireAuth, public user: UserService) {}
  ngOnInit() {
  }
  async logout(){
    try {
      const res = await this.afAuth.auth.signOut();
      
        this.router.navigate(['/login']);
      }catch(err){
        console.dir(err)
        }
      }
     
  }


