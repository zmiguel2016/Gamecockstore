import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { UserService } from './user.service';
import * as firebase from 'firebase';
//import { privateEncrypt } from 'crypto';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  /*define some data containers such as arrays to store items
  items:Array<any>=[{"id":1,"title":"Bread","description":"good","price":"2.50", "category":"food","img":"assets/bread.jpg"},
  {"id":2,"title":"Pashmina","description":"soft", "price":"10", "category":"toy","img":"assets/pash.jpg"},
  {"id":3,"title":"Lemon tea","description":"calming","price":"5", "category":"drink","img":"assets/tea.jpg"},
  {"id":4,"title":"Lasers","description":"Pretty Lights","price":"3500", "category":"toy","img":"assets/lasers.jpg"},
  {"id":5,"title":"Blue Berries","description":"sweet","price":'4.50', "category":"food","img":"assets/berries.jpg"}
  ];*/
  
  private items:Array<any>=[];
  private cart = [];
  constructor(public afstore: AngularFirestore,public user: UserService) { }

  //provide functions to get items, and save items
  
  itemRefresh(){
    this.items.length=0;
  }
   getItems(){
    this.itemRefresh();
    let store = this.afstore.collection('storeitems');
    let Items =  store.get()
    .toPromise()
    .then(snapshot => {
      snapshot.forEach(doc => {
        this.items.push(doc.data())
      });
    })
  	return this.items;
  }
  
async getCart(){
    this.cart=[];
    let findDoc = this.afstore.collection(`users/${this.user.getUID()}/cart`)
    let findcart = await findDoc.get()
    .toPromise()
    .then(snapshot => {
      snapshot.forEach(doc => { 
        this.addtoCart(doc.id, doc.data().count);
      });
    })
    return this.cart;
    
  }
  addItem(product){
    this.cart.push(product);
  }

  addtoCart(id,count){
    let cartItems= this.items;
    for(let i in cartItems){
      if(id == cartItems[i].id){
        let k = 0;
        while(k<count){
          this.addItem(cartItems[i])
          k++;
        }
      }
    }
  }

  createItem(title,description,price,category){
  	  let randomId = Math.random().toString(36).substr(2, 5);
    this.items.push({
      'id': randomId,
      'title': title,
      'description': description,
      'price': price,
      'category': category,
      'img':"assets/bread.jpg"
    });
    
  }

  updateItem(newValues){
    let setDoc = this.afstore.collection('storeitems').doc(newValues.id).update(newValues)
   // let itemIndex = this.items.findIndex(item => item.id == newValues.id);
   // if(newValues.img == undefined){
   // 	newValues.img = this.items[itemIndex].img
  //  }

    //this.items[itemIndex] = newValues;
   // console.log(newValues.img);
  }

  deleteItem(id){
    let setDoc = this.afstore.collection('storeitems').doc(id).delete();
    console.log("Item deleted:"+id)
}

deleteCart(){
  let setDoc = this.afstore.collection(`user/${this.user.getUID()}/cart`).doc().delete();
    console.log("cart deleted:")
}


}