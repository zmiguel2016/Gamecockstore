import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { Router } from '@angular/router';
import { AlertController} from '@ionic/angular'



@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
  selectedItems= [];
  total =0;



  constructor(private router: Router, private itemService: ItemService, private alertCtrl: AlertController) {}
  ngOnInit(){
  
  }
  ionViewWillEnter(){
    this.loadCart();
  }

  async loadCart(){
     let carrt = await this.itemService.getCart();
     let selected = {};
    
    for(let obj of carrt){
      if(selected[obj.id]){
        selected[obj.id].count++;
      }else{
      selected[obj.id] ={...obj, count:1};
      }
      this.selectedItems= Object.keys(selected).map(key => selected[key])
     // console.log('items', this.selectedItems);
      this.total = this.selectedItems.reduce((a,b) => a + (b.count * b.price), 0);
  }  
}

  goToItem(item){
  	console.log(item);
  	this.router.navigate(["/product-detail-page", item]);

  }
  async checkout(){
    let alert = await this.alertCtrl.create({
      header: 'Order Sent',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  deleteCart(){
    this.itemService.deleteCart();
}
}
