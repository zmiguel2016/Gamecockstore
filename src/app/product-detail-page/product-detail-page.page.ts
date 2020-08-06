import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';

import { ItemService } from '../item.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user.service';
import { firestore } from 'firebase/app';

@Component({
  selector: 'app-product-detail-page',
  templateUrl: './product-detail-page.page.html',
  styleUrls: ['./product-detail-page.page.scss'],
})
export class ProductDetailPagePage implements OnInit {
  cart =[];
  items =[];
  count=1;

  current_item:any;
  edit_item_form:FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    public itemService: ItemService,
    private router:Router,
    public afstore: AngularFirestore,
    public user: UserService
  	) { 
  		this.edit_item_form = this.formBuilder.group({
          title: new FormControl('', Validators.required),
          description: new FormControl('', Validators.required),
          price: new FormControl('', Validators.required),
          category: new FormControl('', Validators.required)
        });
        console.log("constructor of UpdateItemPage")
  }

  ngOnInit() {
  		console.log("onInit")
  		this.route.params.subscribe(
      param => {
        this.current_item = param;
        console.log(this.current_item);

        this.edit_item_form.patchValue({title:this.current_item.title});
        this.edit_item_form.patchValue({description:this.current_item.description});
        this.edit_item_form.patchValue({price:this.current_item.price});
        this.edit_item_form.patchValue({category:this.current_item.category});

      }
    )
    this.loadCart();

    
    this.loadItems();
  }

  async loadCart(){
    this.cart = await this.itemService.getCart();
  }
  async loadItems(){
    
    this.items.length =0;
    this.items= await this.itemService.getItems();
  }

  updateItem(value){
  	console.log(value.title);
    console.log(value.description);
    console.log(value.price);
    console.log(value.category);

  	//update the item in the items of th Service Object
  	//need to import the ItemService and create it in constructor
  	let newValues = {
      id: this.current_item.id,
      title: value.title,
      description: value.description,
      price: value.price,
      category: value.category,
      img: this.current_item.img
    }
    this.itemService.updateItem(newValues);


    this.goBack();
  }
  
  addToCart(){
    const itemId=this.current_item.id
    let count = this.count
    console.log(this.count)
    let findDoc = this.afstore.collection(`users/${this.user.getUID()}/cart`).doc(this.current_item.id);
    let getDoc = findDoc.get()
      .toPromise()
      .then(doc => {
        if(!doc.exists){
          let setDoc = this.afstore.collection(`users/${this.user.getUID()}/cart`).doc(this.current_item.id).set(
            {
            count
            });
        }else{
          
          this.afstore.collection(`users/${this.user.getUID()}/cart`).doc(this.current_item.id).update(
            {
            count: doc.data().count +1
            
            });
        }
      })
    this.goBack();
  }
  ionViewDidLeave(){}

  goBack(){
    this.ionViewDidLeave;
    this.router.navigate(['/tabs/tab1']);
  }

  deleteItem(){
    console.log(this.current_item.id+" to be deleted")
    this.itemService.deleteItem(this.current_item.id)
    this.goBack();
  }

}
