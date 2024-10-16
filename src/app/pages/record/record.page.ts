import { Component, Input, OnInit } from '@angular/core';
import { Record, RecordServiceService } from 'src/app/service/record-service.service';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-record',
  templateUrl: './record.page.html',
  styleUrls: ['./record.page.scss'],
})
export class RecordPage implements OnInit {
@Input() id : string
  record : Record

  constructor(private recordService:RecordServiceService, private toastCtrl: ToastController,private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log(this.id);

    this.recordService.getRecordById(this.id).subscribe(res =>{
      this.record = res
    })
  }

  async updateRecord(){
    this.recordService.updateRecord(this.record)
    const toast = await this.toastCtrl.create({
      message: "Jounal Updated",
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
