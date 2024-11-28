import { Component, Input, OnInit } from '@angular/core';
import { Record, RecordServiceService } from 'src/app/service/record-service.service';
import { ModalController, ToastController } from '@ionic/angular';
import { PhotoService } from 'src/app/service/photo.service';
import { AuthServiceService } from 'src/app/authentication.service';
@Component({
  selector: 'app-record',
  templateUrl: './record.page.html',
  styleUrls: ['./record.page.scss'],
})
export class RecordPage implements OnInit {
@Input() id : string
  record : Record
  private images = [];
  userId : any
  records : Record[] = [];
  constructor(private recordService:RecordServiceService, private toastCtrl: ToastController,private modalCtrl: ModalController,
    public photoService: PhotoService, private authService:AuthServiceService
  ) { 
    let data = localStorage.getItem("images");
    if (data) this.images = JSON.parse(data);
  }

  async ngOnInit() {
    console.log(this.id);

    //get photo index meta
    this.authService.getProfile().then(user =>{
      this.userId = user.uid
      console.log(this.userId);
      this.recordService.getRecords(this.userId).subscribe(resultats =>{
        this.records = resultats
        console.log("record page detail",this.records);
      })
    })

    //get record by id
    this.recordService.getRecordById(this.id).subscribe(res =>{
      this.record = res
    })
    console.log("id", this.record);
    // await this.photoService.loadSaved();
  }

  async updateRecord(){
    this.recordService.updateRecord(this.record)
    const toast = await this.toastCtrl.create({
      message: "Record Updated !",
      duration:2000
    })
    toast.present()
    this.modalCtrl.dismiss()
  }

  async deleteRecord(){
   await this.recordService.removeRecord(this.id)
    this.modalCtrl.dismiss()
  }
  


}
