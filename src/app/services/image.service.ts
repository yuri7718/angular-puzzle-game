import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  puzzleImgSrc: string;

  constructor() {
    this.puzzleImgSrc = "../../assets/edgar-nKC772R_qog-unsplash.jpg";
  }

  setPuzzleImgSrc(src: string) {
    this.puzzleImgSrc = src;
  }

  getPuzzleImgURL() {
    return this.puzzleImgSrc;
  }

 

}
