import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AuthServiceService } from './authentication.service';
import { environment } from 'src/environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { PhotoService } from '../app/service/photo.service';

import { Camera } from '@ionic-native/camera/ngx';

@NgModule({
  declarations: [AppComponent ,],
  imports: [BrowserModule,
            AngularFireAuthModule,
            AngularFireModule,
            AngularFireModule.initializeApp(environment.firebaseConfig),
            AngularFireStorageModule,
            

    IonicModule.forRoot(), AppRoutingModule],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    Camera,
    PhotoService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy, }],
  bootstrap: [AppComponent],
})
export class AppModule {}