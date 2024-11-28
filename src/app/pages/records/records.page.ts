import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { AuthServiceService } from 'src/app/authentication.service';
import { IonModal, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { Record, RecordServiceService } from 'src/app/service/record-service.service';
import { RecordPage } from '../record/record.page';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { Filesystem, Directory } from '@capacitor/filesystem';
import { PhotoService } from 'src/app/service/photo.service';
// import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-records',
  templateUrl: './records.page.html',
  styleUrls: ['./records.page.scss'],
})

export class RecordsPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  userId : any
  marque:string;
  modele:string;
  plaque:string;
  createdAt:any;
  records : Record[] = [];
  picture : any;
  imageUrl: string;
  private images = [];

  constructor(private authService:AuthServiceService, private recordService:RecordServiceService,
    private toastCtrl:ToastController, private modalCtrl: ModalController,
    public imageSrv: PhotoService, private navCtrl: NavController,
    private afAuth: AngularFireAuth,
  ) { 

    let data = localStorage.getItem("images");
    if (data) this.images = JSON.parse(data);
  }

  async ngOnInit() {
    this.authService.getProfile().then(user =>{
      this.userId = user.uid
      console.log(this.userId);
      this.recordService.getRecords(this.userId).subscribe(res =>{
        this.records = res
        console.log("record",this.records);
        console.log("length", this.records.length);
        
      })
    })

    // await this.photoService.loadSaved();
  }

  confirm() {
    this.modal.dismiss('confirm');
    this.addRecord()
  }

  public async addRecord(){
    // const lastImageId = await this.photoService.loadSaved();
    
    this.recordService.addRecord({userId:"", marque:this.marque, modele:this.modele, plaque:this.plaque,
       createdAt:new Date(),imageUrl:""})?.then(async ()=>{
        const toast = await this.toastCtrl.create({
          message: "Record addded successfully ! ",
          duration:2000
        })
        // this.photoService.addNewToGallery();
        toast.present()
       }).catch(async (error)=>{
        const toast = await this.toastCtrl.create({
          message: error,
          duration:2000
        })
       })
    
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async openRecord(record:Record){
    const modal = await this.modalCtrl.create({
      component:RecordPage,
      componentProps:{id:record.id},
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.6
    })

    await modal.present()
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Process the image file here
      console.log('Selected image:', file);
    }
  }
  

  // addPhotoToGallery() {
  //   this.photoService.addPhoto();
  // }
  // cameraOptions: CameraOptions = {
  //   quality: 100,
  //   destinationType: this.camera.DestinationType.DATA_URL,
  //   encodingType: this.camera.EncodingType.JPEG,
  //   mediaType: this.camera.MediaType.PICTURE,
  // };
  async takePicture() {
    try {
      const photo = await Camera.getPhoto({
        quality: 100, // Adjust image quality (0-100)
        resultType: CameraResultType.DataUrl, // Get the image as a base64 string
        source: CameraSource.Camera, // Open the device camera
      });
  
      // Convert the photo into a base64 string and upload it
      const base64Image = photo.dataUrl;
      const userId = (await this.afAuth.currentUser)?.uid;
  
      if (userId) {
        const uploadResponse = await this.imageSrv.uploadImage(base64Image, userId);
        console.log('Upload successful:', uploadResponse);
  
        // Save image to local storage or update UI as needed
        this.images.push(uploadResponse.a.name);
        localStorage.setItem('images', JSON.stringify(this.images));
      } else {
        console.error('User not authenticated');
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  }

}
