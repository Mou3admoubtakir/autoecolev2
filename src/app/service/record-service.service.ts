import { Injectable } from '@angular/core';
import {AuthServiceService} from '../authentication.service'
import { addDoc, collection, collectionData, doc, docData, Firestore, query, where, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { deleteDoc } from 'firebase/firestore';

export class Record{
  id?:string;
  userId:string;
  title:string;
  content:string;
  createdAt:any;

  constructor(userId:string,title:string,content:string,createdAt:any){
    this.userId = userId;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
  }
}
@Injectable({
  providedIn: 'root'
})
export class RecordServiceService {
  userId : any
  constructor(private  authService:AuthServiceService, private firestore:Firestore) {
    this.authService.getProfile().then(user =>{
      this.userId = user.uid
      console.log(this.userId);
    })
   }


   addRecord(record:Record){
      record.userId = this.userId
      const recordRef = collection(this.firestore, 'records')
      return addDoc(recordRef, record)
   }

   getRecords(userId:any) : Observable<Record[]>{
    const recordRef = collection(this.firestore, 'records')
    const refquery = query(recordRef, where('userId', '==', userId))
    return collectionData(refquery, { idField:'id'}) as Observable<Record[]>
   }

   getRecordById(id:any) : Observable<Record>{
    const recordRef = doc(this.firestore, `records/${id}`)
    return docData(recordRef, {idField: 'id'}) as Observable<Record>

   }

   removeRecord(id:any){
    const recordRef = doc(this.firestore, `records/${id}`)
    return deleteDoc(recordRef)
  }

  updateRecord(record:Record){
    const recordRef = doc(this.firestore,`records/${record.id}`)
    return updateDoc(recordRef,{title:record.title,content:record.content})
  }

}
