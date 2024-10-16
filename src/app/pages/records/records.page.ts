import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { AuthServiceService } from 'src/app/authentication.service';
import { IonModal, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Record, RecordServiceService } from 'src/app/service/record-service.service';
import { RecordPage } from '../record/record.page';
@Component({
  selector: 'app-records',
  templateUrl: './records.page.html',
  styleUrls: ['./records.page.scss'],
})

export class RecordsPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  userId : any
  title:string;
  content:string;
  createdAt:any;
  records : Record[] = [];

  constructor(private authService:AuthServiceService, private recordService:RecordServiceService,
    private toastCtrl:ToastController, private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.authService.getProfile().then(user =>{
      this.userId = user.uid
      console.log(this.userId);
      this.recordService.getRecords(this.userId).subscribe(res =>{
        this.records = res
        console.log(this.records)
      })
    })
  }

  confirm() {
    this.modal.dismiss('confirm');
    this.addRecord()
  }

  addRecord(){
    this.recordService.addRecord({userId:"", title:this.title, content:this.content,
       createdAt:new Date()})?.then(async ()=>{
        const toast = await this.toastCtrl.create({
          message: "Record addded successfully ! ",
          duration:2000
        })
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

}
