import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ItemService } from '../item.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit  {
  imgfile="assets/bread.jpg";
  items=[
    {"title":"meat","description":"good",'img':this.imgfile}
    
  ]

  constructor(
    private router: Router,
    public itemService: ItemService
  ) {}

  ngOnInit(){
  
  }
  ionViewDidEnter(){
    this.loadItems();
  }
  loadItems(){
    this.itemService.itemRefresh();
    this.items=[];
    this.items = this.itemService.getItems();
    console.log(this.items)
  }
  

  openNewItemPage(){
  	console.log("clicked me");
  	this.router.navigate(["/add-product-page"]);

  }
  
  goToItem(item){
  	console.log(item);
  	this.router.navigate(["/product-detail-page", item]);

  }
}
