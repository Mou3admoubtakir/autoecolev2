import { Injectable } from '@angular/core';
// import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { LoadingController, AlertController } from '@ionic/angular';
import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";


// export interface UserPhoto {
//   filepath: string;
//   webviewPath?: string;
//   imageId?: number;
// }



@Injectable({
  providedIn: 'root'
})

export class PhotoService {
  image = 'https://www.kasterencultuur.nl/editor/placeholder.jpg';
  imagePath: string;
  upload: any;


  constructor( public loadingController: LoadingController,
    public alertController: AlertController,
    public storage: AngularFireStorage,
  ) { 
     
   }

    async uploadPhoto(){
      const loading = await this.loadingController.create({
        duration: 2000
      });
      await loading.present();
      this.upload = this.storage.ref(this.imagePath).putString(this.image, 'data_url');
      this.upload.then(async () => {
        await loading.onDidDismiss();
        this.image = 'https://www.kasterencultuur.nl/editor/placeholder.jpg';
        const alert = await this.alertController.create({
          header: 'Félicitation',
          message: 'L\'envoi de la photo dans Firebase est terminé!',
          buttons: ['OK']
        });
        await alert.present();
      });
    }

    private generateUUID(): string {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }

    uploadImage(image: string, userId: string): any {
      const storage = getStorage();
      const imageName = this.generateUUID(); 
      const imageRef = ref(storage, `${userId}/${imageName}.jpg`); 
      
      // Upload
      return uploadString(imageRef, image, 'data_url');
    }

    getImage(userId: string, imageId: string): Promise<string> {
      const storage = getStorage(); 
      const imageRef = ref(storage, `${userId}/${imageId}`);
      
      return getDownloadURL(imageRef);
    }

  
}
