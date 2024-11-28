import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  ionicForm: FormGroup ;

  constructor(private toastController: ToastController,private loadingController: LoadingController,private authService:AuthServiceService,private router: Router, public formBuilder: FormBuilder,
    private modalCtrl: ModalController
  ) { 

  }

  ngOnInit() {
    // this.signUP()
    this.ionicForm = this.formBuilder.group({
      fullname:['',
        [Validators.required]
      ],
      contact:['',
      [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
        // Validators.min(10)
      ]
    ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      password: ['', [
        Validators.pattern('^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]+$'),
        Validators.required,
      ],
      
    ],
      confirmPassword : ['', Validators.required] // new field
    }, {
      validator : this.matchPasswords('password', 'confirmPassword')
    });
  }

  matchPasswords(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['passwordMismatch']) {
        return;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }
  get errorControl() {
    return this.ionicForm.controls;
  }
 
  async signUP(){
    const loading = await this.loadingController.create();
    await loading.present();
    if (this.ionicForm.valid) {

      const user = await this.authService.registerUser(this.ionicForm.value.email, this.ionicForm.value.password,this.ionicForm.value.fullname).catch((err) => {
        this.presentToast(err)
        console.log(err);
        loading.dismiss();
      })

      if (user) {
        loading.dismiss();
        const toast = await this.toastController.create({
          message: "User created successfully ! ",
          duration:2000
        })
        toast.present()
        this.modalCtrl.dismiss()
        this.router.navigate(['/login'])
      }
    } else {
        loading.dismiss();
      return console.log('Please provide all the required values!');
    }
  }
  
  async presentToast(message: undefined) {
    console.log(message);
    
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
    });

    await toast.present();
  }
}