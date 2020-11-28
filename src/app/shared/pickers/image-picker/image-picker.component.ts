import { Platform } from '@ionic/angular';
import { Component, OnInit, Output, Input, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core';
@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
 @ViewChild('filePicker') filePickerRef: ElementRef<HTMLInputElement>;
 @Output() imagePi = new EventEmitter<string | File>();
 @Input() showPreview = false;
 selectedPick: string;
 usePicker = false;
  constructor(
    private platform: Platform
  ) { }

  ngOnInit() {
    console.log('Mobile: ', this.platform.is('mobile'));
    console.log('Hybrid: ', this.platform.is('hybrid'));
    console.log('Ios: ', this.platform.is('ios'));
    console.log('Android: ', this.platform.is('android'));

    if (this.platform.is('mobile') && !this.platform.is('hybrid') || 
        this.platform.is('desktop')) {
      this.usePicker = true;
    }
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      this.filePickerRef.nativeElement.click();
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.Base64
    })
    .then(image => {
      this.selectedPick = image.base64String;
      this.imagePi.emit(image.base64String);
    })
    .catch(error => {
      console.log(error);
      if (this.usePicker) {
      this.filePickerRef.nativeElement.click();
      }
      return false;
    });
  }
  onFileChosen(event: Event) {
    console.log(event.target);
    const picketFile = (event.target as HTMLInputElement).files[0];
    console.log(picketFile);
    if (!picketFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedPick = dataUrl;
      this.imagePi.emit(picketFile);
      console.log(this.selectedPick)
    };
    fr.readAsDataURL(picketFile);
  }
}
