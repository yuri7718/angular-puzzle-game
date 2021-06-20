import { Component, OnInit } from '@angular/core';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-appage',
  templateUrl: './appage.component.html',
  styleUrls: ['./appage.component.scss']
})
export class AppageComponent implements OnInit {

  constructor(private imageService: ImageService) {
  }

  ngOnInit(): void {
    (document.getElementById("puzzle-img") as HTMLImageElement).src = this.imageService.getPuzzleImgURL();  
  }

  loadImage(event: any) {
    let file: File = event.target.files[0];
    if (file) {
      let reader = new FileReader();
      reader.onload =  (ev) => {
        let imgSrc = ev.target!.result as string;
        $('#puzzle-img').attr('src', imgSrc);
        this.imageService.setPuzzleImgSrc(imgSrc);
      }
      reader.readAsDataURL(file);
    }
  }




}
