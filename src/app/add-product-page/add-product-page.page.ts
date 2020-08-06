import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { Router } from '@angular/router';

import { ItemService } from '../item.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from "@ionic-native/file/ngx";
import * as firebase from "firebase";

@Component({
  selector: 'app-add-product-page',
  templateUrl: './add-product-page.page.html',
  styleUrls: ['./add-product-page.page.scss'],
})
export class AddProductPagePage implements OnInit {
result;
imgfile="";
  new_item_form: FormGroup;

  constructor(
    private file: File,
    private camera:Camera,
    private router: Router,
 	 public formBuilder: FormBuilder,
        public itemService: ItemService,
        public afstore: AngularFirestore
  ) { }

  ngOnInit() {
    this.new_item_form = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      category: new FormControl('', Validators.required)
      //BS: new FormControl(false, Validators.required),
      //date:new FormControl('', Validators.required)
    });
  }
  createItem(value){
  	console.log(value.BS);
  	//console.log(value.date);
  	//save the item, and then go back
    //? 
    let randomId = Math.random().toString(36).substr(2, 5);
    let data = {
    id: randomId,
    title: value.title,
    description: value.description,
    price:  value.price,
    category: value.category,
    img: this.imgfile
    }
    //this.itemService.createItem(value.title,value.description,value.price,value.category);
    
    let setDoc = this.afstore.collection('storeitems').doc(randomId).set(data)
  
  	this.goBack();
  }
  async captureImage() {
    const options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    try{
      console.log(this);
      let cameraInfo = await this.camera.getPicture(options);
      let blobInfo = await this.makeFileIntoBlob(cameraInfo);
      let uploadInfo: any = await this.uploadToFirebase(blobInfo);
      console.log(uploadInfo);
      // let url:any = uploadInfo.ref.getDownloadURL();
      alert("File Upload Success " + uploadInfo);
      this.imgfile = uploadInfo;
      
    } catch (e) {
      console.log(e.message);
      alert("File Upload Error " + e.message);
    }
  }
  makeFileIntoBlob(_imagePath) {
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      let fileName = "";
      this.file
        .resolveLocalFilesystemUrl(_imagePath)
        .then(fileEntry => {
          let { name, nativeURL } = fileEntry;

          // get the path..
          let path = nativeURL.substring(0, nativeURL.lastIndexOf("/"));
          console.log("path", path);
          console.log("fileName", name);

          fileName = name;

          // we are provided the name, so now read the file into
          // a buffer
          return this.file.readAsArrayBuffer(path, name);
        })
        .then(buffer => {
          // get the buffer and make a blob to be saved
          let imgBlob = new Blob([buffer], {
            type: "image/jpeg"
          });
          console.log(imgBlob.type, imgBlob.size);
          resolve({
            fileName,
            imgBlob
          });
        })
        .catch(e => reject(e));
    });
  }

  /**
   *
   * @param _imageBlobInfo
   */
  uploadToFirebase(_imageBlobInfo) {
    console.log("uploadToFirebase");
    return new Promise((resolve, reject) => {
      let imageid = (Math.floor(Math.random() * 2000)).toString();
      let filename = "menu_"+imageid
      // filename = _imageBlobInfo.fileName;
      let fileRef = firebase.storage().ref("images/" + filename);

      let uploadTask = fileRef.put(_imageBlobInfo.imgBlob);
      let mydownloadurl="";
      

      uploadTask.on(
        "state_changed",
        (_snapshot: any) => {
          console.log(
            "snapshot progess " +
              (_snapshot.bytesTransferred / _snapshot.totalBytes) * 100
          );
        },
        _error => {
          console.log(_error);
          reject(_error);
        },
        () => {
          // completion...  get the image URL for saving to database
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
            mydownloadurl = downloadURL;
            resolve( mydownloadurl);
          });
          // resolve( uploadTask.snapshot);
          // resolve( mydownloadurl);

        }
      );
    });
  }


  goBack(){
  	    this.router.navigate(['/tabs/tab1']);
  }

}
